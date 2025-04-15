import Router from "koa-router";
import { validator } from "../../validator";
import { CommentService } from "./comments.service";
import {
  createCommentValidationSchema,
  updateCommentValidationSchema,
} from "./comments.validation-schema";

export const commentRouter = new Router({
  prefix: "/post/:postId/comment",
});


commentRouter.get("/", async (ctx) => {
  const { postId } = ctx.params;
  const comments = await CommentService.getByPostId(postId);
  ctx.body = comments;
});

commentRouter.post(
  "/",
  validator(createCommentValidationSchema),
  async (ctx) => {
    const { postId } = ctx.params;
    const commentData = {
      ...ctx.request.body,
      postId,
      userId: ctx.state.user.id,
    };

    try {
      const comment = await CommentService.create(commentData);
      ctx.status = 201;
      ctx.body = comment;
    } catch (error: unknown) {
      ctx.status = 400;
      ctx.body = {
        error: {
          message: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  }
);

commentRouter.get("/:id", async (ctx) => {
  const { id } = ctx.params;
  const comment = await CommentService.getById(id);
  if (!comment) {
    ctx.status = 404;
    ctx.body = { error: { message: "Comment not found" } };
    return;
  }

  ctx.body = comment;
});

commentRouter.put(
  "/:id",
  validator(updateCommentValidationSchema),
  async (ctx) => {
    const { id } = ctx.params;

    const comment = await CommentService.getById(id);
    if (!comment) {
      ctx.status = 404;
      ctx.body = { error: { message: "Comment not found" } };
      return;
    }

    if (comment.userId !== ctx.state.user.id) {
      ctx.status = 403;
      ctx.body = {
        error: {
          message: "Access denied - you can only update your own comments",
        },
      };
      return;
    }

    const commentData = ctx.request.body;

    const updatedComment = await CommentService.update(id, commentData);
    ctx.body = updatedComment;
  }
);

commentRouter.delete("/:id", async (ctx) => {
  const { id } = ctx.params;

  const comment = await CommentService.getById(id);
  if (!comment) {
    ctx.status = 404;
    ctx.body = { error: { message: "Comment not found" } };
    return;
  }

  if (comment.userId !== ctx.state.user.id && ctx.state.user.role !== "admin") {
    ctx.status = 403;
    ctx.body = {
      error: {
        message: "Access denied - you can only delete your own comments",
      },
    };
    return;
  }

  await CommentService.delete(id);
  ctx.status = 204;
});
