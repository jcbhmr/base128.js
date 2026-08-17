import { typedArrayChunks } from "./utils.ts";

export function bytesToBase128(self: Uint8Array): string {
  let result = "";
  const selfLength = self.length;
  for (let i = 0; i < selfLength; i += 7) {
    const chunk0 = self[i] ?? 0;
    const chunk1 = self[i + 1] ?? 0;
    const chunk2 = self[i + 2] ?? 0;
    const chunk3 = self[i + 3] ?? 0;
    const chunk4 = self[i + 4] ?? 0;
    const chunk5 = self[i + 5] ?? 0;
    const chunk6 = self[i + 6] ?? 0;

    const hi = (chunk0 << 16) | (chunk1 << 8) | chunk2;
    const lo = (chunk3 << 24) | (chunk4 << 16) | (chunk5 << 8) | chunk6;

    const cc0 = (hi >> 21) & 0x7f;
    const cc1 = (hi >> 14) & 0x7f;
    const cc2 = (hi >> 7) & 0x7f;
    const cc3 = hi & 0x7f;
    const cc4 = (lo >> 21) & 0x7f;
    const cc5 = (lo >> 14) & 0x7f;
    const cc6 = (lo >> 7) & 0x7f;
    const cc7 = lo & 0x7f;

    const chars = String.fromCharCode(cc0, cc1, cc2, cc3, cc4, cc5, cc6, cc7);
    const remaining = selfLength - i;
    if (remaining < 7) {
      result += chars.slice(0, remaining + 1);
    } else {
      result += chars;
    }
  }
  return result;
}

export function bytesSetFromBase128(
  self: Uint8Array,
  input: string,
): { read: number; written: number } {}

export function bytesFromBase128(input: string): Uint8Array {}
