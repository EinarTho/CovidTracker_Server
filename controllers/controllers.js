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

module.exports = {
  registerNewUser,
  getAllUsers,
  getUser,
};
