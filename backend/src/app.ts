import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import Router from 'koa-router';
import { initDatabase } from './core/db';
import { runSeeder } from './seed';

import { authRouter } from './core/modules/auth';
import { userRouter } from './core/modules/users';

console.log('userRouter imported successfully:', !!userRouter);

console.log('Loading app...');
console.log('Current directory:', __dirname);
console.log('Importing userRouter from:', './core/modules/users');

const app = new Koa();

app.use(cors());
app.use(bodyParser());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err: any) {
    ctx.status = err.status || 500;
    ctx.body = {
      error: {
        message: err.message || 'Internal Server Error',
        status: ctx.status
      }
    };
    ctx.app.emit('error', err, ctx);
  }
});

const rootRouter = new Router({ prefix: '/api' });

rootRouter.get('/', (ctx) => {
  ctx.body = { message: 'Welcome to Social Network API' };
})

rootRouter.use(authRouter.routes());
rootRouter.use(userRouter.routes());

app.use(rootRouter.routes());
app.use(rootRouter.allowedMethods());

console.log('Available routes:');
rootRouter.stack.forEach(item => {
  if (item.methods && item.methods.length > 0) {
    console.log(`${item.methods.join(',')} ${item.path}`);
  }
});

const startServer = async () => {
  try {
    await initDatabase();
    await runSeeder();

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

app.on('error', (err) => {
  console.error('Error:', err);
});

startServer();