import React, { useContext, useState } from "react";
import { Card, Button, Form, Grid } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import { AuthContext } from "../context/auth";
import { UPDATE_PERSONAL_INFO } from "../util/graphql";
import moment from "moment";

export default function EditInfo(props) {
  const {
    username,
    email,
    createdAt,
    born,
    livesIn,
    isFrom,
    graduatedAt,
  } = props.location.state.profileInfo;

  const { profileId } = props.location.state;
  const { user } = useContext(AuthContext);
  const date_join = moment(createdAt);

  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    userId: profileId,
    born: born,
    livesIn: livesIn,
    isFrom: isFrom,
    graduatedAt: graduatedAt,
  });

  const [updateInfo] = useMutation(UPDATE_PERSONAL_INFO, {
    update() {
      props.history.push(`/profile/${profileId}`);
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };
  const onSubmit = (event) => {
    event.preventDefault();
    updateInfo();
  };
  console.log(props);
  return (
    <Grid>
      <Grid.Column width={5}></Grid.Column>
      <Grid.Column style={{ marginTop: 50 }} width={5}>
        <Card.Group>
          <Card fluid className="single ">
            <Card.Content>
              <Form onSubmit={onSubmit}>
                <h1 className="page-title">Personal details</h1>
                <Form.Input
                  label="Username"
                  icon="user"
                  placeholder={username}
                  name="username"
                  readOnly={true}
                />
                <Form.Input
                  label="Email"
                  icon="mail"
                  placeholder={email}
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

                {user.id === profileId ? (
                  <Button primary type="submit">
                    Update
                  </Button>
                ) : (
                  ""
                )}
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
            </Card.Content>
          </Card>
        </Card.Group>
      </Grid.Column>
      <Grid.Column width={5}></Grid.Column>
    </Grid>
  );
}
