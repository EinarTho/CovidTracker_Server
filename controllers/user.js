const User = require('../model/user');
const findMatchingEntries = require('../utils/findMatch');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validateRoomArray = require('../utils/validateRoomArray');

//change it to the body
const getUser = async (req, res) => {
  try {
    const user = await User.find({ _id: req.params.id });
    res.status(200).send(user);
  } catch (e) {
    //do validation in try
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
    res.status(500).send(e.message);
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
    const roomsToBeAdded = req.body.rooms;
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
    res.status(200).send(user.visits); //change this?
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
      {
        inRisk: true,
        dateOfContact: new Date().toDateString(),
      }
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

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

const createUser = async (req, res, next) => {
  console.log('about to  make a user!');
  try {
    const {
      email,
      firstName,
      lastName,
      password,
      companyId,
      floor,
      role,
    } = req.body;
    const existingUser = await User.findOne({ email: email });
    console.log(existingUser);
    if (existingUser) {
      throw new Error('A user with that email already exists');
    }
    console.log(req.body);
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      companyId,
      floor,
      role,
    });

    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      }
    );

    newUser.accessToken = accessToken;
    await newUser.save();
    res.json({
      data: newUser,
      accessToken,
    });
  } catch (error) {
    res.send(error.message);
  }
};

const login = async (req, res, next) => {
  try {
    console.log(req.body, 'lloooooooogin');
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(new Error('Email does not exist'));
    const validPassword = await validatePassword(password, user.password);
    if (!validPassword) return next(new Error('Password is not correct'));
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    await User.findByIdAndUpdate(user._id, { accessToken });
    res.status(200).json(user);
  } catch (error) {
    res.send(error.message);
  }
};

// Add this to the top of the file
const { roles } = require('../roles');

const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      const permission = roles.can(req.user.role)[action](resource);
      if (!permission.granted) {
        return res.status(401).json({
          error: "You don't have enough permissions to perform this action",
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

const allowIfLoggedin = async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser;
    if (!user)
      return res.status(401).json({
        error: 'You need to be logged in to access this route',
      });
    req.user = user;
    next();
  } catch (error) {
    next(error);
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
  allowIfLoggedin,
  grantAccess,
};
