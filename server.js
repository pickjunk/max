const express = require('express');
const next = require('next');
const { parse } = require('url');
const proxy = require('http-proxy-middleware');

const dev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 3000;

const app = next({ dir: '.', dev });
const handle = app.getRequestHandler();
const proxyConfig = require('./config/proxy');
const routes = require('./config/routes');

app.prepare().then(() => {
  const server = express();

  server.use('/api', proxy(proxyConfig));

  for (let r in routes) {
    const { page } = routes[r];

    server.get(r, (req, res) => {
      let query = Object.assign({}, req.params);
      const parsedUrl = parse(req.url, true);
      query = Object(query, parsedUrl.query);

      app.render(req, res, page, query);
    });
  }

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(PORT, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
