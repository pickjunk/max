const express = require('express');
const next = require('next');
const { parse } = require('url');

const dev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 3000;

const app = next({dir: '.', dev });
const handle = app.getRequestHandler();

const routes = require('./routes');
const pathToRegexp = require('path-to-regexp');
const _routes = [];
for (let r in routes) {
  const keys = [];
  const regexp = pathToRegexp(r, keys);
  _routes.push({
    keys,
    regexp,
    page: routes[r].page,
  });
}

app.prepare().then(() => {
  const server = express();
  for (let r in routes) {
    const { page } = routes[r];

    server.get(r, (req, res) => {
      const query = Object.assign({}, req.params);
      const parsedUrl = parse(req.url, true);
      query = Object(query, parsedUrl.query);

      return app.render(req, res, page, query);
    });
  }

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
