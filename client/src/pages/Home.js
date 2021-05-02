import React, { useState, useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Divider, Form, Button, Grid, Image } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import PostCard from "../components/PostCard";
import ErrorsDisplay from "../components/ErrorsDisplay";
import CustomTextArea from "../components/CustomTextArea";
import MenuBar from "../components/MenuBar";
import "../Home.css";
import { AuthContext } from "../context/auth";
import ProfileCard from "../components/ProfileCard";
const { FETCH_POSTS, MAKE_POST, FETCH_USER_INFO } = require("../util/graphql");

const User = ({ user, profileInfo }) => (
  <div>
    <h2 className="page-title">Your profile card</h2>
    <Divider />
    <ProfileCard user={user} profileInfo={profileInfo} />
  </div>
);

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
    fetchPolicy: "cache-first",
  });

  const {
    loading: loadingInfo,
    data: { getUserInfo: profileInfo } = {},
  } = useQuery(FETCH_USER_INFO, {
    variables: { ID: user.id },
    fetchPolicy: "cache-and-network",
  });

  console.log(profileInfo);
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
          <Grid.Column
            width={4}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <MenuBar />
          </Grid.Column>
          <Grid.Column width={8}>
            <Form>
              <div className="makePostArea">
                <Image
                  src="https://customerthink.com/wp-content/uploads/pngtree-business-people-avatar-icon-user-profile-free-vector-png-image_4815126.jpg"
                  size="tiny"
                  rounded
                  className="makePostImage"
                />
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
              </div>
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
          <Grid.Column
            width={4}
            style={{
              display: "flex",
              justifyContent: "flex-start",
              flexDirection: "column",
            }}
          >
            <div className="stickyTop">
              {!loadingInfo && <User user={user} profileInfo={profileInfo} />}
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
}

export default Home;
