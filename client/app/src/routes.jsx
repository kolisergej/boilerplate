import React from 'react';
import App from './components/App';

import isUserSignedIn from './redux/models/user';

let store;

function requireAuth(nextState, transition, cb) {
  setTimeout(() => {
    if (!isUserSignedIn(store.getState())) {
      transition('/');
    }
    cb();
  }, 0);
}

export default function routes(storeRef) {
  store = storeRef;
  return (
    <Route component={App} path="/" />
  );
}
