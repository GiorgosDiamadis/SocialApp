const chechAuth = require("../../utils/check-auth");
const Conversation = require("../../models/Conversation");
const { withFilter } = require("graphql-subscriptions");

var authUser = undefined;
const MESSAGE_SENT = "MESSAGE_SENT";
const newMessages = [];

module.exports = {
  Query: {
    async getConversation(_, { chatWith }, context) {
      authUser = chechAuth(context);

      const conversation = await Conversation.findOne({
        $or: [
          { $and: [{ user0: authUser.username }, { user1: chatWith }] },
          { $and: [{ user0: chatWith }, { user1: authUser.username }] },
        ],
      });

      return conversation;
    },
  },
  Mutation: {
    async sendMessage(_, { chatWith, body }, context) {
      authUser = chechAuth(context);

      const conversation = await Conversation.findOne({
        $or: [
          { $and: [{ user0: authUser.username }, { user1: chatWith }] },
          { $and: [{ user0: chatWith }, { user1: authUser.username }] },
        ],
      });

      const message = {
        conversation: conversation._id,
        sender: authUser.username,
        body,
        createdAt: new Date().toISOString(),
      };

      conversation.messages.push(message);

      await conversation.save();
      newMessages.push(message);

      context.pubsub.publish(MESSAGE_SENT, { messages: message });
      return message;
    },
  },
  Subscription: {
    messages: {
      subscribe: withFilter(
        (parent, args, { pubsub }) => {
          return pubsub.asyncIterator(MESSAGE_SENT);
        },
        (payload, variables) => {
          return payload.messages.conversation == variables.conversation;
        }
      ),
    },
  },
};
