import React, { useState, useRef } from "react";
import { Input, Dropdown } from "semantic-ui-react";
import { useLazyQuery } from "@apollo/react-hooks";

import { SEARCH_USERS } from "../util/graphql";

export default function SearchBar() {
  const [state, setState] = useState({
    prefix: "",
    typing: false,
    typingTimeout: 0,
  });

  const [searchUsers, { loading, data }] = useLazyQuery(SEARCH_USERS, {
    variables: { prefix: state.prefix },
    fetchPolicy: "network-only",
  });

  const search = (event) => {
    if (event.target.value.trim() !== "") {
      return setTimeout(function () {
        setState({
          prefix: state.prefix,
          typing: false,
          typingTimeout: 0,
        });

        searchUsers();
        const menu = document.querySelector(".dropdown-content");
        menu.classList.remove("invisible");
      }, 1000);
    } else {
      return setTimeout(function () {
        setState({
          prefix: state.prefix,
          typing: false,
          typingTimeout: 0,
        });
      }, 1000);
    }
  };

  const onChange = (event) => {
    if (state.typingTimeout) {
      clearTimeout(state.typingTimeout);
    }

    const menu = document.querySelector(".dropdown-content");
    console.log(menu.innerHTML);
    menu.classList.add("invisible");

    setState({
      typing: true,
      prefix: event.target.value,
      typingTimeout: search(event),
    });
  };

  return (
    <div>
      <Input
        className={state.typing ? "loading" : ""}
        size="mini"
        icon="search"
        placeholder="Search..."
        onChange={onChange}
      />
      <div className="dropdown-content invisible">
        {data &&
          data.searchUsers &&
          data.searchUsers.map((user) => <p key={user.id}>{user.username}</p>)}
      </div>
    </div>
  );
}
