import React, { useState, useContext } from "react";
import { Button, Divider, Form, Image } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import { AuthContext } from "../context/auth";
import { Link } from "react-router-dom";
import { REGISTER_USER } from "../util/graphql";

function Register(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(proxy, { data: { registerUser: userData } }) {
      context.login(userData);
      props.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  const onSubmit = (event) => {
    event.preventDefault();
    addUser();
  };

  return (
    <div className="loginForm-container">
      <Form
        onSubmit={onSubmit}
        noValidate
        className={loading ? "loading loginForm" : "loginForm"}
      >
        <div className="loginForm-left">
          <Image
            size="large"
            src="https://preview.colorlib.com/theme/bootstrap/login-form-08/images/undraw_file_sync_ot38.svg"
          />
        </div>
        <div className="loginForm-right">
          <Form.Input
            icon="user"
            className="loginInput"
            placeholder="Username..."
            name="username"
            value={values.username}
            error={errors.username ? true : false}
            onChange={onChange}
          />
          <Form.Input
            icon="lock"
            className="loginInput"
            placeholder="Password..."
            name="password"
            value={values.password}
            error={errors.password ? true : false}
            type="password"
            onChange={onChange}
          />
          <Form.Input
            icon="lock"
            className="loginInput"
            placeholder="Confirm Password..."
            name="confirmPassword"
            value={values.confirmPassword}
            error={errors.password ? true : false}
            type="password"
            onChange={onChange}
          />

          <Form.Input
            icon="mail"
            className="loginInput"
            placeholder="E-mail..."
            name="email"
            value={values.email}
            error={errors.email ? true : false}
            type="text"
            onChange={onChange}
          />
          <Button type="submit" primary>
            Register
          </Button>
          <Divider />
          <Button type="submit" primary as={Link} to="/login">
            Login
          </Button>
          {Object.keys(errors).length > 0 && (
            <div className="ui error message">
              <ul className="list">
                {Object.values(errors).map((v) => (
                  <li key={v}> {v}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Form>
    </div>
  );
}
export default Register;
