import React from "react";
import { Button, Card, CardMeta, Icon, Label } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  const likePost = () => {};
  const commentPost = () => {};

  return (
    <Card.Group>
      <Card fluid className="postCard">
        <Card.Content>
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
