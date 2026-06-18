import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createHash } from 'crypto';
import prisma from '@/lib/prisma';
import { generateOTP, sendOTPEmail } from '@/lib/email';
import { validateBody, success, badRequest } from '@/lib/api-utils';
import { rateLimit, getClientIP, RATE_LIMITS } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

const forgotPasswordSchema = z.object({
    email: z.string().email('Please provide a valid email address'),
});

/**
 * Hashes an OTP using SHA-256 so it's never stored in plaintext.
 */
function hashOTP(otp: string): string {
    return createHash('sha256').update(otp).digest('hex');
}

export async function POST(req: NextRequest) {
    try {
        // ── Rate Limiting ──
        const ip = getClientIP(req);
        const rateLimitResult = rateLimit(ip, RATE_LIMITS.FORGOT_PASSWORD);
        if (!rateLimitResult.allowed) {
            return NextResponse.json(
                { error: rateLimitResult.message },
                { status: 429, headers: { 'Retry-After': String(Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000)) } }
            );
        }

        const body = await req.json();
        const { data, error } = validateBody(forgotPasswordSchema, body);
        if (error) return badRequest(error);

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: data!.email },
        });

        if (!user) {
            // Don't reveal whether the email exists — return success anyway
            return success({ message: 'If an account with that email exists, an OTP has been sent.' });
        }

        if (!user.isActive) {
            return badRequest('This account has been deactivated. Please contact support.');
        }

        // Generate a 6-digit OTP
        const otp = generateOTP();

        // Invalidate any previous unused tokens for this user
        await prisma.passwordResetToken.updateMany({
            where: { userId: user.id, used: false },
            data: { used: true },
        });

        // Store the hashed OTP with a 10-minute expiry
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        const hashedOtp = hashOTP(otp);

        await prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                token: hashedOtp,
                expiresAt,
            },
        });

        // Send the OTP via email (plaintext OTP for the user to read)
        const emailResult = await sendOTPEmail(data!.email, otp);

        if (!emailResult.success) {
            logger.error('Failed to send OTP email:', 'forgot-password', undefined, { emailError: emailResult.error });
            return NextResponse.json(
                { error: 'Failed to send OTP. Please try again later.' },
                { status: 500 }
            );
        }

        return success({
            message: 'If an account with that email exists, an OTP has been sent.',
        });
    } catch (err) {
        logger.error('Forgot password error:', 'forgot-password', err instanceof Error ? err : undefined);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export const config = { api: { bodyParser: { sizeLimit: '16kb' } } };