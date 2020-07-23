import { readFileSync } from 'fs';
import { join } from 'path';
import { expect } from 'chai';
import 'mocha';
import { Conceal, Rsa } from '../src';
import { calcMD5 } from '../src/utilities';

describe('hash-utils', () => {
  it('compare file md5', () =>
    calcMD5('test/xxy007.png').then((str) => {
      expect(str).to.be.equal('389d8e336cfdf9eb9dc009cd4c790cee');
    }));
});

describe('facebook-conceal', () => {
  describe('#encrypt and decrypt string', () => {
    it('should return the same string', () => {
      const conceal = new Conceal('my-password');
      const plain = 'hello world @ 2020';
      const encrypted = conceal.encryptStr(plain);
      const decrypted = conceal.decryptStr(encrypted);
      expect(plain).to.be.equal(decrypted);
    });
  });

  describe('#encrypt and decrypt file', () => {
    it('should return the same file', async () => {
      const conceal = new Conceal('my-password');
      const sourceFile = 'test/xxy007.png';
      const encFile = 'test/xxy007.png.enc';
      const decFile = 'test/xxy007.dec.png';

      return conceal
        .encryptFile(sourceFile, encFile)
        .then(() => conceal.decryptFile(encFile, decFile))
        .then(() => Promise.all([calcMD5(sourceFile), calcMD5(decFile)]))
        .then((strs) => {
          expect(strs[0]).to.be.a('string');
          expect(strs[1]).to.be.a('string');
          expect(strs[0]).to.be.equal(strs[1]);
        });
    });
  });
});

describe('rsa', () => {
  // openssl genrsa -out rsa-private.pem 4096
  // openssl rsa -in rsa-private.pem -pubout -out rsa-public.pem
  const privateKey = readFileSync(join(__dirname, 'rsa-private.pem'), 'utf8');
  const publicKey = readFileSync(join(__dirname, 'rsa-public.pem'), 'utf8');

  describe('#sign and verify', () => {
    it('should sign and verify correctly', () => {
      const rsa = new Rsa(privateKey, publicKey, 'base64');
      const plain = 'hello world @ 2020';
      const signed = rsa.sign(plain);
      const verified = rsa.verify(plain, signed);
      expect(verified).to.be.equal(true);
    });
  });

  describe('#encrypt and decrypt string', () => {
    it('should encrypt and decrypt string correctly', () => {
      const rsa = new Rsa(privateKey, publicKey, 'base64');
      const plain = 'hello world @ 2020';

      const encrypted = rsa.encrypt(plain);
      const decrypted = rsa.decrypt(encrypted);
      expect(plain).to.be.equal(decrypted);
    });
  });
});
