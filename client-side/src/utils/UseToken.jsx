import { useEffect, useState } from "react";

const UseToken = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(getToken());
  }, []);

  const getToken = () => {
    const userToken = localStorage.getItem("token");
    return userToken && userToken;
  };

  const saveToken = (userToken) => {
    localStorage.setItem("token", userToken);
    setToken(userToken);
  };

  const removeToken = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return {
    setToken: saveToken,
    token,
    removeToken,
  };
};

export default UseToken;
