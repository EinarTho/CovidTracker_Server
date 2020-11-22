const db = require('../model/mongooseModel');

//name of this file should be  changed - feks users

const registerNewUser = (req, res) => {
  const entry = new db.employeeModel(req.body);
  entry.save(err => {
    if (err) return res.send(err);
    return res.send('Registered!');
  });
};

const getAllUsers = (req, res) => {
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

//what if a matching room is added after positive corona test?
const addVisitedRoom = (req, res) => {
  db.employeeModel.findOne({ id: req.body.employeeId }, (err, employee) => {
    if (err) return res.send(err);
    if (!employee) return res.send('no employee with that id!');
    employee.roomsVisited.push({
      room: req.body.room,
      date: new Date().toDateString(),
    });
    employee.save(err => {
      if (err) return res.send(err);
      return res.send(
        'Room added to employee with the following id: ' + req.body.employeeId
      );
    });
  });
};

const registerPositiveTest = (req, res) => {
  db.employeeModel.find({}, (err, employees) => {
    if (err) return res.send(err);
    db.employeeModel.findOne(
      { id: req.body.employeeId },
      (error, infectedEmployee) => {
        if (error) return res.send(error);
        const employeesInRisk = employees.filter(emp => {
          return (
            findMatchingEntries(
              emp.roomsVisited,
              infectedEmployee.roomsVisited
            ) && emp.id !== infectedEmployee.id
          );
        });
        res.send(employeesInRisk);
      }
    );
  });
};

const findMatchingEntries = (arr1, arr2) => {
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      console.log(arr1[i].room, arr2[j].room);
      if (arr1[i].room === arr2[j].room && arr1[i].date === arr2[j].date) {
        console.log('inside if');
        return true;
      }
    }
  }
  return false;
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

module.exports = {
  registerNewUser,
  getAllUsers,
  getUser,
  addVisitedRoom,
  registerPositiveTest,
  registerNewRoom,
  getAllRooms,
};
