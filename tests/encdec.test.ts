import { test, expect } from "vite-plus/test";
import { Base128Encoder, Base128EncoderStream } from "../src/encoder.ts";
import { Base128Decoder, Base128DecoderStream } from "../src/decoder.ts";

test("round-trip 256 bytes", () => {
  const input = Uint8Array.from({ length: 256 }, (_, i) => i);
  const encoder = new Base128Encoder();
  const encoded = encoder.encode(input);
  const decoder = new Base128Decoder();
  const decoded = decoder.decode(encoded);
  expect(decoded).toEqual(input);
});

test("round-trip 256 bytes with streams", async () => {
  const input = Uint8Array.from({ length: 256 }, (_, i) => i);
  const decoded = await new Response(
    ReadableStream.from([input])
      .pipeThrough(new Base128EncoderStream())
      .pipeThrough(new Base128DecoderStream()),
  ).bytes();
  expect(decoded).toEqual(input);
});
