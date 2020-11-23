const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const roomController = require('../controllers/room');

//change to user everywhere

router.get('/users/:id', userController.getUser);

router.get('/users', userController.getAllUsers);

router.delete('/users', userController.deleteUser);

router.post('/users/addvisitedrooms', userController.addVisitedRoom);

router.post('/users/positivetest', userController.registerPositiveTest);

router.post('/users/register', userController.createUser);

router.post('/users/login', userController.login);

router.post('/rooms/registerroom', userController.addVisitedRoom);

router.get('/rooms', roomController.getAllRooms);

router.put('/rooms', roomController.updateRoom);

router.delete('/rooms', roomController.deleteRoom);

module.exports = router;
