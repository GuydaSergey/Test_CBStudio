const mongoose = require('../db/db_mongo');

const { Schema } = mongoose;

const Lesson = new Schema({
  topic: { type: String },
  teacher: { type: Schema.Types.ObjectId },
  group: { type: Schema.Types.ObjectId },
  students: [{ type: Schema.Types.ObjectId }],
  room: { type: Number },
  time_start: { type: Date },
  time_end: { type: Date },
});

const LessonModel = mongoose.model('Lesson', Lesson);

module.exports.LessonModel = LessonModel;
