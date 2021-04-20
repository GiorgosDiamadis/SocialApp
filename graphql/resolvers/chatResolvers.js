const chechAuth = require("../../utils/check-auth");
const Message = require("../../models/Message");
const { withFilter } = require("graphql-subscriptions");

var authUser = undefined;
const MESSAGE_SENT = "MESSAGE_SENT";

module.exports = {
  Query: {
    async getMessages(_, { to }, context) {
      authUser = chechAuth(context);

      const messages = await Message.find({
        $or: [
          { $and: [{ to: authUser.username }, { from: to }] },
          { $and: [{ from: authUser.username }, { to: to }] },
        ],
      });

      return messages;
    },
  },
  Mutation: {
    async sendMessage(_, { to, body }, context) {
      authUser = chechAuth(context);
      const message = new Message({
        from: authUser.username,
        to,
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
        (payload, variables) => {
          console.log(authUser);
          console.log(payload);

          return (
            payload.messages.to === authUser.username ||
            payload.messages.from === authUser.username
          );
        }
      ),
    },
  },
};
