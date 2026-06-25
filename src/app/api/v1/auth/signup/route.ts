import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { hashPassword, createToken, validatePasswordStrength } from '@/lib/auth';
import { validateBody, success, badRequest } from '@/lib/api-utils';
import { isValidEmail } from '@/lib/utils';
import { rateLimit, getClientIP, RATE_LIMITS } from '@/lib/rate-limit';
import { sendVerificationEmail } from '@/lib/email';
import { randomBytes, createHash } from 'crypto';
import { logger } from '@/lib/logger';

const signupSchema = z.object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
    password: z.string().min(8),
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    dateOfBirth: z.string().optional(),
    partnerCode: z.string().length(6).optional(),
    deliveryDate: z.string().optional(),
    role: z.enum(['mother', 'partner', 'caregiver', 'family', 'admin', 'postpartum']).default('mother'),
});

/**
 * Generates a SHA-256 hashed verification token.
 */
function hashVerificationToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
}

/**
 * POST /api/v1/auth/signup
 * Creates a new user account with email verification required.
 * User must verify their email before logging in.
 */
export async function POST(req: NextRequest) {
    try {
        // Rate limiting: 3 signup attempts per 10 minutes per IP
        const ip = getClientIP(req);
        const rl = rateLimit(ip, RATE_LIMITS.SIGNUP);
        if (!rl.allowed) {
            return NextResponse.json(
                { error: rl.message },
                {
                    status: 429,
                    headers: {
                        'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
                        'X-RateLimit-Remaining': '0',
                    },
                }
            );
        }

        const body = await req.json();
        const { data, error } = validateBody(signupSchema, body);
        if (error) return badRequest(error);

        if (!data!.email && !data!.phone) {
            return badRequest('Either email or phone is required');
        }

        if (data!.email && !isValidEmail(data!.email)) {
            return badRequest('Invalid email format');
        }

        // Validate password strength
        const pwCheck = validatePasswordStrength(data!.password);
        if (!pwCheck.valid) return badRequest(pwCheck.message);

        // Check for existing user
        const existing = await prisma.user.findFirst({
            where: {
                OR: [
                    ...(data!.email ? [{ email: data!.email }] : []),
                    ...(data!.phone ? [{ phone: data!.phone }] : []),
                ],
            },
        });
        if (existing) {
            // Don't reveal whether the user exists; use a generic message
            return badRequest('A user with this email or phone already exists');
        }

        // Hash password
        const passwordHash = await hashPassword(data!.password);

        // Create user with emailVerified = false
        const user = await prisma.user.create({
            data: {
                email: data!.email || null,
                phone: data!.phone || null,
                passwordHash,
                firstName: data!.firstName,
                lastName: data!.lastName,
                dateOfBirth: data!.dateOfBirth ? new Date(data!.dateOfBirth) : null,
                emailVerified: false,
            },
        });

        // Assign role
        const roleName: string = data!.role!;
        let role = await prisma.role.findUnique({ where: { roleName } });
        if (!role) {
            role = await prisma.role.create({ data: { roleName } });
        }
        await prisma.userRole.create({
            data: { userId: user.id, roleId: role.id },
        });

        // Auto-create a Family for mothers so shared-space features work immediately
        if (roleName === 'mother' || roleName === 'postpartum') {
            try {
                await prisma.family.create({
                    data: {
                        motherUserId: user.id,
                        familyName: `${user.firstName}'s Family`,
                    },
                });
            } catch (familyErr) {
                logger.error('Auto-create Family on signup error:', 'signup', familyErr instanceof Error ? familyErr : undefined);
            }
        }

        // If postpartum signup, auto-create a PregnancyProfile in postpartum phase
        if (roleName === 'postpartum' && data!.deliveryDate) {
            const deliveryDt = new Date(data!.deliveryDate);
            const msSinceDelivery = Date.now() - deliveryDt.getTime();
            const postpartumWeek = Math.min(52, Math.max(1, Math.ceil(msSinceDelivery / (7 * 24 * 60 * 60 * 1000))));

            await prisma.pregnancyProfile.create({
                data: {
                    userId: user.id,
                    profileStartBasis: 'lmp', // default for postpartum
                    deliveryDate: deliveryDt,
                    phase: 'postpartum',
                    postpartumWeek,
                },
            });
        }

        // Create default preferences
        const defaultLang = await prisma.language.upsert({
            where: { code: 'en' },
            update: {},
            create: { code: 'en', name: 'English' },
        });
        await prisma.userPreference.create({
            data: {
                userId: user.id,
                preferredLanguageId: defaultLang.id,
                consentDataProcessing: true,
                consentNotifications: true,
            },
        });

        // If partner provided a partner code, auto-link them
        if (data!.partnerCode && roleName === 'partner') {
            try {
                const motherUser = await prisma.user.findFirst({
                    where: { partnerCode: data!.partnerCode },
                    include: { userRoles: { include: { role: true } } },
                });

                if (motherUser && motherUser.userRoles.some((ur: { role: { roleName: string } }) => ur.role.roleName === 'mother')) {
                    const existingFamily = await prisma.family.findFirst({
                        where: { motherUserId: motherUser.id },
                        include: {
                            members: {
                                where: { memberRole: 'partner', inviteStatus: 'accepted' },
                            },
                        },
                    });

                    if (!existingFamily || existingFamily.members.length === 0) {
                        let familyId: string;
                        if (existingFamily) {
                            familyId = existingFamily.id;
                        } else {
                            const newFamily = await prisma.family.create({
                                data: {
                                    motherUserId: motherUser.id,
                                    familyName: `${motherUser.firstName} & ${user.firstName}`,
                                },
                            });
                            familyId = newFamily.id;
                        }

                        await prisma.familyMember.create({
                            data: {
                                familyId,
                                userId: user.id,
                                memberRole: 'partner',
                                inviteStatus: 'accepted',
                            },
                        });

                        // Notify both
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

                        await prisma.notification.createMany({
                            data: [
                                {
                                    userId: motherUser.id,
                                    notificationTypeId: notificationType.id,
                                    statusId: statusPending.id,
                                    channelId: channelApp.id,
                                    scheduledFor: new Date(),
                                    payloadJson: {
                                        title: 'Partner Linked! 🎉',
                                        message: `${user.firstName} ${user.lastName} has linked with your account using your partner code.`,
                                        partnerId: user.id,
                                        partnerName: `${user.firstName} ${user.lastName}`,
                                    },
                                },
                                {
                                    userId: user.id,
                                    notificationTypeId: notificationType.id,
                                    statusId: statusPending.id,
                                    channelId: channelApp.id,
                                    scheduledFor: new Date(),
                                    payloadJson: {
                                        title: 'Successfully Linked! 🎉',
                                        message: `You are now connected with ${motherUser.firstName} ${motherUser.lastName}.`,
                                        motherId: motherUser.id,
                                        motherName: `${motherUser.firstName} ${motherUser.lastName}`,
                                    },
                                },
                            ],
                        });
                    }
                }
            } catch (linkErr) {
                logger.error('Auto-link partner on signup error:', 'signup', linkErr instanceof Error ? linkErr : undefined);
            }
        }

        // ── Email Verification ──
        // Generate and store a verification token if user signed up with email
        if (user.email) {
            const verificationToken = randomBytes(32).toString('hex');
            const hashedToken = hashVerificationToken(verificationToken);
            const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

            await prisma.emailVerificationToken.create({
                data: {
                    userId: user.id,
                    token: hashedToken,
                    expiresAt,
                },
            });

            // Send verification email (fire-and-forget; don't block signup)
            sendVerificationEmail(user.email, verificationToken).catch((err) => {
                logger.error('Failed to send verification email:', 'signup', err instanceof Error ? err : undefined);
            });
        }

        // Do NOT auto-login — user must verify email first
        return success({
            message: 'Account created successfully. Please check your email to verify your account.',
            userId: user.id,
            requiresVerification: !!user.email,
        }, 201);
    } catch (err) {
        logger.error('Signup error:', 'signup', err instanceof Error ? err : undefined);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export const config = { api: { bodyParser: { sizeLimit: '16kb' } } };