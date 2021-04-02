import gql from "graphql-tag";

export const FETCH_POSTS = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        body
        username
        createdAt
      }
    }
  }
`;

export const MAKE_POST = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      username
      createdAt
      comments {
        id
        body
        username
        createdAt
      }
      likes {
        id
        username
        createdAt
      }
      likeCount
      commentCount
    }
  }
`;

export const DELETE_POST = gql`
  mutation deletePost($ID: ID!) {
    deletePost(postId: $ID)
  }
`;
export const REGISTER_USER = gql`
  mutation registerUser(
    $username: String!
    $password: String!
    $confirmPassword: String!
    $email: String!
  ) {
    registerUser(
      registerInput: {
        username: $username
        password: $password
        confirmPassword: $confirmPassword
        email: $email
      }
    ) {
      id
      email
      token
      username
      createdAt
    }
  }
`;
export const LOGIN_USER = gql`
  mutation loginUser($username: String!, $password: String!) {
    loginUser(loginInput: { username: $username, password: $password }) {
      id
      email
      token
      username
      createdAt
    }
  }
`;
