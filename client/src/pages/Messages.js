import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";

import Chat from "./Chat";
import { List, Image } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
import { GET_FRIENDS } from "../util/graphql";

export default function Messages() {
  const { user } = useContext(AuthContext);

  const [state, setState] = useState({
    chatWith: "",
  });

  const { loading, data } = useQuery(GET_FRIENDS, {
    fetchPolicy: "cache-first",
    variables: {
      ID: user.id,
    },
  });

  const chatWith = (username) => {
    setState({
      chatWith: username,
    });
  };

  return (
    <div className="messagesPanel">
      <div className="messages">
        <div className="messageFrom">{user.username}</div>
        <div className="messageTo">
          <List selection verticalAlign="middle">
            {data &&
              data.getFriends.friends.map(({ id, username }) => (
                <List.Item key={id} onClick={() => chatWith(username)}>
                  <Image
                    avatar
                    src="https://react.semantic-ui.com/images/avatar/small/helen.jpg"
                  />
                  <List.Content>
                    <List.Header>{username}</List.Header>
                  </List.Content>
                </List.Item>
              ))}
          </List>
        </div>
      </div>
      <div className="chat">
        <Chat chatWith={state.chatWith} />
      </div>
    </div>
  );
}
