/**
 * PURE JS MD5 IMPLEMENTATION (Edge Compatible)
 * Fixed TypeScript typing for 'words' array.
 */
function md5(str: string): string {
  const k: number[] = [
    0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
    0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be, 0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
    0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
    0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
    0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
    0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
    0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
    0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
  ];
  const s: number[] = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21];
  let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476;
  const words: number[] = [];
  const byteStr = unescape(encodeURIComponent(str));
  for (let i = 0; i < byteStr.length; i++) words[i >> 2] |= byteStr.charCodeAt(i) << ((i % 4) << 3);
  words[byteStr.length >> 2] |= 0x80 << ((byteStr.length % 4) << 3);
  words[(((byteStr.length + 8) >> 6) << 4) + 14] = byteStr.length << 3;
  for (let i = 0; i < words.length; i += 16) {
    let aa = a, bb = b, cc = c, dd = d;
    for (let j = 0; j < 64; j++) {
      let f, g;
      if (j < 16) { f = (b & c) | (~b & d); g = j; }
      else if (j < 32) { f = (d & b) | (~d & c); g = (5 * j + 1) % 16; }
      else if (j < 48) { f = b ^ c ^ d; g = (3 * j + 5) % 16; }
      else { f = c ^ (b | ~d); g = (7 * j) % 16; }
      const temp = d; d = c; c = b;
      b = (b + ((a + f + k[j] + (words[i + g] || 0)) << s[j] | (a + f + k[j] + (words[i + g] || 0)) >>> (32 - s[j]))) | 0;
      a = temp;
    }
    a = (a + aa) | 0; b = (b + bb) | 0; c = (c + cc) | 0; d = (d + dd) | 0;
  }
  return [a, b, c, d].map(v => (v < 0 ? v + 0x100000000 : v).toString(16).padStart(8, '0').split('').reverse().join('').match(/../g)!.reverse().join('')).join('');
}

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