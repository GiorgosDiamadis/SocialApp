const { model, Schema } = require("mongoose");

const conversationSchema = new Schema({
  user0: String,
  user1: String,

  messages: [
    {
      sender: String,
      body: String,
      createdAt: String,
    },
  ],
});

module.exports = model("Conversation", conversationSchema);
