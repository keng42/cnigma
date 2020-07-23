/**
 * RSA encrypt/decrypt/sign/verfiy
 *
 * created by keng42 @2020-07-23 10:21:04
 */

import {
  arrayBufferToHex,
  hexToArrayBuffer,
  base64ToArrayBuffer,
  arrayBufferToBase64,
} from './buffer';

const { crypto } = window;

function cleanRsaKey(key: string) {
  return key
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace('-----BEGIN PUBLIC KEY-----', '')
    .replace('-----END PUBLIC KEY-----', '')
    .split('\n')
    .join('')
    .trim();
}

export class Rsa {
  privateKeyBuf: ArrayBufferLike;
  publicKeyBuf: ArrayBufferLike;
  encoding: 'hex' | 'base64';
  algo: string;
  isBase64: boolean;

  constructor(
    privateKey: string,
    publicKey: string,
    encoding: 'hex' | 'base64' = 'hex',
    algo: 'RSA-SHA256' | 'RSA-SHA512' = 'RSA-SHA256'
  ) {
    this.privateKeyBuf = base64ToArrayBuffer(cleanRsaKey(privateKey));
    this.publicKeyBuf = base64ToArrayBuffer(cleanRsaKey(publicKey));
    this.encoding = encoding;
    this.algo = algo;
    this.isBase64 = this.encoding === 'base64';
  }

  async sign(plain: string, keyBuf = this.privateKeyBuf) {
    const privateKey = await crypto.subtle.importKey(
      'pkcs8',
      keyBuf,
      {
        name: 'RSA-PSS',
        hash: { name: 'SHA-256' },
      },
      false,
      ['sign']
    );

    const data = new TextEncoder().encode(plain);

    const signature = await crypto.subtle.sign(
      {
        name: 'RSA-PSS',
        saltLength: 128, // the length of the salt
      },
      privateKey, // from generateKey or importKey above
      data // ArrayBuffer of data you want to sign
    );
    const resultBuf = new Uint8Array(signature);

    if (this.isBase64) {
      return arrayBufferToBase64(resultBuf);
    }
    return arrayBufferToHex(resultBuf);
  }

  async verify(plain: string, sig: string, keyBuf = this.publicKeyBuf) {
    const publicKey = await crypto.subtle.importKey(
      'spki',
      keyBuf,
      {
        name: 'RSA-PSS',
        hash: { name: 'SHA-256' },
      },
      false,
      ['verify']
    );

    const data = new TextEncoder().encode(plain);
    let signature: ArrayBufferLike;
    if (this.isBase64) {
      signature = base64ToArrayBuffer(sig);
    } else {
      signature = hexToArrayBuffer(sig);
    }

    const isValid = await crypto.subtle.verify(
      {
        name: 'RSA-PSS',
        saltLength: 128, // the length of the salt
      },
      publicKey, // from generateKey or importKey above
      signature, // ArrayBuffer of the signature
      data // ArrayBuffer of the data
    );

    return isValid;
  }

  async encrypt(plain: string, keyBuf = this.publicKeyBuf) {
    const publicKey = await crypto.subtle.importKey(
      'spki',
      keyBuf,
      {
        name: 'RSA-OAEP',
        hash: { name: 'SHA-1' },
      },
      false,
      ['encrypt']
    );

    const data = new TextEncoder().encode(plain);

    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP',
      },
      publicKey, // from generateKey or importKey above
      data // ArrayBuffer of data you want to encrypt
    );
    const resultBuf = new Uint8Array(encrypted);

    if (this.isBase64) {
      return arrayBufferToBase64(resultBuf);
    }
    return arrayBufferToHex(resultBuf);
  }

  async decrypt(cipher: string, keyBuf = this.privateKeyBuf) {
    const privateKey = await crypto.subtle.importKey(
      'pkcs8',
      keyBuf,
      {
        name: 'RSA-OAEP',
        hash: { name: 'SHA-1' },
      },
      false,
      ['decrypt']
    );

    let data: ArrayBufferLike;
    if (this.isBase64) {
      data = base64ToArrayBuffer(cipher);
    } else {
      data = hexToArrayBuffer(cipher);
    }

    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'RSA-OAEP',
      },
      privateKey,
      data
    );

    const plainBuffer = new Uint8Array(decrypted);

    const plaintext = new TextDecoder().decode(plainBuffer);
    return plaintext;
  }
}
