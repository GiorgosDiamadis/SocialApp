module.exports.registerInputValidation = (
  username,
  email,
  password,
  confimPassword
) => {
  errors = {};
  if (username.trim() === "") {
    errors.username = "Username can't be empty!";
  }

  if (email.trim() === "") {
    errors.email = "Email can't be empty!";
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = "Email must be a valid email address!";
    }
  }

  if (password === "") {
    errors.password = "Password can't be empty!";
  } else if (password != confimPassword) {
    errors.password = "Passwords don't match!";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.loginInputValidation = (username, password) => {
  errors = {};

  if (username.trim() === "") {
    errors.username = "Username can't be empty!";
  }

  if (password === "") {
    errors.password = "Password can't be empty!";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
