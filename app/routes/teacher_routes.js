const log = require('../../helpers/log')(module);
const { isExistOrEmptyString } = require('../../helpers/helper');
const { TeacherModel } = require('../models_db/teacherSchema');

module.exports = (app) => {
  app.get('/teacher', (req, res) => TeacherModel.find((err, teacher) => {
    if (!err) {
      return res.send(teacher);
    }
    res.statusCode = 500;
    log.error(`Internal error :${res.statusCode} ${err.message}`);
    return res.send({ error: 'Server error' });
  }));

  app.get('/teacher/:id', (req, res) => TeacherModel.findById(req.params.id, (err, teacher) => {
    if (!teacher) {
      res.statusCode = 404;
      return res.send({ error: 'Not found' });
    }
    if (!err) {
      return res.send({ status: 'OK', teacher });
    }
    res.statusCode = 500;
    log.error(`Internal error :${res.statusCode} ${err.message}`);
    return res.send({ error: 'Server error' });
  }));

  app.post('/teacher', async (req, res) => {
    let answer;
    try {
      const teacher = new TeacherModel({
        name: req.body.name,
      });

      await teacher.save().then(() => {
        log.info('Teacher created');
        answer = { status: 'OK', teacher };
      }).catch((err) => { throw err; });
    } catch (err) {
      res.statusCode = 500;
      log.error(`Internal error :${res.statusCode} ${err.message}`);
      answer = { error: 'Server error' };
    } finally {
      res.send(answer);
    }
  });

  app.put('/teacher/:id', (req, res) => TeacherModel.findById(req.params.id, async (err, teacher) => {
    let answer;
    try {
      if (err) throw err;

      if (!teacher) {
        res.statusCode = 404;
        answer = { error: 'Not found' };
        return;
      }

      teacher.name = isExistOrEmptyString(req.body.name) ? teacher.name : req.body.name;

      await teacher.save().then(() => {
        log.info('Teacher update');
        answer = { status: 'OK', teacher };
      }).catch((error) => { throw error; });
    } catch (error) {
      res.statusCode = 500;
      log.error(`Internal error :${res.statusCode} ${error.message}`);
      answer = { error: 'Server error' };
    } finally {
      res.send(answer);
    }
  }));

  app.delete('/teacher/:id', (req, res) => TeacherModel.findById(req.params.id, async (err, teacher) => {
    let answer;
    try {
      if (err) throw err;

      if (!teacher) {
        res.statusCode = 404;
        answer = { error: 'Not found' };
        return;
      }
      await teacher.remove((error) => {
        if (!error) {
          log.info('Teacher removed');
          answer = { status: 'OK' };
          return;
        }
        throw error;
      });
    } catch (error) {
      res.statusCode = 500;
      log.error(`Internal error :${res.statusCode} ${error.message}`);
      answer = { error: 'Server error' };
    } finally {
      res.send(answer);
    }
  }));
};
