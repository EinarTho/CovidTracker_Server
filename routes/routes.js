const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const roomController = require('../controllers/room');

//change to user everywhere

router.get('/users/:id', userController.getUser);

router.get('/users', userController.getAllUsers);

router.delete('/users/:id', userController.deleteUser);

router.post('/users/addvisitedrooms', userController.addVisitedRoom);

router.post('/users/positivetest', userController.registerPositiveTest);

router.post('/users/register', userController.createUser);

router.post('/users/login', userController.login);

router.post('/rooms/registerroom', userController.addVisitedRoom);

router
  .route('/rooms')
  .get(roomController.getAllRooms)
  .post(roomController.createRoom)
  .put(roomController.updateRoom)
  .delete(roomController.deleteRoom);

module.exports = router;
