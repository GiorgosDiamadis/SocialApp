import React, { useState } from "react";

import { Form } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import { COMMENT_POST } from "../util/graphql";
import ErrorsDisplay from "./ErrorsDisplay";
import CustomTextArea from "./CustomTextArea";
import { toggleVisibility } from "../util/dom";
export default function CommentForm({ postId }) {
  const idClass = "id" + postId;
  const commentSectionSelector = `.commentSection.${idClass}`;

  const [errors, setErrors] = useState({});
  const [values] = useState({
    postComment: "",
    ID: postId,
    commentID: "",
  });

  const [comment, { loading }] = useMutation(COMMENT_POST, {
    update() {
      values.postComment = "";

      toggleVisibility(commentSectionSelector, true);
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  return (
    <div>
      <Form
        className={"commentForm " + idClass + " " + (loading ? "loading" : "")}
        onSubmit={comment}
      >
        <CustomTextArea
          values={values}
          valueField="postComment"
          setErrors={setErrors}
          errors={errors}
          errorField="postComment"
          db_callback={comment}
          name="postComment"
          placeholder="Make a comment"
          rows={1}
        />
      </Form>
      <ErrorsDisplay errors={errors} />
    </div>
  );
}
