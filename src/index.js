import { createAction, handleAction } from 'redux-actions';
import fetch from 'isomorphic-fetch';

function identity(v) {
  return v;
}

export function createFetchAction(name, url, options) {
  return () => {
    return dispatch => {
      dispatch(createAction(name)());
      return fetch(url, options).then(response => {
        if (response.status >= 200 && response.status < 300) {
          return response;
        } else {
          const error = new Error(response.statusText);
          error.response = response;
          throw error;
        }
      }).then(response => {
        if (/json/.test(response.headers.get('Content-Type'))) {
          return response.json();
        } else {
          return response.text();
        }
      }).then(object => {
        dispatch(createAction(name, identity, () => {
          return {
            status: 'OK'
          };
        })(object));
      }).catch(e => {
        dispatch(createAction(name)(e));
      });
    };
  };
}

export function handleFetchAction(name, object) {
  if (typeof objet === 'function') {
    return handleAction(name, object);
  } else {
    return handleAction(name, {
      next: (state, action) => {
        if (action.meta && action.meta.status === 'OK') {
          if (object && object.receive && typeof object.receive === 'function') {
            return object.receive(state, action);
          } else {
            return state;
          }
        } else {
          if (object && object.request && typeof object.request === 'function') {
            return object.request(state, action);
          } else {
            return state;
          }
        }
      },
      throw: (state, action) => {
        if (object && object.error && typeof object.error === 'function') {
          return object.error(state, action);
        } else {
          return state;
        }
      }
    });
  }
}
