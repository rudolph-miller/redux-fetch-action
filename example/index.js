import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { handleActions } from 'redux-actions';
import { createFetchAction, handleFetchAction } from 'redux-fetch-action';
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
const FETCH3 = 'FETCH3';

const reducer1 = handleFetchAction(FETCH1, {
  request: (posts = [], action) => {
    console.log('REQUEST 1');
    return posts;
  },
  receive: (posts = [], action) => {
    console.log('RECEIVED 1');
    console.log(action.payload);
    return action.payload.posts;
  },
  error: (posts = [], action) => {
    console.log('ERROR 1');
    return posts;
  }
});

const reducer2 = handleFetchAction(FETCH2, {
  request: (posts = [], action) => {
    console.log('REQUEST 2');
    return posts;
  },
  receive: (posts = [], action) => {
    console.log('RECEIVED 2');
    console.log(action.payload);
    return action.payload.posts;
  },
  error: (posts = [], action) => {
    console.log('ERROR 2');
    return posts;
  }
});

const reducer3 = handleFetchAction(FETCH3, {
  request: (posts = [], action) => {
    console.log('REQUEST 3');
    return posts;
  },
  receive: (posts = [], action) => {
    console.log('RECEIVED 3');
    console.log(action.payload);
    return action.payload.posts;
  },
  error: (posts = [], action) => {
    console.log('ERROR 3');
    return posts;
  }
});

const reducer = handleActions({
  FETCH1: reducer1,
  FETCH2: reducer2,
  FETCH3: reducer3
}, {});

const store = applyMiddleware(
  thunk
)(createStore)(reducer);

const fetchAction1 = createFetchAction(FETCH1, 'http://localhost:8080/data.json');
const fetchAction2 = createFetchAction(FETCH2, 'http://localhost:8080/sample.html');
const fetchAction3 = createFetchAction(FETCH3, 'http://localhost:8080/unknown.json');

store.dispatch(fetchAction1());
store.dispatch(fetchAction2());
store.dispatch(fetchAction3());
