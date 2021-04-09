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
  Query: {
    async getUserInfo(_, { userId }, context, info) {
      const user = await User.findById(userId);
      const username = user.username;
      const email = user.email;
      const createdAt = user.createdAt;
      const born = user.born ? user.born : "";
      const livesIn = user.livesIn ? user.livesIn : "";
      const isFrom = user.isFrom ? user.isFrom : "";
      const graduatedAt = user.graduatedAt ? user.graduatedAt : "";

      return {
        username,
        email,
        createdAt,
        born,
        livesIn,
        isFrom,
        graduatedAt,
      };
    },
  },
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
    async updatePersonalInfo(
      _,
      { userId, born, livesIn, isFrom, graduatedAt }
    ) {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          born: born,
          livesIn: livesIn,
          isFrom: isFrom,
          graduatedAt: graduatedAt,
        },
        { useFindAndModify: false }
      );

      errors = {};
      const dateRegex = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
      if (!born.match(dateRegex)) {
        errors.born = "Wrong date format, date should be in DD/MM/YYYY format!";
        throw new UserInputError("Errors", { errors });
      }
      await user.save();
      const userInfo = (({
        username,
        email,
        born,
        livesIn,
        isFrom,
        createdAt,
        graduatedAt,
      }) => ({
        username,
        email,
        born,
        livesIn,
        isFrom,
        graduatedAt,
        createdAt,
      }))(user);

      return userInfo;
    },
  },
};
