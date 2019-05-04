/* eslint-disable */
import Raven, { RavenOptions, RavenStatic } from 'raven-js';
import { raven } from '../config/app';

interface RavenClient {
  captureException(ex: string | Error | ErrorEvent, options?: RavenOptions): RavenStatic
}

let client: RavenClient;
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

if (typeof window !== 'undefined') {
  window.onerror = function(msg, url, line, col, e) {
    client.captureException(e);
  };
}

export default client;
