const foodchain = require('./foodchain');
const {assert} = require('chai');

const request = generator => (
  context => ({
    end: callback => callback(null, {body: generator(context)}),
  })
);

const _ = callback => (
  (...args) => setTimeout(() => callback(...args), 0)
);

describe('define', () => {

  it('should call the foo request', () => {
    foodchain.define('foo', {
      request: request(() => 'foo'),
    });

    assert(foodchain('foo') instanceof Promise);
  });

  it('should return request result', done => {
    foodchain.define('foo', {
      request: request(context => context.message),
    });

    foodchain('foo', {message: 'foobar'}).then(_(({message}) => {
      assert.equal('foobar', 'foobar');
      done();
    }))
  });

});