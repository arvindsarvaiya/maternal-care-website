import nodemailer from 'nodemailer';
import { logger } from './logger';

/**
 * Creates a Nodemailer SMTP transporter from environment variables.
 * Supports Gmail, Yahoo, Outlook, and custom SMTP servers.
 */
function createTransporter(): nodemailer.Transporter | null {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
        logger.error('SMTP configuration missing. Set SMTP_HOST, SMTP_USER, SMTP_PASS in .env', 'email');
        return null;
    }

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // true for port 465, false for others (STARTTLS)
        auth: { user, pass },
    });
}

const FROM_NAME = process.env.SMTP_FROM_NAME || 'MaternalCare';
const FROM_EMAIL = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || 'noreply@maternalcare.in';

/**
 * Generates a cryptographically secure 6-digit OTP.
 */
export function generateOTP(): string {
    const digits = '0123456789';
    let otp = '';
    const bytes = new Uint8Array(6);
    crypto.getRandomValues(bytes);
    for (let i = 0; i < 6; i++) {
        otp += digits[bytes[i] % 10];
    }
    return otp;
}

/**
 * Sends an OTP email to the specified address via Nodemailer SMTP.
 */
/**
 * Sends a verification email to the specified address.
 */
export async function sendVerificationEmail(to: string, token: string): Promise<{ success: boolean; error?: string }> {
    const transporter = createTransporter();
    if (!transporter) {
        return { success: false, error: 'SMTP transporter not configured. Check SMTP_HOST, SMTP_USER, SMTP_PASS in .env' };
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const verificationUrl = `${appUrl}/verify-email?token=${encodeURIComponent(token)}`;

    try {
        await transporter.sendMail({
            from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
            to,
            subject: 'Verify Your Email — MaternalCare',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <h1 style="color: #e91e63; margin: 0; font-size: 24px;">MaternalCare</h1>
                        <p style="color: #666; margin: 4px 0 0;">Email Verification</p>
                    </div>
                    <div style="background: #fdf2f8; border-radius: 12px; padding: 24px; text-align: center;">
                        <p style="color: #333; font-size: 16px; margin: 0 0 16px;">Welcome to MaternalCare! Please verify your email address to activate your account.</p>
                        <a href="${verificationUrl}" style="display: inline-block; background: #e91e63; color: #fff; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; margin: 16px 0;">
                            Verify Email
                        </a>
                        <p style="color: #888; font-size: 13px; margin: 16px 0 0;">
                            This link expires in <strong>24 hours</strong>. If you didn't create this account, you can safely ignore this email.
                        </p>
                    </div>
                </div>
            `,
        });

        return { success: true };
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to send email';
        logger.error('sendVerificationEmail error', 'email', err instanceof Error ? err : undefined);
        return { success: false, error: message };
    }
}

/**
 * Sends an OTP email to the specified address via Nodemailer SMTP.
 */
export async function sendOTPEmail(to: string, otp: string): Promise<{ success: boolean; error?: string }> {
    const transporter = createTransporter();
    if (!transporter) {
        return { success: false, error: 'SMTP transporter not configured. Check SMTP_HOST, SMTP_USER, SMTP_PASS in .env' };
    }

    try {
        await transporter.sendMail({
            from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
            to,
            subject: 'Your Password Reset OTP — MaternalCare',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <h1 style="color: #e91e63; margin: 0; font-size: 24px;">MaternalCare</h1>
                        <p style="color: #666; margin: 4px 0 0;">Password Reset</p>
                    </div>
                    <div style="background: #fdf2f8; border-radius: 12px; padding: 24px; text-align: center;">
                        <p style="color: #333; font-size: 16px; margin: 0 0 8px;">Your One-Time Password (OTP) is:</p>
                        <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #e91e63; margin: 16px 0;">
                            ${otp}
                        </div>
                        <p style="color: #888; font-size: 13px; margin: 0;">
                            This OTP expires in <strong>10 minutes</strong>. Do not share it with anyone.
                        </p>
                    </div>
                    <p style="color: #999; font-size: 12px; text-align: center; margin-top: 24px;">
                        If you didn't request this, you can safely ignore this email.
                    </p>
                </div>
            `,
        });

        return { success: true };
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to send email';
        logger.error('sendOTPEmail error', 'email', err instanceof Error ? err : undefined);
        return { success: false, error: message };
    }
}