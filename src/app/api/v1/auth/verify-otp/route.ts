import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createHash, randomBytes } from 'crypto';
import prisma from '@/lib/prisma';
import { validateBody, success, badRequest } from '@/lib/api-utils';
import { rateLimit, getClientIP, RATE_LIMITS } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

const verifyOTPSchema = z.object({
    email: z.string().email('Please provide a valid email address'),
    otp: z.string().length(6, 'OTP must be exactly 6 digits'),
});

/**
 * Hashes an OTP using SHA-256 for comparison with the stored hash.
 */
function hashOTP(otp: string): string {
    return createHash('sha256').update(otp).digest('hex');
}

export async function POST(req: NextRequest) {
    try {
        // ── Rate Limiting ──
        const ip = getClientIP(req);
        const rateLimitResult = rateLimit(ip, RATE_LIMITS.VERIFY_OTP);
        if (!rateLimitResult.allowed) {
            return NextResponse.json(
                { error: rateLimitResult.message },
                { status: 429, headers: { 'Retry-After': String(Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000)) } }
            );
        }

        const body = await req.json();
        const { data, error } = validateBody(verifyOTPSchema, body);
        if (error) return badRequest(error);

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: data!.email },
        });

        if (!user) {
            return badRequest('Invalid OTP or email.');
        }

        // Hash the provided OTP for comparison
        const hashedOtp = hashOTP(data!.otp);

        // Find the latest unused token matching the hashed OTP
        const resetToken = await prisma.passwordResetToken.findFirst({
            where: {
                userId: user.id,
                token: hashedOtp,
                used: false,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        });

        if (!resetToken) {
            return badRequest('Invalid or expired OTP. Please request a new one.');
        }

        // Create a one-time verification token for the reset step
        const resetTokenValue = randomBytes(32).toString('hex');

        await prisma.passwordResetToken.update({
            where: { id: resetToken.id },
            data: {
                used: true,
                token: resetTokenValue, // Reuse the token field as a reset verification token
                expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes to complete reset
            },
        });

        return success({
            message: 'OTP verified successfully.',
            resetToken: resetTokenValue,
        });
    } catch (err) {
        logger.error('Verify OTP error:', 'verify-otp', err instanceof Error ? err : undefined);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export const config = { api: { bodyParser: { sizeLimit: '16kb' } } };