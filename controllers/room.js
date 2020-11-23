const db = require('../model/mongooseModel');

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

const deleteRoom = (req, res) => {
  db.roomModel.deleteOne({ name: req.body.id }, (err, room) => {
    res.send(room);
  });
};

module.exports = {
  registerNewRoom,
  getAllRooms,
  deleteRoom,
};
