import Router from "koa-router";
import { validator } from "../../validator";
import { PostService } from "./posts.service";
import {
  createPostValidationSchema,
  updatePostValidationSchema,
} from "./posts.validation-schema";

export const postRouter = new Router({
  prefix: "/post",
});

postRouter.get("/", async (ctx) => {
	const page = parseInt(String(ctx.query.page ?? "1"));
  const limit = parseInt(String(ctx.query.limit ?? "10"));

  const { posts, total } = await PostService.getAll(page, limit);
  ctx.body = { posts, total };
});

postRouter.get("/:userId", async (ctx) => {
  const { userId } = ctx.params;
  const page = parseInt(String(ctx.query.page ?? "1"));
  const limit = parseInt(String(ctx.query.limit ?? "10"));

  if (!userId) {
    ctx.status = 400;
    ctx.body = { error: "User ID is required" };
    return;
  }

  try {
    const allPosts = await PostService.getByUserId(userId);
    
    const total = allPosts.length;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
  
    const posts = allPosts.slice(startIndex, endIndex);
    
    ctx.body = { posts, total };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: "Failed to fetch posts" };
  }
});

postRouter.get("/:id", async (ctx) => {
  const { id } = ctx.params;
  const post = await PostService.getById(id);
  if (!post) {
    ctx.status = 404;
    ctx.body = { error: { message: "Post not found" } };
    return;
  }

  ctx.body = post;
});

postRouter.post("/", validator(createPostValidationSchema), async (ctx) => {
  const postData = {
    ...ctx.request.body,
    userId: ctx.state.user.id,
  };
  try {
    const post = await PostService.create(postData);
    ctx.status = 201;
    ctx.body = post;
  } catch (error: unknown) {
    ctx.status = 400;
    ctx.body = {
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
});

postRouter.put("/:id", validator(updatePostValidationSchema), async (ctx) => {
  const { id } = ctx.params;

  const post = await PostService.getById(id);
  if (!post) {
    ctx.status = 404;
    ctx.body = { error: { message: "Post not found" } };
    return;
  }

  if (post.userId !== ctx.state.user.id) {
    ctx.status = 403;
    ctx.body = {
      error: { message: "Access denied - you can only update your own posts" },
    };
    return;
  }

  const postData = ctx.request.body;

  const updatedPost = await PostService.update(id, postData);
  ctx.body = updatedPost;
});

postRouter.delete("/:id", async (ctx) => {
  const { id } = ctx.params;

  const post = await PostService.getById(id);
  if (!post) {
    ctx.status = 404;
    ctx.body = { error: { message: "Post not found" } };
    return;
  }

  if (post.userId !== ctx.state.user.id && ctx.state.user.role !== "admin") {
    ctx.status = 403;
    ctx.body = {
      error: { message: "Access denied - you can only delete your own posts" },
    };
    return;
  }

  try  { 
		await PostService.delete(id);
	} catch(error) {
		console.error("Error in delete post endpoint:", error);
	}
  ctx.status = 204;
});
