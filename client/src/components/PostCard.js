import React, { useContext } from "react";

import { Card, CardMeta, Icon } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";
import { useMutation } from "@apollo/react-hooks";
import { DELETE_POST, FETCH_POSTS } from "../util/graphql";
import PostComment from "./PostComment";
import CommentForm from "./CommentForm";
import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";

export default function PostCard({ props, post }) {
  const postId = post.id;

  const { user } = useContext(AuthContext);
  const idClass = "id" + postId;

  const [delPost] = useMutation(DELETE_POST, {
    variables: { ID: postId },
  });

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
          <CommentButton idClass={idClass} post={post} props={props} />

          <CommentForm postId={post.id} />
        </Card.Content>
        <div className={`commentSection ${idClass} invisible`}>
          {post.comments.map((comment) => (
            <PostComment key={comment.id} comment={comment} postId={postId} />
          ))}
        </div>
      </Card>
    </Card.Group>
  );
}
