const { model, Schema } = require("mongoose");

const commentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  body: String,
  createdAt: String,
});

module.exports = model("Comment", commentSchema);
