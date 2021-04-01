import React, { useState, useContext } from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";

export default function MenuBar() {
  const pathname = window.location.pathname;
  const { user, logout } = useContext(AuthContext);
  const path = pathname === "/" ? "home" : pathname.substring(1);
  const [activeItem, setActiveItem] = useState(path);

  const handleItemClick = (e, { name }) => setActiveItem(name);
  const dummy = () => {};
  return (
    <Menu pointing secondary size="massive" color="teal">
      <Menu.Item
        name={user ? user.username : "home"}
        active={user ? true : activeItem === "home"}
        onClick={user ? dummy : handleItemClick}
        as={Link}
        to="/"
      />
      {user ? (
        <Menu.Menu position="right">
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
      )}
    </Menu>
  );
}
