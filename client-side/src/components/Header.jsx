import React, { useState } from "react";
import { Link } from "react-router-dom";
import common from "../data/common";
import favicon from "../assests/favicon.ico";
import avatar from "../assests/avatar.png";

const Header = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [displaySignInModal, setDisplaySignInModal] = useState(false);
  const [displaySignUpModal, setDisplaySignUpModal] = useState(false);
  const [showModalErrorMessage, setShowModalErrorMessage] = useState(false);

  const Modal = ({
    title,
    display,
    errorMessage,
    inputEntry1,
    inputEntry2,
  }) => {
    return (
      <div
        className="modal-overlay opacity-transition"
        style={display ? { display: "block" } : { display: "none" }}
      >
        <div className="modal-content transform-translate-center">
          <img src={favicon} className="transform-translate-center" alt="" />
          <h2>{title}</h2>
          <Link
            className="exit-modal"
            role="exit"
            onClick={() =>
              title === common.header.sign_in
                ? setDisplaySignInModal(false)
                : setDisplaySignUpModal(false)
            }
          >
            &times;
          </Link>
          <div className="input-box">
            <input
              type="text"
              name="username"
              autoComplete="off"
              maxLength="20"
              minLength="1"
              required
            />
            <label>
              <i aria-hidden="true">{inputEntry1}</i>
            </label>
          </div>
          <div className="input-box">
            <input
              type="text"
              name="password"
              autoComplete="off"
              maxLength="20"
              minLength="1"
              required
            />
            <label>
              <i aria-hidden="true">{inputEntry2}</i>
            </label>
          </div>
          <p
            className="invalid-message"
            style={
              showModalErrorMessage
                ? { visibility: "visible" }
                : { visibility: "hidden" }
            }
          >
            {errorMessage}
          </p>
          <button className="sign-in-up-button">{title}</button>
          <Link
            className="switch-modal"
            onClick={() => {
              if (title === common.header.sign_in) {
                setDisplaySignInModal(false);
                setDisplaySignUpModal(true);
              } else {
                setDisplaySignInModal(true);
                setDisplaySignUpModal(false);
              }
            }}
          >
            {title === common.header.sign_in
              ? common.header.sign_up
              : common.header.sign_in}
          </Link>
        </div>
      </div>
    );
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
                <strong>Filler</strong>
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
              <Modal
                title={common.header.sign_in}
                display={displaySignInModal}
                errorMessage={common.header.sign_in_error}
                inputEntry1={common.header.sign_in_modal_input_1}
                inputEntry2={common.header.sign_in_modal_input_2}
              />
              <Modal
                title={common.header.sign_up}
                display={displaySignUpModal}
                errorMessage={common.header.sign_up_error}
                inputEntry1={common.header.sign_up_modal_input_1}
                inputEntry2={common.header.sign_up_modal_input_2}
              />
            </>
          )}
        </header>
      </div>
      <section className="container">
        <h1>Pokédex</h1>
      </section>
    </>
  );
};

export default Header;
