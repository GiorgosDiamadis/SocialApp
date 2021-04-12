const { AuthenticationError, UserInputError } = require("apollo-server-errors");
const Post = require("../../models/Post");
const User = require("../../models/User");
const Comment = require("../../models/Comment");
const Like = require("../../models/Like");

const {
  POPULATE_COMMENT,
  POPULATE_USER,
  POPULATE_LIKES,
} = require("../populates");

const chechAuth = require("../../utils/check-auth");
module.exports = {
  Query: {
    async getPosts() {
      const posts = await Post.find({})
        .populate(POPULATE_USER)
        .populate(POPULATE_COMMENT)
        .populate(POPULATE_LIKES)
        .sort({ createdAt: -1 });

      return posts;
    },
    async getPost(parent, { postId }) {
      try {
        const post = await Post.findById(postId)
          .populate(POPULATE_USER)
          .populate(POPULATE_COMMENT)
          .populate(POPULATE_LIKES);
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
        throw new UserInputError("Your post is empty", { errors });
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
        const post = await Post.findById(postId).populate(POPULATE_USER);

        if (post.user.username === user.username) {
          await post.delete();
          await Comment.deleteMany({ _id: { $in: post.comments } });
          await Like.deleteMany({ _id: { $in: post.likes } });

          return "Post deleted";
        } else {
          throw new AuthenticationError("Action not allowed!");
        }
      } catch (e) {
        throw new Error(e);
      }
    },
    async likePost(_, { postId }, context) {
      const authUser = chechAuth(context);

      const post = await Post.findById(postId)
        .populate(POPULATE_USER)
        .populate(POPULATE_COMMENT)
        .populate(POPULATE_LIKES);

      if (post) {
        const user_like_idx = post.likes.findIndex(
          (x) => x.user.username === authUser.username
        );

        const user = await User.findById(authUser.id);
        if (user_like_idx === -1) {
          const like = new Like({
            user,
            createdAt: new Date().toISOString(),
          });
          post.likes.push(like);
          await like.save();
        } else {
          await Like.findByIdAndDelete(post.likes[user_like_idx].id);
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
