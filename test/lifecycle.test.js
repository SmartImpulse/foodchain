const foodchain = require('./foodchain');
const {assert} = require('chai');
const sinon = require('sinon');

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

    foodchain('foo', {message: 'foobar'}).then(_(message => {
      assert.equal(message, 'foobar');
      done();
    }))
  });

  it('should call dependencies too', done => {
    const listener = sinon.spy();

    foodchain.define('foo', {
      request: request(listener),
    });

    foodchain.define(['foo'], 'bar', {
      request: request(context => context.message),
    });

    foodchain('bar', {message: 'foobar'}).then(_(() => {
      assert(listener.called);
      done();
    }))
  });

  it('should save persistent promise', done => {
    const listener = sinon.spy();
    const requestSpy = () => ({
      end: callback => {
        listener();
        return callback(null, {body: []});
      }
    });

    foodchain.define('foo', {
      request: requestSpy,
      shouldSavePromise: true,
      shouldUsePromise: true,
    });

    foodchain('foo', {message: 'foobar'})
      .then(() => foodchain('foo', {message: 'foobar'}))
      .then(_(() => {
        assert(listener.calledOnce);
        done();
      }))
  });

});