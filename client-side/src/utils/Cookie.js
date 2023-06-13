import Cookies from "universal-cookie";

const cookies = new Cookies();

export const setCookie = (name, value, options = { path: "/" }) => {
  cookies.set(name, value, options);
};

export const getCookie = (name) => {
  cookies.get(name);
};
