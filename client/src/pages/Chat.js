import { AuthContext } from "../context/auth";
import React, { useContext, useState } from "react";
import { GET_MESSAGES, SEND_MESSAGE, GET_MESSAGES_TO } from "../util/graphql";
import { useSubscription, useMutation } from "@apollo/client";
import { Form, Grid } from "semantic-ui-react";
import CustomTextArea from "../components/CustomTextArea";
import { useQuery } from "@apollo/react-hooks";

const Messages = ({ user, previous }) => {
  const { data } = useSubscription(GET_MESSAGES);

  return (
    <>
      {previous &&
        previous.map(({ id, from, to, body }) => (
          <div
            style={{
              display: "flex",
              justifyContent: user === from ? "flex-end" : "flex-start",
              paddingBottom: "1em",
            }}
            key={id}
          >
            {user !== from && (
              <div
                style={{
                  height: 50,
                  width: 50,
                  marginRight: "0.5em",
                  border: "2px solid #e5e6ea",
                  borderRadius: 25,
                  textAlign: "center",
                  fontSize: "18pt",
                  paddingTop: 12,
                }}
              >
                {from.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div
              style={{
                background: user === from ? "#58bf56" : "#e5e6ea",
                color: user === from ? "white" : "black",
                padding: "1em",
                borderRadius: "1em",
                maxWidth: "60%",
              }}
            >
              {body}
            </div>
          </div>
        ))}
      {data &&
        data.messages.map(({ id, from, to, body }) => (
          <div
            style={{
              display: "flex",
              justifyContent: user === from ? "flex-end" : "flex-start",
              paddingBottom: "1em",
            }}
            key={id}
          >
            {user !== from && (
              <div
                style={{
                  height: 50,
                  width: 50,
                  marginRight: "0.5em",
                  border: "2px solid #e5e6ea",
                  borderRadius: 25,
                  textAlign: "center",
                  fontSize: "18pt",
                  paddingTop: 12,
                }}
              >
                {from.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div
              style={{
                background: user === from ? "#58bf56" : "#e5e6ea",
                color: user === from ? "white" : "black",
                padding: "1em",
                borderRadius: "1em",
                maxWidth: "60%",
              }}
            >
              {body}
            </div>
          </div>
        ))}
    </>
  );
};

export default function Chat() {
  const { user } = useContext(AuthContext);

  var variables = {
    user: user,
    body: "",
    to: "Giorgos1997",
  };
  const [sendMessage] = useMutation(SEND_MESSAGE, {
    variables: variables,
  });
  const { loading, data: { getMessages: previousMessages } = {} } = useQuery(
    GET_MESSAGES_TO
  );

  if (!previousMessages) {
    return null;
  }
  return (
    <Grid style={{ width: "50%", margin: "auto" }}>
      <Grid.Row>
        <Grid.Column>
          <Messages
            user={variables.user.username}
            previous={previousMessages}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Form>
            <CustomTextArea
              rows={1}
              placeholder="Send Message"
              values={variables}
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
