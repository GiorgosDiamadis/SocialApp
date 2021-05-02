import React, { useContext, useState } from "react";

import { Form } from "semantic-ui-react";

export default function CustomTextArea({
  valueField,
  errorField,
  name,
  placeholder,
  values,
  setErrors,
  errors,
  rows,
  db_callback,
}) {
  const handleUserKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.target.value.trim() !== "") {
        values[valueField] = e.target.value;
        console.log(values[valueField]);
      }
      e.target.style.height = `${39}px`;
      e.target.value = "";
      db_callback();
    }
  };

  const onChange = (event) => {
    const parent = event.target.parentNode;

    event.target.style.height = "inherit";
    event.target.style.height = `${event.target.scrollHeight}px`;
    if (parent.classList.contains("error")) {
      parent.classList.remove("error");
      setErrors({});
    }
  };

  return (
    <>
      <Form.TextArea
        id="text-area"
        name={name}
        rows={rows}
        style={{ height: "inherit" }}
        placeholder={placeholder}
        values={values}
        onChange={onChange}
        onKeyPress={handleUserKeyPress}
        // error={errors[errorField] ? true : false}
      />
    </>
  );
}
