import Router from 'koa-router';
import { authMiddleware } from '../auth';
import { PostAttributes, PostCreationAttributes } from '../../../models/Post';
import { PostService } from './post.service';


export const postRouter = new Router({
    prefix: '/post'
});

postRouter.use(authMiddleware);

postRouter.get('/', async ctx => {
    const posts = await PostService.getAll();
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

postRouter.post('/', async ctx => {
    try {
        const postData = {
            ...ctx.request.body as Omit<PostCreationAttributes, 'userId'>,
            userId: ctx.state.user.id
        };
        const post = await PostService.create(postData);

        ctx.status = 201;
        ctx.body = post;
    } catch (error: any) {
        ctx.status = 400;
        ctx.body = { error: { message: error.message } };
    }
});

postRouter.put('/:id', async ctx => {
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

    const postData = ctx.request.body as Partial<PostAttributes>;
    delete postData.userId;
    delete postData.id;
    
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