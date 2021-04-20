import { AuthContext } from "../context/auth";
import React, { useContext } from "react";
import { GET_MESSAGES, SEND_MESSAGE, GET_MESSAGES_TO } from "../util/graphql";
import { useSubscription, useMutation } from "@apollo/client";
import { Form, Grid } from "semantic-ui-react";
import CustomTextArea from "../components/CustomTextArea";
import { useQuery } from "@apollo/react-hooks";

const Messages = ({ user, previous }) => {
  const { data } = useSubscription(GET_MESSAGES);

  console.log(data);

  return (
    <>
      {/* {previous &&
        previous.map(({ id, from, to, body }) => (
          <div
            className="chatDisplay"
            style={{
              justifyContent: user === from ? "flex-end" : "flex-start",
            }}
            key={id}
          >
            {user !== from && (
              <div className="messageUserInitials">
                {from.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div
              className="messageStyling"
              style={{
                background: user === from ? "#58bf56" : "#e5e6ea",
                color: user === from ? "white" : "black",
              }}
            >
              {body}
            </div>
          </div>
        ))} */}
      {data && data.messages && (
        <div
          className="chatDisplay"
          style={{
            justifyContent:
              user === data.messages.from ? "flex-end" : "flex-start",
          }}
          key={data.messages.id}
        >
          {user !== data.messages.from && (
            <div className="messageUserInitials">
              {data.messages.from.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div
            className="messageStyling"
            style={{
              background: user === data.messages.from ? "#58bf56" : "#e5e6ea",
              color: user === data.messages.from ? "white" : "black",
            }}
          >
            {data.messages.body}
          </div>
        </div>
      )}
    </>
  );
};

export default function Chat({ to }) {
  const { user } = useContext(AuthContext);

  var variables = {
    user: user,
    body: "",
    to: to,
  };
  const [sendMessage] = useMutation(SEND_MESSAGE, {
    variables: variables,
  });
  const {
    loading,
    data: { getMessages: previousMessages } = {},
  } = useQuery(GET_MESSAGES_TO, { variables: variables });

  if (!previousMessages) {
    return null;
  }

  if (to.trim() === "") {
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
