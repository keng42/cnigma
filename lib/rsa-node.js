/**
 * RSA 加密解密签名验证算法
 */
const crypto = require('crypto');

class RSA {
  constructor(opts) {
    this.privateKeyBuf = opts.privateKey;
    this.publicKeyBuf = opts.publicKey;
    this.encoding = opts.encoding || 'hex';
    this.algo = opts.algo || 'RSA-SHA256';
  }

  sign(plain, key = this.privateKeyBuf, encoding = this.encoding) {
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

  verify(plain, sig, key = this.publicKeyBuf, encoding = this.encoding) {
    const verifyer = crypto.createVerify(this.algo);
    verifyer.update(plain);
    return verifyer.verify(
      { key, saltLength: 128, padding: crypto.constants.RSA_PKCS1_PSS_PADDING },
      sig,
      encoding
    );
  }

  encrypt(plain, key = this.publicKeyBuf, encoding = this.encoding) {
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

  decrypt(cipher, key = this.privateKeyBuf, encoding = this.encoding) {
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

module.exports = RSA;
