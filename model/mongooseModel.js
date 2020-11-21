const mongoose = require('mongoose');
const { Schema } = mongoose;

const connect = (password, dbName) => {
  const dbUrl = `mongodb+srv://Einar:${password}@cluster0.8zyic.mongodb.net/${dbName}?retryWrites=true&w=majority`;
  mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function () {
    console.log('connected!');
  });
};

//rooms visited will be an array of objects containing the room + time and date?

const employee = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  roomsVisited: Array,
});

//visiters will be and object per day, stored in an array,
const room = new Schema({
  id: { type: Number, require: true },
  name: { type: String, required: true }, //add an array here for custom message?
  visiters: Array,
});

const employeeModel = mongoose.model('Employee', employee);
const roomModel = mongoose.model('Room', room);

module.exports = {
  connect,
  employeeModel,
  roomModel,
};