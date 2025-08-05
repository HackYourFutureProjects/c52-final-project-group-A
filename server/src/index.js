import express from "express";
import app from "./app.js";
import { logInfo, logError } from "./util/logging.js";
import connectDB from "./db/connectDB.js";
import testRouter from "./testRouter.js";
import config from "./config.js";
import http from "http";
import { Server } from "socket.io";
import initCommentSocket from "./sockets/comments.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { PORT, NODE_ENV } = config;

const devOrigins = ["http://localhost:5173", "http://localhost:5174"];

const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  process.env.FRONTEND_URL,
  ...devOrigins,
].filter(Boolean);

const startServer = async () => {
  try {
    await connectDB();

    app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin) return callback(null, true);
          if (allowedOrigins.includes(origin)) return callback(null, true);
          return callback(new Error(`Not allowed by CORS: ${origin}`));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      }),
    );

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    initCommentSocket(io);

    if (NODE_ENV === "production") {
      app.use(express.static(path.join(__dirname, "../../client/dist")));
      app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
      });
    }

    if (NODE_ENV !== "production") {
      app.use("/api/test", testRouter);
    }

    server.listen(PORT, () => {
      logInfo(`Server with WebSocket started on port ${PORT}`);
      logInfo(
        `CORS allowed origins: ${
          allowedOrigins.length ? allowedOrigins.join(", ") : "(none)"
        }`,
      );
      logInfo(`NODE_ENV: ${NODE_ENV}`);
    });
  } catch (error) {
    logError(error);
    process.exitCode = 1;
  }
};

startServer();
