const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

app.use(bodyParser());

router.get('/', (ctx) => {
  ctx.body = { message: 'Welcome to Social Network API' };
});

router.get('/api/health', (ctx) => {
  ctx.body = { status: 'OK', timestamp: new Date() };
});

app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});