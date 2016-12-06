# foodchain
Describe resource dependencies

```js
const {request, define} = require('foodchain');
const renameKeys = require('object-rename-keys');

const bootTime = Date.now();

define('get:user', () => {
  const factory = ({userId}) => `client-${userId}`;
  const fetcher = ({userId}) => request.get(`/api/users/${userId}`);

  return {factory, fetcher};
});


// products needs user
define(['get:user'], 'get:user-products', () => {
  const factory = ({userId}) => `products-${userId}`;
  const fetcher = ({userId}) => request.get(`/api/users/${userId}/products`);
  const parser = (product) => renameKeys({sid: 'id'});
  const lifecycle = {
    shouldSaveCache: true,
    shouldUseCache: () => Date.now() - bootTime < 60000, // expires every minutes,
  };

  return {factory, fetcher, parser, lifecycle};
});

foodchain('get:user-products', {userId: 'ae563h7e'}).then(products => products.forEach(
  product => console.log(product.sid)
));
```
