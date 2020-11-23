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
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  roomsVisited: Array,
  inRisk: Boolean,
});

//visiters will be and object per day, stored in an array,
const room = new Schema({
  id: { type: Number, require: true },
  name: { type: String, required: true }, //add an array here for custom message?
});

const employeeModel = mongoose.model('Employee', employee);
const roomModel = mongoose.model('Room', room);

module.exports = {
  connect,
  employeeModel,
  roomModel,
};
