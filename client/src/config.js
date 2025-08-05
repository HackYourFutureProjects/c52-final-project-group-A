import getEnv from "./util/getEnv.js";

const config = {
  BACKEND_URL: getEnv("VITE_BACKEND_URL", "http://localhost:3000"),
  CLIENT_ID: getEnv("VITE_CLIENT_ID", "defaultClientId"),
};

export default config;
