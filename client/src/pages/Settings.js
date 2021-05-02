import React, { useContext, useState } from "react";
import { Card, Button, Form, Grid } from "semantic-ui-react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { AuthContext } from "../context/auth";
import { UPDATE_PERSONAL_INFO, FETCH_USER_INFO } from "../util/graphql";
import moment from "moment";
import { Link } from "react-router-dom";
import MenuBar from "../components/MenuBar";
export default function Settings(props) {
  const { user } = useContext(AuthContext);
  const {
    loading: loadingInfo,
    data: { getUserInfo: profileInfo } = {},
  } = useQuery(FETCH_USER_INFO, {
    variables: { ID: user.id },
    fetchPolicy: "cache-and-network",
  });

  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    userId: user.id,
    born: profileInfo ? profileInfo.born : "",
    livesIn: profileInfo ? profileInfo.livesIn : "",
    isFrom: profileInfo ? profileInfo.isFrom : "",
    graduatedAt: profileInfo ? profileInfo.graduatedAt : "",
  });

  const [updateInfo] = useMutation(UPDATE_PERSONAL_INFO, {
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  if (loadingInfo) {
    return null;
  }

  const date_join = moment(profileInfo.createdAt);

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };
  const onSubmit = (event) => {
    event.preventDefault();
    updateInfo();
  };
  console.log(props);
  return (
    <div>
      <Grid>
        <Grid.Column
          width={4}
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <MenuBar />
        </Grid.Column>
        <Grid.Column width={8}>
          <Form onSubmit={onSubmit}>
            <div
              className="loginForm-container"
              style={{ justifyContent: "unset", alignItems: "unset" }}
            >
              <div className="loginForm" style={{ flex: 1, height: 700 }}>
                <div className="loginForm-right">
                  <h1 className="page-title">Personal details</h1>
                  <Form.Input
                    label="Username"
                    icon="user"
                    placeholder={profileInfo.username}
                    name="username"
                    readOnly={true}
                  />
                  <Form.Input
                    label="Email"
                    icon="mail"
                    placeholder={profileInfo.email}
                    name="email"
                    readOnly={true}
                  />
                  <Form.Input
                    label="Joined in"
                    icon="mail"
                    icon="calendar check outline"
                    placeholder={date_join.utc().format("DD/MM/YYYY")}
                    name="createdAt"
                    readOnly={true}
                  />
                  <Form.Input
                    label="Born at"
                    placeholder={values.born}
                    name="born"
                    icon="calendar"
                    error={errors.born ? true : false}
                    onChange={onChange}
                  />
                  <Form.Input
                    label="Lives in"
                    icon="marker"
                    placeholder={values.livesIn}
                    name="livesIn"
                    onChange={onChange}
                  />
                  <Form.Input
                    label="Is from"
                    icon="marker"
                    placeholder={values.isFrom}
                    name="isFrom"
                    onChange={onChange}
                  />
                  <Form.Input
                    label="Graduated at"
                    icon="marker"
                    placeholder={values.graduatedAt}
                    name="graduatedAt"
                    onChange={onChange}
                  />

                  <Button
                    primary
                    onClick={() => {
                      updateInfo();
                      props.history.push("/");
                    }}
                  >
                    Update
                  </Button>
                </div>
              </div>
            </div>
          </Form>
          {Object.keys(errors).length > 0 && (
            <div className="ui error message">
              <ul className="list">
                {Object.values(errors).map((v) => (
                  <li key={v}> {v}</li>
                ))}
              </ul>
            </div>
          )}
        </Grid.Column>
        <Grid.Column width={4}></Grid.Column>
      </Grid>
    </div>
  );
}
