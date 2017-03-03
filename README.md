# foodchain

## Usage

Call request just once.


```js
const {request, define} = require('foodchain');

define('get:user', {
  shouldSaveResult: true,
  shouldUseResult: true,
  factory: ({userId}) => `user-${userId}`,
  request: ({userId}) => request.get(`/api/users/${userId}`),
});

const showUser = async userId => {
  const user = await foodchain('get:user', {userId: 'ae563h7e'});
  console.log(user);
};
```

With this setup: **showUser** will 
 * **fetch and log after first call** and
 * **only log after other calls**
