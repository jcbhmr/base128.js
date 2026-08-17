export function* iteratorChunks<T>(
  self: IteratorObject<T>,
  chunkSize: number,
): IteratorObject<T[], void, void> {
  let chunk: T[] = [];
  for (const item of self) {
    chunk.push(item);
    if (chunk.length === chunkSize) {
      yield chunk;
      chunk = [];
    }
  }
  if (chunk.length > 0) {
    yield chunk;
  }
}

export function* arrayChunks<T>(self: T[], chunkSize: number): IteratorObject<T[], void, void> {
  for (let i = 0; i < self.length; i += chunkSize) {
    yield self.slice(i, i + chunkSize);
  }
}

export type TypedArray =
  | Uint8Array
  | Uint8ClampedArray
  | Uint16Array
  | Uint32Array
  | Int8Array
  | Int16Array
  | Int32Array
  | BigUint64Array
  | BigInt64Array
  | Float16Array
  | Float32Array
  | Float64Array;

export function* typedArrayChunks<T extends TypedArray>(
  self: T,
  chunkLength: number,
): IteratorObject<T, void, void> {
  for (let i = 0; i < self.length; i += chunkLength) {
    yield self.subarray(i, i + chunkLength) as T;
  }
}

export function* stringCharCodes(self: string): IteratorObject<number, void, void> {
  for (let i = 0; i < self.length; i++) {
    yield self.charCodeAt(i);
  }
}

export function* stringChunks(
  self: string,
  chunkLength: number,
): IteratorObject<string, void, void> {
  for (let i = 0; i < self.length; i += chunkLength) {
    yield self.slice(i, i + chunkLength);
  }
}
