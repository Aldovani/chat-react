import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.scss";
import { ChakraProvider } from "@chakra-ui/react";

import "./services/firebase";
import { AuthContextProvider } from "./context/AuthContext";

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
