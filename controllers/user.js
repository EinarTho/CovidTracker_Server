const User = require('../model/user');
const findMatchingEntries = require('../utils/findMatch');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { validateCreateUser, validateLogin } = require('../utils/validateAuth');
const { validatePassword } = require('../utils/validatePassword');

const getUser = (req, res) => {
  console.log(req.params.id);
  User.find({ _id: req.params.id }, (err, user) => {
    if (user) {
      console.log(user);
      res.send(user);
    } else {
      res.send('No hits!');
    }
  });
};

const deleteUser = (req, res) => {
  console.log(req.body.users);
  const usersToBeDeleted = JSON.parse(req.body.users);
  User.deleteMany(
    {
      _id: {
        $in: usersToBeDeleted,
      },
    },
    err => {
      if (err) return res.status(415).send(err);
    }
  );
  res.status(200).send('Deleted users with the ids: ' + req.body.users);
};

const getAllUsers = (req, res) => {
  User.find({}, (err, employees) => {
    if (err) return res.status(500).send();
    res.status(200).send(employees);
  });
};

//what if a matching room is added after positive corona test?
//is there a problem in doing it like this?
//maybe more validation here
//need validation that room id exists
const addVisitedRooms = (req, res) => {
  const roomsToBeAdded = JSON.parse(req.body.rooms);
  console.log(roomsToBeAdded);
  if (!validateRoomArray(roomsToBeAdded)) {
    return res.status(415).send('Rooms in wrong format');
  }
  User.findOne({ _id: req.body._id }, (err, employee) => {
    if (err) return res.status(500).send(err);
    if (!employee) return res.send('no employee with that id!');
    employee.visits.push(...roomsToBeAdded);
    employee.save(err => {
      if (err) return res.send(err);
      return res
        .status(200)
        .send('Room added to employee with the following id: ' + req.body._id);
    });
  });
};

const validateRoomArray = roomArray => {
  for (let i = 0; i < roomArray.length; i++) {
    if (!roomArray[i].date || !roomArray[i].time || !roomArray[i].id) {
      return false;
    }
  }
  return true;
};

const getVisitedRooms = (req, res) => {
  User.findOne({ _id: req.body._id }, (err, user) => {
    if (err) return res.status(500).send(err);
    if (!user) return res.status(400).send('no user with that id!');
    res.status(200).send(user.visits);
  });
};

//red flag at the way in which I filter
const deleteVisitedRooms = (req, res) => {
  const roomsToBeDeleted = req.body.rooms;
  User.findOne({ _id: req.body._id }, (err, user) => {
    if (err) return res.status(500).send(err);
    if (!user) return res.status(400).send('No user with the provided id');
    const filteredRooms = user.visits.filter(
      room => !roomsToBeDeleted.includes(room.id)
    );
    user.visits = filteredRooms;
    console.log(user);
    user.save(err => {
      if (err) return res.status(500).send();
    });
  });
  res.status(200).send('you deleted some rooms');
};

const registerPositiveTest = (req, res) => {
  User.find({}, (err, users) => {
    if (err) return res.send(err);
    User.findOne({ id: req.body.employeeId }, (error, infectedUser) => {
      if (error) return res.send(error);
      const usersInRisk = users.filter(emp => {
        return (
          findMatchingEntries(
            JSON.parse(JSON.stringify(emp.visits)),
            JSON.parse(JSON.stringify(infectedUser.visits))
          ) && emp.id !== infectedUser.id
        );
      });
      console.log(usersInRisk);
      const usersToBeWarned = usersInRisk.map(user => user._id);
      console.log(usersToBeWarned);
      User.updateMany(
        {
          _id: {
            $in: usersToBeWarned,
          },
        },
        { inRisk: true },
        err => {
          if (err) return res.status(500).send(err);
          return res.send(usersInRisk);
        }
      );
    });
  });
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
