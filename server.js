import http from 'http';
import Koa from 'koa';
import Router from 'koa-router';
import cors from 'koa2-cors';
import koaBody from 'koa-body';
import { faker } from '@faker-js/faker';
faker.locale = 'en';

const app = new Koa();

app.use(cors());
app.use(koaBody({ json: true }));

const avatars = [];

let posts = [
  {
    username: 'Bear',
    avatar: 'https://raw.githubusercontent.com/axer665/js-react-router-crud-server/refs/heads/main/images/bear.jpg',
    id: 'JZSPV1_3st',
    content: 'The bear has no natural enemies',
    created: 1730188229345,
    status: 'admin'
  },
  {
    username: 'Wolf',
    avatar: 'https://raw.githubusercontent.com/axer665/js-react-router-crud-server/refs/heads/main/images/wolf.jpg',
    id: 'LuCE9tPsEY',
    content: 'Wolves are forest orderlies',
    created: 1720188229345,
    status: 'user',
  },
  {
    username: 'Fox',
    avatar: 'https://raw.githubusercontent.com/axer665/js-react-router-crud-server/refs/heads/main/images/fox.jpg',
    id: '1FD-Mt36Y2',
    content: 'Chanterelles are the most beautiful',
    created: 1710148259345,
    status: 'user'
  }
];

const router = new Router();

router.get('/posts', async (ctx, next) => {
  ctx.response.body = posts;
});

router.post('/posts', async (ctx, next) => {
  const { id, content } = ctx.request.body;
  const idx = posts.findIndex((post) => post.id === id);
  if (idx === -1) {
    posts.push({
      ...ctx.request.body,
      created: Date.now(),
      username: faker.name.findName(),
      status: 'user',
      avatar: faker.image.avatar()
    });
  } else {
    posts[idx] = {...ctx.request.body, content, created: Date.now()}
  }
  ctx.response.status = 204;
});

router.delete('/posts/:id', async (ctx, next) => {
  const postId = ctx.params.id;
  const index = posts.findIndex(o => o.id === postId);
  if (index !== -1) {
    posts.splice(index, 1);
  }
  ctx.response.status = 204;
});

router.get('/', async (ctx, next) => {
  ctx.response.body = 'Сервер работает';
})

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7777;
const server = http.createServer(app.callback());
server.listen(port, () => console.log(`The server started on port ${port}`));

export default server;
