const mongoose = require('mongoose');
const { Schema } = mongoose;
const room = new Schema({
  id: {
    type: Number,
    require: true
  },
  name: {
    type: String,
    required: true
  }, //add an array here for custom message?
});

const roomModel = mongoose.model('Room', room);

module.exports = roomModel;
