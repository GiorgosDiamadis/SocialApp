import React, { useContext, useState } from "react";

import {
  Button,
  Card,
  CardContent,
  CardMeta,
  Form,
  Icon,
  Label,
} from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";
import { useMutation } from "@apollo/react-hooks";
import {
  DELETE_POST,
  FETCH_POSTS,
  LIKE_POST,
  COMMENT_POST,
} from "../util/graphql";

import PostComment from "./PostComment";
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

export default function PostCard({ props, post, single }) {
  //==========Variables========================
  const ID = post.id;
  console.log(typeof ID);
  const { user } = useContext(AuthContext);
  const idClass = "id" + ID;
  const newCommentDivSelector = `.newComment.${idClass}`;
  const commentCountSelector = `.ui.teal.left.pointing.basic.label.${idClass}.commentCount`;
  const likeCountSelector = `.ui.teal.left.pointing.basic.label.${idClass}.likeCount`;
  const commentFormSelector = `.ui.form.commentForm.${idClass}`;
  const commentSectionSelector = `.commentSection.${idClass}`;

  const [values, setValues] = useState({
    postComment: "",
    ID: ID,
    commentID: "",
  });

  const [state, dispatch] = React.useReducer(seeLikesReducer, {
    open: false,
    size: undefined,
  });
  const { open, size } = state;

  var newComment = "";
  //=============================================================

  //==========Mutations/Queries========================

  const [delPost] = useMutation(DELETE_POST, {
    update(proxy) {
      const data = proxy.readQuery({
        query: FETCH_POSTS,
      });

      proxy.writeQuery({
        query: FETCH_POSTS,
        data: {
          getPosts: data.getPosts.filter((p) => p.id !== ID),
        },
      });
    },
    variables: values,
  });

  const [like] = useMutation(LIKE_POST, {
    variables: values,
  });
  const [comment] = useMutation(COMMENT_POST, {
    update(proxy, result) {
      newComment = values.postComment;
      values.postComment = "";
      const newCommentDiv = document.querySelector(newCommentDivSelector);
      newCommentDiv.classList.remove("invisible");

      const commentCount = document.querySelector(commentCountSelector);
      newCommentDiv.innerHTML = "You just commented: " + newComment;
      commentCount.innerHTML = parseInt(commentCount.innerHTML) + 1;
      const form = document.querySelector(commentFormSelector);
      form.classList.add("invisible");
    },
    variables: values,
  });
  //=============================================================

  //==========Functions========================

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
    console.log(values);
  };

  const onSubmit = () => {
    comment();
  };

  const hasLiked = () => {
    return (
      post.likes.findIndex((v) => v.user.username === user.username) !== -1
    );
  };

  const likePost = (event) => {
    console.log(values);
    like();
    const likeButton = document.querySelector(
      `.ui.teal.button.${idClass}.like`
    );
    const likeCount = document.querySelector(likeCountSelector);
    likeCount.innerHTML = parseInt(likeCount.innerHTML) + (hasLiked() ? -1 : 1);
    likeButton.classList.contains("basic")
      ? likeButton.classList.remove("basic")
      : likeButton.classList.add("basic");
  };
  const toggleVisibility = (selector) => {
    const element = document.querySelector(selector);
    element.classList.contains("invisible")
      ? element.classList.remove("invisible")
      : element.classList.add("invisible");
  };
  const deletePost = () => {
    delPost();
  };

  //=============================================================
  return (
    <Card.Group>
      <Card fluid>
        <Card.Content>
          {user ? (
            user.username === post.user.username ? (
              <Icon name="trash" onClick={deletePost} />
            ) : (
              ""
            )
          ) : (
            ""
          )}

          <Card.Header
            onClick={() => {
              props.history.push(`/profile/${post.user.id}`);
            }}
            className="profile-link"
          >
            <a>{post.user.username}</a>
          </Card.Header>
          <CardMeta as={Link} to={"/post/" + post.id}>
            {moment(post.createdAt.replace("T", " ")).fromNow()}
          </CardMeta>
          <Card.Description>{post.body}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Button as="div" labelPosition="right">
            <Button
              color="teal"
              className={idClass + " like"}
              basic={!hasLiked()}
              onClick={likePost}
            >
              <Icon name="heart" />
            </Button>

            <Label
              as="a"
              basic
              color="teal"
              className={idClass + " likeCount"}
              pointing="left"
            >
              {post.likeCount}
            </Label>
          </Button>

          <Button as="div" labelPosition="right">
            <Button
              color="teal"
              basic
              onClick={() => toggleVisibility(commentFormSelector)}
            >
              <Icon name="comments" />
            </Button>
            <Label
              as="a"
              basic
              color="teal"
              className={idClass + " commentCount"}
              pointing="left"
            >
              {post.commentCount}
            </Label>
          </Button>

          <Form
            className={"commentForm " + idClass + " invisible"}
            onSubmit={onSubmit}
          >
            <Form.TextArea
              placeholder="Comment on this post?"
              name="postComment"
              value={values.postComment}
              onChange={onChange}
            />
            <Button primary type="submit">
              Comment
            </Button>
          </Form>

          <div>
            <a
              href={`post/${ID}`}
              className={"newComment " + idClass + " invisible"}
            ></a>
          </div>
        </Card.Content>
        <CardContent extra className="see-likes-comments">
          <a onClick={() => toggleVisibility(commentSectionSelector)}>
            Comments{" "}
          </a>
          <a onClick={() => dispatch({ type: "open", size: "tiny" })}>Likes</a>
        </CardContent>
        <div className={`commentSection ${idClass} invisible`}>
          {post.comments.map((comment) => (
            <PostComment
              key={comment.id}
              comment={comment}
              ID={ID}
              props={props}
            />
          ))}
        </div>
        <div className={`likeSection ${idClass} invisible`}>
          <Likes
            likes={post.likes}
            dispatch={dispatch}
            open={open}
            props={props}
            size={size}
          />
        </div>
      </Card>
    </Card.Group>
  );
}
