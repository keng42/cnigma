/**
 * NodeJS 使用的字符串加密解密类
 * 兼容 Conceal 2.0
 */

const crypto = require('crypto');
const config = require('./config.json');

const DEFAULT_KEY = config.CONCEAL_DEFAULT_KEY;

class Conceal {
  constructor({
    encoding = 'base64',
    key = DEFAULT_KEY,
    keyEncoding = 'base64',
  } = {}) {
    this.key = Buffer.from(key, keyEncoding);
    this.encoding = encoding;
    this.algo = 'aes-256-gcm';
  }

  encrypt(text, pwd) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(this.algo, this.key, iv);

    cipher.setAAD(Buffer.from('0102', 'hex'));
    cipher.setAAD(Buffer.from(pwd, 'utf8'));
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const tag = cipher.getAuthTag();
    const c = `0102${iv.toString('hex')}${encrypted}${tag.toString('hex')}`;
    return Buffer.from(c, 'hex').toString(this.encoding);
  }

  decrypt(encrypted, pwd) {
    const cipher = Buffer.from(encrypted, this.encoding);
    const iv = Buffer.alloc(12);
    const tag = Buffer.alloc(16);
    const enc = Buffer.alloc(cipher.length - 30);
    cipher.copy(iv, 0, 2);
    cipher.copy(tag, 0, cipher.length - 16);
    cipher.copy(enc, 0, 14);

    const decipher = crypto.createDecipheriv(this.algo, this.key, iv);
    decipher.setAuthTag(tag);
    decipher.setAAD(Buffer.from('0102', 'hex'));
    decipher.setAAD(Buffer.from(pwd, 'utf8'));

    let dec = decipher.update(enc, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
  }
}

module.exports = Conceal;
