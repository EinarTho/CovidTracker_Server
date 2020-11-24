const Room = require('../model/room');

const registerNewRoom = (req, res) => {
  const newRoom = new Room(req.body);
  newRoom.save(err => {
    if (err) return res.send(err);
    return res.send('Room added');
  });
};

const getAllRooms = (req, res) => {
  Room.find({}, (err, rooms) => {
    if (err) return res.send(err);
    return res.send(rooms);
  });
};

const deleteRoom = (req, res) => {
  Room.deleteOne({ name: req.body.id }, (err, room) => {
    res.send(room);
  });
};

const updateRoom = (req, res) => {};

module.exports = {
  registerNewRoom,
  getAllRooms,
  deleteRoom,
  updateRoom,
};
