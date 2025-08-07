import express from "express";
import app from "./app.js";
import { logInfo, logError } from "./util/logging.js";
import connectDB from "./db/connectDB.js";
import testRouter from "./testRouter.js";
import config from "./config.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const { PORT, NODE_ENV } = config;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const startServer = async () => {
  try {
    await connectDB();

    // development
    if (NODE_ENV !== "production") {
      app.use("/api/test", testRouter);
    }

    // production
    let clientPath;

    if (NODE_ENV === "production") {
      clientPath = path.join(__dirname, "../../client/dist");

      try {
        await fs.access(clientPath);
        console.log("Serving static files from:", clientPath);
        app.use(express.static(clientPath));
      } catch (err) {
        logError("Client files not found:", err);
      }
    }

    if (NODE_ENV === "production") {
      app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
      });
    }

    app.listen(PORT, () => {
      logInfo(`Server running on port ${PORT} in ${NODE_ENV} mode`);
    });
  } catch (error) {
    logError("Server failed to start:", error);
  }
};

startServer();
