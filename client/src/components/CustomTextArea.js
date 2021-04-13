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
  console.log(errorField);
  const handleUserKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      values[valueField] = e.target.value;
      e.target.value = "";
      db_callback();
      values[valueField] = "";
    }
  };
  const onChange = (event) => {
    const parent = event.target.parentNode;
    if (parent.classList.contains("error")) {
      parent.classList.remove("error");
      setErrors({});
    }
  };

  return (
    <>
      <Form.TextArea
        className="text-area"
        name={name}
        rows={rows}
        placeholder={placeholder}
        values={values}
        onChange={onChange}
        onKeyPress={handleUserKeyPress}
        error={errors[errorField] ? true : false}
      />
    </>
  );
}
