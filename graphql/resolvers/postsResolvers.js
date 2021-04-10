const { AuthenticationError, UserInputError } = require("apollo-server-errors");
const Post = require("../../models/Post");
const User = require("../../models/User");

const chechAuth = require("../../utils/check-auth");
module.exports = {
  Query: {
    async getPosts() {
      const posts = Post.find({})
        .populate({ path: "user", model: "User" })
        .sort({ createdAt: -1 });
      return posts;
    },
    async getPost(parent, { postId }) {
      try {
        const post = await Post.findById(postId).populate({
          path: "user",
          model: "User",
        });
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
      const authUser = chechAuth(context);
      errors = {};
      if (body.trim() === "") {
        errors.body = "Body can't be empty";
        throw new UserInputError("Body can't be empty", { errors });
      }
      try {
        const user = await User.findById(authUser.id);
        const post = new Post({
          body,
          user,
          createdAt: new Date().toISOString(),
        });
        const newPost = await post.save();

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
    async likePost(_, { postId }, context) {
      const user = chechAuth(context);

      const post = await Post.findById(postId).populate({
        path: "user",
        model: "User",
      });
      if (post) {
        const user_like_idx = post.likes.findIndex(
          (x) => x.username === user.username
        );

        if (user_like_idx === -1) {
          post.likes.push({
            username: user.username,
            createdAt: new Date().toISOString(),
          });
        } else {
          post.likes.splice(user_like_idx, 1);
        }
        await post.save();
        return post;
      } else {
        throw new UserInputError("Post not found!");
      }
    },
  },
};
