import React from "react";
import { Button, Icon, Label } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import { LIKE_POST } from "../util/graphql";
import Likes from "./Likes";

function seeLikesReducer(state, action) {
  switch (action.type) {
    case "close":
      return { open: false };
    case "open":
      return { open: true, size: action.size };
    default:
      throw new Error("Unsupported action...");
  }
}

export default function LikeButton({ id, likes, likeCount, user, props }) {
  const idClass = "id" + id;
  const likeCountSelector = `.ui.teal.left.pointing.basic.label.${idClass}.likeCount`;

  const [state, dispatch] = React.useReducer(seeLikesReducer, {
    open: false,
    size: undefined,
  });
  const { open, size } = state;

  const hasLiked = () => {
    return likes.findIndex((v) => v.user.username === user.username) !== -1;
  };

  const [like, { loading }] = useMutation(LIKE_POST, {
    variables: { postId: id },
  });

  const likePost = (event) => {
    if (!loading) {
      like();
      const likeButton = document.querySelector(
        `.ui.teal.button.${idClass}.like`
      );
      const likeCount = document.querySelector(likeCountSelector);
      likeCount.innerHTML =
        parseInt(likeCount.innerHTML) + (hasLiked() ? -1 : 1);
      likeButton.classList.contains("basic")
        ? likeButton.classList.remove("basic")
        : likeButton.classList.add("basic");
    }
  };

  return (
    <Button as="div" labelPosition="right">
      <Button
        color="teal"
        className={`like ${idClass}`}
        basic={!hasLiked()}
        onClick={likePost}
      >
        <Icon name="heart" />
      </Button>

      <Label
        as="a"
        className={`likeCount ${idClass}`}
        basic
        color="teal"
        pointing="left"
        onClick={() => dispatch({ type: "open", size: "tiny" })}
      >
        {likeCount}
      </Label>

      <div className={`likeSection ${idClass} invisible`}>
        <Likes
          likes={likes}
          dispatch={dispatch}
          open={open}
          props={props}
          size={size}
        />
      </div>
    </Button>
  );
}
