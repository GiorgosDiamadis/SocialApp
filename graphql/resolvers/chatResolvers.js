const chechAuth = require("../../utils/check-auth");
const Message = require("../../models/Message");

var messages = [];
const subscribers = [];
const onMessagesUpdates = (fn) => subscribers.push(fn);

module.exports = {
  Query: {
    async getMessages(_, __, context) {
      const authUser = chechAuth(context);

      messages = await Message.find({
        $or: [{ to: authUser.username }, { from: authUser.username }],
      }).sort({ createdAt: -1 });

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
      subscribers.forEach((fn) => fn());
      return message;
    },
  },
  Subscription: {
    messages: {
      subscribe: (parent, args, { pubsub }) => {
        const channel = Math.random.toString(36).slice(2, 15);
        onMessagesUpdates(() => pubsub.publish(channel, { messages }));
        return pubsub.asyncIterator(channel);
      },
    },
  },
};
