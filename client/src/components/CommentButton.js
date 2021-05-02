import React from "react";
import { Button, Icon, Label } from "semantic-ui-react";

import { toggleVisibility } from "../util/dom";
export default function CommentButton({ idClass, post }) {
  const commentSectionSelector = `.commentSection.${idClass}`;

  return (
    <Button as="div" labelPosition="right">
      <Button
        color="blue"
        onClick={() => toggleVisibility(commentSectionSelector, false)}
      >
        <Icon name="comments" />
      </Button>
      <Label
        as="a"
        basic
        color="blue"
        className={idClass + " commentCount"}
        // pointing="left"
      >
        {post.commentCount}
      </Label>
    </Button>
  );
}
