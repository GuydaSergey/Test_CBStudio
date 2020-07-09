const log = require('../../helpers/log')(module);
const { isExistOrEmptyString } = require('../../helpers/helper');
const { GroupModel } = require('../models_db/groupSchema');
const { StudentModel } = require('../models_db/studentsSchema');

module.exports = (app) => {
  app.get('/students', (req, res) => StudentModel.find((err, students) => {
    if (!err) {
      return res.send(students);
    }
    res.statusCode = 500;
    log.error(`Internal error :${res.statusCode} ${err.message}`);
    return res.send({ error: 'Server error' });
  }));

  app.get('/student/:id', (req, res) => StudentModel.findById(req.params.id, (err, student) => {
    if (!student) {
      res.statusCode = 404;
      return res.send({ error: 'Not found' });
    }
    if (!err) {
      return res.send({ status: 'OK', student });
    }
    res.statusCode = 500;
    log.error(`Internal error :${res.statusCode} ${err.message}`);
    return res.send({ error: 'Server error' });
  }));

  app.post('/student', async (req, res) => {
    let answer;
    try {
      if (isExistOrEmptyString(req.body.group_id)) req.body.group_id = undefined;
      const group = await GroupModel.findById(req.body.group_id, (error, doc) => {
        if (error) throw error;
        if (doc) return doc.id;
        return doc;
      });

      const student = new StudentModel({
        name: req.body.name,
        age: Number.isInteger(req.body.age) ? req.body.age : null,
        group,
      });

      await student.save().then(() => {
        log.info('Student created');
        answer = { status: 'OK', student };
      }).catch((err) => { throw err; });
    } catch (err) {
      res.statusCode = 500;
      log.error(`Internal error :${res.statusCode} ${err.message}`);
      answer = { error: 'Server error' };
    } finally {
      res.send(answer);
    }
  });

  app.put('/student/:id', (req, res) => StudentModel.findById(req.params.id, async (err, student) => {
    let answer;
    try {
      if (err) throw err;

      if (!student) {
        res.statusCode = 404;
        answer = { error: 'Not found' };
        return;
      }
      if (isExistOrEmptyString(req.body.group_id)) req.body.group_id = undefined;
      const group = await GroupModel.findById(req.body.group_id, (error, doc) => {
        if (error) throw error;
        if (doc) return doc.id;
        return doc;
      });

      student.name = isExistOrEmptyString(req.body.name) ? student.name : req.body.name;
      student.age = Number.isInteger(req.body.age) ? req.body.age : student.age;
      student.group = isExistOrEmptyString(req.body.group_id) ? student.group : group;

      await student.save().then(() => {
        log.info('Student update');
        answer = { status: 'OK', student };
      }).catch((error) => { throw error; });
    } catch (error) {
      res.statusCode = 500;
      log.error(`Internal error :${res.statusCode} ${error.message}`);
      answer = { error: 'Server error' };
    } finally {
      res.send(answer);
    }
  }));

  app.delete('/student/:id', (req, res) => StudentModel.findById(req.params.id, async (err, student) => {
    let answer;
    try {
      if (err) throw err;

      if (!student) {
        res.statusCode = 404;
        answer = { error: 'Not found' };
        return;
      }
      await student.remove((error) => {
        if (!error) {
          log.info('Student removed');
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
