const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const webServerConfig = require('../config/server.js');
const log = require('../../helpers/log')(module);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
require('../routes')(app);

let httpServer;

function initialize() {
  return new Promise((resolve, reject) => {
    httpServer = http.createServer(app);
    httpServer.listen(webServerConfig.port)
      .on('listening', () => {
        log.info(`Web server listening on localhost:${webServerConfig.port}`);
        resolve();
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

function close() {
  return new Promise((resolve, reject) => {
    httpServer.close((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

module.exports.close = close;
module.exports.initialize = initialize;
