const mongoose = require('../db/db_mongo');

const { Schema } = mongoose;

const Student = new Schema({
  name: { type: String },
  age: { type: Number },
  group: { type: Schema.Types.ObjectId },
});

const StudentModel = mongoose.model('Student', Student);

module.exports = {
  StudentModel,
};
