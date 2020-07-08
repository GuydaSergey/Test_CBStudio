const lessonRoutes = require('./lesson_routes');
const GroupRoutes = require('./group_routes');
const StudentRoutes = require('./student_routes');
const TeacherRoutes = require('./teacher_routes');
const log = require('../../helpers/log')(module);

module.exports = (app) => {
  app.get('/', (req, res) => {
    res.end('API is running');
  });

  lessonRoutes(app);
  GroupRoutes(app);
  StudentRoutes(app);
  TeacherRoutes(app);

  app.use((req, res) => {
    res.status(404);
    log.debug(`Not found URL:${req.url}`);
    res.send({ error: 'Not found' });
  });

  app.use((err, req, res) => {
    res.status(err.status || 500);
    log.error(`Internal error :${res.statusCode} ${err.message}`);
    res.send({ error: err.message });
  });
};
