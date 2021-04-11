import gql from "graphql-tag";

export const FETCH_POSTS = gql`
  {
    getPosts {
      id
      body
      createdAt
      user {
        username
        id
      }
      likeCount
      likes {
        id
        user {
          username
          id
        }
        createdAt
      }
      commentCount
      comments {
        id
        body
        user {
          username
          id
        }
        createdAt
      }
    }
  }
`;
export const FETCH_POST = gql`
  query getPost($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      user {
        username
        id
      }
      likeCount
      likes {
        id
        user {
          username
          id
        }
        createdAt
      }
      commentCount
      comments {
        id
        body
        user {
          username
          id
        }
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
      user {
        username
        id
      }
      createdAt
      comments {
        id
        body
        user {
          username
          id
        }
        createdAt
      }
      likes {
        id
        user {
          username
          id
        }
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
    }
  }
`;

export const LIKE_POST = gql`
  mutation likePost($ID: ID!) {
    likePost(postId: $ID) {
      id
      body
      user {
        username
        id
      }
      createdAt
      comments {
        id
        body
        user {
          username
          id
        }
        createdAt
      }
      likes {
        id
        user {
          username
          id
        }
        createdAt
      }
      likeCount
      commentCount
    }
  }
`;

export const COMMENT_POST = gql`
  mutation makeComment($ID: ID!, $postComment: String!) {
    makeComment(postId: $ID, body: $postComment) {
      id
      body
      user {
        username
        id
      }
      createdAt
      comments {
        id
        body
        user {
          username
          id
        }
        createdAt
      }
      likes {
        id
        user {
          username
          id
        }
        createdAt
      }
      likeCount
      commentCount
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation deleteComment($ID: ID!, $commentID: ID!) {
    deleteComment(postId: $ID, commentId: $commentID) {
      id
      body
      user {
        username
        id
      }
      createdAt
      comments {
        id
        body
        user {
          username
          id
        }
        createdAt
      }
      likes {
        id
        user {
          username
          id
        }
        createdAt
      }
      likeCount
      commentCount
    }
  }
`;

export const FETCH_USER_INFO = gql`
  query getUserInfo($ID: ID!) {
    getUserInfo(userId: $ID) {
      username
      email
      createdAt
      born
      livesIn
      isFrom
      graduatedAt
      friends {
        username
        id
      }
    }
  }
`;

export const UPDATE_PERSONAL_INFO = gql`
  mutation updatePersonalInfo(
    $userId: ID!
    $born: String!
    $livesIn: String!
    $isFrom: String!
    $graduatedAt: String!
  ) {
    updatePersonalInfo(
      userId: $userId
      born: $born
      livesIn: $livesIn
      isFrom: $isFrom
      graduatedAt: $graduatedAt
    ) {
      username
      email
      createdAt
      born
      livesIn
      isFrom
      graduatedAt
    }
  }
`;

export const ADD_FRIEND = gql`
  mutation addFriend($profileId: ID!) {
    addFriend(friendId: $profileId) {
      friends {
        username
        id
      }
    }
  }
`;

export const GET_FRIENDS = gql`
  query getFriends($ID: ID!) {
    getFriends(userId: $ID) {
      friends {
        username
        id
      }
    }
  }
`;

export const MESSAGES = gql`
  subscription messageSent($from: ID!, $to: ID!, $body: String!) {
    messageSent(from: $from, to: $to, body: $body) {
      from
      to
      body
    }
  }
`;
