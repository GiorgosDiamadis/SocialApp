import React from "react";
import { GET_MESSAGES, SEND_MESSAGE, GET_CONVERSATION } from "../util/graphql";
import { useSubscription, useMutation } from "@apollo/client";
import { Form, Grid } from "semantic-ui-react";
import CustomTextArea from "../components/CustomTextArea";

const MessagesSubscription = ({ user, conversation }) => {
  const { data } = useSubscription(GET_MESSAGES, {
    variables: {
      conversation: conversation.id,
    },
  });

  return (
    <>
      {data && data.messages && (
        <div
          className="chatDisplay"
          style={{
            justifyContent:
              user === data.messages.sender ? "flex-end" : "flex-start",
          }}
          key={data.messages.id}
        >
          {user !== data.messages.sender && (
            <div className="messageUserInitials">
              {data.messages.sender.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div
            className="messageStyling"
            style={{
              background: user === data.messages.sender ? "#58bf56" : "#e5e6ea",
              color: user === data.messages.sender ? "white" : "black",
            }}
          >
            {data.messages.body}
          </div>
        </div>
      )}
    </>
  );
};

export default function Chat({ state }) {
  const [sendMessage] = useMutation(SEND_MESSAGE, {
    variables: state,
  });

  if (!state.conversation) {
    return null;
  }

  console.log(state);

  return (
    <Grid style={{ width: "50%", margin: "auto" }}>
      <Grid.Row>
        <Grid.Column>
          <MessagesSubscription
            user={state.user.username}
            conversation={state.conversation}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
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
