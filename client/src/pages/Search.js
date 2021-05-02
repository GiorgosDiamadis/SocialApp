import React, { useState, useContext } from "react";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import {
  Divider,
  Form,
  Button,
  Grid,
  Image,
  Input,
  Icon,
} from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import PostCard from "../components/PostCard";
import ErrorsDisplay from "../components/ErrorsDisplay";
import CustomTextArea from "../components/CustomTextArea";
import MenuBar from "../components/MenuBar";
import "../Home.css";
import { AuthContext } from "../context/auth";
import ProfileCard from "../components/ProfileCard";
import SearchBar from "../components/SearchBar";

const {
  FETCH_POSTS,
  MAKE_POST,
  FETCH_USER_INFO,
  SEARCH_USERS,
} = require("../util/graphql");

const User = ({ user, profileInfo }) => (
  <div>
    <h2 className="page-title">Your profile card</h2>
    <Divider />
    <ProfileCard user={user} profileInfo={profileInfo} />
  </div>
);

export default function Search() {
  const { user } = useContext(AuthContext);
  const [state, setState] = useState({
    prefix: "",
  });

  let [searchUsers, { loading, data }] = useLazyQuery(SEARCH_USERS, {
    fetchPolicy: "no-cache",
  });

  const handleUserKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchUsers({ variables: { prefix: e.target.value } });
    }
  };

  const {
    loading: loadingInfo,
    data: { getUserInfo: profileInfo } = {},
  } = useQuery(FETCH_USER_INFO, {
    variables: { ID: user.id },
    fetchPolicy: "cache-and-network",
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
          <Grid.Column
            width={8}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <Input
              id="text-area"
              size="medium"
              icon="search"
              placeholder="Search..."
              onKeyPress={handleUserKeyPress}
            />
            <Divider />
            <Grid columns="3">
              <Grid.Row>
                {!loading &&
                  data &&
                  data.searchUsers.map((fr) => (
                    <Grid.Column>
                      <ProfileCard user={user} profileInfo={fr} />
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
