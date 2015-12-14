# Redux Fetch Action

[![npm version](https://badge.fury.io/js/redux-fetch-action.svg)](https://badge.fury.io/js/redux-fetch-action)

Fetch Action utilities for [Redux](https://github.com/rackt/redux).
It uses [redux-actions](https://github.com/acdlite/redux-actions) to create action,
and you can wraps a reducer so that only handles Flux Standard Actions of a certain type with `handleAction` API of [redux-actions](https://github.com/acdlite/redux-actions).


# Install

```sh
npm install --save redux-fetch-action
```


# API

- `createFetchAction`: `function(ACTION_NAME, URL, ?OPTIONS)`
    - `ACTION_NAME`: `String`
    - `URL`: `String`
    - `?OPTIONS`: `Object`
        - It's should be the valid second argument of [fetch](https://github.com/github/fetch).


# Usage

```js
import { createFetchAction } from 'redux-fetch-action';

const FETCH = 'FETCH';
const fetchAction = createFetchAction(FETCH, '/data.json');
```

Full example is below.
(See `example` directory.)

```js
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { handleActions, handleAction } from 'redux-actions';
import { createFetchAction } from 'redux-fetch-action';
import { Server }from 'node-static';
import { createServer } from 'http';

const file = new Server();
createServer((request, response)  => {
  request.addListener('end', () => {
    file.serve(request, response);
  }).resume();
}).listen(8080);


const FETCH1 = 'FETCH1';
const FETCH2 = 'FETCH2';

const reducer1 = handleAction(FETCH1, {
  next: (posts = [], action) => {
    if (action.meta && action.meta.status === 'OK') {
      console.log('RECEIVED 1');
      return action.payload.posts;
    } else {
      console.log('REQUEST 1');
      return posts;
    }
  },
  throw: (posts = [], action) => {
    console.log('ERROR 1');
    return posts; 
  }
});

const reducer2 = handleAction(FETCH2, {
  next: (posts = [], action) => {
    if (action.meta && action.meta.status === 'OK') {
      console.log('RECEIVED 2');
      return action.payload.posts;
    } else {
      console.log('REQUEST 2');
      return posts;
    }
  },
  throw: (posts = [], action) => {
    console.log('ERROR 2');
    return posts; 
  }
});

const reducer = handleActions({
  FETCH1: reducer1,
  FETCH2: reducer2
}, {});

const store = applyMiddleware(
  thunk
)(createStore)(reducer);

const fetchAction1 = createFetchAction(FETCH1, 'http://localhost:8080/data.json');
const fetchAction2 = createFetchAction(FETCH2, 'http://localhost:8080/unknown.json');

store.dispatch(fetchAction1());
store.dispatch(fetchAction2());

/*
REQUEST 1
REQUEST 2
ERROR 2
RECEIVED 1
*/
```


# See Also

- [redux-actions](https://github.com/acdlite/redux-actions)
- [Redux](https://github.com/rackt/redux)
