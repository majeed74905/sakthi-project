/**
 * Masks sensitive bank account numbers for public/admin views and logs.
 * Example: "999900001002" -> "XXXXXX1002"
 */
export function maskAccountNumber(accNo) {
  if (!accNo || typeof accNo !== 'string') return 'XXXXXX';
  if (accNo.length <= 4) return 'XXXX';
  return 'X'.repeat(accNo.length - 4) + accNo.slice(-4);
}

/**
 * Masks email address for privacy.
 * Example: "member01@example.com" -> "m***01@example.com"
 */
export function maskEmail(email) {
  if (!email || !email.includes('@')) return '***@***.com';
  const [user, domain] = email.split('@');
  if (user.length <= 2) return `${user[0]}*@${domain}`;
  return `${user[0]}***${user[user.length - 1]}@${domain}`;
}

/**
 * Sanitizes object data before logging, stripping passwords, tokens, and full account numbers.
 */
export function sanitizeLogData(data) {
  if (!data || typeof data !== 'object') return data;
  const sanitized = Array.isArray(data) ? [...data] : { ...data };

  const sensitiveKeys = ['password', 'transactionPassword', 'passwordHash', 'transactionPasswordHash', 'accountNumber', 'token', 'refreshToken'];

  for (const key in sanitized) {
    if (sensitiveKeys.includes(key)) {
      sanitized[key] = '[REDACTED_SENSITIVE]';
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeLogData(sanitized[key]);
    }
  }

  return sanitized;
}
