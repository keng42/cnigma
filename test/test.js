const fs = require('fs');
const path = require('path');
const { expect } = require('chai');
const { Conceal, Rsa } = require('../');

describe('facebook-conceal', () => {
  describe('#encrypt and decrypt string', () => {
    it('should return the same base64 string', () => {
      const conceal = new Conceal();
      const plain = 'hello world @ 2019';
      const password = 'my-password';
      const encrypted = conceal.encrypt(plain, password);
      const decrypted = conceal.decrypt(encrypted, password);
      expect(plain).to.be.equal(decrypted);
    });

    it('should return the same hex string', () => {
      const conceal = new Conceal({ encoding: 'hex' });
      const plain = 'hello world @ 2019';
      const password = 'my-password';
      const encrypted = conceal.encrypt(plain, password);
      const decrypted = conceal.decrypt(encrypted, password);
      expect(plain).to.be.equal(decrypted);
    });
  });
});

describe('rsa', () => {
  // openssl genrsa -out rsa-private.pem 4096
  // openssl rsa -in rsa-private.pem -pubout -out rsa-public.pem
  const privateKey = fs.readFileSync(path.join(__dirname, 'rsa-private.pem'));
  const publicKey = fs.readFileSync(path.join(__dirname, 'rsa-public.pem'));

  describe('#sign and verify', () => {
    it('should sign and verify correctly', () => {
      const rsa = new Rsa({ privateKey, publicKey, encoding: 'base64' });
      const plain = 'hello world @ 2019';
      const signed = rsa.sign(plain);
      const verified = rsa.verify(plain, signed);
      expect(verified).to.be.equal(true);
    });
  });

  describe('#encrypt and decrypt string', () => {
    it('should encrypt and decrypt string correctly', () => {
      const rsa = new Rsa({ privateKey, publicKey, encoding: 'base64' });
      const plain = 'hello world @ 2019';

      const encrypted = rsa.encrypt(plain);
      const decrypted = rsa.decrypt(encrypted);
      expect(plain).to.be.equal(decrypted);
    });
  });
});
