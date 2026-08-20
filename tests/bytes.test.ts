import { expect, test } from "vite-plus/test";
import { bytesFromBase128, bytesToBase128 } from "../src/bytes.ts";

test("round-trip 0 bytes", () => {
  const input = new Uint8Array();
  const encoded = bytesToBase128(input);
  const decoded = bytesFromBase128(encoded);
  expect(decoded).toEqual(input);
});

test("round-trip 1 byte", () => {
  const input = new Uint8Array([0x01]);
  const encoded = bytesToBase128(input);
  const decoded = bytesFromBase128(encoded);
  expect(decoded).toEqual(input);
});

test("round-trip 256 bytes", () => {
  const input = Uint8Array.from({ length: 256 }, (_, i) => i);
  const encoded = bytesToBase128(input);
  const decoded = bytesFromBase128(encoded);
  expect(decoded).toEqual(input);
});

test("round-trip 1,000 bytes", () => {
  const input = Uint8Array.from({ length: 1000 }, (_, i) => i % 256);
  const encoded = bytesToBase128(input);
  const decoded = bytesFromBase128(encoded);
  expect(decoded).toEqual(input);
});
