import { bytesToBase128 } from "./bytes.ts";

export interface Base128EncoderEncodeOptions {
  stream?: boolean;
}

export class Base128Encoder {
  #carry: Uint8Array | undefined;
  constructor() {}
  encode(input: Uint8Array = new Uint8Array(), options: Base128EncoderEncodeOptions = {}): string {
    const { stream = false } = options;
    if (!stream && !this.#carry) {
      return bytesToBase128(input);
    }
  }
}

export class Base128EncoderStream extends TransformStream<Uint8Array, string> {
  constructor() {
    super({
      transform: (chunk, controller) => this.#transform(chunk, controller),
      flush: (controller) => this.#flush(controller),
    });
  }

  #transform(chunk: Uint8Array, controller: TransformStreamDefaultController<string>) {}

  #flush(controller: TransformStreamDefaultController<string>) {}
}
