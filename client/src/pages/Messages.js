import React, { useContext, useState } from "react";
import { useQuery } from "@apollo/react-hooks";

import Chat from "./Chat";
import { List, Image, Grid, Divider } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
import { GET_FRIENDS, GET_CONVERSATION } from "../util/graphql";
import MenuBar from "../components/MenuBar";
export default function Messages() {
  const { user } = useContext(AuthContext);

  const [state, setState] = useState({
    user,
    body: "",
    chatWith: "",
    messages: [],
  });

  const { loading, data } = useQuery(GET_FRIENDS, {
    fetchPolicy: "cache-first",
    variables: {
      ID: user.id,
    },
  });

  const { _, data: conversation, refetch } = useQuery(GET_CONVERSATION, {
    variables: state,
    fetchPolicy: "no-cache",
  });

  const chatWith = (username) => {
    setState({
      user,
      chatWith: username,
      messages: [],
    });

    refetch({
      variables: state,
    });
  };

  if (state.messages.length > 0) {
    state.messages = [];
  }

  return (
    <Grid>
      <Grid.Column
        width={4}
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <MenuBar />
      </Grid.Column>
      <Grid.Column width={12}>
        <div className="messagesPanel">
          <div className="messages">
            <div className="messageFrom">
              <h3 style={{ marginBottom: 0 }}>{user.username}</h3>
              {/* asdk */}
              <Divider className="messagesfrom" />
            </div>
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
            {conversation && conversation.getConversation && (
              <Chat state={{ ...state, conversation }} setState={setState} />
            )}
          </div>
        </div>
      </Grid.Column>
      <Grid.Column width={2}></Grid.Column>
    </Grid>
  );
}
