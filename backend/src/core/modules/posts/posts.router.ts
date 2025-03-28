import Router from 'koa-router';
import { validator } from '../../validator';
// import { authMiddleware } from '../auth';
import { PostService } from './posts.service';
import { createPostValidationSchema, updatePostValidationSchema } from './posts.validation-schema';


export const postRouter = new Router({
	prefix: '/post'
});

// postRouter.use(authMiddleware);

postRouter.get('/', async ctx => {
	const posts = await PostService.getAll();
	ctx.body = posts;
});

// get all posts of logged-in user
postRouter.get('/:userId', async ctx => {
  const { userId } = ctx.params;
  
  if (!userId) {
    ctx.status = 400;
    ctx.body = { error: 'User ID is required' };
    return;
  }
  
  const posts = await PostService.getByUserId(userId);
  ctx.body = posts;
});

postRouter.get('/:id', async ctx => {
	const { id } = ctx.params;
	const post = await PostService.getById(id);
	if (!post) {
		ctx.status = 404;
		ctx.body = { error: { message: 'Post not found' } };
		return;
	}

	ctx.body = post;
});

postRouter.post('/', validator(createPostValidationSchema), async ctx => {
	const postData = {
		...ctx.request.body,
		userId: ctx.state.user.id
	};
	try {
		const post = await PostService.create(postData);
		ctx.status = 201;
		ctx.body = post;

	} catch (error: unknown) {
		ctx.status = 400;
		ctx.body = { error: { message: error instanceof Error ? error.message : 'Unknown error' } };
	}
});

postRouter.put('/:id', validator(updatePostValidationSchema), async ctx => {
	const { id } = ctx.params;

	const post = await PostService.getById(id);
	if (!post) {
		ctx.status = 404;
		ctx.body = { error: { message: 'Post not found' } };
		return;
	}

	if (post.userId !== ctx.state.user.id) {
		ctx.status = 403;
		ctx.body = { error: { message: 'Access denied - you can only update your own posts' } };
		return;
	}

	const postData = ctx.request.body;

	const updatedPost = await PostService.update(id, postData);
	ctx.body = updatedPost;
});

postRouter.delete('/:id', async ctx => {
	const { id } = ctx.params;

	const post = await PostService.getById(id);
	if (!post) {
		ctx.status = 404;
		ctx.body = { error: { message: 'Post not found' } };
		return;
	}

	if (post.userId !== ctx.state.user.id && ctx.state.user.role !== 'admin') {
		ctx.status = 403;
		ctx.body = { error: { message: 'Access denied - you can only delete your own posts' } };
		return;
	}

	await PostService.delete(id);
	ctx.status = 204;
});