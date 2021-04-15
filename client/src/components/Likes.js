import React from "react";
import { Button, Modal, List, Image } from "semantic-ui-react";
import moment from "moment";

export default function Likes({ likes, dispatch, open, size, props }) {
  return (
    <Modal size={size} open={open} onClose={() => dispatch({ type: "close" })}>
      <Modal.Header>Likes</Modal.Header>
      <Modal.Content>
        {likes.map((like) => (
          <List divided relaxed>
            <List.Item>
              <Image
                src="https://cdn.iconscout.com/icon/free/png-256/avatar-373-456325.png"
                size="mini"
                circular
                centered
              />
              <List.Content>
                <List.Header
                  as="a"
                  onClick={() => {
                    dispatch({ type: "close" });
                    props.history.push(`/profile/${like.user.id}`);
                  }}
                >
                  {like.user.username}
                </List.Header>
                <List.Description as="a">
                  {moment(like.createdAt.replace("T", " ")).fromNow()}
                </List.Description>
              </List.Content>
            </List.Item>
          </List>
        ))}
      </Modal.Content>
      <Modal.Actions>
        <Button positive onClick={() => dispatch({ type: "close" })}>
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
