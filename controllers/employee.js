const db = require('../model/mongooseModel');
const utils = require('../utils/employee');

const registerNewUser = (req, res) => {
  const entry = new db.employeeModel(req.body);
  entry.save(err => {
    if (err) return res.send(err);
    return res.send('Registered!');
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

const deleteUser = (req, res) => {
  db.employeeModel.deleteOne({ id: req.body.id }, (err, employee) => {
    if (err) return res.send(err);
    if (!employee) return res.send('no employee with that id!');
    return res.send('Deleted user with id: ' + req.body.id);
  });
};

const getAllUsers = res => {
  db.employeeModel.find({}, (err, employees) => {
    res.send(employees);
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
  db.employeeModel.findOne({ id: req.body.employeeId }, (err, employee) => {
    if (err) return res.send(err);
    if (!employee) return res.send('no employee with that id!');
    res.send(employee.roomsVisited);
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
            utils.findMatchingEntries(
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

module.exports = {
  deleteUser,
  registerNewUser,
  getAllUsers,
  getUser,
  addVisitedRoom,
  registerPositiveTest,
  getVisitedRooms,
};
