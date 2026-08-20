export function bytesToBase128(self: Uint8Array): string {
  let result = "";
  const tempBuffer = new ArrayBuffer(8);
  const tempBytes = new Uint8Array(tempBuffer);
  const tempView = new DataView(tempBuffer);
  let tempString = "";
  for (let i = 0; i < self.length; i += 7) {
    tempBytes.fill(0);
    tempString = "";

    tempBytes.set(self.subarray(i, i + 7), 1);

    const high = tempView.getUint32(0, false);
    const low = tempView.getUint32(4, false);

    tempString += String.fromCharCode((high >> 14) & 0x7f);
    tempString += String.fromCharCode((high >> 7) & 0x7f);
    tempString += String.fromCharCode(high & 0x7f);
    tempString += String.fromCharCode((low >> 21) & 0x7f);
    tempString += String.fromCharCode((low >> 14) & 0x7f);
    tempString += String.fromCharCode((low >> 7) & 0x7f);
    tempString += String.fromCharCode(low & 0x7f);

    result += tempString;
  }
  const remainder = self.length % 7;
  if (remainder > 0) {
    result = result.slice(0, -(7 - remainder));
  }
  return result;
}

export function bytesFromBase128(input: string): Uint8Array<ArrayBuffer> {
  let result = new Uint8Array(Math.ceil(input.length / 8) * 7);
  const tempBuffer = new ArrayBuffer(8);
  const tempBytes = new Uint8Array(tempBuffer);
  const tempView = new DataView(tempBuffer);
  let tempString = "";
  for (let i = 0; i < input.length; i += 8) {
    tempBytes.fill(0);
    tempString = "";

    tempString = input.slice(i, i + 8).padEnd(8, "\0");

    if (
      tempString.charCodeAt(0) > 127 ||
      tempString.charCodeAt(1) > 127 ||
      tempString.charCodeAt(2) > 127 ||
      tempString.charCodeAt(3) > 127 ||
      tempString.charCodeAt(4) > 127 ||
      tempString.charCodeAt(5) > 127 ||
      tempString.charCodeAt(6) > 127 ||
      tempString.charCodeAt(7) > 127
    ) {
      throw new SyntaxError("Found a character that cannot be part of a valid base128 string.");
    }

    const high =
      (tempString.charCodeAt(0) << 14) | (tempString.charCodeAt(1) << 7) | tempString.charCodeAt(2);
    const low =
      (tempString.charCodeAt(3) << 21) |
      (tempString.charCodeAt(4) << 14) |
      (tempString.charCodeAt(5) << 7) |
      tempString.charCodeAt(6);

    tempView.setUint32(0, high, false);
    tempView.setUint32(4, low, false);

    result.set(tempBytes.subarray(1, 8), (i / 8) * 7);
  }
  const remainder = input.length % 8;
  if (remainder > 0) {
    result = result.subarray(0, -(8 - remainder));
  }
  return result;
}
