const { gql } = require("apollo-server");

module.exports = gql`
  type Like {
    id: ID!
    user: User!
    createdAt: String!
  }

  type Comment {
    id: ID!
    body: String!
    user: User!
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
  type Friend {
    id: ID!
    email: String
    username: String!
  }

  type User {
    id: ID!
    email: String!
    token: String
    username: String!
    createdAt: String!
    born: String!
    livesIn: String!
    isFrom: String!
    graduatedAt: String!
    friends: [Friend]!
  }

  type UserInfo {
    id: ID
    username: String
    email: String
    createdAt: String
    born: String
    livesIn: String
    isFrom: String
    graduatedAt: String
    friends: [Friend]
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
    getPosts: [Post]!
    getPost(postId: ID!): Post!
    getUserInfo(userId: ID!): UserInfo!
    getFriends(userId: ID!): UserInfo!
    searchUsers(prefix: String!): [User]
    getConversation(chatWith: String!): Conversation!
  }

  type Conversation {
    id: ID!
    user0: String!
    user1: String!
    channel: String!
    messages: [Message]
  }

  type Message {
    id: ID
    conversation: ID
    sender: String!
    body: String!
    createdAt: String!
  }

  type Mutation {
    loginUser(loginInput: LoginInput): User!
    registerUser(registerInput: RegisterInput): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    makeComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
    updatePersonalInfo(
      userId: ID!
      born: String!
      livesIn: String!
      isFrom: String!
      graduatedAt: String!
    ): UserInfo!

    editComment(commentId: ID!, body: String!): String!

    addFriend(friendId: ID!): UserInfo!
    sendMessage(chatWith: String!, body: String!): String!
  }

  type Subscription {
    messages(conversation: ID!, channel: String!): Message!
  }
`;
