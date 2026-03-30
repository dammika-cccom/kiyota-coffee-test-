import crypto from "crypto";

/**
 * INSTITUTIONAL CRYPTO LOGIC
 * Generates the secure hash for PayHere Sandbox/Live.
 */
export function generatePayHereHash(
  merchantId: string,
  orderId: string,
  amount: number,
  currency: string,
  merchantSecret: string
) {
  // Format amount to 2 decimal places as per PayHere spec
  const formattedAmount = amount.toLocaleString("en-us", { minimumFractionDigits: 2, useGrouping: false });
  
  // MD5(MerchantID + OrderID + Amount + Currency + MD5(MerchantSecret))
  const hashedSecret = crypto.createHash("md5").update(merchantSecret).digest("hex").toUpperCase();
  
  const mainHash = crypto
    .createHash("md5")
    .update(merchantId + orderId + formattedAmount + currency + hashedSecret)
    .digest("hex")
    .toUpperCase();

  return mainHash;
}