import 'babel-polyfill';
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './containers/App'
import configureStore from './store/configureStore'
import { fetchRegions } from './actions'
require("./style/main.css")

const store = configureStore() //NOTE: to set initial state, pass in state object as first argument

store.dispatch(fetchRegions("PORTLAND")) //Kick-off initial data request

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
