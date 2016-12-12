const foodchain = require('./foodchain');
const {assert} = require('chai');

const request = () => Object.create({foo: 1});

describe('factory', () => {

  it('should create a factory with createFactory', () => {
    const factory = foodchain.createFactory(() => 'foo');

    assert.property(factory, 'requests');
  });

  it('should call the request function if id does not exist', () => {
    const factory = foodchain.createFactory(({id}) => `request-${id}`);

    factory.getOrCreate({id: 'foo'}, request);

    assert.property(factory.requests, 'request-foo');
  });

  it('should re-use the request is the id is the same', () => {
    const factory = foodchain.createFactory(({id}) => `request-${id}`, request);

    const request1 = factory.getOrCreate({id: 'foo'}, request);
    const request2 = factory.getOrCreate({id: 'foo'}, request);

    assert.strictEqual(request1, request2);
  });


});