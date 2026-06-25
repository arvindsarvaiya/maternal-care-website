import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';

/**
 * Resolves the family ID for a given user.
 *
 * 1. If the user is already a mother on an existing Family, return that ID.
 * 2. Otherwise, if the user is an accepted FamilyMember (e.g. a linked partner),
 *    return that family's ID.
 * 3. Otherwise, if the user has the `mother` role but no Family yet, auto-create
 *    one so shared-space features (memories, baby names, wishlist, notes, tasks)
 *    work immediately — even before a partner links.
 *
 * Returns `null` only when the user has no family link and is not a mother
 * (e.g. a partner who hasn't linked yet).
 */
export async function findOrCreateFamilyId(userId: string): Promise<string | null> {
    // 1. Existing family where user is the mother
    const familyAsMother = await prisma.family.findFirst({
        where: { motherUserId: userId },
        select: { id: true },
    });
    if (familyAsMother) return familyAsMother.id;

    // 2. Existing family where user is an accepted member (partner/caregiver)
    const familyMember = await prisma.familyMember.findFirst({
        where: { userId, inviteStatus: 'accepted' },
        select: { familyId: true },
    });
    if (familyMember) return familyMember.familyId;

    // 3. No family link yet — check if this user is a mother.
    //    If so, lazily create a Family so shared-space features work.
    const userRole = await prisma.userRole.findFirst({
        where: { userId },
        include: { role: { select: { roleName: true } } },
    });

    const isMother = userRole?.role.roleName === 'mother';

    if (isMother) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { firstName: true },
            });

            const newFamily = await prisma.family.create({
                data: {
                    motherUserId: userId,
                    familyName: user ? `${user.firstName}'s Family` : 'My Family',
                },
            });
            logger.info(`Auto-created Family ${newFamily.id} for mother ${userId}`, 'family-utils');
            return newFamily.id;
        } catch (err) {
            logger.error('Failed to auto-create Family for mother', 'family-utils', err instanceof Error ? err : undefined);
            return null;
        }
    }

    // Not a mother and no family link — cannot resolve a family.
    return null;
}
