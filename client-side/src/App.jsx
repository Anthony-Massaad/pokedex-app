import React from "react";
import { ToastProvider } from "./utils/toast/Toast";
import { LocalStorageProvider } from "./utils/storage/LocalStorage";
import Pokedex from "./Pokedex";

const App = () => {
  return (
    <>
      <LocalStorageProvider>
        <ToastProvider>
          <Pokedex />
        </ToastProvider>
      </LocalStorageProvider>
    </>
  );
};

export default App;
