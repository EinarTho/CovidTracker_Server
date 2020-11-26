const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const roomController = require('../controllers/room');

//change to user everywhere

router.get('/users/:id', userController.getUser);
->> PUT ->> updateuser
router.post('/users/register', userController.createUser);
router.delete('/users/:id', userController.deleteUser);


router.post('/users/addvisitedrooms', userController.addVisitedRoom);
router.put('/users/positivetest', userController.registerPositiveTest);
router.post('/users/login', userController.login);

router
  .route('/rooms')
  .get(roomController.getAllRooms)
  .post(roomController.createRoom)
  .put(roomController.updateRoom)
  .delete(roomController.deleteRoom);

module.exports = router;
