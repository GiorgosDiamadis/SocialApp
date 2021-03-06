import React, { useState } from "react";
import { GET_MESSAGES, SEND_MESSAGE, GET_CONVERSATION } from "../util/graphql";
import { useSubscription, useMutation } from "@apollo/client";
import { Form, Grid } from "semantic-ui-react";
import CustomTextArea from "../components/CustomTextArea";

const Display = ({ message, user }) => {
  return (
    <>
      {user !== message.sender && (
        <div className="messageUserInitials">
          {message.sender.slice(0, 2).toUpperCase()}
        </div>
      )}
      <div
        className="messageStyling"
        style={{
          background: user === message.sender ? "#58bf56" : "#e5e6ea",
          color: user === message.sender ? "white" : "black",
        }}
      >
        {message.body}
      </div>
    </>
  );
};

var b = true;

const MessagesSubscription = ({
  user,
  conversation: { getConversation: conversation },
  messages,
}) => {
  const { data, loading } = useSubscription(GET_MESSAGES, {
    variables: {
      conversation: conversation.id,
      channel: conversation.channel.toString(),
    },
    fetchPolicy: "no-cache",
  });

  if (!loading) {
    if (data.messages.conversation == conversation.id)
      if (messages.indexOf(data.messages) === -1) messages.push(data.messages);
  }

  return (
    <>
      {conversation &&
        conversation.messages.map((ms) => (
          <div
            className="chatDisplay"
            style={{
              justifyContent: user === ms.sender ? "flex-end" : "flex-start",
            }}
            key={ms.createdAt}
          >
            <Display message={ms} user={user} />
          </div>
        ))}
      {messages.map((ms) => (
        <div
          className="chatDisplay"
          style={{
            justifyContent: user === ms.sender ? "flex-end" : "flex-start",
          }}
          key={ms.createdAt}
        >
          <Display message={ms} user={user} />
        </div>
      ))}
    </>
  );
};

export default function Chat({ state, setState }) {
  // console.log(state);

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    variables: state,
    update() {},
  });

  return (
    <Grid
      style={{
        width: "100%",
        margin: "auto",
        height: "100%",
        backgroundColor: "rgb(47,56, 82)",
        borderRadius: 40,
        position: "relative",
      }}
    >
      <Grid.Row>
        <Grid.Column
          className={"chatting"}
          width={20}
          style={{ overflow: "auto", height: 690, padding: 20 }}
        >
          <MessagesSubscription
            user={state.user.username}
            conversation={state.conversation}
            messages={state.messages}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row
        style={{ alignSelf: "flex-end", position: "absolute", bottom: 0 }}
      >
        <Grid.Column>
          <Form>
            <CustomTextArea
              rows={1}
              placeholder="Send Message"
              values={state}
              valueField="body"
              name="body"
              db_callback={sendMessage}
            />
          </Form>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}
