import React, { Component } from 'react';
import Provider from 'react-redux/es/components/Provider';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import thunk from 'redux-thunk';
import { applyMiddleware, compose, createStore } from 'redux';
import { throttle } from 'lodash';

import Home from '../components/Home';
import Login from '../components/Login';
import Bookings from '../components/Bookings';
import OwnerHome from '../components/OwnerHome';
import OnBoarding from '../components/OnBoarding';
import Referral from '../components/Referral';

import reducers from '../reducers';
import { loadState, saveState } from '../helpers/LocalStorage';

import Stores from './Stores';
import { LocationAndStoreProvider } from '../contexts/location-and-store-context';
import fetchMiddleware from '../helpers/fetchMiddleware';

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

export default class RouteWrapper extends Component {
  render() {
    return (
      <Provider store={store}>
        <LocationAndStoreProvider>
          <Router>
            <div style={{ maxWidth: '500px', margin: '0 auto' }}>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/bookings" component={Bookings} />
                <Route exact path="/stores" component={Stores} />
                <Route exact path="/onboard" component={OnBoarding} />
                <Route exact path="/owners" component={OwnerHome} />
                <Route exact path="/refer" component={Referral} />
                <Route render={() => <Redirect to="/" />} />
              </Switch>
              {/*<div className="footer">
                CREATED BY
                <a href="https://www.linkedin.com/in/shubhamjain94/">Shubham Jain</a>
                <a href="https://www.linkedin.com/in/shubhamjain94/">Akshay Nagpal</a>
                <img className="donate" src={donate}/>
            </div>
          */}
            </div>
          </Router>
        </LocationAndStoreProvider>
      </Provider>
    );
  }
}
