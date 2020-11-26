const User = require('../model/user');
const findMatchingEntries = require('../utils/findMatch');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { validateCreateUser, validateLogin } = require('../utils/validateAuth');
const { validatePassword } = require('../utils/validatePAssword');

const getUser = (req, res) => {
  console.log(req.params.id);
  User.find({ id: req.params.id }, (err, employee) => {
    if (employee.length > 0) {
      res.send(employee);
    } else {
      res.send('No hits!');
    }
  });
};

const deleteUser = (req, res) => {
  User.deleteOne({ id: req.body.id }, (err, user) => {
    if (err) return res.send(err);
    if (!user) return res.send('no employee with that id!');
    return res.send('Deleted user with id: ' + req.body.id);
  });
};

const getAllUsers = (req, res) => {
  User.find({}, (err, employees) => {
    res.send(employees);
  });
};

//what if a matching room is added after positive corona test?
const addVisitedRoom = (req, res) => {
  User.findOne({ id: req.body.employeeId }, (err, employee) => {
    if (err) return res.send(err);
    if (!employee) return res.send('no employee with that id!');
    employee.visits.push({
      room: req.body.room,
      date: new Date().toDateString(),
      time: new Date().getHours() + new Date().getSeconds() / 60,
    });
    employee.save(err => {
      if (err) return res.send(err);
      return res.send(
        'Room added to employee with the following id: ' + req.body.employeeId
      );
    });
  });
};

const getVisitedRooms = (req, res) => {
  User.findOne({ id: req.body.employeeId }, (err, employee) => {
    if (err) return res.send(err);
    if (!employee) return res.send('no employee with that id!');
    res.send(employee.visits);
  });
};

const deleteVisitedRoom = (req, res) => {};

const registerPositiveTest = (req, res) => {
  User.find({}, (err, users) => {
    if (err) return res.send(err);
    User.findOne({ id: req.body.employeeId }, (error, infectedUser) => {
      if (error) return res.send(error);
      const usersInRisk = users.filter(emp => {
        return (
          findMatchingEntries(emp.visits, infectedUser.visits) &&
          emp.id !== infectedUser.id
        );
      });
      return res.send(usersInRisk);
    });
  });
};

const createUser = async (req, res, next) => {
  const { email, firstName, lastName, password, companyId } = req.body;
  validateCreateUser(req.body);

  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      const err = new Error('User already exists.');
      err.code = 400;
      throw err;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      companyId,
    });
    const savedUser = await user.save();
    res.status(200).send(savedUser);
  } catch (err) {
    console.error(err);
    throw err;
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
  addVisitedRoom,
  registerPositiveTest,
  getVisitedRooms,
  login,
  createUser,
  deleteVisitedRoom,
};
