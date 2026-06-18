import { NextRequest } from 'next/server';
import { getAuthPayload, success, badRequest, unauthorized } from '@/lib/api-utils';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { logger } from '@/lib/logger';

/**
 * GET /api/v1/profile/partner-code
 * Mother: retrieves or generates her 6-digit partner code.
 * Partner: returns the mother's code if already linked.
 */
export async function GET(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            include: {
                userRoles: { include: { role: true } },
                familyAsMother: { include: { members: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } } } } } },
            },
        });

        if (!user) return unauthorized();

        const roles = user.userRoles.map(ur => ur.role.roleName);

        // If user is a mother, return/generate her code
        if (roles.includes('mother')) {
            let code = user.partnerCode;

            if (!code) {
                // Generate a unique 6-digit code
                code = await generateUniqueCode();
                await prisma.user.update({
                    where: { id: user.id },
                    data: { partnerCode: code },
                });
            }

            const linkedPartner = user.familyAsMother?.[0]?.members?.find(
                m => m.memberRole === 'partner' && m.inviteStatus === 'accepted'
            );

            return success({
                partnerCode: code,
                linked: !!linkedPartner,
                partner: linkedPartner ? {
                    id: linkedPartner.user.id,
                    firstName: linkedPartner.user.firstName,
                    lastName: linkedPartner.user.lastName,
                } : null,
            });
        }

        // If user is a partner, return the mother's code they're linked to
        if (roles.includes('partner')) {
            const membership = await prisma.familyMember.findFirst({
                where: {
                    userId: user.id,
                    memberRole: 'partner',
                    inviteStatus: 'accepted',
                },
                include: {
                    family: {
                        include: {
                            mother: { select: { id: true, partnerCode: true, firstName: true, lastName: true } },
                        },
                    },
                },
            });

            if (!membership) {
                return success({ linked: false, partnerCode: null });
            }

            return success({
                linked: true,
                partnerCode: membership.family.mother.partnerCode,
                mother: {
                    id: membership.family.mother.id,
                    firstName: membership.family.mother.firstName,
                    lastName: membership.family.mother.lastName,
                },
            });
        }

        return badRequest('This endpoint is for mother or partner roles only');
    } catch (err) {
        logger.error('Get partner code error:', 'partner-code', err instanceof Error ? err : undefined);
        return badRequest('Failed to fetch partner code');
    }
}

async function generateUniqueCode(): Promise<string> {
    for (let attempt = 0; attempt < 10; attempt++) {
        const code = crypto.randomInt(100000, 999999).toString();
        const existing = await prisma.user.findUnique({ where: { partnerCode: code } });
        if (!existing) return code;
    }
    throw new Error('Failed to generate unique partner code');
}