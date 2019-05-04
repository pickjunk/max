import router from '@pickjunk/min/Router';
import Cookies from 'js-cookie';
import Promise from './promise';
import Raven from './raven';
import profile$ from '../subjects/profile$';

const codeMessage = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
};
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  const error = new Error(errortext);
  error.name = response.status;

  Raven.captureException(error);
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };

  newOptions.headers = newOptions.headers || {};

  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }

  const token = Cookies.get('token');
  if (token) {
    newOptions.headers = {
      ...newOptions.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => {
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();
    })
    .then(response => {
      // business error, continue to throw
      if (response.code && response.msg) {
        throw response;
      }

      return response;
    });
}

export function dashboard(request) {
  return request.catch(e => {
    const status = e.name;

    if (status === 401) {
      // clear login status
      Cookies.remove('token');
      profile$.next({});

      router.replace('/gate');
      return Promise.stop();
    }
    if (status === 403) {
      router.replace('/exception/403');
      return Promise.stop();
    }
    if (status >= 404 && status < 422) {
      router.replace('/exception/404');
      return Promise.stop();
    }
    if (status <= 504 && status >= 500) {
      router.replace('/exception/500');
      return Promise.stop();
    }

    throw e;
  });
}
