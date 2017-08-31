import express from 'express';
import cookieParser from 'cookie-parser';
import React from 'react';
import ReactDom from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import { Provider } from 'react-redux';
import { getHeaders, initialize } from 'redux-oauth';

import configureStore from '../client/app/src/redux/configureStore';
import routes from '../client/app/src/routes';

const app = express();
app.disable('x-powered-by');

const [staticUrl, devToolsHTML, apiUrl] = (process.env.NODE_ENV === 'production') ?
  ['', '', 'productionUrl'] :
  ['http://localhost:9000', '<div id="dev-tools"></div>', 'localhostUrl'];

const PORT = process.env.PORT || 3001;
const cookieMaxAge = 14 * 24 * 3600 * 1000;

function renderHTML(componentHTML, initialState) {
  return `
    <!DOCTYPE html>
    <html lang="ru">
        <head>
            <meta name="keywords" content="">
            <meta name="description" content="">
            <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
            <title></title>
            <link href="${staticUrl}/styles/styles.css" rel="stylesheet">
            <script type="application/javaScript">
              window.REDUX_INITIAL_STATE = ${JSON.stringify(initialState)};
            </script>
        </head>
        <body>
          <div id="root">${componentHTML}</div>
          ${devToolsHTML}
          <script src="${staticUrl}/js/app.js"></script>
        </body>
    </html>
    `;
}

app.use(cookieParser());
app.use((req, res) => {
  const store = configureStore();
  store.dispatch(initialize({
    backend: {
      apiUrl,
      authProviderPaths: {
        vk: '/auth/vk',
        facebook: '/auth/facebook',
        instagram: '/auth/instagram',
      },
    },
    currentLocation: req.url,
    cookies: req.cookies,
  }))
  .then(() => match({ routes: routes(store), location: req.url }, (err, redirect, renderProps) => {
    if (redirect) {
      return res.redirect(301, redirect.pathname + redirect.search);
    }

    if (err) {
      return res.status(500).send(err.message);
    }

    if (!renderProps) {
      return res.status(404).send('Not route found');
    }

    const componentHTML = ReactDom.renderToString(
      <Provider store={store}>
        <RouterContext {...renderProps} />
      </Provider>,
    );
    const state = store.getState();
    res.cookie('authHeaders', JSON.stringify(getHeaders(state)), { maxAge: cookieMaxAge });
    return res.end(renderHTML(componentHTML, state));
  }));
});

app.listen(PORT, () => {
  console.log(`Server listening on: ${PORT}`);
});
