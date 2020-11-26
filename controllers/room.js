const Room = require('../model/room');

//where do I check if the person is logged in? Must be in the request, if token is valid..

const createRooms = (req, res) => {
  if (!req.body.rooms) {
    return res.status(415).send('Invalid content'); //is this the right statuscode?
  }
  const roomArray = req.body.rooms;
  roomArray.forEach(room => {
    const newRoom = new Room(room);
    newRoom.save(err => {
      if (err) return res.status(500).send(err);
    });
  });
  return res.status(200).send('Room added');
};

const getAllRooms = (req, res) => {
  Room.find({}, (err, rooms) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(rooms);
  });
};

const deleteRooms = (req, res) => {
  if (!req.body.rooms) return res.status(415).send('invalid content');
  const roomsToBeUpdated = req.body.rooms;
  roomsToBeUpdated.forEach(room => {
    Room.deleteOne({ _id: room._id }, (err, room) => {
      res.status(200).send(room);
    });
  });
};

//need more validation here
const updateRooms = (req, res) => {
  if (!req.body.rooms) return res.status(415).send('invalid content');
  const roomsToBeUpdated = req.body.rooms;
  roomsToBeUpdated.forEach(err, room => {
    if (err) return res.status(500).send(err);
    Room.findOneAndUpdate({ _id: room._id }, room);
  });
  res.status(200).send('updated room! :)');
};

module.exports = {
  createRooms,
  getAllRooms,
  deleteRooms,
  updateRooms,
};
