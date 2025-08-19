import test from 'node:test';
import assert from 'node:assert/strict';
import signupHandler from '../src/pages/api/auth/signup';
import loginHandler from '../src/pages/api/auth/login';
import recoverHandler from '../src/pages/api/auth/recover';
import { prisma } from '../src/lib/prisma';
import { rateLimiters } from '../src/lib/rateLimit';

function createMockReqRes({ method = 'GET', body = {} } = {}) {
  const req = { method, body } as any;
  let statusCode = 200;
  let jsonData: any;
  const headers: Record<string, string[]> = {};
  const res: any = {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(data: any) {
      jsonData = data;
      return this;
    },
    setHeader(name: string, value: any) {
      headers[name.toLowerCase()] = Array.isArray(value) ? value : [value];
    },
    end() {
      return this;
    },
    getStatus() {
      return statusCode;
    },
    getJSON() {
      return jsonData;
    },
    getHeaders() {
      return headers;
    },
  };
  return { req, res };
}

const users: any[] = [];
(prisma as any).user = {
  findUnique: async ({ where: { email } }: any) =>
    users.find((u) => u.email === email) || null,
  create: async ({ data }: any) => {
    const user = { id: users.length + 1, ...data };
    users.push(user);
    return { id: user.id, email: user.email, passwordHash: user.passwordHash, role: user.role };
  },
};

test('signup creates new user', async () => {
  users.length = 0;
  rateLimiters.signup.reset('global');
  const { req, res } = createMockReqRes({
    method: 'POST',
    body: { email: 'a@a.com', password: 'pass' },
  });
  await signupHandler(req, res);
  assert.equal(res.getStatus(), 201);
  assert.deepEqual(res.getJSON(), { id: 1, email: 'a@a.com', role: 'CLIENT' });
});

test('signup fails if user exists', async () => {
  users.length = 0;
  rateLimiters.signup.reset('global');
  users.push({ id: 1, email: 'a@a.com', passwordHash: 'hash' });
  const { req, res } = createMockReqRes({
    method: 'POST',
    body: { email: 'a@a.com', password: 'pass' },
  });
  await signupHandler(req, res);
  assert.equal(res.getStatus(), 409);
});

test('signup locks after repeated failures', async () => {
  users.length = 0;
  rateLimiters.signup.reset('global');
  users.push({ id: 1, email: 'e@e.com', passwordHash: 'hash' });
  for (let i = 0; i < 5; i++) {
    const { req, res } = createMockReqRes({
      method: 'POST',
      body: { email: 'e@e.com', password: 'pass' },
    });
    await signupHandler(req, res);
  }
  const { req, res } = createMockReqRes({
    method: 'POST',
    body: { email: 'e@e.com', password: 'pass' },
  });
  await signupHandler(req, res);
  assert.equal(res.getStatus(), 429);
});

test('login succeeds and sets cookie', async () => {
  users.length = 0;
  rateLimiters.login.reset('global');
  rateLimiters.signup.reset('global');
  const { req: sReq, res: sRes } = createMockReqRes({
    method: 'POST',
    body: { email: 'b@b.com', password: 'secret' },
  });
  await signupHandler(sReq, sRes);

  const { req, res } = createMockReqRes({
    method: 'POST',
    body: { email: 'b@b.com', password: 'secret' },
  });
  await loginHandler(req, res);
  assert.equal(res.getStatus(), 200);
  const cookies = res.getHeaders()['set-cookie'];
  assert.ok(cookies && /session=/.test(cookies[0]));
});

test('login fails with wrong password', async () => {
  users.length = 0;
  rateLimiters.login.reset('global');
  rateLimiters.signup.reset('global');
  const { req: sReq, res: sRes } = createMockReqRes({
    method: 'POST',
    body: { email: 'c@c.com', password: 'correct' },
  });
  await signupHandler(sReq, sRes);

  const { req, res } = createMockReqRes({
    method: 'POST',
    body: { email: 'c@c.com', password: 'wrong' },
  });
  await loginHandler(req, res);
  assert.equal(res.getStatus(), 401);
});

test('login locks after multiple failed attempts', async () => {
  users.length = 0;
  rateLimiters.login.reset('global');
  rateLimiters.signup.reset('global');
  const { req: sReq, res: sRes } = createMockReqRes({
    method: 'POST',
    body: { email: 'd@d.com', password: 'pass' },
  });
  await signupHandler(sReq, sRes);
  for (let i = 0; i < 5; i++) {
    const { req, res } = createMockReqRes({
      method: 'POST',
      body: { email: 'd@d.com', password: 'wrong' },
    });
    await loginHandler(req, res);
  }
  const { req, res } = createMockReqRes({
    method: 'POST',
    body: { email: 'd@d.com', password: 'wrong' },
  });
  await loginHandler(req, res);
  assert.equal(res.getStatus(), 429);
});

test('recover locks after multiple invalid attempts', async () => {
  users.length = 0;
  rateLimiters.recover.reset('global');
  for (let i = 0; i < 5; i++) {
    const { req, res } = createMockReqRes({
      method: 'POST',
      body: { email: 'unknown@none.com' },
    });
    await recoverHandler(req, res);
  }
  const { req, res } = createMockReqRes({
    method: 'POST',
    body: { email: 'unknown@none.com' },
  });
  await recoverHandler(req, res);
  assert.equal(res.getStatus(), 429);
});
