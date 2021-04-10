import React from "react";
import { Button, Modal } from "semantic-ui-react";
export default function Likes({ likes, dispatch, open, size, props }) {
  return (
    <Modal size={size} open={open} onClose={() => dispatch({ type: "close" })}>
      <Modal.Header>Likes</Modal.Header>
      <Modal.Content>
        {likes.map((like) => (
          <a
            key={like.id}
            onClick={() => props.history.push(`/profile/${like.user.id}`)}
          >
            {like.user.username}
          </a>
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
