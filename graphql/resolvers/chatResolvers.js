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
    async sendMessage(_, { to, body }, context) {
      authUser = chechAuth(context);
      const message = new Message({
        sender: authUser.username,
        receiver: to,
        body,
        createdAt: new Date().toISOString(),
      });
      await message.save();
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
        (payload, variables) => {}
      ),
    },
  },
};
