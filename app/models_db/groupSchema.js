const mongoose = require('../db/db_mongo');

const { Schema } = mongoose;

const Group = new Schema({
  name: { type: String },
});

const GroupModel = mongoose.model('Group', Group);

module.exports = {
  GroupModel,
  Group,
};
