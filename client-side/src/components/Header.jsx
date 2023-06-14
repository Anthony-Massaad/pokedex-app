import React, { useState } from "react";
import { Link } from "react-router-dom";
import common from "../data/common";
import avatar from "../assests/avatar.png";

const Header = ({
  isSignedIn,
  setDisplaySignInModal,
  setDisplaySignUpModal,
  user,
  children,
}) => {
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
                <strong>{user.username}</strong>
                <img src={avatar} alt="" />
              </div>
              <Link to="/favorites">View Favorites</Link>
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
