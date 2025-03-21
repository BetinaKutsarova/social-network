import Router from 'koa-router';
import { validator } from '../../validator';
import { loginValidationSchema, registerValidationSchema } from './auth.validation-schema';
import { AuthService } from './auth.service';


export const authRouter = new Router({
	prefix: '/auth'
});


authRouter.post(
	'/register',
	validator(registerValidationSchema),
	async (ctx) => {
		try {
			const userData = ctx.request.body
			const user = await AuthService.register(userData);
			ctx.status = 201;
			ctx.body = {
				message: 'User registered successfully',
				user
			};

		} catch (error: unknown) {
			ctx.status = 400;
			ctx.body = { error: { message: error instanceof Error ? error.message : 'Unknown error' } };
		}
	}
);

authRouter.post(
	'/login',
	validator(loginValidationSchema),
	async (ctx) => {


		try {
			const { email, password } = ctx.request.body;
			const result = await AuthService.login(email, password);

			ctx.body = {
				message: 'Login successful',
				...result
			};
		} catch (error: unknown) {
			ctx.status = 401;
			ctx.body = { error: { message: error instanceof Error ? error.message : 'Unknown error' } };
		}
	}
);

authRouter.post(
	'/logout',
	async (ctx) => {
		try {
			const authHeader = ctx.headers.authorization;

			if (!authHeader || !authHeader.startsWith('Bearer ')) {
				ctx.status = 400;
				ctx.body = { success: false, message: 'No authentication token provided' };
				return;
			}

			const token = authHeader.substring(7);
			await AuthService.logout(token);

			ctx.status = 200;
			ctx.body = { success: true, message: 'Logged out successfully' };
		} catch (error) {
			ctx.status = 500;
			ctx.body = { success: false, message: 'Failed to process logout' };
		}
	});