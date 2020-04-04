import thunk from 'redux-thunk';
import { throttle } from 'lodash';
import React, { Component } from 'react';
import { applyMiddleware, compose, createStore } from 'redux';

import reducers from '../../reducers';
import RouteWrapper from '../RouteWrapper';
import Provider from 'react-redux/lib/components/Provider';
import fetchMiddleware from '../../helpers/fetchMiddleware';
import { loadState, saveState } from '../../helpers/LocalStorage';

const enhancers = compose(
  applyMiddleware(thunk, fetchMiddleware),
  window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : f => f
);

const userLoggedIndetails = loadState('userAuthenticationDetails');
let localStateObject;

if (userLoggedIndetails) {
  localStateObject = {
    isFetching: false,
    data: { ...userLoggedIndetails, isLoggedIn: true },
    error: {}
  };
}

const store = createStore(
  reducers,
  {
    userAuthenticationDetails: localStateObject
  },
  enhancers
);

store.subscribe(
  throttle(() => {
    saveState({
      reducedActiveUser: store.getState().reducedActiveUser
    });
  }, 1000)
);

export default function App () {
  return (
    <Provider store={store}>
      <RouteWrapper />
    </Provider>
  );
}
