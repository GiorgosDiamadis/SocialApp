import React from "react";
import { Button, Modal } from "semantic-ui-react";
export default function Likes({ likes, dispatch, open, size }) {
  return (
    <Modal size={size} open={open} onClose={() => dispatch({ type: "close" })}>
      <Modal.Header>Likes</Modal.Header>
      <Modal.Content>
        {likes.map((like) => (
          <h1 key={like.id}>{like.username}</h1>
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
