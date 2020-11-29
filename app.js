const express = require('express');
const app = express();
const router = require('./routes/routes');
const jwt = require('jsonwebtoken');
const User = require('./model/user');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(async (req, res, next) => {
  if (req.headers['x-access-token']) {
    const accessToken = req.headers['x-access-token'];
    const { userId, exp } = await jwt.verify(
      accessToken,
      process.env.JWT_SECRET
    );
    console.log(userId, exp);
    // Check if token has expired
    if (exp < Date.now().valueOf() / 1000) {
      return res.status(401).json({
        error: 'JWT token has expired, please login to obtain a new one',
      });
    }
    res.locals.loggedInUser = await User.findById(userId);
    next();
  } else {
    next();
  }
});

app.use('/api/', router);
module.exports = app;
