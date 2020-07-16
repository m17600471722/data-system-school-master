const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://mjtest.yunxiaoos.com/api',
      secure: false,
      changeOrigin: true,
      pathRewrite: {
      "^/api": "/"
      },
    })
  );
};