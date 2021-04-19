const { AuthenticationError, UserInputError } = require("apollo-server-errors");
const Post = require("../../models/Post");
const User = require("../../models/User");
const Comment = require("../../models/Comment");

const chechAuth = require("../../utils/check-auth");
const {
  POPULATE_COMMENT,
  POPULATE_USER,
  POPULATE_LIKES,
} = require("../populates");
const messages = [];

module.exports = {
  Query: {
    messages: () => messages,
  },
  Mutation: {
    sendMessage(_, { to, body }, context) {
      const authUser = chechAuth(context);

      const id = messages.length;
      const message = {
        id,
        from: authUser.username,
        to,
        body,
      };
      messages.push(message);
      return message;
    },
  },
};
