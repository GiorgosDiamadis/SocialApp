import React, { useState, useContext } from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";
import SearchBar from "./SearchBar";

export default function MenuBar() {
  const pathname = window.location.pathname;
  const { user, logout } = useContext(AuthContext);
  const path = pathname === "/" ? "home" : pathname.substring(1);
  const [activeItem, setActiveItem] = useState(path);
  const handleItemClick = (e, { name }) => setActiveItem(name);
  const dummy = () => {};
  return (
    <Menu secondary size="massive" className="myMenu">
      <Menu.Item name={"Username and Image"} />

      <Menu.Item name={"Home Feed"} />
      <Menu.Item name={"Messages"} />
      <Menu.Item name={"Friends"} />

      <Menu.Item name={"Profile"} />
      <Menu.Item name={"Search"} />
      <Menu.Item name={"Logout"} />

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
