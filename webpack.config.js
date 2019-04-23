const { proxy } = require('./config/app');

module.exports = {
  devServer: {
    proxy,
  },
};
