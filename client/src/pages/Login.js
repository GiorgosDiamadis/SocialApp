import React, { useContext, useState } from "react";
import { Button, Form, Image } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import { AuthContext } from "../context/auth";
import "../Login.css";

import { LOGIN_USER } from "../util/graphql";
function Login(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(proxy, { data: { loginUser: userData } }) {
      context.login(userData);
      props.history.push("/");
      console.log(userData);
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  const onSubmit = (event) => {
    event.preventDefault();
    loginUser();
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
          <Button type="submit" primary>
            Login
          </Button>
        </div>
      </Form>
      {/* {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((v) => (
              <li key={v}> {v}</li>
            ))}
          </ul>
        </div>
      )} */}
    </div>
  );
}
export default Login;
