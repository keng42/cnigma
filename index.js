/* eslint-disable global-require */

let Conceal;
let Rsa;
let BufferBrowser;
if (process.browser) {
  Conceal = require('./lib/conceal-browser').default;
  Rsa = require('./lib/rsa-browser').default;
  BufferBrowser = require('./lib/buffer-browser');
} else {
  Conceal = require('./lib/conceal-node');
  Rsa = require('./lib/rsa-node');
}

module.exports = {
  Conceal,
  Rsa,
  BufferBrowser,
};
