import React from "react";
import { Divider, Image, Icon, Button } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { ADD_FRIEND } from "../util/graphql";

export default function ProfileCard({ user, profileInfo }) {
  const [addFriend] = useMutation(ADD_FRIEND, {
    variables: { profileId: profileInfo.id },
    fetchPolicy: "",
  });
  return (
    <div
      style={{ display: "flex", flexDirection: "column" }}
      className={`lightBackground profileCard id${profileInfo.id}`}
    >
      <div style={{ alignSelf: "center" }}>
        <Image
          className="profileCardImage"
          src="https://customerthink.com/wp-content/uploads/pngtree-business-people-avatar-icon-user-profile-free-vector-png-image_4815126.jpg"
          size="medium"
          rounded
        />
      </div>

      <div>
        <Divider />

        <h3>
          <Icon name="user" />
          {profileInfo.username}
        </h3>
        {user.username === profileInfo.username && (
          <h4>
            <Icon name="mail" />
            {profileInfo.email}
          </h4>
        )}

        <h5>
          <Icon name="calendar check outline" />
          {"Joined in " +
            moment(profileInfo.createdAt).utc().format("DD/MM/YYYY")}
        </h5>
        <h5>
          {" "}
          <Icon name="calendar" />
          Born at {profileInfo.born}
        </h5>
        <h5>
          <Icon name="marker" />
          Lives in {profileInfo.livesIn}
        </h5>
        <h5>
          <Icon name="marker" />
          Is from {profileInfo.isFrom}
        </h5>
        <h5>
          <Icon name="marker" />
          Graduated at {profileInfo.graduatedAt}
        </h5>

        {user.username === profileInfo.username && (
          <div>
            <Divider />
            <a className="page-title" href="/settings">
              <Icon name="cog" />
              Edit
            </a>
          </div>
        )}

        {profileInfo.friends &&
          profileInfo.friends.findIndex((u) => u.username === user.username) ===
            -1 &&
          user.username !== profileInfo.username && (
            <Button
              color="green"
              content="Add"
              onClick={() => {
                addFriend();
                const g = document.querySelector(
                  `.profileCard.id${profileInfo.id}`
                );

                g.style.display = "none";
              }}
            />
          )}

        {profileInfo.friends &&
          profileInfo.friends.findIndex((u) => u.username === user.username) !==
            -1 &&
          user.username !== profileInfo.username && (
            <Button color="red" content="Remove friend" onClick={addFriend} />
          )}
      </div>
    </div>
  );
}
