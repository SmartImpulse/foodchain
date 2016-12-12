const foodchain = require('./foodchain');
const {assert} = require('chai');


describe('define', () => {

  it('should call the foo request', () => {
    foodchain.define('foo', {
      request: foodchain.request.get('http://example.com'),
    });

    assert(foodchain('foo') instanceof Promise);
  });

});