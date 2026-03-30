import { md5 } from "./crypto-utils";

export function generatePayHereHash(
  merchantId: string,
  orderId: string,
  amount: number,
  currency: string,
  merchantSecret: string
): string {
  const amountFormatted = amount.toFixed(2);
  const hashedSecret = md5(merchantSecret).toUpperCase();
  const mainString = merchantId + orderId + amountFormatted + currency + hashedSecret;
  return md5(mainString).toUpperCase();
}