import React, { useContext, useState } from "react";

import { Comment, Container } from "semantic-ui-react";
import moment from "moment";
import { AuthContext } from "../context/auth";
import { useMutation } from "@apollo/react-hooks";
import { DELETE_COMMENT } from "../util/graphql";

export default function PostComment({ comment, ID }) {
  const { user } = useContext(AuthContext);

  const [values, setValues] = useState({
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
        <Comment.Author as="a">{comment.username}</Comment.Author>
        <Comment.Metadata className="text-muted">
          <div>{moment(comment.createdAt.replace("T", " ")).fromNow()}</div>
        </Comment.Metadata>
        <Comment.Text>
          <Container>{comment.body}</Container>
        </Comment.Text>
        <Comment.Actions>
          <Comment.Action>Reply </Comment.Action>
          {comment.username === user.username && (
            <Comment.Action onClick={deleteComment}>Delete</Comment.Action>
          )}
        </Comment.Actions>
        <Container>..Comments on this comment..</Container>
      </Comment.Content>
    </Comment.Group>
  );
}
