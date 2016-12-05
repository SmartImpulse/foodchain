if (process.env.FOODCHAIN_ECMA === '5') {
  module.exports = require('..');
} else {
  module.exports = require('../src');
}
