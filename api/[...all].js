const app = require('../server/src/app');

module.exports = (req, res) => {
  if (req.url && req.url.startsWith('/api')) {
    req.url = req.url.replace(/^\/api/, '') || '/';
  }

  return app(req, res);
};
