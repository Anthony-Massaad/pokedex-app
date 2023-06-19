import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ScrollToTop from "./utils/ScrollToTop";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Pokemon from "./pages/Pokemon";
import common from "./data/common";
import Modal from "./components/Modal";
import axios from "axios";
import { logger } from "./utils/logger";
import { useToastProviderContext } from "./utils/toast/Toast";
import {
  useLocalStorageContext,
  useLocalStorageVariableContext,
} from "./utils/storage/LocalStorage";

const Pokedex = () => {
  const setToast = useToastProviderContext();
  const { setToken } = useLocalStorageContext();
  const { usernameToken } = useLocalStorageVariableContext();

  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState({ username: "" });
  const [displaySignInModal, setDisplaySignInModal] = useState(false);
  const [displaySignUpModal, setDisplaySignUpModal] = useState(false);

  const signIn = (isLogIn, username) => {
    setIsSignedIn(isLogIn);
    const tpm = { ...user };
    tpm.username = username;
    setUser(tpm);
  };

  const onFavoriteClick = (id, poke_name) => {
    if (isSignedIn) {
      // do something
      axios
        .post(
          `http://127.0.0.1:8080/addFavorite?poke_id=${id}&poke_name=${poke_name}&username=${user.username}}`
        )
        .then((res) => {
          console.log(res);
          setToast({
            severity: "success",
            title: "Favorite added",
            description: `Pokemon ${poke_name} added to favorites`,
          });
        })
        .catch((err) => {
          console.error(err);
          setToast({
            severity: "error",
            title: "Favorite Issue",
            description: `Could not favorite pokemon ${poke_name}`,
          });
        });
    } else {
      setDisplaySignInModal(true);
    }
  };

  useEffect(() => {
    if (usernameToken) {
      axios
        .get(`http://127.0.0.1:8080/check`, {
          headers: {
            Authorization: "Bearer " + usernameToken,
          },
        })
        .then((res) => {
          const data = res.data;
          data.access_token && setToken("username", data.access_token);
          signIn(data.response, data.username);
        })
        .catch((err) => {
          logger.error(err);
        });
    }
  }, [usernameToken]);

  return (
    <>
      <Router>
        <Header
          isSignedIn={isSignedIn}
          setDisplaySignInModal={setDisplaySignInModal}
          setDisplaySignUpModal={setDisplaySignUpModal}
          user={user}
        >
          <Modal
            title={common.header.sign_in}
            display={displaySignInModal}
            inputEntry1={common.header.sign_in_modal_input_1}
            inputEntry2={common.header.sign_in_modal_input_2}
            setDisplaySignInModal={setDisplaySignInModal}
            setDisplaySignUpModal={setDisplaySignUpModal}
            signIn={signIn}
          />
          <Modal
            title={common.header.sign_up}
            display={displaySignUpModal}
            inputEntry1={common.header.sign_up_modal_input_1}
            inputEntry2={common.header.sign_up_modal_input_2}
            setDisplaySignInModal={setDisplaySignInModal}
            setDisplaySignUpModal={setDisplaySignUpModal}
            signIn={signIn}
          />
        </Header>
        <ScrollToTop>
          <Routes>
            <Route
              path="/"
              exact
              element={<Home onFavoriteClick={onFavoriteClick} />}
            />
            <Route
              path="/Pokemons/:pokemonName"
              exact
              element={<Pokemon onFavoriteClick={onFavoriteClick} />}
            />
          </Routes>
        </ScrollToTop>
      </Router>
      <Footer />
    </>
  );
};

export default Pokedex;
