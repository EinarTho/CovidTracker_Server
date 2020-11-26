const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const roomController = require('../controllers/room');

//change to user everywhere

router.get('/users', userController.getAllUsers);

router.delete('/users', userController.deleteUser);

router.put('/users/positivetest', userController.registerPositiveTest);

router.put('/users/visitedrooms', userController.addVisitedRooms);

router.get('/users/visitedrooms', userController.getVisitedRooms);

router.delete('/users/visitedrooms', userController.deleteVisitedRooms);

router.post('/users/register', userController.createUser);

router.post('/users/login', userController.login);

router.get('/users/:id', userController.getUser);

router
  .route('/rooms')
  .get(roomController.getAllRooms)
  .post(roomController.createRooms)
  .put(roomController.updateRooms)
  .delete(roomController.deleteRooms);

module.exports = router;
