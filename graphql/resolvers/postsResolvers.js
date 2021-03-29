const { AuthenticationError } = require("apollo-server-errors");
const Post = require("../../models/Post");
const chechAuth = require("../../utils/check-auth");
module.exports = {
  Query: {
    async getPosts() {
      const posts = Post.find({});
      return posts;
    },
    async getPost(parent, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Post not found!");
        }
      } catch (e) {
        throw new Error(e);
      }
    },
  },
  Mutation: {
    async createPost(_, { body }, context) {
      const user = chechAuth(context);
      try {
        const post = new Post({
          body,
          user: user.id,
          createdAt: new Date().toISOString(),
          username: user.username,
        });
        const newPost = post.save();

        return newPost;
      } catch (e) {
        throw new Error(e);
      }
    },
    async deletePost(_, { postId }, context) {
      const user = chechAuth(context);
      try {
        const post = await Post.findById(postId);
        if (post.username === user.username) {
          await post.delete();
          return "Post deleted";
        } else {
          throw new AuthenticationError("Action not allowed!");
        }
      } catch (e) {
        throw new Error(e);
      }
    },
  },
};
