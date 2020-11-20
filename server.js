const app = require('./app');
const db = require('./model/mongooseModel');
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 8080;
app.listen(port, () => {
  db.connect(process.env.DB_PASSWORD, 'pepper');
  console.log(`your server is flying 🚀 on port ${port}`);
});
