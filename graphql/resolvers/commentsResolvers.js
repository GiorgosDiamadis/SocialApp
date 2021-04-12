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
module.exports = {
  Query: {},
  Mutation: {
    async makeComment(_, { postId, body }, context) {
      const authUser = chechAuth(context);
      const errors = {};

      if (body.trim() === "") {
        errors.postComment = "Your comment is empty!";

        throw new UserInputError("Empty comment", { errors });
      }

      const post = await Post.findById(postId)
        .populate(POPULATE_USER)
        .populate(POPULATE_COMMENT)
        .populate(POPULATE_LIKES);

      const user = await User.findById(authUser.id);
      if (post) {
        const comment = new Comment({
          body,
          user,
          createdAt: new Date().toISOString(),
        });

        post.comments.unshift(comment);

        await comment.save();
        await post.save();

        return post;
      } else {
        throw new UserInputError("Post does not exist!");
      }
    },
    async deleteComment(_, { postId, commentId }, context) {
      const authUser = chechAuth(context);
      try {
        const post = await Post.findById(postId)
          .populate(POPULATE_USER)
          .populate(POPULATE_COMMENT)
          .populate(POPULATE_LIKES);

        if (post) {
          const commentIndex = post.comments.findIndex(
            (x) => x._id == commentId
          );

          if (post.comments[commentIndex].user.username != authUser.username) {
            throw new AuthenticationError("Action not allowed!");
          }

          await Comment.findByIdAndDelete(post.comments[commentIndex].id);
          post.comments.splice(commentIndex, 1);
          await post.save();
          return post;
        } else {
          throw new UserInputError("Post does not exist!");
        }
      } catch (e) {
        throw new Error(e);
      }
    },
  },
};
