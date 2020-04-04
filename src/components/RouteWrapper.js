import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

import Home from '../components/Home';
import Login from '../components/Login';
import Bookings from '../components/Bookings';
import OwnerHome from '../components/OwnerHome';
import OnBoarding from '../components/OnBoarding';

export default function RouteWrapper() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/bookings" component={Bookings} />
          <Route exact path="/onboard" component={OnBoarding} />
          <Route exact path="/owners" component={OwnerHome} />
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      </Router>
    );
}
