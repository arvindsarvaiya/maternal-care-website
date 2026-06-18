import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getAuthPayload, success, badRequest, notFound, unauthorized } from '@/lib/api-utils';
import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';

/**
 * POST /api/v1/profile/link-partner
 * Partner submits the 6-digit partner code to link with a mother's account.
 * Creates Family + FamilyMember records and auto-create support notifications.
 */
const linkSchema = z.object({
    partnerCode: z.string().length(6),
});

export async function POST(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const body = await req.json();
        const parsed = linkSchema.safeParse(body);
        if (!parsed.success) return badRequest('Invalid partner code. Must be exactly 6 digits.');

        const { partnerCode } = parsed.data;

        // Verify the calling user is a partner
        const partnerUser = await prisma.user.findUnique({
            where: { id: payload.userId },
            include: { userRoles: { include: { role: true } } },
        });

        if (!partnerUser || !partnerUser.userRoles.some(ur => ur.role.roleName === 'partner')) {
            return badRequest('Only partner accounts can link with a mother');
        }

        // Find the mother by partner code
        const motherUser = await prisma.user.findUnique({
            where: { partnerCode },
            include: { userRoles: { include: { role: true } } },
        });

        if (!motherUser || !motherUser.userRoles.some(ur => ur.role.roleName === 'mother')) {
            return notFound('Mother account not found with this partner code. Please check the code and try again.');
        }

        // Check if partner is already linked to someone else
        const existingMembership = await prisma.familyMember.findFirst({
            where: {
                userId: partnerUser.id,
                memberRole: 'partner',
                inviteStatus: 'accepted',
            },
        });

        if (existingMembership) {
            return badRequest('You are already linked to a mother account. Please unlink first before linking with a new code.');
        }

        // Check if this mother already has a linked partner
        const existingFamily = await prisma.family.findFirst({
            where: { motherUserId: motherUser.id },
            include: {
                members: {
                    where: { memberRole: 'partner', inviteStatus: 'accepted' },
                },
            },
        });

        if (existingFamily && existingFamily.members.length > 0) {
            return badRequest('This mother already has a linked partner.');
        }

        // Create or reuse Family
        let familyId: string;
        if (existingFamily) {
            familyId = existingFamily.id;
        } else {
            const newFamily = await prisma.family.create({
                data: {
                    motherUserId: motherUser.id,
                    familyName: `${motherUser.firstName} & ${partnerUser.firstName}`,
                },
            });
            familyId = newFamily.id;
        }

        // Remove any pending/declined memberships for this partner
        await prisma.familyMember.deleteMany({
            where: { userId: partnerUser.id, memberRole: 'partner' },
        });

        // Create accepted FamilyMember
        await prisma.familyMember.create({
            data: {
                familyId,
                userId: partnerUser.id,
                memberRole: 'partner',
                inviteStatus: 'accepted',
            },
        });

        // Create a notification for the mother
        const notificationType = await prisma.notificationType.upsert({
            where: { typeName: 'partner_linked' },
            update: {},
            create: { typeName: 'partner_linked' },
        });

        const statusPending = await prisma.notificationStatus.upsert({
            where: { statusName: 'pending' },
            update: {},
            create: { statusName: 'pending' },
        });

        const channelApp = await prisma.reminderChannel.upsert({
            where: { channelName: 'app' },
            update: {},
            create: { channelName: 'app' },
        });

        await prisma.notification.create({
            data: {
                userId: motherUser.id,
                notificationTypeId: notificationType.id,
                statusId: statusPending.id,
                channelId: channelApp.id,
                scheduledFor: new Date(),
                payloadJson: {
                    title: 'Partner Linked! 🎉',
                    message: `${partnerUser.firstName} ${partnerUser.lastName} has linked with your account using your partner code. You are now connected!`,
                    partnerId: partnerUser.id,
                    partnerName: `${partnerUser.firstName} ${partnerUser.lastName}`,
                },
            },
        });

        // Also notify the partner
        await prisma.notification.create({
            data: {
                userId: partnerUser.id,
                notificationTypeId: notificationType.id,
                statusId: statusPending.id,
                channelId: channelApp.id,
                scheduledFor: new Date(),
                payloadJson: {
                    title: 'Successfully Linked! 🎉',
                    message: `You are now connected with ${motherUser.firstName} ${motherUser.lastName}. You can now see her health updates and support her journey.`,
                    motherId: motherUser.id,
                    motherName: `${motherUser.firstName} ${motherUser.lastName}`,
                },
            },
        });

        return success({
            message: 'Successfully linked!',
            familyId,
            mother: {
                id: motherUser.id,
                firstName: motherUser.firstName,
                lastName: motherUser.lastName,
            },
        });
    } catch (err) {
        logger.error('Link partner error:', 'link-partner', err instanceof Error ? err : undefined);
        return badRequest('Failed to link with partner code');
    }
}