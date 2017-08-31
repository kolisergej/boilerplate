import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Router } from 'react-router';
import { Provider } from 'react-redux';

import configureStore from './src/redux/configureStore';
import routes from './src/routes';


const initialState = window.REDUX_INITIAL_STATE || {};
const store = configureStore(initialState);
const component = (
  <Provider store={store}>
    <Router history={browserHistory}>
      { routes(store) }
    </Router>
  </Provider>
);

ReactDOM.render(component, document.getElementById('root'));

if (process.env.NODE_ENV !== 'production') {
  /* eslint-disable global-require */
  const DevTools = require('./src/components/DevTools').default;
  ReactDOM.render(<DevTools store={store} />, document.getElementById('dev-tools'));
  /* eslint-enable global-require */
}
