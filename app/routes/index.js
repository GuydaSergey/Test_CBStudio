const lessonRoutes = require('./lesson_routes');
const log = require('../../helpers/log')(module);

module.exports = (app) => {
  app.get('/', (req, res) => {
    res.end('API is running');
  });

  lessonRoutes(app);

  app.use((req, res) => {
    res.status(404);
    log.debug('Not found URL: %s', req.url);
    res.send({ error: 'Not found' });
  });

  app.use((err, req, res) => {
    res.status(err.status || 500);
    log.error('Internal error(%d): %s', res.statusCode, err.message);
    res.send({ error: err.message });
  });
};
