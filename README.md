# Facebook Conceal and RSA utilities for js

Compatible with [Facebook Conceal 2.0](https://github.com/facebook/conceal)

## Usage

### Conceal

```js
const { Conceal } = require('cnigma');
const conceal = new Conceal('my-password');

// or
const conceal = new Conceal('my-password', myKey, encoding);
// encoding: hex or base64
// myKey: 32 bytes with ${encoding} encoded string
```

### String

```js
const plain = 'hello world @ 2020';
const encrypted = conceal.encryptStr(plain);
const decrypted = conceal.decryptStr(encrypted);
```

### File

```js
const srcFilePath = 'test/xxy007.png';
const encFilePath = 'test/xxy007.png.enc';
const decFilePath = 'test/xxy007.dec.png';

conceal
  .encryptFile(path, encFilePath)
  .then(() => conceal.decryptFile(encFilePath, decFilePath))
  .then(() => {
    console.log('done');
  })
  .catch((err) => {
    console.log(err);
  });
```

### Using in browser

```html
<script src="https://cdn.jsdelivr.net/npm/almond@0.3.3/almond.min.js"></script>
<script src="./cnigma.bundle.js"></script>

<script>
  const { Conceal, Rsa } = require('cnigma');
  const conceal = new Conceal('my-password');

  (async () => {
    const plain = 'hello world @ 2020';
    const encrypted = await conceal.encryptStr(plain);
    const decrypted = await conceal.decryptStr(encrypted);
  })();
</script>
```

### RSA

```js
const { Rsa } = require('cnigma');

const privateKey = fs.readFileSync('rsa-private.pem', 'utf8');
const publicKey = fs.readFileSync('rsa-public.pem', 'utf8');

const rsa = new Rsa(rsaPrivateKey, rsaPublicKey, 'base64');

const plain = 'hello world @ 2020';
const signed = rsa.sign(plain);
const verified = rsa.verify(plain, signed);
const encrypted = rsa.encrypt(plain);
const decrypted = rsa.decrypt(encrypted);
```

## FAQ

### Private Key

[The header `-----BEGIN RSA PRIVATE KEY-----` in the PEM file is reserved to PKCS#1 keys, but WebCryptoApi does not support pkcs1, so you need to convert the key from pkcs1 to pkcs8 using a tool like openssl](https://stackoverflow.com/questions/51033786/how-can-i-import-an-rsa-private-key-in-pem-format-for-use-with-webcrypto)

```sh
openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in pkcs1.key -out pkcs8.key
```

### RSA-OAEP-SHA1

[Openssl has OAEP padding hardcoded using SHA1](https://stackoverflow.com/questions/33532091/rsa-crypto-between-node-js-and-webcrypto)
