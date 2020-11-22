const express = require('express');
const { reset } = require('nodemon');
const router = express.Router();
const users = require('../controllers/users.js');
const auth = require('../controllers/auth');

router.get('/employees/:id', users.getUser);

router.post('/employees', users.registerNewUser);

router.get('/employees', users.getAllUsers);

router.post('/employees/addvisitedroom', users.addVisitedRoom);

router.post('/employees/positivetest', users.registerPositiveTest);

router.post('/registerroom', users.registerNewRoom);

router.get('/rooms', users.getAllRooms);

router.post('/signin', auth.signIn);

router.post('/register', auth.signUp);

module.exports = router;
