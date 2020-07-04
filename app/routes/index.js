const lessRoutes = require('./less_routes');

module.exports = function (app, db) {
  lessRoutes(app, db);
};
