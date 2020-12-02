const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const roomController = require('../controllers/room');

//change to user everywhere

router.get(
  '/users',
  userController.allowIfLoggedin,
  userController.grantAccess('readAny', 'profile'),
  userController.getAllUsers
);

router.delete(
  '/users',
  userController.allowIfLoggedin,
  userController.grantAccess('deleteAny', 'profile'),
  userController.deleteUser
);

router.put('/users/positivetest', userController.registerPositiveTest);

router.put(
  '/users/visitedrooms',
  userController.allowIfLoggedin,
  userController.grantAccess('updateAny', 'profile'),
  userController.addVisitedRooms
);

router.get(
  '/users/visitedrooms',
  userController.allowIfLoggedin,
  userController.grantAccess('readAny', 'profile'),
  userController.getVisitedRooms
);

router.put('/users/deletevisitedrooms', userController.deleteVisitedRooms);

router.post('/users/register', userController.createUser);

router.post('/users/login', userController.login);

router.get(
  '/users/:id',
  userController.allowIfLoggedin,
  userController.getUser
);

router
  .route('/rooms')
  .get(roomController.getAllRooms)
  .post(roomController.createRooms)
  .put(roomController.updateRooms)
  .delete(roomController.deleteRooms);

module.exports = router;
