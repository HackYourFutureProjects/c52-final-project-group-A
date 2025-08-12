// index.js
import express from "express";
import app from "./app.js";
import { logInfo, logError } from "./util/logging.js";
import connectDB from "./db/connectDB.js";
import testRouter from "./testRouter.js";
import config from "./config.js";
import path from "path";
import { fileURLToPath } from "url";

const { PORT, NODE_ENV } = config;

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
if (NODE_ENV === "production") {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const clientPath = path.resolve(__dirname, "../../client/dist");

  app.use(express.static(clientPath));

  // Отдаём index.html для всех маршрутов, КРОМЕ /api/**
  app.get(/^\/(?!api\/).*/, (_req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });
}

/****** For cypress we want to provide an endpoint to seed our data ******/
if (NODE_ENV !== "production") {
  app.use("/api/test", testRouter);
}

// Start the server
startServer();
