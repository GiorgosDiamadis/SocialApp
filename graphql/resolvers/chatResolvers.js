module.exports = {
  Subscription: {
    messageSent: {
      // More on pubsub below
      subscribe: () => pubsub.asyncIterator(["MESSAGE_SENT"]),
    },
  },
};
