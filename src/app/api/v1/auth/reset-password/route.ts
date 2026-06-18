import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { hashPassword, validatePasswordStrength, invalidateAllSessions } from '@/lib/auth';
import { validateBody, success, badRequest } from '@/lib/api-utils';
import { logger } from '@/lib/logger';
import { auditPasswordChange } from '@/lib/audit';

const resetPasswordSchema = z.object({
    email: z.string().email('Please provide a valid email address'),
    resetToken: z.string().min(1, 'Reset token is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { data, error } = validateBody(resetPasswordSchema, body);
        if (error) return badRequest(error);

        // Validate password strength
        const pwCheck = validatePasswordStrength(data!.newPassword);
        if (!pwCheck.valid) return badRequest(pwCheck.message);

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: data!.email },
        });

        if (!user) {
            return badRequest('Invalid reset request.');
        }

        // Find the valid reset token
        const resetToken = await prisma.passwordResetToken.findFirst({
            where: {
                userId: user.id,
                token: data!.resetToken,
                used: true, // was marked used during OTP verification, but expired-time still valid
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        });

        if (!resetToken) {
            return badRequest('Invalid or expired reset token. Please start the process again.');
        }

        // Hash the new password
        const passwordHash = await hashPassword(data!.newPassword);

        // Update the user's password
        await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash },
        });

        // Invalidate all existing sessions for this user (token versioning)
        await invalidateAllSessions(user.id);

        // Invalidate all remaining reset tokens for this user
        await prisma.passwordResetToken.updateMany({
            where: { userId: user.id },
            data: { used: true },
        });

        // Fire-and-forget audit log
        auditPasswordChange(user.id, 'password-reset');

        return success({ message: 'Password has been reset successfully. You can now log in.' });
    } catch (err) {
        logger.error('Reset password error:', 'reset-password', err instanceof Error ? err : undefined);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export const config = { api: { bodyParser: { sizeLimit: '16kb' } } };