import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import DevTools from '../components/DevTools';
import rootReducer from './reducers';

const reducers = require('./reducers');

export default function (initialState = {}) {
  const store = createStore(rootReducer, initialState, compose(
    applyMiddleware(thunk),
    DevTools.instrument(),
  ));

  if (module.hot) {
    module.hot.accept('./reducers', () =>
      store.replaceReducer(reducers.default),
    );
  }
  return store;
}
