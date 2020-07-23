/**
 * 浏览器使用的字符串加密解密类
 * 兼容 Conceal 2.0
 */

import {
  arrayBufferToHex,
  hexToArrayBuffer,
  base64ToArrayBuffer,
  arrayBufferToBase64,
  concatArrayBuffer,
} from './buffer';

const { crypto } = window;
const DEFAULT_KEY = '7At16p/dyonmDW3ll9Pl1bmCsWEACxaIzLmyC0ZWGaE=';

export class Conceal {
  password: string;
  key: ArrayBuffer;
  encoding: 'base64' | 'hex';
  algo: 'aes-256-gcm' | 'aes-128-gcm';

  isBase64: boolean;
  versionBuf: Uint8Array;

  constructor(
    password: string,
    encoding: 'base64' | 'hex' = 'base64',
    keyStr = DEFAULT_KEY,
    algo: 'aes-256-gcm' | 'aes-128-gcm' = 'aes-256-gcm'
  ) {
    this.password = password;
    this.encoding = encoding;
    this.algo = algo;

    if (encoding === 'base64' || keyStr === DEFAULT_KEY) {
      this.key = base64ToArrayBuffer(keyStr);
    } else {
      this.key = hexToArrayBuffer(keyStr);
    }

    this.isBase64 = encoding === 'base64';
    this.versionBuf = new TextEncoder().encode('\u0001\u0002');
  }

  randomBytes(len = 12, isBase64 = this.isBase64) {
    const buf = crypto.getRandomValues(new Uint8Array(len));
    if (isBase64) {
      return arrayBufferToBase64(buf);
    }
    return arrayBufferToHex(buf);
  }

  async encryptStr(text: string, password = this.password): Promise<string> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const additionalData = concatArrayBuffer(
      Uint8Array,
      this.versionBuf,
      new TextEncoder().encode(password)
    );
    const alg = {
      name: 'AES-GCM',
      iv,
      additionalData,
    };
    const key = await crypto.subtle.importKey('raw', this.key, alg, false, [
      'encrypt',
    ]);

    const ptUint8 = new TextEncoder().encode(text);
    const encBuf = await crypto.subtle.encrypt(alg, key, ptUint8);

    const resultBuf = concatArrayBuffer(
      Uint8Array,
      this.versionBuf,
      iv,
      new Uint8Array(encBuf)
    );

    if (this.isBase64) {
      return arrayBufferToBase64(resultBuf);
    }
    return arrayBufferToHex(resultBuf);
  }

  async decryptStr(encrypted: string, password = this.password) {
    let cipherBuf;
    if (this.isBase64) {
      cipherBuf = base64ToArrayBuffer(encrypted);
    } else {
      cipherBuf = hexToArrayBuffer(encrypted);
    }
    const versionBuf = new Uint8Array(cipherBuf.slice(0, 2));
    const iv = new Uint8Array(cipherBuf.slice(2, 14));
    const encBuf = new Uint8Array(cipherBuf.slice(14));

    const additionalData = concatArrayBuffer(
      Uint8Array,
      versionBuf,
      new TextEncoder().encode(password)
    );

    const alg = { name: 'AES-GCM', iv: new Uint8Array(iv), additionalData };
    const key = await crypto.subtle.importKey(
      'raw',
      base64ToArrayBuffer(DEFAULT_KEY),
      alg,
      false,
      ['decrypt']
    );

    const plainBuffer = await crypto.subtle.decrypt(alg, key, encBuf);
    const plaintext = new TextDecoder().decode(plainBuffer);

    return plaintext;
  }
}
