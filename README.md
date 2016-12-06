# foodchain
Describe resource dependencies

```js
const {request, define} = require('foodchain');
const renameKeys = require('object-rename-keys');

const bootTime = Date.now();


define('get:user', {
  factory: ({userId}) => `client-${userId}`,
  request: ({userId}) => request.get(`/api/users/${userId}`),
  shouldSaveResult: true,
  shouldUseResult: () => Date.now() - bootTime < 60000, // expires every minutes,
});


define(['get:user'], 'get:user-products', {
  factory: ({userId}) => `client-${userId}`,
  request: ({userId}) => request.get(`/api/users/${userId}`),
  shouldSaveResult: true,
  shouldUseResult: () => Date.now() - bootTime < 60000, // expires every minutes,
});

foodchain('get:user-products', {userId: 'ae563h7e'}).then(products => products.forEach(
  product => console.log(product.sid)
));
