import { iteratorChunks, stringCharCodes, typedArrayChunks } from "./utils.ts";

export function bytesToBase128(self: Uint8Array): string {
  let result = "";
  for (const chunk of typedArrayChunks(self, 7)) {
    let n = 0n;
    for (let i = 0; i < 7; i++) {
      const v = BigInt(chunk[i] ?? 0);
      n |= v << BigInt(56 - 8 * (i + 1));
    }
    const charCodes = new Uint8Array(8);
    for (let i = 0; i < 8; i++) {
      charCodes[i] = Number((n >> BigInt(56 - 7 * (i + 1))) & 0x7fn);
    }
    result += String.fromCharCode(...charCodes.subarray(0, chunk.length + 1));
  }
  return result;
}

export function bytesSetFromBase128(
  self: Uint8Array,
  input: string,
): { read: number; written: number } {
  let read = 0;
  let written = 0;
  for (const chunk of iteratorChunks(stringCharCodes(input), 8)) {
    if (written + chunk.length - 1 > self.length) {
      break;
    }
    let n = 0n;
    for (let i = 0; i < 8; i++) {
      const v = BigInt(chunk[i] ?? 0);
      n |= v << BigInt(56 - 7 * (i + 1));
    }
    for (let i = 0; i < 7; i++) {
      self[written + i] = Number((n >> BigInt(56 - 8 * (i + 1))) & 0xffn);
    }
    read += chunk.length;
    written += chunk.length - 1;
  }
  return { read, written };
}

export function bytesFromBase128(input: string): Uint8Array<ArrayBuffer> {
  const result = new Uint8Array(Math.ceil(input.length / 8) * 7);
  let resultUsed = 0;
  for (const chunk of iteratorChunks(stringCharCodes(input), 8)) {
    let n = 0n;
    for (let i = 0; i < 8; i++) {
      const v = BigInt(chunk[i] ?? 0);
      n |= v << BigInt(56 - 7 * (i + 1));
    }
    for (let i = 0; i < 7; i++) {
      result[resultUsed + i] = Number((n >> BigInt(56 - 8 * (i + 1))) & 0xffn);
    }
    resultUsed += chunk.length - 1;
  }
  return result.subarray(0, resultUsed);
}
