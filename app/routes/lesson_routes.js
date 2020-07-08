const log = require('../../helpers/log')(module);
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
      if (req.body.teacher_id.length < 1) req.body.teacher_id = undefined;
      const teacher = await TeacherModel.findById(req.body.teacher_id, (err, doc) => {
        if (err) throw err;
        if (doc) return doc.id;
        return doc;
      });

      if (req.body.group_id.length < 1) req.body.group_id = undefined;
      const group = await GroupModel.findById(req.body.group_id, (err, doc) => {
        if (err) throw err;
        if (doc) return doc.id;
        return doc;
      });

      const students = await StudentModel.find({ group_id: group }, (err, doc) => {
        if (err) throw err;
        return doc;
      });

      const lesson = new LessonModel({
        topic: req.body.topic,
        teacher,
        group,
        students: students.map(
          (current) => current.id,
        ),
        room: req.body.room,
        time_start: req.body.time_start,
        time_end: req.body.time_end,
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
      if (req.body.teacher_id.length < 1) req.body.teacher_id = undefined;
      const teacher = await TeacherModel.findById(req.body.teacher_id, (error, doc) => {
        if (error) throw error;
        if (doc) return doc.id;
        return doc;
      });
      if (req.body.group_id.length < 1) req.body.group_id = undefined;
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

      lesson.topic = !req.body.topic ? lesson.topic : req.body.topic;
      lesson.teacher = !req.body.teacher_id ? lesson.teacher : teacher;
      lesson.group = !req.body.group_id ? lesson.group : group;
      lesson.students = !req.body.group_id ? lesson.students : students.map(
        (current) => current.id,
      );
      lesson.room = !req.body.room ? lesson.room : req.body.room;
      lesson.time_start = !req.body.time_start ? lesson.time_start : req.body.time_start;
      lesson.time_end = !req.body.time_end ? lesson.time_end : req.body.time_end;

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
