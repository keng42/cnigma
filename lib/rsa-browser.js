/**
 * RSA 加密解密签名验证算法
 */
import {
  arrayBufferToHex,
  hexToArrayBuffer,
  base64ToArrayBuffer,
  arrayBufferToBase64,
} from './buffer-browser';

const { crypto } = window;

function cleanRsaKey(key) {
  return key
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace('-----BEGIN PUBLIC KEY-----', '')
    .replace('-----END PUBLIC KEY-----', '')
    .split('\n')
    .join('')
    .trim();
}

class Rsa {
  constructor(opts) {
    this.privateKeyBuf = base64ToArrayBuffer(cleanRsaKey(opts.privateKey));
    this.publicKeyBuf = base64ToArrayBuffer(cleanRsaKey(opts.publicKey));
    this.encoding = opts.encoding || 'hex';
    this.isBase64 = this.encoding === 'base64';
    this.algo = opts.algo || 'RSA-SHA256';
  }

  async sign(plain, keyBuf = this.privateKeyBuf) {
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

  async verify(plain, sig, keyBuf = this.publicKeyBuf) {
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
    let signature;
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

  async encrypt(plain, keyBuf = this.publicKeyBuf) {
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

  async decrypt(cipher, keyBuf = this.privateKeyBuf) {
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

    let data;
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

export default Rsa;
