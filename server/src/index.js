import express from "express";
import app from "./app.js";
import { logInfo, logError } from "./util/logging.js";
import connectDB from "./db/connectDB.js";
import testRouter from "./testRouter.js";
import config from "./config.js";
import http from "http";
import { Server } from "socket.io";
import initCommentSocket from "./sockets/comments.js";

const { PORT, NODE_ENV } = config;

const startServer = async () => {
  try {
    await connectDB();

    // Сreate an HTTP server
    const server = http.createServer(app);

    // Attach socket.io to the HTTP server
    const io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    // Initialize socket event handlers
    initCommentSocket(io);

    // Start the server
    server.listen(PORT, () => {
      logInfo(`Server with WebSocket started on port ${PORT}`);
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
  app.use(
    express.static(new URL("../../client/dist", import.meta.url).pathname),
  );
  // Redirect * requests to give the client data
  app.get("/*file", (req, res) =>
    res.sendFile(
      new URL("../../client/dist/index.html", import.meta.url).pathname,
    ),
  );
}

/****** For cypress we want to provide an endpoint to seed our data ******/
if (NODE_ENV !== "production") {
  app.use("/api/test", testRouter);
}

// Start the server
startServer();
