const db = require('../model/mongooseModel');

const registerNewUser = (req, res) => {
  const entry = new db.employeeModel(req.body);
  entry.save(err => {
    if (err) return res.send(err);
    return res.send('Registered!');
  });
};

const getAllUsers = res => {
  db.employeeModel.find({}, (err, employees) => {
    res.send(employees);
  });
};

const getUser = (req, res) => {
  console.log(req.params.id);
  db.employeeModel.find({ id: req.params.id }, (err, employee) => {
    if (employee.length > 0) {
      res.send(employee);
    } else {
      res.send('No hits!');
    }
  });
};

const addVisitedRoom = (req, res) => {
  //this is going to be a post request with both a user id as well as a room id
  //is there a better way?
  //if corona, you will look at all the rooms that that person visited
  //the person id will be added to a list in the releevant room
  //all the the people in a room where the id is present will be warned.
  //dont actually think there needs to be a list of all the rooms the individual visited?
  //maybe I do. Perhaps its easier to do warning that way
  db.employeeModel.find({ id: req.body.employeeId }, (err, employee) => {
    if (err) return res.send(err);
    employee.roomsVisited.push(req.body.roomId);
    employee.save(err => {
      if (err) return res.send(err);
    });
  });

  db.roomModel.find({ id: req.body.roomId }, (err, room) => {
    if (err) return res.send(err);
    room.visiters.push(req.employeeId);
    room.save(err => {
      if (err) return res.send(err);
    });
    return res.send('updated room entry');
  });
  //this is not very dry.? or maybe its fine-.
};

const registerPositiveTest = (req, res) => {
  //id of employee with positive test here
  //should return a list of everyone who was in contact.
};

module.exports = {
  registerNewUser,
  getAllUsers,
  getUser,
  addVisitedRoom,
  registerPositiveTest,
};
