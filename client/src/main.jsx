import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AppWrapper from "./AppWrapper";
import { GoogleOAuthProvider } from "@react-oauth/google";
import config from "./config.js";

const { VITE_CLIENT_ID } = config;

createRoot(document.getElementById("root")).render(
  <AppWrapper>
    <GoogleOAuthProvider clientId={VITE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </AppWrapper>,
);
