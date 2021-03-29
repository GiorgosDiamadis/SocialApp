import React from "react";
import { Button, Card, CardMeta, Image } from "semantic-ui-react";
import moment from "moment";
export default function PostCard({ post }) {
  return (
    <Card.Group>
      <Card fluid>
        <Card.Content>
          <Card.Header>{post.username}</Card.Header>
          <CardMeta>
            {moment(post.createdAt.replace("T", " ")).fromNow()}
          </CardMeta>
          <Card.Description>{post.body}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <div className="ui two buttons">
            <Button basic color="green">
              Like
            </Button>
            <Button basic color="red">
              Comment
            </Button>
          </div>
        </Card.Content>
      </Card>
    </Card.Group>
  );
}
