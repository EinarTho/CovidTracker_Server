const validator = require('validator');

exports.validateCreateUser = userInput => {
  const isValidEmail = validator.isEmail(userInput.email);
  const isValidFirstName = validator.isLength(userInput.firstName, { min: 3 });
  const isValidLastName = validator.isLength(userInput.lastName, { min: 3 });
  const isValidPassword = validator.isLength(userInput.password, { min: 8 });

  if (
    !isValidEmail ||
    !isValidFirstName ||
    !isValidLastName ||
    !isValidPassword
  ) {
    const err = new Error('Invalid credentials');
    err.code = 422;
    throw err;
  }
};

exports.validateLogin = email => {
  if (!validator.isEmail(email)) {
    const err = new Error('Invalid credentials.');
    err.code = 422;
    throw err;
  }
};
