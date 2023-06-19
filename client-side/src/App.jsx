import React from "react";
import { ToastProvider } from "./utils/toast/Toast";
import Pokedex from "./Pokedex";

const App = () => {
  return (
    <>
      <ToastProvider>
        <Pokedex />
      </ToastProvider>
    </>
  );
};

export default App;
