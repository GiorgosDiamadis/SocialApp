import React, { useState, useContext } from "react";
import MenuBar from "../components/MenuBar";
import { Divider, Form, Button, Grid, Image } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
import ProfileCard from "../components/ProfileCard";
import { useQuery, useMutation } from "@apollo/react-hooks";
const { ADD_FRIEND, MAKE_POST, FETCH_USER_INFO } = require("../util/graphql");

const User = ({ user, profileInfo }) => (
  <div>
    <h2 className="page-title">Your profile card</h2>
    <Divider />
    <ProfileCard user={user} profileInfo={profileInfo} />
  </div>
);
export default function Friends(props) {
  const { user } = useContext(AuthContext);
  const [addFriend] = useMutation(ADD_FRIEND);

  const {
    loading: loadingInfo,
    data: { getUserInfo: profileInfo } = {},
  } = useQuery(FETCH_USER_INFO, {
    variables: { ID: user.id },
    fetchPolicy: "cache-and-network",
  });
  console.log(profileInfo);
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
            <h2 className="page-title">Your friends</h2>
            <Divider />
            <Grid columns="3">
              <Grid.Row>
                {!loadingInfo &&
                  profileInfo.friends.map((fr) => (
                    <Grid.Column>
                      <ProfileCard user={user} profileInfo={fr} />
                      <div style={{ marginLeft: "75px" }}>
                        <Button
                          color="red"
                          content="Remove friend"
                          id="btn-remove"
                          onClick={() => {
                            addFriend({ variables: { profileId: fr.id } });
                            var g = document.querySelector(
                              `.profileCard.id${fr.id}`
                            );

                            g.style.display = "none";

                            g = document.querySelector("#btn-remove");
                            g.style.display = "none";
                          }}
                        />
                      </div>
                    </Grid.Column>
                  ))}
              </Grid.Row>
            </Grid>
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
