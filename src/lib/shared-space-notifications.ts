import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';

type SharedSpaceResourceType = 'baby_name' | 'wishlist_item' | 'memory' | 'note';
type SharedSpaceAction = 'created' | 'liked' | 'unliked' | 'completed' | 'reopened' | 'updated' | 'deleted' | 'shared';

interface SharedSpaceNotificationInput {
    familyId: string;
    actorUserId: string;
    resourceType: SharedSpaceResourceType;
    resourceId: string;
    action: SharedSpaceAction;
    message: string;
    title?: string;
}

async function getFamilyRecipientIds(familyId: string, actorUserId: string): Promise<string[]> {
    const family = await prisma.family.findUnique({
        where: { id: familyId },
        select: {
            motherUserId: true,
            members: {
                where: { inviteStatus: 'accepted' },
                select: { userId: true },
            },
        },
    });

    if (!family) return [];

    const recipientIds = new Set<string>();
    recipientIds.add(family.motherUserId);
    family.members.forEach(member => recipientIds.add(member.userId));
    recipientIds.delete(actorUserId);

    return Array.from(recipientIds);
}

async function getActorName(actorUserId: string): Promise<string> {
    const actor = await prisma.user.findUnique({
        where: { id: actorUserId },
        select: { firstName: true, lastName: true },
    });

    const fullName = [actor?.firstName, actor?.lastName].filter(Boolean).join(' ').trim();
    return fullName || 'Your partner';
}

export async function notifySharedSpaceUpdate(input: SharedSpaceNotificationInput): Promise<void> {
    try {
        const recipientIds = await getFamilyRecipientIds(input.familyId, input.actorUserId);
        if (recipientIds.length === 0) return;

        const actorName = await getActorName(input.actorUserId);
        const [notificationType, pendingStatus, inAppChannel] = await Promise.all([
            prisma.notificationType.upsert({
                where: { typeName: 'partner_activity' },
                update: {},
                create: { typeName: 'partner_activity' },
            }),
            prisma.notificationStatus.upsert({
                where: { statusName: 'pending' },
                update: {},
                create: { statusName: 'pending' },
            }),
            prisma.reminderChannel.upsert({
                where: { channelName: 'in_app' },
                update: {},
                create: { channelName: 'in_app' },
            }),
        ]);

        const scheduledFor = new Date();
        await Promise.all(recipientIds.map(userId => prisma.notification.create({
            data: {
                userId,
                notificationTypeId: notificationType.id,
                statusId: pendingStatus.id,
                channelId: inAppChannel.id,
                scheduledFor,
                payloadJson: {
                    title: input.title || 'Shared Space updated',
                    body: input.message,
                    message: input.message,
                    actionUrl: '/shared',
                    actionLabel: 'Open Shared Space',
                    source: 'shared_space',
                    actorUserId: input.actorUserId,
                    actorName,
                    familyId: input.familyId,
                    resourceType: input.resourceType,
                    resourceId: input.resourceId,
                    action: input.action,
                },
            },
        })));
    } catch (err) {
        logger.error('Create shared space notification error', 'shared-space-notifications', err instanceof Error ? err : undefined);
    }
}

export async function buildSharedSpaceActorName(actorUserId: string): Promise<string> {
    return getActorName(actorUserId);
}
