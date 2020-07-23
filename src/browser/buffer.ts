export function stringToArrayBuffer(str: string): ArrayBufferLike {
  const string = btoa(unescape(encodeURIComponent(str)));

  const charList = string.split('');

  const buffer = [];
  for (let i = 0; i < charList.length; i += 1) {
    buffer.push(charList[i].charCodeAt(0));
  }
  return new Uint8Array(buffer);
}

export function arrayBufferToString(buffer: number[]): string {
  const encodedString = String.fromCharCode.apply(null, buffer);

  const decodedString = decodeURIComponent(escape(atob(encodedString)));
  return decodedString;
}

export function arrayBufferToHex(buffer: Uint8Array): string {
  return Array.prototype.map
    .call(new Uint8Array(buffer), (x) => `00${x.toString(16)}`.slice(-2))
    .join('');
}

export function hexToArrayBuffer(hex: string): ArrayBufferLike {
  const typedArray = new Uint8Array(
    (hex.match(/[\da-f]{2}/gi) || []).map((h) => parseInt(h, 16))
  );
  return typedArray.buffer;
}

export function base64ToArrayBuffer(base64: string): ArrayBufferLike {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export function arrayBufferToBase64(buffer: Uint8Array): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function concatArrayBuffer<T extends Uint8Array>(
  c: { new (len: number): T },
  ...arrays: T[]
) {
  let totalLength = 0;
  arrays.forEach((arr) => {
    totalLength += arr.length;
  });
  const result: T = new c(totalLength);
  let offset = 0;
  arrays.forEach((arr) => {
    result.set(arr, offset);
    offset += arr.length;
  });
  return result;
}
