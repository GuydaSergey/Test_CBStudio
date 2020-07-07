const mongoose = require('../db/db_mongo');

const { Schema } = mongoose;

const Teacher = new Schema({
  name: { type: String },
});

const TeacherModel = mongoose.model('Teacher', Teacher);

module.exports = {
  TeacherModel,
  Teacher,
};
