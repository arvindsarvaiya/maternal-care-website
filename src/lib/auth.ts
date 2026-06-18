import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import * as otplib from 'otplib';
import QRCode from 'qrcode';

function getJwtSecret(): Uint8Array {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('FATAL: JWT_SECRET environment variable is not set. Application cannot start.');
    }
    if (secret.length < 32) {
        throw new Error('FATAL: JWT_SECRET must be at least 32 characters long.');
    }
    return new TextEncoder().encode(secret);
}

const JWT_SECRET = getJwtSecret();

// ─── TOTP Configuration ───

/** Issuer label shown in authenticator apps (e.g., "MaternalCare") */
const TOTP_ISSUER = process.env.NEXT_PUBLIC_APP_NAME || 'MaternalCare';

// ─── JWT Payload ───

export interface JWTPayload {
    userId: string;
    email?: string | null;
    roles: string[];
    tokenVersion: number;
}

// ─── Password Helpers ───

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export function validatePasswordStrength(password: string): { valid: boolean; message: string } {
    if (password.length < 8) {
        return { valid: false, message: 'Password must be at least 8 characters long.' };
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one uppercase letter.' };
    }
    if (!/[a-z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one lowercase letter.' };
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one number.' };
    }
    return { valid: true, message: 'Password is strong.' };
}

// ─── JWT Helpers ───

export async function createToken(payload: JWTPayload): Promise<string> {
    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(JWT_SECRET);
}

/**
 * Creates a short-lived (5 min) intermediate token used during the
 * TOTP 2FA step. It carries the same payload but expires quickly.
 */
export async function createIntermediateToken(payload: JWTPayload): Promise<string> {
    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('5m')
        .sign(JWT_SECRET);
}

/**
 * Fetches the current tokenVersion for a user from the database.
 * Used by auth routes to include the version in newly created JWTs.
 */
export async function getTokenVersion(userId: string): Promise<number> {
    try {
        const { prisma: prismaClient } = await import('./prisma');
        const user = await prismaClient.user.findUnique({
            where: { id: userId },
            select: { tokenVersion: true },
        });
        return user?.tokenVersion ?? 0;
    } catch {
        return 0;
    }
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as unknown as JWTPayload;
    } catch {
        return null;
    }
}

/**
 * Verifies a JWT and checks that the tokenVersion in the payload
 * matches the current tokenVersion stored in the database.
 * If the versions don't match, the token is considered invalid
 * (user changed password, logged out from all devices, etc.).
 *
 * This function requires a database call — use it for API routes
 * where session invalidation is critical. For middleware (page guards),
 * use the lighter `verifyToken()` which is cryptographic-only.
 */
export async function verifyTokenWithVersion(token: string): Promise<JWTPayload | null> {
    const payload = await verifyToken(token);
    if (!payload) return null;

    try {
        const { prisma: prismaClient } = await import('./prisma');
        const user = await prismaClient.user.findUnique({
            where: { id: payload.userId },
            select: { tokenVersion: true, isActive: true },
        });
        if (!user || !user.isActive || user.tokenVersion !== payload.tokenVersion) {
            return null;
        }
        return payload;
    } catch {
        // If the DB check fails, still return the cryptographically valid payload
        // to avoid a hard dependency on the DB for every request.
        // This is a graceful degradation — the token is still valid from a
        // cryptographic standpoint.
        return payload;
    }
}

/**
 * Increments the user's tokenVersion in the database, effectively
 * invalidating all existing JWTs for that user.
 *
 * Call this after:
 * - Password change
 * - Logout from all devices
 * - Account compromise detection
 * - Admin-initiated session revocation
 *
 * @param userId - The user whose sessions should be invalidated
 */
export async function invalidateAllSessions(userId: string): Promise<void> {
    try {
        const { prisma: prismaClient } = await import('./prisma');
        await prismaClient.user.update({
            where: { id: userId },
            data: { tokenVersion: { increment: 1 } },
        });
    } catch (err) {
        // Log but don't throw — the password change itself succeeded
        const { logger } = await import('./logger');
        logger.error('Failed to invalidate sessions:', 'auth', err instanceof Error ? err : undefined, { userId });
    }
}

// ─── TOTP (Time-Based One-Time Password) 2FA Helpers ───

/**
 * Generates a cryptographically secure base32 secret for TOTP setup.
 * This secret is stored on the server and used to verify codes
 * from the user's authenticator app (Google Authenticator, Authy, etc.).
 */
export function generateTOTPSecret(): string {
    return otplib.generateSecret();
}

/**
 * Generates the otpauth:// URI that gets embedded in a QR code.
 * The user scans this with their authenticator app during setup.
 *
 * @param email  - User's email (used as the account label)
 * @param secret - Base32 TOTP secret from generateTOTPSecret()
 */
export function generateTOTPUri(email: string, secret: string): string {
    return otplib.generateURI({ issuer: TOTP_ISSUER, label: email, secret });
}

/**
 * Generates a QR code data URL (base64 PNG) for the TOTP URI.
 * Display this as an <img> tag to the user during 2FA setup.
 *
 * @param uri - The otpauth:// URI from generateTOTPUri()
 */
export async function generateTOTPQRDataURL(uri: string): Promise<string> {
    return QRCode.toDataURL(uri);
}

/**
 * Verifies a 6-digit TOTP token against a secret.
 * Uses a window of ±1 step (30s before/after) for clock drift tolerance.
 *
 * @param token  - 6-digit code from the user's authenticator app
 * @param secret - Base32 TOTP secret stored on the user record
 */
export async function verifyTOTP(token: string, secret: string): Promise<boolean> {
    try {
        const result = await otplib.verify({ token, secret });
        return Boolean(result);
    } catch {
        return false;
    }
}