import React, { Component } from 'react';
import RouteWrapper from '../RouteWrapper';
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn:
    'https://f987773779f94786bba794126d11b3f0@o376012.ingest.sentry.io/5196310',
  blacklistUrls: [/localhost/, /127.0.0.0/]
});
export default class App extends Component {
  render() {
    return <RouteWrapper />;
  }
}
