const express = require('express');
const app = express();
const router = require('./routes/routes');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', router);
module.exports = app;
