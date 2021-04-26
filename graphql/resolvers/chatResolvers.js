const chechAuth = require("../../utils/check-auth");
const Conversation = require("../../models/Conversation");
const { withFilter } = require("graphql-subscriptions");

var authUser = undefined;
var CHANNEL = "";

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
        channel: conversation.channel,
        sender: authUser.username,
        body,
        createdAt: new Date().toISOString(),
      };

      conversation.messages.push(message);

      await conversation.save();

      context.pubsub.publish(conversation.channel, { messages: message });
      return "";
    },
  },
  Subscription: {
    messages: {
      subscribe: withFilter(
        (parent, args, { pubsub }) => {
          return pubsub.asyncIterator(args.channel);
        },
        (payload, variables) => {
          return (
            payload.messages.conversation == variables.conversation &&
            payload.messages.channel == variables.channel
          );
        }
      ),
    },
  },
};
