import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../context/auth";

function AuthRoute({ component: Component, mode: Mode, ...rest }) {
  const { user } = useContext(AuthContext);
  console.log(Component);

  if (Mode === "false") {
    return (
      <Route
        {...rest}
        render={(props) =>
          user ? <Component {...props} /> : <Redirect to="/" />
        }
      />
    );
  } else {
    return (
      <Route
        {...rest}
        render={(props) =>
          user ? <Redirect to="/" /> : <Component {...props} />
        }
      />
    );
  }
}

export default AuthRoute;
