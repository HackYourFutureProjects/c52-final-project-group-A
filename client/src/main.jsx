import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AppWrapper from "./AppWrapper";
import { GoogleOAuthProvider } from "@react-oauth/google";
import config from "./config.js";
import StateContextProvider from "./context/state/StateContextProvider.jsx";

const { CLIENT_ID } = config;

createRoot(document.getElementById("root")).render(
  <AppWrapper>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <StateContextProvider>
        <App />
      </StateContextProvider>
    </GoogleOAuthProvider>
  </AppWrapper>,
);
