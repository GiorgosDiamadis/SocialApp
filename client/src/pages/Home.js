import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Divider, Form, Button, Grid } from "semantic-ui-react";
import { useMutation, useSubscription } from "@apollo/react-hooks";
import PostCard from "../components/PostCard";
import ErrorsDisplay from "../components/ErrorsDisplay";

const { FETCH_POSTS, MAKE_POST, MESSAGES } = require("../util/graphql");

function Home(props) {
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    body: "",
  });

  function MessageSent({ from, to, body }) {
    const {
      data: { messageSent },
      loading,
    } = useSubscription(MESSAGES, { variables: { from, to, body } });
    return <h4>New comment: {!loading && messageSent.body}</h4>;
  }

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
      <Grid>
        <Grid.Row>
          <Grid.Column width={5}> </Grid.Column>

          <Grid.Column width={6}>
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
            <ErrorsDisplay errors={errors} />
            <Divider />

            {loading ? (
              <h1>Loading...</h1>
            ) : (
              posts.map((post) => (
                <PostCard
                  props={props}
                  key={post.id}
                  post={post}
                  single={false}
                />
              ))
            )}
          </Grid.Column>
          <Grid.Column width={2}></Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
}

export default Home;
