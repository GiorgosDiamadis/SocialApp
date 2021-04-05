import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";

import { AuthContext } from "../context/auth";
import { FETCH_POSTS } from "../util/graphql";

import PostCard from "../components/PostCard";

import {
  Button,
  Card,
  CardContent,
  CardMeta,
  Form,
  Icon,
  Label,
  Container,
  Modal,
  Image,
  Grid,
  GridColumn,
} from "semantic-ui-react";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const { loading, data: { getPosts: posts } = {} } = useQuery(FETCH_POSTS);

  const userPosts = posts.filter((f) => f.username === user.username);

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
                <div>
                  <h3 className="page-title">Personal details</h3>
                </div>
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
