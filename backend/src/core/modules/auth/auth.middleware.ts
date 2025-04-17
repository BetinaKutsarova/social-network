import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';
import { config } from '../../../config';
import { User } from '../../../models';
import { AuthService } from './auth.service';

export const authMiddleware = async (ctx: Context, next: Next) => {
	try {
		const token = ctx.cookies.get('auth_token');

		if (!token) {
			ctx.status = 401;
			ctx.body = { error: { message: 'Authentication required' } };
			return;
		}

		const isBlacklisted = await AuthService.isTokenBlacklisted(token);
		if (isBlacklisted) {
			ctx.status = 401;
			ctx.body = { error: { message: 'Token has been invalidated' } };
			return;
		}

		const decoded = jwt.verify(token, config.jwt.secret);

		if (typeof decoded !== 'object' || decoded === null) {
			throw new Error('Invalid token payload');
		}

		const user = await User.findByPk(decoded.userId);

		if (!user) {
			ctx.status = 401;
			ctx.body = { error: { message: 'Invalid token' } };
			return;
		}

		ctx.state.user = user;
		ctx.state.token = token; 

		await next();
	} catch (error) {
		ctx.status = 401;
		ctx.body = { error: { message: 'Invalid token' } };
	}
}