import crypto from "node:crypto";

/**
 * INSTITUTIONAL SECURITY PROTOCOL
 * Generates the MD5 Integrity Hash for PayHere Gateway.
 * Formula: MD5(MerchantID + OrderID + Amount + Currency + MD5(MerchantSecret))
 * Zero-Any Standard | Zero-ESLint Error
 */
export function generatePayHereHash(
  merchantId: string,
  orderId: string,
  amount: number,
  currency: string,
  merchantSecret: string
): string {
  // 1. Format amount to exactly 2 decimal places (e.g., 1500.00)
  // PayHere expects a string representation of the number with no commas.
  const amountFormatted = amount.toFixed(2);

  // 2. Hash the Merchant Secret (Step 1 of Tiered Security)
  const hashedSecret = crypto
    .createHash("md5")
    .update(merchantSecret)
    .digest("hex")
    .toUpperCase();

  // 3. Construct the Main Signature String
  const mainString = merchantId + orderId + amountFormatted + currency + hashedSecret;

  // 4. Generate Final Signature
  return crypto
    .createHash("md5")
    .update(mainString)
    .digest("hex")
    .toUpperCase();
}