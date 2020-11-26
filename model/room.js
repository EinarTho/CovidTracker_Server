const mongoose = require('mongoose');
const { Schema } = mongoose;
const room = new Schema({
  roomId: {
    type: Number,
    require: true
  },
  name: {
    type: String,
    required: true
  },
  floor: {
    type: String,
    required: true
  }
});

const roomModel = mongoose.model('Room', room);

module.exports = roomModel;
