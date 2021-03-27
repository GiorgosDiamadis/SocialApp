const Post = require("../../models/Post");

module.exports = {
  Query: {
    async getPosts() {
      const posts = Post.find({});
      return posts;
    },
  },
};
