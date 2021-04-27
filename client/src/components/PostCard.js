import React, { useContext } from "react";

import { Button, Card, CardMeta, Icon } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";
import { useMutation } from "@apollo/react-hooks";
import { DELETE_POST, FETCH_POSTS } from "../util/graphql";
import PostComment from "./PostComment";
import CommentForm from "./CommentForm";
import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";
import "../PostCard.css";
export default function PostCard({ props, post }) {
  const postId = post.id;

  const { user } = useContext(AuthContext);
  const idClass = "id" + postId;

  const [delPost] = useMutation(DELETE_POST, {
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS,
      });

      proxy.writeQuery({
        query: FETCH_POSTS,
        data: {
          getPosts: data.getPosts.filter((p) => p.id !== postId),
        },
      });
    },
    variables: { ID: postId },
  });

  const deletePost = (e) => {
    delPost();
  };

  //=============================================================
  return (
    <Card.Group id="postcard">
      <Card fluid>
        <Card.Content>
          <Card.Header
            onClick={() => {
              props.history.push(`/profile/${post.user.id}`);
            }}
            className="profile-link"
          >
            <a>{post.user.username}</a>
          </Card.Header>
          <CardMeta id="timeCreated" as={Link} to={"/post/" + post.id}>
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
          {user ? (
            user.username === post.user.username ? (
              <Button color="red" onClick={deletePost}>
                Remove
              </Button>
            ) : (
              ""
            )
          ) : (
            ""
          )}
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
