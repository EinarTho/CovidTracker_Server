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
  //this request needs employeeId, room, roomId - dont actullally need all three of these,
  //but will it actually be easier?
  db.employeeModel.findOne({ id: req.body.employeeId }, (err, employee) => {
    if (err) return res.send(err);
    if (!employee) return res.send('no employee with that id!');
    employee.roomsVisited.push(req.body.room);
    employee.save(err => {
      if (err) return res.send(err);
    });
  });

  db.roomModel.findOne({ id: req.body.roomId }, (err, room) => {
    if (err) return res.send(err);
    if (!room) return res.send('no room with that id!');
    room.visiters.push(req.body.employeeId);
    room.save(err => {
      if (err) return res.send(err);
    });
    return res.send('updated room entry');
  });
  //this is not very dry.? or maybe its fine-.
};

const registerNewRoom = (req, res) => {
  const newRoom = new db.roomModel(req.body);
  newRoom.save(err => {
    if (err) return res.send(err);
    return res.send('Room added');
  });
};

const getAllRooms = (req, res) => {
  db.roomModel.find({}, (err, rooms) => {
    if (err) return res.send(err);
    return res.send(rooms);
  });
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
  registerNewRoom,
  getAllRooms,
};
