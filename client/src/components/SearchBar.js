import React, { useState, useRef } from "react";
import { Input, List, Image } from "semantic-ui-react";
import { useLazyQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";

import { SEARCH_USERS } from "../util/graphql";

export default function SearchBar(props) {
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

        const x = document.querySelector(".ui.icon.input > i.icon");
        x.addEventListener("click", () => {
          menu.classList.add("invisible");
          event.target.value = "";
          x.classList.remove("cancel");
          x.classList.add("search");
        });
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
        icon={!(data && data.searchUsers) ? "search" : "cancel"}
        placeholder="Search..."
        onChange={onChange}
      />
      <div className="dropdown-content invisible">
        <List divided relaxed>
          {data && data.searchUsers
            ? [
                ...Array(
                  data.searchUsers.length >= 6 ? 6 : data.searchUsers.length
                ),
              ].map((x, i) => (
                <List.Item>
                  <Image
                    src="https://cdn.iconscout.com/icon/free/png-256/avatar-373-456325.png"
                    size="mini"
                    circular
                    centered
                  />
                  <List.Content>
                    <List.Header
                      as={Link}
                      to={`/profile/${data.searchUsers[i].id}`}
                      onClick={() => {
                        const menu = document.querySelector(
                          ".dropdown-content"
                        );

                        menu.classList.add("invisible");
                      }}
                    >
                      {data.searchUsers[i].username}
                    </List.Header>
                  </List.Content>
                </List.Item>
              ))
            : ""}
          {data.searchUsers.length >= 6 ? <h4>See all</h4> : ""}
        </List>
      </div>
    </div>
  );
}
