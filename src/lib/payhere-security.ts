/**
 * INSTITUTIONAL SECURITY PROTOCOL
 * Generates the MD5 Integrity Hash for PayHere Gateway.
 * Cloudflare Edge Compatible version.
 */
export function generatePayHereHash(
  merchantId: string,
  orderId: string,
  amount: number,
  currency: string,
  merchantSecret: string
): string {
  // Use require inside the function to bypass ESM import restrictions on Edge
  const nodeCrypto = require('crypto');
  
  const amountFormatted = amount.toFixed(2);

  // 1. Hash the Merchant Secret
  const hashedSecret = nodeCrypto
    .createHash("md5")
    .update(merchantSecret)
    .digest("hex")
    .toUpperCase();

  // 2. Construct the Main Signature String
  const mainString = merchantId + orderId + amountFormatted + currency + hashedSecret;

  // 3. Generate Final Signature
  return nodeCrypto
    .createHash("md5")
    .update(mainString)
    .digest("hex")
    .toUpperCase();
}