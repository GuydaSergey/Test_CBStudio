const log = require('../../helpers/log')(module);
const { isExistOrEmptyString, isDate } = require('../../helpers/helper');
const { LessonModel } = require('../models_db/lessonSchema');
const { TeacherModel } = require('../models_db/teacherSchema');
const { GroupModel } = require('../models_db/groupSchema');
const { StudentModel } = require('../models_db/studentsSchema');

module.exports = (app) => {
  app.get('/lesson', (req, res) => LessonModel.find((err, lesson) => {
    if (!err) {
      return res.send(lesson);
    }
    res.statusCode = 500;
    log.error(`Internal error :${res.statusCode} ${err.message}`);
    return res.send({ error: 'Server error' });
  }));

  app.get('/lesson/:id', (req, res) => LessonModel.findById(req.params.id, (err, lesson) => {
    if (!lesson) {
      res.statusCode = 404;
      return res.send({ error: 'Not found' });
    }
    if (!err) {
      return res.send({ status: 'OK', lesson });
    }
    res.statusCode = 500;
    log.error(`Internal error :${res.statusCode} ${err.message}`);
    return res.send({ error: 'Server error' });
  }));

  app.post('/lesson', async (req, res) => {
    let answer;
    try {
      if (isExistOrEmptyString(req.body.teacher_id)) req.body.teacher_id = undefined;
      const teacher = await TeacherModel.findById(req.body.teacher_id, (err, doc) => {
        if (err) throw err;
        if (doc) return doc.id;
        return doc;
      });

      if (isExistOrEmptyString(req.body.group_id)) req.body.group_id = undefined;
      const group = await GroupModel.findById(req.body.group_id, (err, doc) => {
        if (err) throw err;
        if (doc) return doc.id;
        return doc;
      });

      const students = await StudentModel.find(
        { group_id: group ? group.id : group }, (err, doc) => {
          if (err) throw err;
          return doc;
        },
      );

      const lesson = new LessonModel({
        topic: req.body.topic,
        teacher,
        group,
        students: students.map(
          (current) => current.id,
        ),
        room: Number.isInteger(req.body.room) ? req.body.room : null,
        time_start: isDate(req.body.time_start) ? req.body.time_start : null,
        time_end: isDate(req.body.time_end) ? req.body.time_end : null,
      });

      await lesson.save().then(() => {
        log.info('Lesson created');
        answer = { status: 'OK', lesson };
      }).catch((err) => { throw err; });
    } catch (err) {
      res.statusCode = 500;
      log.error(`Internal error :${res.statusCode} ${err.message}`);
      answer = { error: 'Server error' };
    } finally {
      res.send(answer);
    }
  });

  app.put('/lesson/:id', (req, res) => LessonModel.findById(req.params.id, async (err, lesson) => {
    let answer;
    try {
      if (err) throw err;

      if (!lesson) {
        res.statusCode = 404;
        answer = { error: 'Not found' };
        return;
      }
      if (isExistOrEmptyString(req.body.teacher_id)) req.body.teacher_id = undefined;
      const teacher = await TeacherModel.findById(req.body.teacher_id, (error, doc) => {
        if (error) throw error;
        if (doc) return doc.id;
        return doc;
      });
      if (isExistOrEmptyString(req.body.group_id)) req.body.group_id = undefined;
      const group = await GroupModel.findById(req.body.group_id, (error, doc) => {
        if (error) throw error;
        if (doc) return doc.id;
        return doc;
      });

      const students = await StudentModel.find(
        { group_id: group ? group.id : group }, (error, doc) => {
          if (error) throw error;
          return doc;
        },
      );

      lesson.topic = isExistOrEmptyString(req.body.topic) ? lesson.topic : req.body.topic;
      lesson.teacher = isExistOrEmptyString(req.body.teacher_id) ? lesson.teacher : teacher;
      lesson.group = isExistOrEmptyString(req.body.group_id) < 1 ? lesson.group : group;
      lesson.students = isExistOrEmptyString(req.body.group_id) ? lesson.students
        : students.map(
          (current) => current.id,
        );
      lesson.room = Number.isInteger(req.body.room) ? req.body.room : lesson.room;
      lesson.time_start = isDate(req.body.time_start) ? req.body.time_start : lesson.time_start;
      lesson.time_end = isDate(req.body.time_end) ? req.body.time_end : lesson.time_end;

      await lesson.save().then(() => {
        log.info('Lesson update');
        answer = { status: 'OK', lesson };
      }).catch((error) => { throw error; });
    } catch (error) {
      res.statusCode = 500;
      log.error(`Internal error :${res.statusCode} ${error.message}`);
      answer = { error: 'Server error' };
    } finally {
      res.send(answer);
    }
  }));

  app.delete('/lesson/:id', (req, res) => LessonModel.findById(req.params.id, async (err, lesson) => {
    let answer;
    try {
      if (err) throw err;

      if (!lesson) {
        res.statusCode = 404;
        answer = { error: 'Not found' };
        return;
      }
      await lesson.remove((error) => {
        if (!error) {
          log.info('lesson removed');
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
