const app = require('./app');
const connect = require('./model/connect');
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 8080;
app.listen(port, () => {
  connect(process.env.DB_PASSWORD, 'pepper');
  console.log(`your server is flying 🚀 on port ${port}`);
});
