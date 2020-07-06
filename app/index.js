const webServer = require('./services/server.js');
const log = require('../helpers/log')(module);

async function startup() {
  log.info('Starting application');

  try {
    log.info('Initializing web server module');

    await webServer.initialize();
  } catch (err) {
    log.error(err);

    process.exit(1);
  }
}

async function shutdown(e) {
  let err = e;

  log.info('Shutting down');

  try {
    log.info('Closing web server module');

    await webServer.close();
  } catch (er) {
    log.error('Encountered error', er);

    err = err || er;
  }

  log.info('Exiting process');

  if (err) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

process.on('SIGTERM', () => {
  log.info('Received SIGTERM');

  shutdown();
});

process.on('SIGINT', () => {
  log.info('Received SIGINT');

  shutdown();
});

process.on('uncaughtException', (err) => {
  log.info('Uncaught exception');
  log.error(err);

  shutdown(err);
});

startup();
