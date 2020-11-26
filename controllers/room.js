const Room = require('../model/room');
const roomArrayValidator = require('../utils/roomArrayValidator');

//where do to check if the person is logged in? Must be in the request, if token is valid..
//need a validator for content

const createRooms = async (req, res) => {
  try {
    const roomArray = JSON.parse(req.body.rooms);
    if (!roomArrayValidator(roomArray)) {
      return res.status(415).send('One of the rooms are in the wrong format');
    }
    await Room.insertMany(roomArray);
    return res.status(200).send('rooms added');
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const getAllRooms = async (req, res) => {
  try {
    const allRooms = await Room.find({});
    return res.status(200).send(allRooms);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const deleteRooms = async (req, res) => {
  try {
    const roomsToBeDeleted = JSON.parse(req.body.rooms);
    await Room.deleteMany({
      _id: {
        $in: roomsToBeDeleted,
      },
    });
    res.status(200).send('deleted');
  } catch (e) {
    res.status(500).send(e.message);
  }
};

//need more validation here
//is doing it like this problematic?
const updateRooms = async (req, res) => {
  try {
    const roomsToBeUpdated = JSON.parse(req.body.rooms);
    if (!roomArrayValidator(roomsToBeUpdated)) {
      return res.status(415).send('invalid content');
    }
    for (let i = 0; i < roomsToBeUpdated.length; i++) {
      await Room.findOneAndUpdate(
        { _id: roomsToBeUpdated[i]._id },
        roomsToBeUpdated[i]
      );
    }
    res.status(200).send('updated rooms! :)');
  } catch (e) {
    res.status(500).send(e.message);
  }
};

module.exports = {
  createRooms,
  getAllRooms,
  deleteRooms,
  updateRooms,
};
