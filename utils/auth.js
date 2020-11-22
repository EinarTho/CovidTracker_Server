const jwt = require('jsonwebtoken');
const createJWT = (email, userId, duration) => {
  const payload = {
    email,
    userId,
    duration,
  };
  return jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: duration,
  });
};

module.exports.createJWT = createJWT;
