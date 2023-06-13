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
// import { getCookie, setCookie } from "./utils/Cookie";

const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState("");
  const [displaySignInModal, setDisplaySignInModal] = useState(false);
  const [displaySignUpModal, setDisplaySignUpModal] = useState(false);

  const signIn = (isLogIn, username) => {
    setIsSignedIn(isLogIn);
    setUser(username);
  };

  useEffect(() => {}, []);

  return (
    <>
      <Router>
        <Header
          isSignedIn={isSignedIn}
          setDisplaySignInModal={setDisplaySignInModal}
          setDisplaySignUpModal={setDisplaySignUpModal}
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
