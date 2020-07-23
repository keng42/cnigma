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
  if (key.includes('-----BEGIN RSA PRIVATE KEY-----')) {
    throw new Error(
      'WebCryptoApi does not support PKCS#1 keys, so you need to convert the key from PKCS#1 to PKCS#8.'
    );
  }

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
  }

  async sign(
    plain: string,
    key = this.privateKeyBuf,
    encoding = this.encoding
  ) {
    const privateKey = await crypto.subtle.importKey(
      'pkcs8',
      key,
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

    if (encoding === 'base64') {
      return arrayBufferToBase64(resultBuf);
    }
    return arrayBufferToHex(resultBuf);
  }

  async verify(
    plain: string,
    sig: string,
    key = this.publicKeyBuf,
    encoding = this.encoding
  ) {
    const publicKey = await crypto.subtle.importKey(
      'spki',
      key,
      {
        name: 'RSA-PSS',
        hash: { name: 'SHA-256' },
      },
      false,
      ['verify']
    );

    const data = new TextEncoder().encode(plain);
    let signature: ArrayBufferLike;
    if (encoding === 'base64') {
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

  async encrypt(
    plain: string,
    key = this.publicKeyBuf,
    encoding = this.encoding
  ) {
    const publicKey = await crypto.subtle.importKey(
      'spki',
      key,
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

    if (encoding === 'base64') {
      return arrayBufferToBase64(resultBuf);
    }
    return arrayBufferToHex(resultBuf);
  }

  async decrypt(
    cipher: string,
    key = this.privateKeyBuf,
    encoding = this.encoding
  ) {
    const privateKey = await crypto.subtle.importKey(
      'pkcs8',
      key,
      {
        name: 'RSA-OAEP',
        hash: { name: 'SHA-1' },
      },
      false,
      ['decrypt']
    );

    let data: ArrayBufferLike;
    if (encoding === 'base64') {
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
