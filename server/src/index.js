import http from "http";
import express from "express";
import app from "./app.js";
import { Server } from "socket.io";
import { logInfo, logError } from "./util/logging.js";
import connectDB from "./db/connectDB.js";
import testRouter from "./testRouter.js";
import config from "./config.js";
import { registerCommentsSocket } from "./sockets/commentsSocket.js";

const { PORT, NODE_ENV } = config;

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

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
  path: "/socket.io",
});

// Make io available inside request handlers
app.set("io", io);

// Register /comments namespace and room-per-post logic
registerCommentsSocket(io);

// Start server after DB is connected
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      logInfo(`Server started on port ${PORT}`);
    });
  } catch (error) {
    logError(error);
  }
};

// Start the server
startServer();
