module.exports = {
  Subscription: {
    messageSent() {
      // More on pubsub below
      subscribe: (parent, args, { pubsub }) =>
        pubsub.asyncIterator(["MESSAGE_SENT"]);
    },
  },
};
