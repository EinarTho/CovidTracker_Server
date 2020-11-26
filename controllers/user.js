const User = require('../model/user');
const findMatchingEntries = require('../utils/findMatch');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validateRoomArray = require('../utils/validateRoomArray');

const { validateCreateUser, validateLogin } = require('../utils/validateAuth');
const { validatePassword } = require('../utils/validatePassword');

const getUser = async (req, res) => {
  try {
    const user = await User.find({ _id: req.params.id });
    res.status(200).send(user);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const usersToBeDeleted = JSON.parse(req.body.users);
    await User.deleteMany({
      _id: {
        $in: usersToBeDeleted,
      },
    });
    res.status(200).send('Deleted users with the ids: ' + req.body.users);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

//need to do more validation - not nessarily statuscode 500
const addVisitedRooms = async (req, res) => {
  try {
    const roomsToBeAdded = JSON.parse(req.body.rooms);
    if (!validateRoomArray(roomsToBeAdded)) {
      return res.status(415).send('Rooms in wrong format');
    }
    const user = await User.findOne({ _id: req.body._id });
    if (!user) return res.status(400).send('No user with the provided ID');
    user.visits.push(...roomsToBeAdded);
    await user.save();
    res.status(200).send('Rooms added');
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const getVisitedRooms = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body._id });
    if (!user) return res.status(400).send('no user with that id!');
    res.status(200).send(user.visits);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const deleteVisitedRooms = async (req, res) => {
  try {
    const roomsToBeDeleted = req.body.rooms;
    console.log(roomsToBeDeleted);
    const user = await User.findOne({ _id: req.body._id });
    if (!user) return res.status(400).send('No user with the provided id');
    const filteredRooms = user.visits.filter(
      room => !roomsToBeDeleted.includes(room.id)
    );
    user.visits = filteredRooms;
    await user.save();
    res.status(200).send('You deleted some rooms for a user');
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const registerPositiveTest = async (req, res) => {
  try {
    const allUsers = await User.find({});
    const positiveUser = await User.findOne({ _id: req.body._id });
    if (!positiveUser)
      return res.status(400).send('No user with the provided id');
    const usersInRisk = allUsers.filter(user => {
      console.log('first: ' + positiveUser._id, 'second' + user._id);
      if (JSON.stringify(positiveUser._id) === JSON.stringify(user._id)) {
        return false;
      }
      return findMatchingEntries(
        JSON.parse(JSON.stringify(user.visits)),
        JSON.parse(JSON.stringify(positiveUser.visits))
      );
    });
    const usersToBeWarned = usersInRisk.map(user => user._id);
    await User.updateMany(
      {
        _id: {
          $in: usersToBeWarned,
        },
      },
      { inRisk: true }
    );
    res
      .status(200)
      .send(
        'The users with the following ids will be warned: ' + usersToBeWarned
      );
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const createUser = async (req, res, next) => {
  const { email, firstName, lastName, password, companyId, floor } = req.body;
  validateCreateUser(req.body);

  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      const err = new Error('User already exists.');
      err.code = 400;
      res.status(400).send(err);
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      companyId,
      floor,
    });
    const savedUser = await user.save();
    res.status(200).send(savedUser);
  } catch (err) {
    console.error(err);
    err.code = 400;
    res.status(400).send(err);
  }
};

const login = async (req, res, next) => {
  const { password, email } = req.body;
  validateLogin(email);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      const err = new Error('User with this credential not found');
      err.conde = 404;
      throw err;
    }
    await validatePassword(password, user.password);
    const token = jwt.sign({ userId: user._id, email }, 'securetext', {
      expiresIn: '12h',
    });
    const loginUser = {
      userId: user._id,
      token,
      tokenExp: 12,
    };
    res.status(200).send(loginUser);
  } catch (err) {
    console.error(err);
    //throw err; - why should we throw here?
    res.send(err);
  }
};

module.exports = {
  deleteUser,
  getAllUsers,
  getUser,
  addVisitedRooms,
  registerPositiveTest,
  getVisitedRooms,
  login,
  createUser,
  deleteVisitedRooms,
};
