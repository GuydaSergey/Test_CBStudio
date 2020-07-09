const mongoose = require('mongoose');
const log = require('../../helpers/log')(module);

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', (err) => {
  log.error('connection error:', err.message);
});
db.on('open', () => {
  log.info('Connected to DB!');
});
db.on('close', () => {
  log.info('Closed connect to DB!');
});
db.on('disconnected', () => {
  log.info('Disconnect to DB!');
});
module.exports = mongoose;
