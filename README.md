# foodchain
Describe resource dependencies

```js
const foodchain = require('foodchain');
const renameKeys = require('object-rename-keys');

const bootTime = Date.now();

foodchain.define('get:user', {
  const factory = foodchain.createFactory(({userId}) => `client-${userId}`);
  const request = foodchain.createRequest((client, ({userId}) => client.get(`/api/users/${userId}`));

  return {factory, request};
});


// products needs user
foodchain.define(['get:user'], 'get:user-products', {
  const factory = foodchain.createFactory(({userId}) => `client-${userId}`);
  const request = foodchain.createRequest({
    shouldSaveCache: true,
    shouldUseCache: () => Date.now() - bootTime < 60000, // expires every minutes,
    exec: (client, {userId}) => client.get(`/api/users/${userId}/products`),
    parse: (product) => renameKeys({sid: 'id'}),
  });

  return {factory, request};
});

foodchain('get:user-products', {userId: 'ae563h7e'}).then(products => products.forEach(
  product => console.log(product.sid)
));
```
