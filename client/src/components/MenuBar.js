import React, { useState, useContext } from "react";
import { Menu, Image, Divider } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";
import SearchBar from "./SearchBar";

const User = ({ user }) => (
  <div>
    <Image
      src="https://customerthink.com/wp-content/uploads/pngtree-business-people-avatar-icon-user-profile-free-vector-png-image_4815126.jpg"
      size="medium"
      rounded
    />
    <h3>{user.username}</h3>
    <h3>{user.email}</h3>
    <Divider />
  </div>
);

export default function MenuBar() {
  const pathname = window.location.pathname;
  const { user, logout } = useContext(AuthContext);
  const path = pathname === "/" ? "home" : pathname.substring(1);
  const [activeItem, setActiveItem] = useState(path);
  const handleItemClick = (e, { name }) => setActiveItem(name);
  const dummy = () => {};

  return (
    <Menu secondary size="massive" className="myMenu">
      <Menu.Item className="user" content={<User user={user} />} />

      <Menu.Item
        name={"home"}
        icon="home"
        as={Link}
        to="/"
        active={activeItem === "home"}
        onClick={() => setActiveItem("home")}
      />
      <Menu.Item
        name={"messages"}
        icon="rocketchat"
        as={Link}
        to={"messages"}
        active={activeItem === "messages"}
        onClick={() => setActiveItem("messages")}
      />
      <Menu.Item
        name={"friends"}
        icon="users"
        as={Link}
        to="friends"
        active={activeItem === "friends"}
        onClick={() => setActiveItem("friends")}
      />

      <Menu.Item
        name={"profile"}
        icon="user"
        as={Link}
        to="profile"
        active={activeItem === "profile"}
        onClick={() => setActiveItem("profile")}
      />
      <Menu.Item
        name={"search"}
        icon="search"
        as={Link}
        to="search"
        active={activeItem === "search"}
        onClick={() => setActiveItem("search")}
      />
      <Menu.Item
        name={"logout"}
        icon="sign-out"
        onClick={logout}
        as={Link}
        to="/login"
      />

      {/* <Menu.Item
        name={user ? user.username : "home"}
        active={user ? true : activeItem === "home"}
        onClick={user ? dummy : handleItemClick}
        as={Link}
        to="/"
        className={(user ? "" : "invisible") + " left"}
      />
      {user ? (
        <Menu.Item className="search">
          <SearchBar />
        </Menu.Item>
      ) : (
        ""
      )}

      {user ? (
        <Menu.Menu position="right">
          <Menu.Item name="profile" as={Link} to={`/profile/${user.id}`} />
          <Menu.Item
            name="messages"
            as={Link}
            to={`/messages/${user.username}`}
          />
          <Menu.Item name="logout" onClick={logout} as={Link} to="/login" />
        </Menu.Menu>
      ) : (
        <Menu.Menu position="right">
          <Menu.Item
            name="login"
            active={activeItem === "login"}
            onClick={handleItemClick}
            as={Link}
            to="/login"
          />
          <Menu.Item
            name="register"
            active={activeItem === "register"}
            onClick={handleItemClick}
            as={Link}
            to="/register"
          />
        </Menu.Menu>
      )} */}
    </Menu>
  );
}
