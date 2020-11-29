const mongoose = require('mongoose');
const { Schema } = mongoose;
const room = new Schema({
  roomId: { type: String, require: true },
  name: { type: String, required: true }, //add an array here for custom message?
  floor: { type: Number, required: true },
});

const roomModel = mongoose.model('Room', room);

module.exports = roomModel;
