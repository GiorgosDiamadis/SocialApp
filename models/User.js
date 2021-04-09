const { model, Schema, Mongoose } = require("mongoose");

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String,
  born: String,
  livesIn: String,
  isFrom: String,
  graduatedAt: String,
  friends: [
    {
      username: String,
      id: { type: Schema.Types.ObjectId },
    },
  ],
});

module.exports = model("User", userSchema);
