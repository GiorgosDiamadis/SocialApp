const { model, Schema } = require("mongoose");

const likeSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: String,
});

module.exports = model("Like", likeSchema);
