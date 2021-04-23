const chechAuth = require("../../utils/check-auth");
const Conversation = require("../../models/Conversation");
const { withFilter } = require("graphql-subscriptions");

var authUser = undefined;
const MESSAGE_SENT = "MESSAGE_SENT";

module.exports = {
  Query: {
    async getConversation(_, { username }, context) {
      authUser = chechAuth(context);

      const conversation = await Conversation.findOne({
        $and: [{ user0: authUser.username }, { user1: username }],
      });

      return conversation;
    },
  },
  Mutation: {
    async sendMessage(_, { username, body }, context) {
      authUser = chechAuth(context);

      const conversation = await Conversation.findOne({
        $and: [{ user0: authUser.username }, { user1: username }],
      });

      const message = {
        conversation: conversation._id,
        sender: authUser.username,
        body,
        createdAt: new Date().toISOString(),
      };

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
