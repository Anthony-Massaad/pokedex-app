import React, { useEffect, useState } from "react";
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
import UseToken from "./utils/UseToken";

const App = () => {
  const { token, removeToken, setToken } = UseToken();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState({username: ''});
  const [displaySignInModal, setDisplaySignInModal] = useState(false);
  const [displaySignUpModal, setDisplaySignUpModal] = useState(false);

  const signIn = (isLogIn, username) => {
    setIsSignedIn(isLogIn);
    const tpm = {...user}
    tpm.username = username
    setUser(tpm);
  };

  useEffect(() => {
    console.log(token);
    if (token) {
      axios
        .get(`http://127.0.0.1:8080/check`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((res) => {
          const data = res.data;
          console.log(data);
          data.access_token && setToken(data.access_token);
          signIn(data.response, data.username);
        })
        .catch((err) => {
          logger.error(err);
        });
    }
  }, [token]);

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
            setToken={setToken}
          />
          <Modal
            title={common.header.sign_up}
            display={displaySignUpModal}
            inputEntry1={common.header.sign_up_modal_input_1}
            inputEntry2={common.header.sign_up_modal_input_2}
            setDisplaySignInModal={setDisplaySignInModal}
            setDisplaySignUpModal={setDisplaySignUpModal}
            signIn={signIn}
            setToken={setToken}
          />
        </Header>
        <ScrollToTop>
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/Pokemons/:pokemonName" exact element={<Pokemon />} />
          </Routes>
        </ScrollToTop>
      </Router>
      <Footer />
    </>
  );
};

export default App;
