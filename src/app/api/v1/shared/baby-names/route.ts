import { randomUUID } from 'crypto';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAuthPayload, success, created, badRequest, notFound, unauthorized } from '@/lib/api-utils';
import { stripHtml } from '@/lib/sanitize';
import { logger } from '@/lib/logger';
import { buildSharedSpaceActorName, notifySharedSpaceUpdate } from '@/lib/shared-space-notifications';

interface RawBabyName {
    id: string;
    name: string;
    meaning: string | null;
    created_by_user_id: string;
    created_by_first_name: string;
    created_by_last_name: string;
    created_at: Date;
    updated_at: Date;
    votes: bigint | number;
    liked: boolean;
}

async function ensureBabyNameTables() {
    await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS shared_baby_names (
            id TEXT PRIMARY KEY,
            family_id TEXT NOT NULL REFERENCES families(id) ON DELETE CASCADE,
            created_by_user_id TEXT NOT NULL REFERENCES users(id),
            name TEXT NOT NULL,
            meaning TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);

    await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS shared_baby_name_likes (
            baby_name_id TEXT NOT NULL REFERENCES shared_baby_names(id) ON DELETE CASCADE,
            user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            PRIMARY KEY (baby_name_id, user_id)
        )
    `);
}

async function findFamilyId(userId: string): Promise<string | null> {
    const familyAsMother = await prisma.family.findFirst({
        where: { motherUserId: userId },
        select: { id: true },
    });
    if (familyAsMother) return familyAsMother.id;

    const familyMember = await prisma.familyMember.findFirst({
        where: { userId, inviteStatus: 'accepted' },
        select: { familyId: true },
    });
    return familyMember?.familyId ?? null;
}

function mapBabyName(row: RawBabyName) {
    return {
        id: row.id,
        name: row.name,
        meaning: row.meaning ?? '',
        votes: Number(row.votes),
        liked: row.liked,
        createdBy: {
            id: row.created_by_user_id,
            firstName: row.created_by_first_name,
            lastName: row.created_by_last_name,
        },
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

async function listNames(familyId: string, userId: string) {
    const rows = await prisma.$queryRaw<RawBabyName[]>`
        SELECT
            n.id::text,
            n.name,
            n.meaning,
            n.created_by_user_id::text,
            u.first_name AS created_by_first_name,
            u.last_name AS created_by_last_name,
            n.created_at,
            n.updated_at,
            COUNT(l.user_id) AS votes,
            EXISTS (
                SELECT 1
                FROM shared_baby_name_likes mine
                WHERE mine.baby_name_id = n.id AND mine.user_id = ${userId}
            ) AS liked
        FROM shared_baby_names n
        JOIN users u ON u.id = n.created_by_user_id
        LEFT JOIN shared_baby_name_likes l ON l.baby_name_id = n.id
        WHERE n.family_id = ${familyId}
        GROUP BY n.id, u.first_name, u.last_name
        ORDER BY votes DESC, n.created_at DESC
    `;

    return rows.map(mapBabyName);
}

const createBabyNameSchema = z.object({
    name: z.string().min(1).max(60),
    meaning: z.string().max(160).optional().default(''),
});

export async function GET(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        await ensureBabyNameTables();
        const familyId = await findFamilyId(payload.userId);
        if (!familyId) return notFound('Family');

        return success({ names: await listNames(familyId, payload.userId) });
    } catch (err) {
        logger.error('Get shared baby names error', 'shared-baby-names', err instanceof Error ? err : undefined);
        return badRequest('Failed to fetch baby names');
    }
}

export async function POST(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const body = await req.json();
        const parsed = createBabyNameSchema.safeParse(body);
        if (!parsed.success) return badRequest(parsed.error.issues.map(i => i.message).join('; '));

        await ensureBabyNameTables();
        const familyId = await findFamilyId(payload.userId);
        if (!familyId) return notFound('Family');

        const babyNameId = randomUUID();
        const name = stripHtml(parsed.data.name).trim();
        const meaning = stripHtml(parsed.data.meaning).trim();

        await prisma.$executeRaw`
            INSERT INTO shared_baby_names (id, family_id, created_by_user_id, name, meaning)
            VALUES (${babyNameId}, ${familyId}, ${payload.userId}, ${name}, ${meaning || null})
        `;

        const actorName = await buildSharedSpaceActorName(payload.userId);
        await notifySharedSpaceUpdate({
            familyId,
            actorUserId: payload.userId,
            resourceType: 'baby_name',
            resourceId: babyNameId,
            action: 'created',
            message: `${actorName} added baby name "${name}" to Shared Space.`,
        });

        return created({ names: await listNames(familyId, payload.userId) });
    } catch (err) {
        logger.error('Create shared baby name error', 'shared-baby-names', err instanceof Error ? err : undefined);
        return badRequest('Failed to add baby name');
    }
}
