/**
 * Formats a number to Indian Rupee currency format (e.g. ₹4,999.00)
 */
export function formatCurrency(amount) {
  const numeric = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(numeric);
}

/**
 * Formats ISO date string to human readable format (e.g. 09 Aug 2026)
 */
export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

/**
 * Masks sensitive bank account number for safety.
 * Example: "999900001002" -> "XXXXXX1002"
 */
export function maskBankAcc(accountNumber) {
  if (!accountNumber || typeof accountNumber !== 'string') return 'XXXXXX';
  if (accountNumber.length <= 4) return 'XXXX';
  return 'X'.repeat(accountNumber.length - 4) + accountNumber.slice(-4);
}

/**
 * Validates standard User/Distributor ID format (e.g., MSM10001)
 */
export function validateUserCode(code) {
  if (!code) return false;
  return /^MSM\d{5,}$/i.test(code.trim());
}
