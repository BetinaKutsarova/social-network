import Router from 'koa-router';
import { validator } from '../../validator';
// import { authMiddleware } from '../auth';
import { createUserValidationSchema, updateUserValidationSchema } from './users.validation-schema';
import { UserService } from './users.service';

export const userRouter = new Router({
	prefix: '/users'
});

// userRouter.use(authMiddleware);

userRouter.get('/', async ctx => {
	if (ctx.state.user.role !== 'admin') {
		ctx.status = 403;
		ctx.body = { error: { message: 'Access denied' } };
		return;
	}

	const users = await UserService.getAll();
	ctx.body = users;
});


userRouter.get('/:id', async ctx => {
	const { id } = ctx.params;

	if (ctx.state.user.role !== 'admin' && ctx.state.user.id !== id) {
		ctx.status = 403;
		ctx.body = { error: { message: 'Access denied' } };
		return;
	}

	const user = await UserService.getById(id);
	if (!user) {
		ctx.status = 404;
		ctx.body = { error: { message: 'User not found' } };
		return;
	}

	ctx.body = user;
});

userRouter.post(
	'/',
	validator(createUserValidationSchema),
	async ctx => {
		if (ctx.state.user.role !== 'admin') {
			ctx.status = 403;
			ctx.body = { error: { message: 'Access denied' } };
			return;
		}

		try {
			const userData = ctx.request.body;
			const user = await UserService.create(userData);
			ctx.status = 201;
			ctx.body = user;

		} catch (error: unknown) {
			ctx.status = 400;
			ctx.body = { error: { message: error instanceof Error ? error.message : 'Unknown error' } };
		}
	}
);


userRouter.put(
	'/:id',
	validator(updateUserValidationSchema),
	async ctx => {
		const { id } = ctx.params;


		if (ctx.state.user.role !== 'admin' && ctx.state.user.id !== id) {
			ctx.status = 403;
			ctx.body = { error: { message: 'Access denied' } };
			return;
		}

		const userData = ctx.request.body;

		if (ctx.state.user.role !== 'admin' && userData.role) {
			delete userData.role;
		}

		const updatedUser = await UserService.update(id, userData);
		if (!updatedUser) {
			ctx.status = 404;
			ctx.body = { error: { message: 'User not found' } };
			return;
		}

		ctx.body = updatedUser;
	}
);

userRouter.delete('/:id', async ctx => {
	const { id } = ctx.params;
	const loggedInUserId = ctx.state.user.id;

	if (id !== loggedInUserId && ctx.state.user.role !== 'admin') {
		ctx.status = 403;
		ctx.body = { error: { message: 'Access denied' } };
		return;
	}

	const deleted = await UserService.delete(id);

	if (!deleted) {
		ctx.status = 404;
		ctx.body = { error: { message: 'User not found' } };
		return;
	}

	ctx.status = 204;
});