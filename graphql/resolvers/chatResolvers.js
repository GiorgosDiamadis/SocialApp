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

module.exports = {
  Mutation: {
    sendMessage(_, { from, to, body }, context) {
      context.pubsub.publish("NEW_MESSAGE", {
        messageSent: { from, to, body },
      });
      return { from, to, body };
    },
  },
  Subscription: {
    messageSent: {
      subscribe: (_, args, { pubsub }) => pubsub.asyncIterator("NEW_MESSAGE"),
    },
  },
};
