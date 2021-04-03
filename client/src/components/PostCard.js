import React, { useContext, useState } from "react";
import { Button, Card, CardMeta, Form, Icon, Label } from "semantic-ui-react";
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

export default function PostCard({ post }) {
  const ID = post.id;
  const { user } = useContext(AuthContext);
  var newComment = "";
  const idClass = "a" + ID;

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
    variables: { ID },
  });

  const [like] = useMutation(LIKE_POST, {
    variables: { ID },
  });
  const [values, setValues] = useState({
    postComment: "",
    ID: ID,
  });
  const [comment] = useMutation(COMMENT_POST, {
    update(proxy, result) {
      newComment = values.postComment;
      const newCommentDiv = document.querySelector(
        `.newComment.invisible.${idClass}`
      );
      newCommentDiv.classList.remove("invisible");
      console.log(newCommentDiv);

      newCommentDiv.innerHTML = "You just commented: " + `"${newComment}"`;
      const form = document.querySelector(`.ui.form.commentForm.${idClass}`);
      form.classList.add("invisible");
    },
    variables: values,
  });

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
    console.log(values);
  };

  const onSubmit = () => {
    comment();
  };

  const hasLiked = () => {
    return post.likes.findIndex((v) => v.username === user.username) != -1;
  };

  const likePost = (event) => {
    like();
    const likeButton = document.querySelector(".ui.teal.button");
    likeButton.classList.contains("basic")
      ? likeButton.classList.remove("basic")
      : likeButton.classList.add("basic");
  };
  const toggleCommentForm = () => {
    const form = document.querySelector(`.ui.form.commentForm.${idClass}`);
    form.classList.contains("invisible")
      ? form.classList.remove("invisible")
      : form.classList.add("invisible");
  };
  const deletePost = () => {
    delPost();
  };

  return (
    <Card.Group>
      <Card fluid className="postCard">
        <Card.Content>
          {user ? (
            user.username === post.username ? (
              <Icon name="trash" onClick={deletePost} />
            ) : (
              ""
            )
          ) : (
            ""
          )}

          <Card.Header>{post.username}</Card.Header>
          <CardMeta as={Link} to={"/" + post.id}>
            {moment(post.createdAt.replace("T", " ")).fromNow()}
          </CardMeta>
          <Card.Description>{post.body}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Button as="div" labelPosition="right">
            <Button color="teal" basic={!hasLiked()} onClick={likePost}>
              <Icon name="heart" />
            </Button>
            <Label as="a" basic color="teal" pointing="left">
              {post.likeCount}
            </Label>
          </Button>

          <Button as="div" labelPosition="right">
            <Button color="teal" basic onClick={toggleCommentForm}>
              <Icon name="comments" />
            </Button>
            <Label as="a" basic color="teal" pointing="left">
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
      </Card>
    </Card.Group>
  );
}
