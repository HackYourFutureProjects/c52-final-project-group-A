import express from "express";
import app from "./app.js";
import { logInfo, logError } from "./util/logging.js";
import connectDB from "./db/connectDB.js";
import testRouter from "./testRouter.js";
import config from "./config.js";
import path from "path";
import { fileURLToPath } from "url";

const { PORT, NODE_ENV } = config;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      logInfo(`Server started on port ${PORT}`);
    });
  } catch (error) {
    logError(error);
  }
};

/****** Host our client code for Heroku *****/
/**
 * We only want to host our client code when in production mode as we then want to use the production build that is built in the dist folder.
 * When not in production, don't host the files, but the development version of the app can connect to the backend itself.
 */

if (NODE_ENV === "production") {
  const clientPath = path.join(__dirname, "../../client/dist");
  app.use(express.static(clientPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });
}

/****** For cypress we want to provide an endpoint to seed our data ******/
if (NODE_ENV !== "production") {
  app.use("/api/test", testRouter);
}

// Start the server
startServer();
