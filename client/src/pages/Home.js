import React, { useContext, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Divider, Form, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import { AuthContext } from "../context/auth";
import PostCard from "../components/PostCard";

function Home(props) {
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    body: "",
  });

  const { user } = useContext(AuthContext);

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    makePost();
  };

  const { loading, data: { getPosts: posts } = {} } = useQuery(FETCH_POSTS);

  const [makePost] = useMutation(MAKE_POST, {
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS,
      });

      proxy.writeQuery({
        query: FETCH_POSTS,
        data: {
          getPosts: [result.data.createPost, ...data.getPosts],
        },
      });
      values.body = "";
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  return (
    <div>
      <Form onSubmit={onSubmit}>
        <Form.TextArea
          placeholder="What are you thinking?"
          value={values.body}
          onChange={onChange}
          label="Post"
          name="body"
        />
        <Button primary type="submit">
          Post
        </Button>
      </Form>
      <Divider />
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
}

const MAKE_POST = gql`
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

const FETCH_POSTS = gql`
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

export default Home;
