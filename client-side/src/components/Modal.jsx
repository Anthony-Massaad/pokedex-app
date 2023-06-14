import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import common from "../data/common";
import favicon from "../assests/favicon.ico";
import { includes, isEmpty, omit } from "lodash";
import axios from "axios";
import { logger } from "../utils/logger";

const Modal = ({
  title,
  display,
  inputEntry1,
  inputEntry2,
  setDisplaySignInModal,
  setDisplaySignUpModal,
  signIn,
  setToken,
}) => {
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [activeErrors, setActiveErrors] = useState({});

  useEffect(() => {
    if (!display) {
      setUsernameInput("");
      setPasswordInput("");
      setActiveErrors({});
    }
  }, [display]);

  const removeActiveError = (key) => {
    var errors = { ...activeErrors };
    errors = omit(errors, [key]);
    setActiveErrors(errors);
  };

  const isValidSignUpInputs = () => {
    if (isEmpty(usernameInput)) {
      return "required field";
    }

    if (includes(usernameInput, " ")) {
      return "No spaces allowed";
    }

    return true;
  };

  const isInvalidSignInInput = () => {
    var hasError = false;
    const errors = {};
    if (isEmpty(usernameInput)) {
      errors[common.modalErrors.keys.username] =
        common.modalErrors.errors.required;
      hasError = true;
    }

    if (isEmpty(passwordInput)) {
      errors[common.modalErrors.keys.password] =
        common.modalErrors.errors.required;

      hasError = true;
    }

    if (includes(usernameInput, " ")) {
      errors[common.modalErrors.keys.username] =
        common.modalErrors.errors.spaces;

      hasError = true;
    }

    if (includes(passwordInput, " ")) {
      errors[common.modalErrors.keys.password] =
        common.modalErrors.errors.spaces;

      hasError = true;
    }

    setActiveErrors(errors);

    return hasError;
  };

  const onSubmit = () => {
    if (title === common.header.sign_in) {
      if (!isInvalidSignInInput()) {
        axios
          .get(
            `http://127.0.0.1:8080/login?username=${usernameInput}&password=${passwordInput}`
          )
          .then((res) => {
            const res_data = res.data;
            logger.info(res_data);
            if (res_data.response) {
              setDisplaySignInModal(false);
              signIn(res_data.response, res_data.username);
              setToken(res_data.access_token);
            }
          })
          .catch((error) => {
            logger.error(error);
          });
      }
    } else {
      // post
    }
  };

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
            value={usernameInput}
            onChange={(e) => {
              const val = e.target.value || "";
              removeActiveError(common.modalErrors.keys.username);
              setUsernameInput(val);
            }}
          />
          {activeErrors[common.modalErrors.keys.username] && (
            <p>{activeErrors[common.modalErrors.keys.username]}</p>
          )}
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
            value={passwordInput}
            onChange={(e) => {
              const val = e.target.value || "";
              removeActiveError(common.modalErrors.keys.password);
              setPasswordInput(val);
            }}
          />
          {activeErrors[common.modalErrors.keys.password] && (
            <p>{activeErrors[common.modalErrors.keys.password]}</p>
          )}

          <label>
            <i aria-hidden="true">{inputEntry2}</i>
          </label>
        </div>
        {activeErrors[common.modalErrors.keys.signInSubmit] && (
          <p className="invalid-message">
            {activeErrors[common.modalErrors.keys.signInSubmit]}
          </p>
        )}
        {activeErrors[common.modalErrors.keys.signUpSubmit] && (
          <p className="invalid-message">
            {activeErrors[common.modalErrors.keys.signUpSubmit]}
          </p>
        )}
        <button className="sign-in-up-button" onClick={onSubmit}>
          {title}
        </button>
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

export default Modal;
