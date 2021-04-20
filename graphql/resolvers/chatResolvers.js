const chechAuth = require("../../utils/check-auth");
const Message = require("../../models/Message");

var messages = [];
const MESSAGE_SENT = "MESSAGE_SENT";

module.exports = {
  Query: {
    async getMessages(_, { to }, context) {
      const authUser = chechAuth(context);

      messages = await Message.find({
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
      const authUser = chechAuth(context);
      const message = new Message({
        from: authUser.username,
        to,
        body,
        createdAt: new Date().toISOString(),
      });
      await message.save();
      messages.push(message);
      context.pubsub.publish(MESSAGE_SENT, { messages });
      return message;
    },
  },
  Subscription: {
    messages: {
      subscribe: (parent, args, { pubsub }) => {
        return pubsub.asyncIterator(MESSAGE_SENT);
      },
    },
  },
};
