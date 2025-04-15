import Router from "koa-router";
import { LikeService } from "./likes.service";

export const likeRouter = new Router({
  prefix: "/comment/:commentId/like",
});

likeRouter.get("/", async (ctx) => {
  const { commentId } = ctx.params;
  const likes = await LikeService.getByCommentId(commentId);
  ctx.body = likes;
});

likeRouter.get("/count", async (ctx) => {
  const { commentId } = ctx.params;
  const count = await LikeService.getLikeCount(commentId);
  ctx.body = count;
});

likeRouter.get("/status", async (ctx) => {
  const { commentId } = ctx.params;
  const userId = ctx.state.user.id;
  const hasLiked = await LikeService.hasUserLikedComment(userId, commentId);
  ctx.body = { hasLiked };
});

likeRouter.post("/", async (ctx) => {
  const { commentId } = ctx.params;
  const userId = ctx.state.user.id;

  try {
    const existingLike = await LikeService.findOne({
      userId,
      commentId,
    });

    if (existingLike) {
      ctx.status = 200;
      ctx.body = existingLike;
      return;
    }

    const like = await LikeService.create({ userId, commentId });
    ctx.status = 201;
    ctx.body = like;
  } catch (error: unknown) {
    ctx.status = 400;
    ctx.body = {
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
});

likeRouter.delete("/", async (ctx) => {
  const { commentId } = ctx.params;
  const userId = ctx.state.user.id;

  try {
    const existingLike = await LikeService.findOne({
      userId,
      commentId,
    });

    if (!existingLike) {
      ctx.status = 404;
      ctx.body = { error: { message: "Like not found" } };
      return;
    }

    await LikeService.delete(userId, commentId);
    ctx.status = 200;
    ctx.body = { message: "Like removed successfully" };
  } catch (error: unknown) {
    ctx.status = 400;
    ctx.body = {
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
});
