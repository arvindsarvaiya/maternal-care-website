/**
 * Audit Trail Utility
 *
 * Provides a centralized audit logging mechanism that records security-sensitive
 * operations to the database. This enables:
 * - SIEM/log aggregation pipeline integration
 * - Forensic analysis after security incidents
 * - Compliance with data protection regulations (HIPAA-like, Indian DPDP Act)
 * - Anomaly detection by monitoring access patterns
 *
 * All audit writes are fire-and-forget (non-blocking) to avoid impacting
 * request latency. Failed audit writes are logged to the structured logger
 * but never cause the parent operation to fail.
 */

import { logger } from './logger';

export type AuditAction =
    | 'CREATE'
    | 'UPDATE'
    | 'DELETE'
    | 'LOGIN'
    | 'LOGOUT'
    | 'PASSWORD_CHANGE'
    | 'SESSION_INVALIDATE'
    | 'PROFILE_VIEW'
    | 'PROFILE_EDIT'
    | 'SETTINGS_CHANGE'
    | '2FA_ENABLE'
    | '2FA_DISABLE'
    | '2FA_VERIFY'
    | 'PARTNER_LINK'
    | 'PARTNER_UNLINK'
    | 'HEALTH_DATA_ACCESS'
    | 'HEALTH_DATA_MODIFY'
    | 'SENSITIVE_DATA_EXPORT'
    | 'ACCOUNT_LOCKOUT'
    | 'ADMIN_ACTION';

export interface AuditEntry {
    actorUserId: string;
    entityName: string;
    entityId: string;
    actionName: AuditAction;
    changeSummary: string;
}

/**
 * Writes an audit log entry to the database.
 * This is fire-and-forget — failures are logged but never thrown.
 *
 * @param entry - The audit entry to record
 */
export async function writeAuditLog(entry: AuditEntry): Promise<void> {
    try {
        const { prisma } = await import('./prisma');
        await prisma.auditLog.create({
            data: {
                actorUserId: entry.actorUserId,
                entityName: entry.entityName,
                entityId: entry.entityId,
                actionName: entry.actionName,
                changeSummary: entry.changeSummary,
            },
        });
    } catch (err) {
        logger.error(
            'Failed to write audit log',
            'audit',
            err instanceof Error ? err : undefined,
            {
                actorUserId: entry.actorUserId,
                actionName: entry.actionName,
                entityName: entry.entityName,
            },
        );
    }
}

/**
 * Writes an audit log entry without awaiting the result.
 * Use this in request handlers where audit latency should not
 * affect the response time.
 */
export function writeAuditLogAsync(entry: AuditEntry): void {
    writeAuditLog(entry).catch(() => {
        // Already logged inside writeAuditLog
    });
}

/**
 * Convenience function for logging a login event.
 */
export function auditLogin(userId: string, method: 'password' | '2fa' = 'password'): void {
    writeAuditLogAsync({
        actorUserId: userId,
        entityName: 'User',
        entityId: userId,
        actionName: 'LOGIN',
        changeSummary: `User logged in via ${method}`,
    });
}

/**
 * Convenience function for logging a logout event.
 */
export function auditLogout(userId: string): void {
    writeAuditLogAsync({
        actorUserId: userId,
        entityName: 'User',
        entityId: userId,
        actionName: 'LOGOUT',
        changeSummary: 'User logged out',
    });
}

/**
 * Convenience function for logging a password change.
 */
export function auditPasswordChange(userId: string, reason: string = 'user-initiated'): void {
    writeAuditLogAsync({
        actorUserId: userId,
        entityName: 'User',
        entityId: userId,
        actionName: 'PASSWORD_CHANGE',
        changeSummary: `Password changed (${reason})`,
    });
}

/**
 * Convenience function for logging account lockout.
 */
export function auditAccountLockout(userId: string): void {
    writeAuditLogAsync({
        actorUserId: userId,
        entityName: 'User',
        entityId: userId,
        actionName: 'ACCOUNT_LOCKOUT',
        changeSummary: 'Account locked due to too many failed login attempts',
    });
}

/**
 * Convenience function for logging a health data access.
 */
export function auditHealthDataAccess(userId: string, profileType: 'mother' | 'father' | 'pregnancy', operation: 'view' | 'modify'): void {
    writeAuditLogAsync({
        actorUserId: userId,
        entityName: `${profileType.charAt(0).toUpperCase() + profileType.slice(1)}HealthProfile`,
        entityId: userId,
        actionName: operation === 'view' ? 'HEALTH_DATA_ACCESS' : 'HEALTH_DATA_MODIFY',
        changeSummary: `Health data ${operation === 'view' ? 'viewed' : 'modified'} by owner`,
    });
}

/**
 * Convenience function for logging partner health data access.
 * This is especially important for audit compliance — when a partner
 * views the mother's health data, it must be logged.
 */
export function auditPartnerAccess(partnerId: string, motherId: string, dataType: string): void {
    writeAuditLogAsync({
        actorUserId: partnerId,
        entityName: 'PartnerAccess',
        entityId: motherId,
        actionName: 'HEALTH_DATA_ACCESS',
        changeSummary: `Partner accessed mother's ${dataType} data`,
    });
}