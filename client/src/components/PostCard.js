import React, { useContext, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardMeta,
  Form,
  Icon,
  Label,
  Comment,
  Divider,
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

export default function PostCard({ post }) {
  //==========Variables========================
  const ID = post.id;
  const { user } = useContext(AuthContext);
  const idClass = "id" + ID;
  const newCommentDivSelector = `.newComment.invisible.${idClass}`;
  const commentCountSelector = `.ui.teal.left.pointing.basic.label.${idClass}.commentCount`;
  const likeCountSelector = `.ui.teal.left.pointing.basic.label.${idClass}.likeCount`;
  const commentFormSelector = `.ui.form.commentForm.${idClass}`;

  const [values, setValues] = useState({
    postComment: "",
    ID: ID,
  });

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
    variables: { ID },
  });

  const [like] = useMutation(LIKE_POST, {
    variables: { ID },
  });

  const [comment] = useMutation(COMMENT_POST, {
    update(proxy, result) {
      newComment = values.postComment;
      const newCommentDiv = document.querySelector(newCommentDivSelector);
      newCommentDiv.classList.remove("invisible");

      const commentCount = document.querySelector(commentCountSelector);
      newCommentDiv.innerHTML = "You just commented: " + `"${newComment}"`;
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
    return post.likes.findIndex((v) => v.username === user.username) != -1;
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
  const toggleCommentForm = () => {
    const form = document.querySelector(commentFormSelector);
    form.classList.contains("invisible")
      ? form.classList.remove("invisible")
      : form.classList.add("invisible");
  };
  const deletePost = () => {
    delPost();
  };

  //=============================================================
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
            <Button color="teal" basic onClick={toggleCommentForm}>
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
          <a href="">Comments </a>
          <a href="">Likes</a>
        </CardContent>
        <div className="commentSection">
          <Comment.Group>
            <Comment.Content>
              <Comment.Author as="a">Matt</Comment.Author>
              <Comment.Metadata>
                <div>Today at 5:42PM</div>
              </Comment.Metadata>
              <Comment.Text>How artistic!</Comment.Text>
              <Comment.Actions>
                <Comment.Action>Reply</Comment.Action>
              </Comment.Actions>
            </Comment.Content>
          </Comment.Group>
        </div>
      </Card>
    </Card.Group>
  );
}
