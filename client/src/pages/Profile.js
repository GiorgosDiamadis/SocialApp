import React, { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";

import { AuthContext } from "../context/auth";
import { FETCH_POSTS } from "../util/graphql";

import PostCard from "../components/PostCard";

import { Card, Image, Grid, List, Button } from "semantic-ui-react";

import { FETCH_USER_INFO } from "../util/graphql";

export default function Profile(props) {
  const { user } = useContext(AuthContext);
  const { profileId } = useParams();
  const { loading, data: { getPosts: posts } = {} } = useQuery(FETCH_POSTS);
  const {
    loading: loadingInfo,
    data: { getUserInfo: userInfo } = {},
  } = useQuery(FETCH_USER_INFO, {
    variables: { ID: profileId },
  });

  var userPosts = {};

  if (posts) {
    userPosts = posts.filter((f) => f.username === user.username);
  }

  return (
    <div>
      <Card className="profile">
        <Image
          src="https://cdn.iconscout.com/icon/free/png-256/avatar-373-456325.png"
          size="medium"
          circular
          centered
        />
        <Card.Content>
          <div>
            <h2 className="page-title">{user.username}</h2>
          </div>
        </Card.Content>
        <Card.Content>
          <Grid>
            <Grid.Row>
              <Grid.Column width={8}>
                {" "}
                <h3 className="page-title">Personal details</h3>
                {loadingInfo ? (
                  <h4>Loading...</h4>
                ) : (
                  <Card.Group>
                    <Card fluid className="postCard">
                      <Card.Content>
                        <List>
                          <List.Item icon="user" content={user.username} />
                          <List.Item icon="mail" content={user.email} />
                          <List.Item
                            icon="calendar check outline"
                            content={"Joined in " + userInfo.createdAt}
                          />
                          <List.Item
                            icon="marker"
                            content={"Born at " + userInfo.born}
                          />
                          <List.Item
                            icon="marker"
                            content={"Lives in " + userInfo.livesIn}
                          />
                          <List.Item
                            icon="marker"
                            content={"Is from " + userInfo.isFrom}
                          />
                          <List.Item
                            icon="graduation cap"
                            content={"Graduated at " + userInfo.graduatedAt}
                          />
                        </List>
                      </Card.Content>
                      {user.id === profileId ? (
                        <Button
                          primary
                          onClick={() =>
                            props.history.push(`/profile/${user.id}/editInfo`)
                          }
                        >
                          Edit
                        </Button>
                      ) : (
                        ""
                      )}
                    </Card>
                  </Card.Group>
                )}
              </Grid.Column>
              <Grid.Column width={8}>
                <h3 className="page-title">Latest Posts</h3>
                {loading ? (
                  <h1>Loading...</h1>
                ) : (
                  userPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))
                )}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Card.Content>
      </Card>
    </div>
  );
}
