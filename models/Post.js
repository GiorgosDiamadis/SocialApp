const { model, Schema } = require("mongoose");

const postSchema = new Schema({
  body: String,
  user: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: String,
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Like",
    },
  ],
});

module.exports = model("Post", postSchema);
