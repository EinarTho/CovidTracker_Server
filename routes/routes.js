const express = require('express');
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

router.delete('/employees', (req, res) => {
  controllers.delete(req, res);
});

router.post('/employees/addvisitedroom', (req, res) => {
  controllers.addVisitedRoom(req, res);
});

router.post('/employees/positivetest', (req, res) => {
  controllers.registerPositiveTest(req, res);
});

router.post('/registerroom', (req, res) => {
  controllers.registerNewRoom(req, res);
});

router.get('/rooms', (req, res) => {
  controllers.getAllRooms(req, res);
});

module.exports = router;
