const bcrypt = require('bcrypt');

exports.validatePassword = async (inputPassword, dbPassword) => {
  const isSame = bcrypt.compare(inputPassword, dbPassword);
  if (!isSame) {
    const err = new Error('Incorrect password.');
    err.code = 404;
    throw err;
  }
};
