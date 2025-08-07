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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const startServer = async () => {
  try {
    await connectDB();

    if (NODE_ENV === "production") {
      const clientPath = path.join(__dirname, "../../client/dist");

      try {
        await fs.access(clientPath);
        app.use(express.static(clientPath));

        app.get("*", (req, res) => {
          res.sendFile(path.join(clientPath, "index.html"));
        });
      } catch (err) {
        console.error("Client files not found:", err);
      }
    }

    if (NODE_ENV !== "production") {
      app.use("/api/test", testRouter);
    }

    app.listen(PORT, () => {
      logInfo(`Server started on port ${PORT}`);
    });
  } catch (error) {
    logError(error);
  }
};

startServer();
