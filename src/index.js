import { createAction } from 'redux-actions';
import fetch from 'isomorphic-fetch';

function identity(v) {
  return v;
}

export function createFetchAction(name, url, options) {
  return () => {
    return dispatch => {
      dispatch(createAction(name)());
      return fetch(url, options).then(response => {
        return response.json();
      }).then(json => {
        dispatch(createAction(name, identity, () => {
          return {
            status: 'OK'
          };
        })(json));
      }).catch(e => {
        dispatch(createAction(name)(e));
      });
    };
  };
}

