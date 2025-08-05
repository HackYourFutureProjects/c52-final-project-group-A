import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AppWrapper from "./AppWrapper";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = import.meta.env.VITE_CLIENT_ID;

if (!clientId) {
  throw new Error("VITE_CLIENT_ID environment variable is not defined.");
}

createRoot(document.getElementById("root")).render(
  <AppWrapper>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </AppWrapper>,
);
