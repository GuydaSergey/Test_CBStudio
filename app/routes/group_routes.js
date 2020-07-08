const log = require('../../helpers/log')(module);
const { GroupModel } = require('../models_db/groupSchema');

module.exports = (app) => {
  app.get('/group', (req, res) => GroupModel.find((err, group) => {
    if (!err) {
      return res.send(group);
    }
    res.statusCode = 500;
    log.error(`Internal error :${res.statusCode} ${err.message}`);
    return res.send({ error: 'Server error' });
  }));

  app.get('/group/:id', (req, res) => GroupModel.findById(req.params.id, (err, group) => {
    if (!group) {
      res.statusCode = 404;
      return res.send({ error: 'Not found' });
    }
    if (!err) {
      return res.send({ status: 'OK', group });
    }
    res.statusCode = 500;
    log.error(`Internal error :${res.statusCode} ${err.message}`);
    return res.send({ error: 'Server error' });
  }));

  app.post('/group', async (req, res) => {
    let answer;
    try {
      const group = new GroupModel({
        name: req.body.name,
      });

      await group.save().then(() => {
        log.info('Group created');
        answer = { status: 'OK', group };
      }).catch((err) => { throw err; });
    } catch (err) {
      res.statusCode = 500;
      log.error(`Internal error :${res.statusCode} ${err.message}`);
      answer = { error: 'Server error' };
    } finally {
      res.send(answer);
    }
  });

  app.put('/group/:id', (req, res) => GroupModel.findById(req.params.id, async (err, group) => {
    let answer;
    try {
      if (err) throw err;

      if (!group) {
        res.statusCode = 404;
        answer = { error: 'Not found' };
        return;
      }

      group.name = !req.body.name ? group.name : req.body.name;

      await group.save().then(() => {
        log.info('Group update');
        answer = { status: 'OK', group };
      }).catch((error) => { throw error; });
    } catch (error) {
      res.statusCode = 500;
      log.error(`Internal error :${res.statusCode} ${error.message}`);
      answer = { error: 'Server error' };
    } finally {
      res.send(answer);
    }
  }));

  app.delete('/group/:id', (req, res) => GroupModel.findById(req.params.id, async (err, group) => {
    let answer;
    try {
      if (err) throw err;

      if (!group) {
        res.statusCode = 404;
        answer = { error: 'Not found' };
        return;
      }
      await group.remove((error) => {
        if (!error) {
          log.info('Group removed');
          answer = { status: 'OK' };
          return;
        }
        throw error;
      });
    } catch (error) {
      res.statusCode = 500;
      log.error(`Internal error :${res.statusCode} ${error.message}`);
      answer = { error: 'Server error' };
    } finally {
      res.send(answer);
    }
  }));
};
