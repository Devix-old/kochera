/**
 * Cloudflare Turnstile Validator
 * Server-side validation utility for Turnstile tokens
 */

const SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || '0x4AAAAAACIEGenVQfGkmVJwt5CG08Zqsm0';
const VALIDATION_TIMEOUT = 10000; // 10 seconds

export interface TurnstileValidationResult {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
  action?: string;
  cdata?: string;
  metadata?: {
    ephemeral_id?: string;
  };
  error?: string;
}

export interface TurnstileValidationOptions {
  expectedAction?: string;
  expectedHostname?: string;
  idempotencyKey?: string;
}

/**
 * Validates a Turnstile token with Cloudflare's Siteverify API
 */
export async function validateTurnstile(
  token: string,
  remoteip?: string,
  options: TurnstileValidationOptions = {}
): Promise<TurnstileValidationResult> {
  // Input validation
  if (!token || typeof token !== 'string') {
    return {
      success: false,
      'error-codes': ['missing-input-response'],
      error: 'Invalid token format',
    };
  }

  if (token.length > 2048) {
    return {
      success: false,
      'error-codes': ['bad-request'],
      error: 'Token too long',
    };
  }

  // Prepare request with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), VALIDATION_TIMEOUT);

  try {
    const formData = new FormData();
    formData.append('secret', SECRET_KEY);
    formData.append('response', token);

    if (remoteip) {
      formData.append('remoteip', remoteip);
    }

    if (options.idempotencyKey) {
      formData.append('idempotency_key', options.idempotencyKey);
    }

    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      return {
        success: false,
        'error-codes': ['internal-error'],
        error: `Validation request failed: ${response.statusText}`,
      };
    }

    const result: TurnstileValidationResult = await response.json();

    // Additional validation checks
    if (result.success) {
      // Check action if specified
      if (options.expectedAction && result.action !== options.expectedAction) {
        return {
          success: false,
          'error-codes': ['bad-request'],
          error: 'Action mismatch',
        };
      }

      // Check hostname if specified
      if (options.expectedHostname && result.hostname !== options.expectedHostname) {
        return {
          success: false,
          'error-codes': ['bad-request'],
          error: 'Hostname mismatch',
        };
      }
    }

    return result;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return {
        success: false,
        'error-codes': ['timeout-or-duplicate'],
        error: 'Validation timeout',
      };
    }

    // Only log in development mode
    if (process.env.NODE_ENV === 'development') {
      console.error('Turnstile validation error:', error);
    }
    return {
      success: false,
      'error-codes': ['internal-error'],
      error: 'Internal validation error',
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Gets the client IP address from request headers
 */
export function getClientIP(request: Request): string | undefined {
  // Cloudflare header (when behind Cloudflare)
  const cfIP = request.headers.get('CF-Connecting-IP');
  if (cfIP) return cfIP;

  // Standard forwarded header
  const forwardedFor = request.headers.get('X-Forwarded-For');
  if (forwardedFor) {
    // X-Forwarded-For can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }

  // Fallback to other common headers
  const realIP = request.headers.get('X-Real-IP');
  if (realIP) return realIP;

  return undefined;
}

