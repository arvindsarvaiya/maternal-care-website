import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAuthPayload, success, created, badRequest, notFound, unauthorized } from '@/lib/api-utils';
import { logger } from '@/lib/logger';

// ─── GET: List user vaccinations ───
export async function GET(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const url = new URL(req.url);
        const status = url.searchParams.get('status');
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '50');

        const where: any = { userId: payload.userId };
        if (status) {
            where.status = { statusName: status };
        }

        const [vaccinations, total] = await Promise.all([
            prisma.userVaccination.findMany({
                where,
                include: {
                    vaccine: { select: { vaccineName: true, description: true } },
                    status: { select: { statusName: true } },
                    scheduleRule: { select: { ruleLabel: true, startWeek: true, endWeek: true } },
                },
                orderBy: { dueDate: { sort: 'asc', nulls: 'last' } },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.userVaccination.count({ where }),
        ]);

        return success({
            vaccinations: vaccinations.map(v => ({
                id: v.id,
                vaccineName: v.vaccine.vaccineName,
                description: v.vaccine.description,
                status: v.status.statusName,
                ruleLabel: v.scheduleRule?.ruleLabel,
                dueDate: v.dueDate?.toISOString().split('T')[0],
                scheduledDate: v.scheduledDate?.toISOString().split('T')[0],
                completedDate: v.completedDate?.toISOString().split('T')[0],
                notes: v.notes,
                createdAt: v.createdAt,
            })),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (err) {
        logger.error('Get vaccinations error', 'vaccinations', err instanceof Error ? err : undefined);
        return badRequest('Failed to fetch vaccinations');
    }
}

// ─── POST: Create user vaccination ───
const createVaccinationSchema = z.object({
    vaccineName: z.string().min(1),
    status: z.string().optional(),
    dueDate: z.string().optional(),
    scheduledDate: z.string().optional(),
    completedDate: z.string().optional(),
    notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const body = await req.json();
        const parsed = createVaccinationSchema.safeParse(body);
        if (!parsed.success) return badRequest(parsed.error.issues.map(i => i.message).join('; '));

        // Find or create vaccine
        let vaccine = await prisma.vaccine.findUnique({
            where: { vaccineName: parsed.data.vaccineName },
        });
        if (!vaccine) {
            vaccine = await prisma.vaccine.create({
                data: { vaccineName: parsed.data.vaccineName },
            });
        }

        // Find or create status
        const statusName = parsed.data.status || 'upcoming';
        let status = await prisma.vaccinationStatus.findUnique({
            where: { statusName },
        });
        if (!status) {
            status = await prisma.vaccinationStatus.create({
                data: { statusName },
            });
        }

        const vaccination = await prisma.userVaccination.create({
            data: {
                userId: payload.userId,
                vaccineId: vaccine.id,
                statusId: status.id,
                dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
                scheduledDate: parsed.data.scheduledDate ? new Date(parsed.data.scheduledDate) : null,
                completedDate: parsed.data.completedDate ? new Date(parsed.data.completedDate) : null,
                notes: parsed.data.notes,
            },
            include: {
                vaccine: { select: { vaccineName: true, description: true } },
                status: { select: { statusName: true } },
                scheduleRule: { select: { ruleLabel: true, startWeek: true, endWeek: true } },
            },
        });

        return created({
            id: vaccination.id,
            vaccineName: vaccination.vaccine.vaccineName,
            description: vaccination.vaccine.description,
            status: vaccination.status.statusName,
            dueDate: vaccination.dueDate?.toISOString().split('T')[0],
            scheduledDate: vaccination.scheduledDate?.toISOString().split('T')[0],
            completedDate: vaccination.completedDate?.toISOString().split('T')[0],
            notes: vaccination.notes,
        });
    } catch (err) {
        logger.error('Create vaccination error', 'vaccinations', err instanceof Error ? err : undefined);
        return badRequest('Failed to create vaccination');
    }
}