import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import Router from "koa-router";
import { initDatabase } from "./core/db";
import { runSeeder } from "./seed";

import { authMiddleware, authRouter } from "./core/modules/auth";
import { userRouter } from "./core/modules/users";
import { postRouter } from "./core/modules/posts";
import { commentRouter } from "./core/modules/comments";
import { petRouter } from "./core/modules/pets";
import { likeRouter } from "./core/modules/likes";

import messageRouter from "./core/modules/messages/message.router";
import webSocketService from "./services/websocketService";
import http from "http";

const app = new Koa();

const server = http.createServer(app.callback());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err: any) {
    ctx.status = err.status || 500;
    ctx.body = {
      error: {
        message: err.message || "Internal Server Error",
        status: ctx.status,
      },
    };
    ctx.app.emit("error", err, ctx);
  }
});

app.use(async (ctx, next) => {
  const publicPaths = [
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/logout",
  ];

  if (publicPaths.includes(ctx.path)) {
    await next();
  } else {
    await authMiddleware(ctx, next);
  }
});

const rootRouter = new Router({ prefix: "/api" });

rootRouter.get("/", (ctx) => {
  ctx.body = { message: "Welcome to Social Network API" };
});

rootRouter.use(authRouter.routes());
rootRouter.use(userRouter.routes());
rootRouter.use(postRouter.routes());
rootRouter.use(commentRouter.routes());
rootRouter.use(petRouter.routes());
rootRouter.use(likeRouter.routes());

// rootRouter.use(messageRouter.getConversations);
// rootRouter.use(messageRouter.getChatHistory);

rootRouter.get("/conversations", messageRouter.getConversations);
rootRouter.get("/messages/:otherUserId", messageRouter.getChatHistory);
rootRouter.post("/messages", messageRouter.createMessage);
rootRouter.post("/messages/:messageId/read", messageRouter.markMessageAsRead);

app.use(rootRouter.routes());
app.use(rootRouter.allowedMethods());

console.log("Available routes:");
rootRouter.stack.forEach((item) => {
  if (item.methods && item.methods.length > 0) {
    console.log(`${item.methods.join(",")} ${item.path}`);
  }
});

const startServer = async () => {
  try {
    await initDatabase();
    await runSeeder();

    const PORT = process.env.PORT || 4000;

    const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";
    webSocketService.initialize(server, JWT_SECRET);

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

app.on("error", (err) => {
  console.error("Error:", err);
});

startServer();
