import getEnv from "./util/getEnv.js";

const config = {
  VITE_BACKEND_URL: getEnv("VITE_BACKEND_URL"),
  VITE_CLIENT_ID: getEnv("VITE_CLIENT_ID"),
};

export default config;
