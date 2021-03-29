const { AuthenticationError, UserInputError } = require("apollo-server-errors");
const Post = require("../../models/Post");
const chechAuth = require("../../utils/check-auth");
module.exports = {
  Query: {},
  Mutation: {
    async makeComment(_, { postId, body }, context) {
      const user = chechAuth(context);

      try {
        if (body.trim() === "") {
          throw new UserInputError("Empty comment", {
            errors: {
              body: "Comments must have a body",
            },
          });
        }

        const post = await Post.findById(postId);
        if (post) {
          const comment = {};
          comment.body = body;
          comment.username = user.username;
          comment.createdAt = new Date().toISOString();

          post.comments.unshift(comment);

          await post.save();
          return post;
        } else {
          throw new UserInputError("Post does not exist!");
        }
      } catch (e) {
        throw new Error(e);
      }
    },
    async deleteComment(_, { postId, commentId }, context) {
      const user = chechAuth(context);
      try {
        const post = await Post.findById(postId);
        if (post) {
          const commentIndex = post.comments.findIndex(
            (x) => x._id == commentId
          );

          if (post.comments[commentIndex].username != user.username) {
            throw new AuthenticationError("Action not allowed!");
          }

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
