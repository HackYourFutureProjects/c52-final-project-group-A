import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import app from "./app.js";
import { logInfo, logError } from "./util/logging.js";
import connectDB from "./db/connectDB.js";
import testRouter from "./testRouter.js";
import config from "./config.js";

const { PORT, NODE_ENV } = config;

// __dirname для ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Выводит список зарегистрированных маршрутов
 */
function printRegisteredRoutes() {
  try {
    console.log("=== REGISTERED ROUTES ===");

    if (app._router) {
      app._router.stack.forEach((layer) => {
        if (layer.route) {
          console.log(
            `${Object.keys(layer.route.methods).join(", ").toUpperCase()} ${layer.route.path}`,
          );
        } else if (layer.name === "router" && layer.handle?.stack) {
          // Для роутеров, подключенных через app.use()
          layer.handle.stack.forEach((sublayer) => {
            if (sublayer.route) {
              console.log(
                `${Object.keys(sublayer.route.methods).join(", ").toUpperCase()} ${sublayer.route.path}`,
              );
            }
          });
        }
      });
    } else {
      console.log("Router not initialized yet");
    }

    console.log("========================");
  } catch (error) {
    console.error("Failed to print routes:", error);
  }
}

const startServer = async () => {
  try {
    await connectDB();
    logInfo("Database connection established");
  } catch (error) {
    logError("DB connection failed (continuing in dev):", error);
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    logInfo(`Server started on port ${PORT} (env=${NODE_ENV})`);
    printRegisteredRoutes();
  });

  server.on("error", (error) => {
    logError("Server error:", error);
  });
};

// Production-конфигурация
if (NODE_ENV === "production") {
  const clientPath = path.resolve(__dirname, "../../client/dist");

  app.use(express.static(clientPath));

  // Все НЕ /api/** -> index.html (SPA роутинг)
  app.get(/^(?!\/api\/).*/, (_req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });
} else {
  // Development-конфигурация
  app.use("/api/test", testRouter);
}

// Запуск сервера с обработкой неожиданных ошибок
startServer().catch((error) => {
  logError("Fatal server startup error:", error);
  process.exit(1);
});

// Обработка неотловленных исключений/промисов
process.on("unhandledRejection", (reason) => {
  logError("Unhandled Rejection at:", reason);
});

process.on("uncaughtException", (error) => {
  logError("Uncaught Exception thrown:", error);
});
