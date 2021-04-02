import React, { useContext, useState } from "react";
import { Button, Card, CardMeta, Icon, Label } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";
import { useMutation } from "@apollo/react-hooks";
import { DELETE_POST, FETCH_POSTS } from "../util/graphql";

export default function PostCard({ post }) {
  const ID = post.id;

  const [delPost] = useMutation(DELETE_POST, {
    update(proxy) {
      const data = proxy.readQuery({
        query: FETCH_POSTS,
      });

      proxy.writeQuery({
        query: FETCH_POSTS,
        data: {
          getPosts: data.getPosts.filter((p) => p.id !== ID),
        },
      });
    },
    variables: { ID },
  });
  const likePost = () => {};
  const commentPost = () => {};
  const deletePost = () => {
    delPost();
  };
  const { user } = useContext(AuthContext);
  return (
    <Card.Group>
      <Card fluid className="postCard">
        <Card.Content>
          {user ? (
            user.username === post.username ? (
              <Icon name="trash" onClick={deletePost} />
            ) : (
              ""
            )
          ) : (
            ""
          )}

          <Card.Header>{post.username}</Card.Header>
          <CardMeta as={Link} to={"/" + post.id}>
            {moment(post.createdAt.replace("T", " ")).fromNow()}
          </CardMeta>
          <Card.Description>{post.body}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Button as="div" labelPosition="right">
            <Button color="teal" basic onClick={likePost}>
              <Icon name="heart" />
            </Button>
            <Label as="a" basic color="teal" pointing="left">
              {post.likeCount}
            </Label>
          </Button>

          <Button as="div" labelPosition="right">
            <Button color="teal" basic onClick={commentPost}>
              <Icon name="comments" />
            </Button>
            <Label as="a" basic color="teal" pointing="left">
              {post.commentCount}
            </Label>
          </Button>
        </Card.Content>
      </Card>
    </Card.Group>
  );
}
