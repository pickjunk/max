import router from '@pickjunk/min/Router';
import Promise from './promise';
import request from './request';
import Raven from './raven';

export default function graphql(uri, query, variables) {
  return request(uri, {
    method: 'POST',
    body: {
      query,
      variables,
    },
  }).then(res => {
    if (res.errors) {
      let err;
      try {
        err = JSON.parse(res.errors[0].message);
      } catch (e) {
        router.push('/exception/500');

        Raven.captureException(new Error(res.errors[0].message));

        return Promise.stop();
      }

      // business error, continue to throw
      throw err;
    }
    return res.data;
  });
}
