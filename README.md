# foodchain
Describe resource dependencies

```js
const {request, define} = require('foodchain');
const renameKeys = require('object-rename-keys');

const bootTime = Date.now();
const resultsExpire = duration => ({
  shouldSaveResult: true,
  shouldUseResult: () => Date.now() - bootTime < duration,
});

define('get:user', Object.assign({
  factory: ({userId}) => `client-${userId}`,
  request: ({userId}) => request.get(`/api/users/${userId}`),
}, resultsExpire(60000)));


define(['get:user'], 'get:user-products', {
  factory: ({userId}) => `client-${userId}`,
  request: ({userId}) => request.get(`/api/users/${userId}`),
}, resultsExpire(10000)));

foodchain('get:user-products', {userId: 'ae563h7e'}).then(products => products.forEach(
  product => console.log(product.sid)
));
