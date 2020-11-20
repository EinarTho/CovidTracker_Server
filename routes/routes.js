const express = require('express');
const { reset } = require('nodemon');
const router = express.Router();
const controllers = require('../controllers/controllers.js');

router.get('/employees/:id', (req, res) => {
  //send back name, and whether the person is in the danger zone.
  //send back a list of rooms for our react app to use. 'Loading rooms...'
  controllers.getUser(req, res);
});

router.post('/employees', (req, res) => {
  controllers.registerNewUser(req, res);
});

router.get('/employees', (req, res) => {
  controllers.getAllUsers(res);
});

router.post('/employees/positivetest', (req, res) => {
  controlleres.registerPositiveTest(req, res);
});

module.exports = router;
