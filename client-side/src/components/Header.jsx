import React, { useState } from "react";
import { Link, RedirectFunction, useLocation } from "react-router-dom";
import common from "../data/common";
import avatar from "../assests/avatar.png";
import axios from "axios";
import { useLocalStorageContext } from "../utils/storage/LocalStorage";
import { useToastProviderContext } from "../utils/toast/Toast";

const Header = ({
  isSignedIn,
  setDisplaySignInModal,
  setDisplaySignUpModal,
  user,
  signIn,
  children,
}) => {
  const { removeToken } = useLocalStorageContext();
  const setToast = useToastProviderContext();

  const logMeOut = () => {
    axios
      .post("http://127.0.0.1:8080/logout")
      .then((response) => {
        console.log(response);
        removeToken("username");
        signIn(false, "");
      })
      .catch((error) => {
        console.error(error);
        setToast({
          severity: "error",
          title: "Log out issue",
          description: "Error in logging out",
        });
      });
  };

  const Button = ({ isFor, text, click }) => {
    return (
      <div className={`btn ${isFor}`} role="button" onClick={click}>
        {text}
        <span className="display-flex-center">
          <i className="rotate-45deg"></i>
        </span>
      </div>
    );
  };

  return (
    <>
      <div className="header-container">
        <header className="container">
          <Link to="/">
            <img
              src="https://assets.pokemon.com/assets/cms2/img/misc/gus/buttons/logo-pokemon-79x45.png"
              alt="Pokemon logo"
            />
          </Link>
          {isSignedIn ? (
            <div className="header-user-signed-in">
              <div className="user-signed-in">
                <img src={avatar} alt="" />
                <strong>{user.username}</strong>
                <span className="trigger-arrow-container display-flex-center">
                  <i className="rotate-45deg" id="trigger-select-arrow"></i>
                </span>
              </div>
              <ul className="sign-in-advance-options">
                <li>
                  <Link to="/favorites">View Favorites</Link>
                </li>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <div
                    role="button"
                    className="logout-button"
                    onClick={() => {
                      logMeOut();
                    }}
                  >
                    Logout
                  </div>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <span>
                <Button
                  isFor="login"
                  text={common.header.sign_in}
                  click={() => setDisplaySignInModal(true)}
                />
                <Button
                  isFor="create"
                  text={common.header.sign_up}
                  click={() => setDisplaySignUpModal(true)}
                />
              </span>
            </>
          )}
        </header>
        {children}
      </div>
      <section className="container">
        <h1>Pokédex</h1>
      </section>
    </>
  );
};

export default Header;
