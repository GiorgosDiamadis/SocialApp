import React, { useContext, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Divider, Form, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import { AuthContext } from "../context/auth";
import PostCard from "../components/PostCard";
const { FETCH_POSTS, MAKE_POST } = require("../util/graphql");

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
          error={errors.body ? true : false}
        />
        <Button primary type="submit">
          Post
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((v) => (
              <li key={v}> {v}</li>
            ))}
          </ul>
        </div>
      )}
      <Divider />

      {loading ? (
        <h1>Loading...</h1>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
}

export default Home;
