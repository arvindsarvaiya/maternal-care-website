/**
 * TOTP Secret Encryption — AES-256-GCM
 * 
 * Encrypts TOTP secrets at rest in the database so that a database
 * breach alone does not expose the raw TOTP secrets.
 * 
 * Uses AES-256-GCM for authenticated encryption with a random IV
 * prepended to the ciphertext for storage.
 */

import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

// AES-256-GCM constants
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // 128-bit IV for GCM
const AUTH_TAG_LENGTH = 16; // 128-bit auth tag
const KEY_LENGTH = 32; // 256-bit key

/**
 * Derives the encryption key from the TOTP_ENCRYPTION_KEY environment variable.
 * The key must be 64 hex characters (32 bytes / 256 bits).
 */
function getEncryptionKey(): Buffer {
    const hexKey = process.env.TOTP_ENCRYPTION_KEY;
    if (!hexKey) {
        throw new Error('TOTP_ENCRYPTION_KEY environment variable is not set. TOTP encryption cannot operate.');
    }
    if (hexKey.length < 64) {
        throw new Error('TOTP_ENCRYPTION_KEY must be at least 64 hex characters (32 bytes / 256 bits).');
    }
    return Buffer.from(hexKey.slice(0, 64), 'hex');
}

/**
 * Encrypts a TOTP secret string for storage in the database.
 * Returns a hex-encoded string: IV (16 bytes) + AuthTag (16 bytes) + Ciphertext.
 * 
 * @param plaintext - The raw TOTP secret (base32 string)
 * @returns Hex-encoded encrypted data
 */
export function encryptTotpSecret(plaintext: string): string {
    const key = getEncryptionKey();
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, key, iv);

    const encrypted = Buffer.concat([
        cipher.update(plaintext, 'utf8'),
        cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();

    // Store as: IV + Ciphertext + AuthTag (all concatenated, then hex-encoded)
    return Buffer.concat([iv, encrypted, authTag]).toString('hex');
}

/**
 * Decrypts a TOTP secret that was encrypted with encryptTotpSecret().
 * 
 * @param encryptedHex - The hex-encoded encrypted data from the database
 * @returns The original TOTP secret (base32 string), or null if decryption fails
 */
export function decryptTotpSecret(encryptedHex: string): string | null {
    try {
        const key = getEncryptionKey();
        const data = Buffer.from(encryptedHex, 'hex');

        // Extract IV, ciphertext, and auth tag
        const iv = data.subarray(0, IV_LENGTH);
        const authTag = data.subarray(data.length - AUTH_TAG_LENGTH);
        const encrypted = data.subarray(IV_LENGTH, data.length - AUTH_TAG_LENGTH);

        const decipher = createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(authTag);

        const decrypted = Buffer.concat([
            decipher.update(encrypted),
            decipher.final(),
        ]);

        return decrypted.toString('utf8');
    } catch {
        // Decryption failed (wrong key, corrupted data, etc.)
        return null;
    }
}