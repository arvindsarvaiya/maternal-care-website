import { jwtVerify } from 'jose';

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

// ─── JWT Payload ───

export interface JWTPayload {
    userId: string;
    email?: string | null;
    roles: string[];
    tokenVersion: number;
}

// ─── JWT Verification (lightweight for middleware) ───

export async function verifyToken(token: string): Promise<JWTPayload | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as unknown as JWTPayload;
    } catch (error) {
        return null;
    }
}
