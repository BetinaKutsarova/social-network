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

			ctx.cookies.set('auth_token', result.token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 24 * 60 * 60 * 1000,  // 1 day
			});

			ctx.status = 200;
			ctx.body = { success: true, message: 'Logged in successfully' };

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
			const token = ctx.cookies.get('auth_token');

			if (!token) {
				ctx.status = 400;
				ctx.body = { success: false, message: 'No authentication token provided' };
				return;
			}

			await AuthService.logout(token);

			ctx.cookies.set('auth_token', '', {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				maxAge: 0, // expire immediately
				sameSite: 'strict'
			});

			ctx.status = 200;
			ctx.body = { success: true, message: 'Logged out successfully' };
		} catch (error) {
			ctx.status = 500;
			ctx.body = { success: false, message: 'Failed to process logout' };
		}
	}
);