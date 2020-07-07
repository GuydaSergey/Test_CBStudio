const mongoose = require('../db/db_mongo');
const { Group } = require('./groupSchema');

const { Schema } = mongoose;

const Student = new Schema({
  name: { type: String },
  age: { type: Number },
  group: Group,
});

const StudentModel = mongoose.model('Student', Student);

module.exports = {
  StudentModel,
  Student,
};
