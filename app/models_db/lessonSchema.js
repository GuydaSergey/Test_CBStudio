const mongoose = require('../db/db_mongo');
const { Group } = require('./groupSchema');
const { Teacher } = require('./teacherSchema');
const { Student } = require('./studentsSchema');

const { Schema } = mongoose;

const Lesson = new Schema({
  topic: { type: String },
  teacher: Teacher,
  group: Group,
  students: [Student],
  room: { type: Number },
  time_start: { type: Date },
  time_end: { type: Date },
});

const LessonModel = mongoose.model('Lesson', Lesson);

module.exports.LessonModel = LessonModel;
