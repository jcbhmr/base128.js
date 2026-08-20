import { iteratorChunks, iteratorConcat, stringCharCodes } from "./utils.ts";

export interface Base128DecoderDecodeOptions {
  stream?: boolean;
}

export interface Base128DecoderDecodeIntoResult {
  read: number;
  written: number;
}

export class Base128Decoder {
  #carry: number[] = [];
  constructor() {}

  decode(input: string = "", options: Base128DecoderDecodeOptions = {}): Uint8Array {
    const { stream = false } = options;
    const result = new Uint8Array(Math.ceil((this.#carry.length + input.length) / 8) * 7);
    let resultUsed = 0;
    for (const chunk of iteratorChunks(iteratorConcat(this.#carry, stringCharCodes(input)), 8)) {
      if (stream && chunk.length < 8) {
        this.#carry = chunk;
        break;
      }
      let n = 0n;
      for (let i = 0; i < 8; i++) {
        const v = BigInt(chunk[i] ?? 0);
        n |= v << BigInt(56 - 7 * (i + 1));
      }
      for (let i = 0; i < 7; i++) {
        const cc = Number((n >> BigInt(56 - 8 * (i + 1))) & 0xffn);
        result[resultUsed + i] = cc;
      }
      resultUsed += chunk.length - 1;
    }
    return result.subarray(0, resultUsed);
  }

  decodeInto(
    source: string,
    destination: Uint8Array,
    options: Base128DecoderDecodeOptions = {},
  ): Base128DecoderDecodeIntoResult {
    const { stream = false } = options;
    let read = 0;
    let written = 0;
    for (const chunk of iteratorChunks(iteratorConcat(this.#carry, stringCharCodes(source)), 8)) {
      if (stream && chunk.length < 8) {
        this.#carry = chunk;
        break;
      }
      let n = 0n;
      for (let i = 0; i < 8; i++) {
        const v = BigInt(chunk[i] ?? 0);
        n |= v << BigInt(56 - 7 * (i + 1));
      }
      if (written + chunk.length - 1 > destination.length) {
        break;
      }
      const bytes = new Uint8Array(7);
      for (let i = 0; i < 7; i++) {
        bytes[i] = Number((n >> BigInt(56 - 8 * (i + 1))) & 0xffn);
      }
      destination.set(bytes.subarray(0, chunk.length - 1), written);
      read += chunk.length;
      written += chunk.length - 1;
    }
    return { read, written };
  }
}

export class Base128DecoderStream extends TransformStream<string, Uint8Array> {
  constructor() {
    const decoder = new Base128Decoder();
    super({
      transform(chunk, controller) {
        const chunkDecoded = decoder.decode(chunk, { stream: true });
        if (chunkDecoded.length) {
          controller.enqueue(chunkDecoded);
        }
      },
      flush(controller) {
        const finalChunkDecoded = decoder.decode();
        if (finalChunkDecoded.length) {
          controller.enqueue(finalChunkDecoded);
        }
      },
    });
  }
}
