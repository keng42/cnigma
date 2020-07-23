/**
 * RSA encrypt/decrypt/sign/verfiy
 *
 * created by keng42 @2020-07-23 09:56:20
 */

import * as crypto from 'crypto';

export class Rsa {
  privateKeyBuf: Buffer;
  publicKeyBuf: Buffer;
  encoding: 'hex' | 'base64';
  algo: string;

  constructor(
    privateKey: string,
    publicKey: string,
    encoding: 'hex' | 'base64' = 'hex',
    algo: 'RSA-SHA256' | 'RSA-SHA512' = 'RSA-SHA256'
  ) {
    this.privateKeyBuf = Buffer.from(privateKey);
    this.publicKeyBuf = Buffer.from(publicKey);
    this.encoding = encoding;
    this.algo = algo;
  }

  sign(plain: string, key = this.privateKeyBuf, encoding = this.encoding) {
    const signer = crypto.createSign(this.algo);
    signer.update(plain);
    const sig = signer.sign(
      {
        key,
        saltLength: 128,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
      },
      encoding
    );
    return sig;
  }

  verify(
    plain: string,
    sig: string,
    key = this.publicKeyBuf,
    encoding = this.encoding
  ) {
    const verifyer = crypto.createVerify(this.algo);
    verifyer.update(plain);
    return verifyer.verify(
      { key, saltLength: 128, padding: crypto.constants.RSA_PKCS1_PSS_PADDING },
      sig,
      encoding
    );
  }

  encrypt(plain: string, key = this.publicKeyBuf, encoding = this.encoding) {
    const cipher = crypto
      .publicEncrypt(
        {
          key,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        Buffer.from(plain)
      )
      .toString(encoding);
    return cipher;
  }

  decrypt(cipher: string, key = this.privateKeyBuf, encoding = this.encoding) {
    const plain = crypto
      .privateDecrypt(
        {
          key,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        Buffer.from(cipher, encoding)
      )
      .toString('utf8');
    return plain;
  }
}
