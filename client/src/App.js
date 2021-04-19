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
import Profile from "./pages/Profile";
import EditInfo from "./pages/EditInfo";
import Chat from "./pages/Chat";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Container className="outer">
          <MenuBar />
          <AuthRoute exact path="/" component={Home} mode="false" />
          <AuthRoute exact path="/post/:postId" component={Post} mode="false" />
          <Route exact path="/messages" component={Chat} />

          <Container className="inner" id="inner">
            <AuthRoute
              exact
              path="/profile/:profileId"
              component={Profile}
              mode="false"
            />
            <AuthRoute
              exact
              path="/profile/:profileId/editInfo"
              component={EditInfo}
              mode="false"
            />
          </Container>
        </Container>
        <AuthRoute exact path="/register" component={Register} />
        <AuthRoute exact path="/login" component={Login} />
      </Router>
    </AuthProvider>
  );
}

export default App;
