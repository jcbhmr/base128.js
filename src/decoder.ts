import { bytesFromBase128, bytesSetFromBase128 } from "./bytes.ts";

export interface Base128DecoderDecodeOptions {
  stream?: boolean;
}

export interface Base128DecoderDecodeIntoResult {
  read: number;
  written: number;
}

export class Base128Decoder {
  #carry: string | undefined;
  constructor() {}

  decode(input: string = "", options: Base128DecoderDecodeOptions = {}): Uint8Array {
    const { stream = false } = options;
    if (!stream && this.#carry == null) {
      return bytesFromBase128(input);
    }
  }

  decodeInto(
    source: string,
    destination: Uint8Array,
    options: Base128DecoderDecodeOptions = {},
  ): Base128DecoderDecodeIntoResult {}
}

export class Base128DecoderStream extends TransformStream<string, Uint8Array> {
  constructor() {
    super({
      transform: (chunk, controller) => this.#transform(chunk, controller),
      flush: (controller) => this.#flush(controller),
    });
  }

  #transform(chunk: string, controller: TransformStreamDefaultController<Uint8Array>) {}

  #flush(controller: TransformStreamDefaultController<Uint8Array>) {}
}
