const { AuthenticationError, UserInputError } = require("apollo-server-errors");
const Post = require("../../models/Post");
const User = require("../../models/User");
const Comment = require("../../models/Comment");

const chechAuth = require("../../utils/check-auth");
const {
  POPULATE_COMMENT,
  POPULATE_USER,
  POPULATE_LIKES,
} = require("../populates");

module.exports = {};
