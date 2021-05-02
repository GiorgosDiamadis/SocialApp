const User = require("../../models/User");
const Conversation = require("../../models/Conversation");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const checkAuth = require("../../utils/check-auth");
const { POPULATE_FRIENDS } = require("../populates");
const {
  registerInputValidation,
  loginInputValidation,
} = require("../../utils/inputValidations");
const { SECRET_KEY } = require("../../config");
const { UserInputError } = require("apollo-server-errors");
const { mongoose } = require("mongoose");

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
      const user = await User.findById(userId).populate(POPULATE_FRIENDS);

      return user;
    },
    async getFriends(_, { userId }, context, info) {
      checkAuth(context);
      const user = await User.findById(userId).populate(POPULATE_FRIENDS);
      return user;
    },

    async searchUsers(_, { prefix }, context, info) {
      const user = checkAuth(context);
      const myname = user.username;

      const users = await User.find({
        $and: [
          { username: { $regex: `${prefix}` } },
          { username: { $ne: myname } },
        ],
      }).populate(POPULATE_FRIENDS);

      return users;
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

      newUser.born = "";
      newUser.livesIn = "";
      newUser.isFrom = "";
      newUser.graduatedAt = "";

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

      console.log(username, password);

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
      errors = {};
      const dateRegex = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
      if (born.trim() !== "" && !born.match(dateRegex)) {
        errors.born = "Wrong date format, date should be in DD/MM/YYYY format!";
        throw new UserInputError("Errors", { errors });
      }

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

      await user.save();

      return user;
    },
    async addFriend(_, { friendId }, context) {
      const user = checkAuth(context);
      const user_adds = await User.findById(user.id).populate(POPULATE_FRIENDS);
      const new_friend = await User.findById(friendId).populate(
        POPULATE_FRIENDS
      );

      const friend_index = user_adds.friends.findIndex(
        (friend) => friend.username === new_friend.username
      );

      const user_index = new_friend.friends.findIndex(
        (friend) => friend.username === user_adds.username
      );

      if (friend_index === -1) {
        user_adds.friends.push(new_friend);
        new_friend.friends.push(user_adds);

        const conversation = new Conversation({
          user0: user_adds.username,
          user1: new_friend.username,
          messages: [],
          channel: parseInt(Math.random() * 0xffffff, 10),
        });

        await conversation.save();
      } else {
        user_adds.friends.splice(friend_index, 1);
        new_friend.friends.splice(user_index, 1);

        const conversation = await Conversation.findOne({
          $or: [
            {
              $and: [{ user0: user.username }, { user1: new_friend.username }],
            },
            {
              $and: [{ user0: new_friend.username }, { user1: user.username }],
            },
          ],
        });

        await conversation.delete();
      }

      await user_adds.save();
      await new_friend.save();
      return user_adds;
    },
  },
};
