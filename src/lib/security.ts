import { sendAdminEmail } from './notifications';
import { logActivityInStore } from './storeManager';

interface AttemptRecord {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
  lockedUntil: number | null;
}

// In-memory tracker for failed attempts and IP lockouts
const failedAttemptsMap = new Map<string, AttemptRecord>();

const MAX_FAILED_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes window
const LOCKOUT_DURATION_MS = 30 * 60 * 1000; // 30 minutes lockout

/**
 * Extract Real Client IP from Request Headers
 */
export function getClientIp(headers: Headers): string {
  const cfConnectingIp = headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp.trim();

  const xForwardedFor = headers.get('x-forwarded-for');
  if (xForwardedFor) {
    const ips = xForwardedFor.split(',');
    return ips[0].trim();
  }

  const xRealIp = headers.get('x-real-ip');
  if (xRealIp) return xRealIp.trim();

  return 'Unknown IP';
}

/**
 * Check if an IP is currently blocked/locked out
 */
export function isIpLocked(ip: string): { locked: boolean; remainingMinutes: number } {
  const record = failedAttemptsMap.get(ip);
  if (!record || !record.lockedUntil) {
    return { locked: false, remainingMinutes: 0 };
  }

  const now = Date.now();
  if (now < record.lockedUntil) {
    const remainingMinutes = Math.ceil((record.lockedUntil - now) / 60000);
    return { locked: true, remainingMinutes };
  }

  // Lockout expired, reset record
  failedAttemptsMap.delete(ip);
  return { locked: false, remainingMinutes: 0 };
}

/**
 * Record a failed login / unauthorized attempt
 */
export async function recordFailedAttempt(ip: string, email: string, userAgent?: string): Promise<{ locked: boolean; attemptsLeft: number }> {
  const now = Date.now();
  let record = failedAttemptsMap.get(ip);

  if (!record || (now - record.firstAttempt > ATTEMPT_WINDOW_MS && !record.lockedUntil)) {
    record = {
      count: 1,
      firstAttempt: now,
      lastAttempt: now,
      lockedUntil: null,
    };
  } else {
    record.count += 1;
    record.lastAttempt = now;
  }

  let locked = false;
  if (record.count >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
    locked = true;
  }

  failedAttemptsMap.set(ip, record);

  const attemptsLeft = Math.max(0, MAX_FAILED_ATTEMPTS - record.count);

  // Security Alert Details
  const title = locked
    ? `🚨 CRITICAL SECURITY ALERT: IP Auto-Blocked (${ip})`
    : `⚠️ WARNING: Unauthorized / Failed Admin Login Attempt (${ip})`;

  const details = locked
    ? `Target: ${email} | IP: ${ip} exceeded ${MAX_FAILED_ATTEMPTS} failed attempts. IP has been automatically LOCKED for 30 minutes. User-Agent: ${userAgent || 'Unknown'}`
    : `Target: ${email} | IP: ${ip} failed password attempt (${record.count}/${MAX_FAILED_ATTEMPTS}). Attempts left before IP lockout: ${attemptsLeft}. User-Agent: ${userAgent || 'Unknown'}`;

  // Log in system activity store
  logActivityInStore({
    type: 'SUSPICIOUS',
    title,
    details,
    userEmail: email,
  });

  // Send High Priority Email Alert to Admin immediately
  sendAdminEmail({
    title,
    type: 'SUSPICIOUS',
    details,
    userEmail: email,
  }).catch((err) => {
    console.error('Failed to dispatch security alert email:', err);
  });

  return { locked, attemptsLeft };
}

/**
 * Reset failed attempts on successful login
 */
export function recordSuccessfulLogin(ip: string) {
  failedAttemptsMap.delete(ip);
}
