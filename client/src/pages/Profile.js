import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/react-hooks";

import { AuthContext } from "../context/auth";
import { FETCH_POSTS } from "../util/graphql";

import PostCard from "../components/PostCard";
import moment from "moment";
import { Card, Image, Grid, List, Button } from "semantic-ui-react";

import { FETCH_USER_INFO, ADD_FRIEND, GET_FRIENDS } from "../util/graphql";

export default function Profile(props) {
  const { user } = useContext(AuthContext);
  const { profileId } = useParams();

  const { loading, data: { getPosts: posts } = {} } = useQuery(FETCH_POSTS);

  const {
    loading: loadingInfo,
    data: { getUserInfo: profileInfo } = {},
  } = useQuery(FETCH_USER_INFO, {
    variables: { ID: profileId },
    fetchPolicy: "cache-and-network",
  });

  const {
    loading: loadingFriends,
    data: { getFriends: friends } = {},
  } = useQuery(GET_FRIENDS, {
    update() {},
    variables: { ID: user.id },
  });

  const [addFriend] = useMutation(ADD_FRIEND, {
    update(proxy, result) {
      const add_remove_friend = document.querySelector(
        ".page-title.add-remove-friend"
      );
    },
    variables: { profileId },
  });

  return (
    <div>
      <Card className="profile">
        <Image
          src="https://cdn.iconscout.com/icon/free/png-256/avatar-373-456325.png"
          size="medium"
          circular
          centered
        />
        <div></div>
        <Card.Content>
          <div>
            {loadingInfo ? (
              <h4>Loading...</h4>
            ) : (
              <div>
                <h2 className="page-title">{profileInfo.username}</h2>
                <a
                  onClick={() => addFriend()}
                  className="page-title add-remove-friend"
                >
                  {loadingFriends ? (
                    <h4>Loading...</h4>
                  ) : (
                    <h1>friends.friends[0].username</h1>
                  )}
                </a>
              </div>
            )}
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
                          <List.Item
                            icon="user"
                            content={profileInfo.username}
                          />
                          <List.Item icon="mail" content={profileInfo.email} />
                          <List.Item
                            icon="calendar check outline"
                            content={
                              "Joined in " +
                              moment(profileInfo.createdAt)
                                .utc()
                                .format("DD/MM/YYYY")
                            }
                          />
                          <List.Item
                            icon="marker"
                            content={"Born at " + profileInfo.born}
                          />
                          <List.Item
                            icon="marker"
                            content={"Lives in " + profileInfo.livesIn}
                          />
                          <List.Item
                            icon="marker"
                            content={"Is from " + profileInfo.isFrom}
                          />
                          <List.Item
                            icon="graduation cap"
                            content={"Graduated at " + profileInfo.graduatedAt}
                          />
                        </List>
                      </Card.Content>
                      {user.id === profileId ? (
                        <Button
                          primary
                          onClick={() =>
                            props.history.push({
                              pathname: `/profile/${user.id}/editInfo`,
                              state: { profileInfo, profileId },
                            })
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
                {loadingInfo || loading ? (
                  <h1>Loading...</h1>
                ) : (
                  posts
                    .filter(
                      (post) => post.user.username === profileInfo.username
                    )
                    .map((post) => <PostCard key={post.id} post={post} />)
                )}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Card.Content>
      </Card>
    </div>
  );
}
