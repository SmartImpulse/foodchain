# foodchain
Describe resource dependencies

```js
const foodchain = require('foodchain');

const bootTime = Date.now();

foodchain.define('get-user', {
  const factory = foodchain.createFactory(({userId}) => `client-${userId}`);
  const request = foodchain.createRequest((client, ({userId}) => client.get(`/api/users/${userId}`));

  return {factory, request};
});


// products needs user
foodchain.define(['get-user'], 'get-user-products', {
  const factory = foodchain.createFactory(({userId}) => `client-${userId}`);

  const request = foodchain.createRequest({
    shouldSaveCache: true,
    shouldUseCache: () => Date.now() - bootTime < 60000, // expires every minutes,

    exec({userId}) {
      return this.get(`/api/users/${userId}/products`);
    },
  });

  return {factory, request};
});


```
