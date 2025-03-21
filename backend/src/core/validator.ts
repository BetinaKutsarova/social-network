import { Context, Next } from 'koa';
import { Schema, ValidationError } from 'yup';

export function validator<T>(schema: Schema<T>) { // use with all schemas, accepts generic type that defines the ctx
  return async (ctx: Context & { request: { body: T } }, next: Next) => {
    try {
      const data = ctx.request.body;
      const validatedData: T = await schema.validate(data, {
        abortEarly: false,
        stripUnknown: true
      });

      ctx.request.body = validatedData;
      await next();

    } catch (error) {
      if (error instanceof ValidationError) {
        ctx.status = 400;
        ctx.body = {
          error: {
            message: 'Validation Error',
            details: error.errors
          }
        };
        return;
      }

      throw error;
    }
  };
}
