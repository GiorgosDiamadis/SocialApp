import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import MenuBar from "./components/MenuBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Post from "./pages/Post";
import { AuthProvider } from "./context/auth";
import AuthRoute from "./util/AuthRoute";

import "./App.css";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Container className="outer">
          <MenuBar />
          <Container className="inner">
            <Route exact path="/" component={Home} />
            <AuthRoute exact path="/register" component={Register} />
            <AuthRoute exact path="/login" component={Login} />
            <AuthRoute
              exact
              path="/post/:postId"
              component={Post}
              mode="false"
            />
          </Container>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
