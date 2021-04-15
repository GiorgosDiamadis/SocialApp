import React, { useContext } from "react";

import {
  Button,
  Card,
  CardContent,
  CardMeta,
  Icon,
  Label,
} from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";
import { useMutation } from "@apollo/react-hooks";
import { DELETE_POST, FETCH_POSTS } from "../util/graphql";
import PostComment from "./PostComment";
import CommentForm from "./CommentForm";
import Likes from "./Likes";
import LikeButton from "./LikeButton";

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
  const postId = post.id;

  const { user } = useContext(AuthContext);
  const idClass = "id" + postId;
  const commentSectionSelector = `.commentSection.${idClass}`;

  var newComment = "";

  const [delPost] = useMutation(DELETE_POST, {
    variables: { ID: postId },
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
          <LikeButton
            props={props}
            id={post.id}
            likeCount={post.likeCount}
            likes={post.likes}
            user={user}
          />

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

          <CommentForm postId={post.id} />
        </Card.Content>
        <div className={`commentSection ${idClass} invisible`}>
          {post.comments.map((comment) => (
            <PostComment
              key={comment.id}
              comment={comment}
              postId={postId}
              props={props}
            />
          ))}
        </div>
      </Card>
    </Card.Group>
  );
}
