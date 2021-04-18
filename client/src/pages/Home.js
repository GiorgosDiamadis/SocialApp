import React, { useState, useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Divider, Form, Button, Grid } from "semantic-ui-react";
import { useMutation, useSubscription } from "@apollo/react-hooks";
import PostCard from "../components/PostCard";
import ErrorsDisplay from "../components/ErrorsDisplay";
import CustomTextArea from "../components/CustomTextArea";
import { AuthContext } from "../context/auth";
const { FETCH_POSTS, MAKE_POST, MESSAGES } = require("../util/graphql");

function Home(props) {
  const [errors, setErrors] = useState({});
  const { user } = useContext(AuthContext);

  const [values] = useState({
    body: "",
  });

  const onSubmit = (event) => {
    makePost();
  };

  const { loading, data: { getPosts: posts } = {} } = useQuery(FETCH_POSTS, {
    fetchPolicy: "cache-and-network",
  });

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
            <Form>
              <CustomTextArea
                values={values}
                valueField="body"
                setErrors={setErrors}
                errors={errors}
                errorField="body"
                db_callback={onSubmit}
                name="body"
                placeholder={`What are you thinking ${user.username}?`}
                rows={1}
              />
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
