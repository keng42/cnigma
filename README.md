# Facebook Conceal and RSA utilities for js

Compatible with [Facebook Conceal 2.0](https://github.com/facebook/conceal)

## Conceal

### Nodejs

```javascript
const { Conceal } = require('cnigma');

const conceal = new Conceal();

// same with
// encoding: hex or base64
// myKey: 32 bytes with ${encoding} encoded string
const conceal = new Conceal({
  encoding: 'base64',
  key: '7At16p/dyonmDW3ll9Pl1bmCsWEACxaIzLmyC0ZWGaE=',
  keyEncoding: 'base64',
});


const plain = 'hello world @ 2017';
const encrypted = conceal.encrypt(plain, 'mypassword');
const decrypted = conceal.decrypt(encrypted, 'mypassword');
```

### Browser

```javascript
import { Conceal } from 'cnigma';

(async () => {
  const conceal = new Conceal();

  const plain = 'hello world @ 2017';
  const encrypted = await conceal.encrypt(plain, 'mypassword');
  const decrypted = await conceal.decrypt(encrypted, 'mypassword');
})();
```

## RSA

```js
const { Rsa } = require('cnigma');

const privateKey = fs.readFileSync('rsa-private.pem');
const publicKey = fs.readFileSync('rsa-public.pem');

const rsa = new Rsa({ privateKey, publicKey, encoding: 'base64' });


const plain = 'hello world @ 2019';
const signed = rsa.sign(plain);
const verified = rsa.verify(plain, signed);
const encrypted = rsa.encrypt(plain);
const decrypted = rsa.decrypt(encrypted);
```
