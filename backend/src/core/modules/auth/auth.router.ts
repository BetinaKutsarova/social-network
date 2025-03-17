import Router from 'koa-router';
import { validator } from '../../validator';
import { loginValidationSchema, registerValidationSchema } from './auth.validation-schema';
import { AuthService } from './auth.service';
import { UserAttributes } from '../../../models/User';

export const authRouter = new Router({
  prefix: '/auth'
});

authRouter.post(
  '/register',
  validator(registerValidationSchema),
  async (ctx) => {
    try {
      const userData = ctx.request.body as Omit<UserAttributes, "id" | "createdAt">;
      const user = await AuthService.register(userData);

      ctx.status = 201;
      ctx.body = {
        message: 'User registered successfully',
        user
      };
    } catch (error: any) {
      ctx.status = 400;
      ctx.body = {
        error: {
          message: error.message
        }
      };
    }
  }
);

authRouter.post(
  '/login',
  validator(loginValidationSchema),
  async (ctx) => {
    try {
      const { email, password } = ctx.request.body as { email: string; password: string };
      const result = await AuthService.login(email, password);

      ctx.body = {
        message: 'Login successful',
        ...result
      };
    } catch (error: any) {
      ctx.status = 401;
      ctx.body = {
        error: {
          message: error.message
        }
      };
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