export const toggleVisibility = (selector, visibility = undefined) => {
  const element = document.querySelector(selector);
  if (!visibility) {
    element.classList.contains("invisible")
      ? element.classList.remove("invisible")
      : element.classList.add("invisible");
  } else {
    element.classList.remove("invisible");
  }
};
