import React from "react";
import PostCard from "../components/PostCard";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { Grid } from "semantic-ui-react";
import { FETCH_POST } from "../util/graphql";
export default function Post() {
  const { postId } = useParams();
  const { loading, data } = useQuery(FETCH_POST, {
    variables: { postId },
  });

  return (
    <div>
      <Grid>
        <Grid.Row>
          <Grid.Column width={4}></Grid.Column>

          <Grid.Column width={8}>
            {loading ? <h1>loading</h1> : <PostCard post={data.getPost} />}
          </Grid.Column>
          <Grid.Column width={4}></Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
}
