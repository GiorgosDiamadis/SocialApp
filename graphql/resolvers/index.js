const postsResolvers = require("./postsResolvers");
const usersResolvers = require("./usersResolvers");
const commentsResolvers = require("./commentsResolvers");
const chatResolvers = require("./chatResolvers");

module.exports = {
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
  },
  Query: {
    ...postsResolvers.Query,
    ...usersResolvers.Query,
    ...commentsResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentsResolvers.Mutation,
  },
};
