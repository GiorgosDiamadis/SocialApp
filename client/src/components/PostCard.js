import React, { useContext, useState } from "react";

import {
  Button,
  Card,
  CardContent,
  CardMeta,
  Form,
  Icon,
  Label,
  TextArea,
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
  FETCH_POST,
} from "../util/graphql";
import ErrorsDisplay from "./ErrorsDisplay";
import PostComment from "./PostComment";
import Likes from "./Likes";
import CustomTextArea from "./CustomTextArea";

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

export default function PostCard({ props, post }) {
  //==========Variables========================
  const ID = post.id;

  const { user } = useContext(AuthContext);
  const idClass = "id" + ID;
  const commentCountSelector = `.ui.teal.left.pointing.basic.label.${idClass}.commentCount`;
  const likeCountSelector = `.ui.teal.left.pointing.basic.label.${idClass}.likeCount`;
  const commentSectionSelector = `.commentSection.${idClass}`;

  const [errors, setErrors] = useState({});
  const [values] = useState({
    postComment: "",
    ID: post.id,
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
    update() {},
    variables: values,
  });
  const [comment, { loading: commentProcessing }] = useMutation(COMMENT_POST, {
    update() {
      newComment = values.postComment;
      values.postComment = "";

      const commentCount = document.querySelector(commentCountSelector);
      commentCount.innerHTML = parseInt(commentCount.innerHTML) + 1;
      toggleVisibility(commentSectionSelector, true);
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });
  //=============================================================

  //==========Functions========================

  const onSubmit = () => {
    comment();
  };

  const hasLiked = () => {
    return (
      post.likes.findIndex((v) => v.user.username === user.username) !== -1
    );
  };

  const likePost = (event) => {
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
  const deletePost = (e) => {
    const post = e.target.parentNode.parentNode;
    post.remove();
    delPost();
  };

  //=============================================================
  return (
    <Card.Group className="postcard">
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
          <Card.Description className="text">{post.body}</Card.Description>
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
              className={idClass + " likeCount " + "loading"}
              pointing="left"
            >
              {post.likeCount}
            </Label>
          </Button>

          <Button as="div" labelPosition="right">
            <Button color="teal" basic>
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
            className={
              "commentForm " +
              idClass +
              " " +
              (commentProcessing ? "loading" : "")
            }
            onSubmit={onSubmit}
          >
            <CustomTextArea
              values={values}
              valueField="postComment"
              setErrors={setErrors}
              errors={errors}
              errorField="postComment"
              db_callback={onSubmit}
              name="postComment"
              placeholder="Make a comment"
              rows={1}
            />
          </Form>
          <ErrorsDisplay errors={errors} />
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
