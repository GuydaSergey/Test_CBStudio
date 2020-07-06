const log = require('../../helpers/log')(module);
const { LessonModel } = require('../models_db/lessonShema');

module.exports = (app) => {
  app.get('/lesson', (req, res) => LessonModel.find((err, lesson) => {
    if (!err) {
      return res.send(lesson);
    }
    res.statusCode = 500;
    log.error(`Internal error :${res.statusCode}${err.message}`);
    return res.send({ error: 'Server error' });
  }));

  app.post('/lesson', (req, res) => {
    const lesson = new LessonModel({
      topic: req.body.topic,
      teacher: req.body.teacher,
      group: req.body.group,
      room: req.body.room,
      time_start: req.body.time_start,
      time_end: req.body.time_end,
    });

    lesson.save((err) => {
      if (!err) {
        log.info('article created');
        return res.send({ status: 'OK', lesson });
      }
      res.statusCode = 500;
      log.error(`Internal error :${res.statusCode}${err.message}`);
      return res.send({ error: 'Server error' });
    });
  });
};
