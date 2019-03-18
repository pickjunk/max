module.exports = {
  target: 'http://192.168.56.101:8080',
  changeOrigin: true,
  pathRewrite: {
    '^/api/': '/',
  },
};
