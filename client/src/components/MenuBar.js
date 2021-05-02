import React, { useState, useContext } from "react";
import { Menu, Image, Divider } from "semantic-ui-react";
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
    <Menu secondary size="massive" className="myMenu stickyTop">
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
        to="/friends"
        active={activeItem === "friends"}
        onClick={() => setActiveItem("friends")}
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
        name={"settings"}
        icon="cog"
        as={Link}
        to={`settings`}
        active={activeItem === "settings"}
        onClick={() => setActiveItem("settings")}
      />
      <Menu.Item
        name={"logout"}
        icon="sign-out"
        onClick={logout}
        as={Link}
        to="/login"
      />
    </Menu>
  );
}
