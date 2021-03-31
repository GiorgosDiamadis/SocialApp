const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  registerInputValidation,
  loginInputValidation,
} = require("../../utils/inputValidations");
const { SECRET_KEY } = require("../../config");
const { UserInputError } = require("apollo-server-errors");
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
};

module.exports = {
  Query: {},
  Mutation: {
    async registerUser(
      _,
      { registerInput: { username, email, password, confirmPassword } },
      context,
      info
    ) {
      const { errors, valid } = registerInputValidation(
        username,
        email,
        password,
        confirmPassword
      );

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("Username is taken!", {
          errors: {
            username: "Username is taken!",
          },
        });
      }

      password = await bcrypt.hash(password, 12);
      const createdAt = new Date().toISOString();

      const newUser = new User({ username, password, email, createdAt });
      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
    async loginUser(_, { loginInput: { username, password } }, context, info) {
      const { errors, valid } = loginInputValidation(username, password);

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({ username });

      if (!user) {
        errors.loginError = "Wrong credentials!";
        throw new UserInputError("Error", {
          errors,
        });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.loginError = "Wrong credentials!";
        throw new UserInputError("Error", { errors });
      }
      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
  },
};
