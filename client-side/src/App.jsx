import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ScrollToTop from "./utils/ScrollToTop";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
  return (
    <>
      <Router>
        <Header />
        <ScrollToTop>
          <Routes>
            <Route path="/" exact element={<Home />} />
          </Routes>
        </ScrollToTop>
      </Router>
      <Footer />
    </>
  );
};

export default App;
