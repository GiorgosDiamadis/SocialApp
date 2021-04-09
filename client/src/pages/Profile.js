import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/react-hooks";

import { AuthContext } from "../context/auth";
import { FETCH_POSTS } from "../util/graphql";
import ProfileCard from "../components/ProfileCard";
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
    variables: { profileId },
    refetchQueries: [{ query: GET_FRIENDS, variables: { ID: user.id } }],
  });

  console.log(friends);
  const isFriend = () => {
    return (
      friends.friends.findIndex(
        (fr) => fr.username === profileInfo.username
      ) !== -1
    );
  };

  return (
    <div>
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}></Grid.Column>
          <Grid.Column width={7}>
            <h3 className="page-title">Latest Posts</h3>
            {loadingInfo || loading ? (
              <h1>Loading...</h1>
            ) : (
              posts
                .filter((post) => post.user.username === profileInfo.username)
                .map((post) => <PostCard key={post.id} post={post} />)
            )}
          </Grid.Column>
          <Grid.Column width={5}>
            {" "}
            <h3 className="page-title">Personal details</h3>
            {loadingInfo ? (
              <h4>Loading...</h4>
            ) : (
              <div>
                <Card.Group>
                  <Card fluid className="postCard">
                    <Image
                      src="https://cdn.iconscout.com/icon/free/png-256/avatar-373-456325.png"
                      size="medium"
                      circular
                      centered
                    />
                    <a
                      onClick={() => addFriend()}
                      className="page-title add-remove-friend"
                    >
                      {user.id !== profileId ? (
                        loadingFriends ? (
                          <h4>Loading...</h4>
                        ) : isFriend() ? (
                          "Remove Friend"
                        ) : (
                          "Add Friend"
                        )
                      ) : (
                        ""
                      )}
                    </a>
                    <Card.Content>
                      <List>
                        <List.Item icon="user" content={profileInfo.username} />
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
                <h3 className="page-title">Friends</h3>
                {loadingFriends ? (
                  <h1>Loading...</h1>
                ) : (
                  <ProfileCard key={"profile"} friends={profileInfo.friends} />
                )}
              </div>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
}
