const { model, Schema } = require("mongoose");

const postSchema = new Schema({
  body: String,
  user: {
    username: String,
    id: {
      type: Schema.Types.ObjectId,
    },
  },
  createdAt: String,
  comments: [
    {
      body: String,
      username: String,
      createdAt: String,
    },
  ],
  likes: [
    {
      username: String,
      createdAt: String,
    },
  ],
});

module.exports = model("Post", postSchema);
