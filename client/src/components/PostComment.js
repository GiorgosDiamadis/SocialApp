import React, { useContext, useState } from "react";

import { Button, Comment, Container, Popup } from "semantic-ui-react";
import moment from "moment";
import { AuthContext } from "../context/auth";
import { useMutation } from "@apollo/react-hooks";
import { DELETE_COMMENT } from "../util/graphql";

export default function PostComment({ comment, ID, props }) {
  const { user } = useContext(AuthContext);

  const [values] = useState({
    ID: ID,
    commentID: comment.id,
  });
  const [delComment] = useMutation(DELETE_COMMENT, {
    variables: values,
  });

  const deleteComment = () => {
    delComment();
  };

  return (
    <Comment.Group>
      <Comment.Content>
        <Comment.Author
          className="comment-author"
          onClick={() => props.history.push(`/profile/${comment.user.id}`)}
        >
          {comment.user.username}
        </Comment.Author>
        <Comment.Metadata className="text-muted">
          <div>{moment(comment.createdAt.replace("T", " ")).fromNow()}</div>
        </Comment.Metadata>
        <Comment.Text>
          <Container>{comment.body}</Container>
        </Comment.Text>
      </Comment.Content>
      <Comment.Actions>
        {comment.user.username === user.username && (
          <Comment.Action>
            <Popup
              content={
                <div>
                  <Button
                    size="mini"
                    onClick={deleteComment}
                    // className="delete-comment-btn"
                    color="red"
                  >
                    Delete
                  </Button>
                  <Button
                    size="mini"
                    // className="delete-comment-btn"
                    color="blue"
                  >
                    Edit
                  </Button>
                </div>
              }
              on="click"
              pinned
              trigger={
                <Button
                  style={{ borderRadius: "15px", margin: "auto" }}
                  icon="ellipsis horizontal"
                />
              }
            />
          </Comment.Action>
        )}
      </Comment.Actions>
    </Comment.Group>
  );
}
