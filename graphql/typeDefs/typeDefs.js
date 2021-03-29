const { gql } = require("apollo-server");

module.exports = gql`
  type Like {
    id: ID!
    username: String!
    createdAt: String!
  }

  type Comment {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
  }

  type Post {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }

  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }

  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  input LoginInput {
    username: String!
    password: String!
  }

  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
    loginUser(loginInput: LoginInput): User!
  }

  type Mutation {
    registerUser(registerInput: RegisterInput): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    makeComment(postId: ID!, body: String!): Post
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
  }
`;
