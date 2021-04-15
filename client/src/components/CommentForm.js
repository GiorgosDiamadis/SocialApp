import React, { useState } from "react";

import { Form } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import { COMMENT_POST, FETCH_POST } from "../util/graphql";
import ErrorsDisplay from "./ErrorsDisplay";
import CustomTextArea from "./CustomTextArea";

export default function CommentForm({ postId }) {
  const idClass = "id" + postId;
  const commentSectionSelector = `.commentSection.${idClass}`;

  const [errors, setErrors] = useState({});
  const [values] = useState({
    postComment: "",
    ID: postId,
    commentID: "",
  });

  const toggleVisibility = (selector, visibility = undefined) => {
    const element = document.querySelector(selector);
    if (!visibility) {
      element.classList.contains("invisible")
        ? element.classList.remove("invisible")
        : element.classList.add("invisible");
    } else {
      element.classList.remove("invisible");
    }
  };
  const [comment] = useMutation(COMMENT_POST, {
    update(cache, result) {
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
        className={"commentForm " + idClass + " " + (false ? "loading" : "")}
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
