import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";

import { AuthContext } from "../context/auth";
import { FETCH_POSTS } from "../util/graphql";

import PostCard from "../components/PostCard";
export default function Profile() {
  const { user } = useContext(AuthContext);
  const { loading, data: { getPosts: posts } = {} } = useQuery(FETCH_POSTS);

  const userPosts = posts.filter((f) => f.username === user.username);

  return (
    <div>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        userPosts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
}
