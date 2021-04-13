import React, { useContext, useState } from "react";

import {
  Button,
  Comment,
  Container,
  Popup,
  Loader,
  Icon,
} from "semantic-ui-react";
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
  const [delComment, { loading }] = useMutation(DELETE_COMMENT, {
    variables: values,
  });

  const deleteComment = () => {
    delComment();
  };
  console.log(loading);

  return (
    <Comment.Group>
      <Comment.Content>
        <div className="commentDiv">
          <Comment.Author
            className="comment-author"
            onClick={() => props.history.push(`/profile/${comment.user.id}`)}
          >
            {comment.user.username}
          </Comment.Author>
          <Comment.Metadata className="text-muted">
            <div>{moment(comment.createdAt.replace("T", " ")).fromNow()}</div>
          </Comment.Metadata>
          <Container>
            <Loader active={loading ? true : false} />
            <Comment.Text>{comment.body}</Comment.Text>
          </Container>
        </div>
        <div className="commentDiv options">
          <Comment.Actions>
            {comment.user.username === user.username && (
              <Comment.Action>
                <Popup
                  content={
                    <div className="options">
                      <div className="option" onClick={deleteComment}>
                        <Icon name="trash" />
                        <p>Delete</p>
                      </div>
                      <div className="option">
                        <Icon name="edit" />
                        <p>Edit</p>
                      </div>
                    </div>
                  }
                  on="click"
                  pinned
                  trigger={<Icon name="ellipsis horizontal" />}
                />
              </Comment.Action>
            )}
          </Comment.Actions>
        </div>
      </Comment.Content>
    </Comment.Group>
  );
}
