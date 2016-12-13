const foodchain = require('./foodchain');
const {assert} = require('chai');
const sinon = require('sinon');
const nock = require('nock');


const _ = callback => (
  (...args) => setTimeout(() => callback(...args), 0)
);


describe('integration', () => {

  /*
   * Mock
   */

  beforeEach(() => {
    nock('http://example.com')
      .get('/users/1')
      .reply(200, {
        name: 'John',
        age: 45,
      });

    nock('http://example.com')
      .get('/users/2')
      .reply(200, {
        name: 'Jack',
        age: 21,
      });

    nock('http://example.com')
      .get('/users/1/products')
      .reply(200, [
        {name: 'toothbrush', price: 2.4},
        {name: 'socks', price: 5.8},
      ]);
  });


  it('should get user data', done => {
    foodchain.define('get:user', {
      request: ({userId}) => foodchain.request.get(`http://example.com/users/${userId}`),
    });

    foodchain('get:user', {userId: 1}).then(_(user => {
      assert.equal(user.name, 'John');
      assert.equal(user.age, 45);
      done();
    }));
  });

  it('should get user products', done => {
    foodchain.define('get:user:products', {
      request: ({userId}) => foodchain.request.get(`http://example.com/users/${userId}/products`),
    });

    foodchain('get:user:products', {userId: 1}).then(_(products => {
      assert.equal(products.length, 2);
      assert.equal(products[0].name, 'toothbrush');
      done();
    }));
  });

  it('should manage dependencies', done => {
    const spy = sinon.spy();

    foodchain.define('get:user', {
      request: ({userId}) => {
        spy();
        return foodchain.request.get(`http://example.com/users/${userId}`)
      },
    });

    foodchain.define(['get:user'], 'get:user:products', {
      request: ({userId}) => foodchain.request.get(`http://example.com/users/${userId}/products`),
    });

    foodchain('get:user:products', {userId: 1})
      .then(() => foodchain('get:user', {userId: 1}))
      .then(_(user => {
        assert.equal(spy.callCount, 2);
        done();
      }));
  });

  it('should save promises', done => {
    const spy = sinon.spy();

    foodchain.define('get:user', {
      request: ({userId}) => {
        spy();
        return foodchain.request.get(`http://example.com/users/${userId}`)
      },
      shouldSavePromise: true,
      shouldUsePromise: true,
    });

    foodchain.define(['get:user'], 'get:user:products', {
      request: ({userId}) => foodchain.request.get(`http://example.com/users/${userId}/products`),
    });

    foodchain('get:user:products', {userId: 1})
      .then(() => foodchain('get:user', {userId: 1}))
      .then(_(user => {
        assert(spy.calledOnce);
        done();
      }));
  });


  it('should use Request class', done => {
    foodchain.define('get:user', {
      request: class extends foodchain.Request {
        constructor(...args) {
          super(...args);
        }

        exec({userId}) {
          return foodchain.request.get(`http://example.com/users/${userId}`)
        }
      },
    });

    foodchain('get:user', {userId: 1})
      .then(_(user => {
        assert.equal(user.name, 'John');
        done();
      }));
  });

  it('should re-use the same request instance', done => {
    foodchain.define('get:user', {
      request: class extends foodchain.Request {
        constructor(...args) {
          super(...args);
          this.userId = 0;
        }

        exec({userId}) {
          this.userId++;
          return foodchain.request.get(`http://example.com/users/${this.userId}`)
        }
      },
    });

    foodchain('get:user').then(_(first => {
      assert.equal(first.name, 'John');

      foodchain('get:user').then(_(second => {
        assert.equal(second.name, 'Jack');
        done();
      }));
    }));

  });

})