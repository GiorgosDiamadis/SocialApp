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
    user: User!
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
  }

  type UserInfo {
    username: String!
    email: String!
    createdAt: String!
    born: String!
    livesIn: String!
    isFrom: String!
    graduatedAt: String!
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
    getUserInfo(userId: ID!): UserInfo
  }

  type Mutation {
    loginUser(loginInput: LoginInput): User!
    registerUser(registerInput: RegisterInput): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    makeComment(postId: ID!, body: String!): Post
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
    updatePersonalInfo(
      userId: ID!
      born: String!
      livesIn: String!
      isFrom: String!
      graduatedAt: String!
    ): UserInfo!
  }
`;
