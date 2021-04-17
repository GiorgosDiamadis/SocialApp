import React, { useState, useRef } from "react";
import { Input } from "semantic-ui-react";

export default function SearchBar() {
  const [state, setState] = useState({
    name: "",
    typingTimeout: 0,
  });
  const searchBar = useRef(null);
  const onChange = (event) => {
    if (state.typingTimeout) {
      clearTimeout(state.typingTimeout);
    }
    const searchBar = React.findDOMNode("searchUser");
    console.log(searchBar);

    searchBar.classList.add("loading");
    setState({
      name: event.target.value,
      typingTimeout: setTimeout(function () {
        searchBar.classList.remove("loading");
      }, 1000),
    });
  };

  return (
    <Input
      className={"icon"}
      ref="searchUser"
      size="mini"
      icon="search"
      placeholder="Search..."
      onChange={onChange}
    />
  );
}
