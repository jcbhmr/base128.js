import { iteratorChunks, iteratorConcat } from "./utils.ts";

export interface Base128EncoderEncodeOptions {
  stream?: boolean;
}

export class Base128Encoder {
  #carry: number[] = [];
  constructor() {}
  encode(input: Uint8Array = new Uint8Array(), options: Base128EncoderEncodeOptions = {}): string {
    const { stream = false } = options;
    let result = "";
    for (const chunk of iteratorChunks(iteratorConcat(this.#carry, input), 7)) {
      if (stream && chunk.length < 7) {
        this.#carry = chunk;
        break;
      }
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
    if (!stream) {
      this.#carry = [];
    }
    return result;
  }
}

export class Base128EncoderStream extends TransformStream<Uint8Array, string> {
  constructor() {
    const encoder = new Base128Encoder();
    super({
      transform(chunk, controller) {
        const chunkEncoded = encoder.encode(chunk, { stream: true });
        if (chunkEncoded.length) {
          controller.enqueue(chunkEncoded);
        }
      },
      flush(controller) {
        const finalChunkEncoded = encoder.encode();
        if (finalChunkEncoded.length) {
          controller.enqueue(finalChunkEncoded);
        }
      },
    });
  }
}
