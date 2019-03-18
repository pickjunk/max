/* eslint-disable */
import Raven from 'raven-js';
import { raven } from '../config/app';

let client;
if (process.env.NODE_ENV === 'production' && raven) {
  Raven.config(raven).install();
  client = Raven;
} else {
  // mock this function in development, throw but not report
  client = {
    captureException(e) {
      throw e;
    },
  };
}

if (process.browser) {
  window.onerror = function(msg, url, line, col, e) {
    client.captureException(e);
  };
}

export default client;
