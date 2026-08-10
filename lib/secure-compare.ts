import crypto from 'crypto';

// Constant-time string comparison. Hashes both sides first so the buffers
// passed to timingSafeEqual always match in length - timingSafeEqual throws
// on unequal-length buffers, and branching on that throw would itself leak
// the secret's length through a timing side-channel.
export function timingSafeEqualString(a: string, b: string): boolean {
  const aHash = crypto.createHash('sha256').update(a).digest();
  const bHash = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(aHash, bHash);
}
