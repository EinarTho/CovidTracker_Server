const Room = require('../model/room');

//where do I check if the person is logged in? Must be in the request, if token is valid..
//need a validator for content

const createRooms = (req, res) => {
  const roomArray = JSON.parse(req.body.rooms);
  if (!roomArrayValidator(roomArray)) {
    return res.status(415).send('One of the rooms are in the wrong format');
  }
  Room.insertMany(roomArray, err => {
    if (err) res.status(500).send('Something went wrong, 500');
    return res.status(200).send('rooms added');
  });
};

const getAllRooms = (req, res) => {
  Room.find({}, (err, rooms) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(rooms);
  });
};

const deleteRooms = (req, res) => {
  const roomsToBeDeleted = JSON.parse(req.body.rooms);
  if (!roomsToBeDeleted) {
    return res.status(415).send('Invalid content'); //is this the right statuscode?
  }
  Room.deleteMany(
    {
      _id: {
        $in: roomsToBeDeleted,
      },
    },
    err => {
      if (err) return res.status(415).send(err);
    }
  );
  res.status(200).send('deleted');
};

//need more validation here
//is doing it like this problematic?
const updateRooms = (req, res) => {
  const roomsToBeUpdated = JSON.parse(req.body.rooms);
  if (!roomArrayValidator(roomsToBeUpdated)) {
    return res.status(415).send('invalid content');
  }
  for (let i = 0; i < roomsToBeUpdated.length; i++) {
    Room.findOneAndUpdate(
      { _id: roomsToBeUpdated[i]._id },
      roomsToBeUpdated[i],
      err => {
        if (err) return res.status(400).send(err);
      }
    );
  }
  res.status(200).send('updated room! :)');
};

const roomArrayValidator = roomArray => {
  console.log(roomArray);
  for (let i = 0; i < roomArray.length; i++) {
    if (!roomArray[i].floor || !roomArray[i].roomId || !roomArray[i].name) {
      console.log(roomArray[i], '-.');
      return false;
    }
  }
  return true;
};

module.exports = {
  createRooms,
  getAllRooms,
  deleteRooms,
  updateRooms,
};
