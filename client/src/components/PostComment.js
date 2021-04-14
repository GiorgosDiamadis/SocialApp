import React, { useContext, useState } from "react";

import {
  Button,
  Comment,
  Container,
  Popup,
  Loader,
  Icon,
  Form,
} from "semantic-ui-react";
import CustomTextArea from "./CustomTextArea";
import moment from "moment";
import { AuthContext } from "../context/auth";
import { useMutation } from "@apollo/react-hooks";
import { DELETE_COMMENT, UPDATE_COMMENT } from "../util/graphql";
import ErrorsDisplay from "./ErrorsDisplay";

export default function PostComment({ comment, ID, props }) {
  const { user } = useContext(AuthContext);
  const idclass = "a" + ID;
  const [values] = useState({
    ID: ID,
    commentId: comment.id,
    body: comment.body,
  });

  const [errors, setErrors] = useState({});

  const [delComment, { loading }] = useMutation(DELETE_COMMENT, {
    variables: values,
  });

  const [editComment, { loading: updatingComment }] = useMutation(
    UPDATE_COMMENT,
    {
      update(proxy, result) {
        const oldbody = document.querySelector(`.text.${idclass}`);
        oldbody.innerHTML = result.data.editComment;
      },
      variables: values,
      onError(err) {
        setErrors(err.graphQLErrors[0].extensions.exception.errors);
      },
    }
  );

  const showEditForm = (active) => {
    const form = document.getElementById(`Edit ${idclass}`);
    const comment = document.getElementById(`comment ${idclass}`);
    if (active) {
      form.classList.remove("invisible");
      comment.classList.add("invisible");
    } else {
      form.classList.add("invisible");
      comment.classList.remove("invisible");
    }

    const popup = document.querySelector(".ui.top.left.popup");
    if (popup) {
      popup.remove();
    }
  };

  const onSubmit = () => {
    editComment();
    showEditForm(false);
  };

  return (
    <div>
      <Loader active={loading ? true : false} />

      <Comment.Group>
        <Comment.Content>
          <div className="commentDiv">
            <div id={`comment ${idclass}`}>
              <Comment.Author
                className="comment-author"
                onClick={() =>
                  props.history.push(`/profile/${comment.user.id}`)
                }
              >
                {comment.user.username}
              </Comment.Author>
              <Comment.Metadata className="text-muted">
                <div>
                  {moment(comment.createdAt.replace("T", " ")).fromNow()}
                </div>
              </Comment.Metadata>
              <Container>
                <Comment.Text className={`${idclass}`}>
                  {comment.body}
                </Comment.Text>
              </Container>
            </div>
            <div id={`Edit ${idclass}`} className={`invisible`}>
              <Form onSubmit={onSubmit}>
                <CustomTextArea
                  values={values}
                  valueField="body"
                  setErrors={setErrors}
                  errors={errors}
                  errorField="body"
                  db_callback={onSubmit}
                  name="body"
                  placeholder={values.body}
                  rows={1}
                />
              </Form>
              <ErrorsDisplay errors={errors} />
            </div>
          </div>

          <div className="commentDiv options">
            <Comment.Actions>
              {comment.user.username === user.username && (
                <Comment.Action>
                  <Popup
                    content={
                      <div className="options">
                        <div className="option" onClick={() => delComment()}>
                          <Icon name="trash" />
                          <p>Delete</p>
                        </div>
                        <div
                          className="option"
                          onClick={() => showEditForm(true)}
                        >
                          <Icon name="edit" />
                          <p>Edit</p>
                        </div>
                      </div>
                    }
                    className="popup"
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
    </div>
  );
}
