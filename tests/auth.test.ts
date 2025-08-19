import test from 'node:test';
import assert from 'node:assert/strict';
import signupHandler from '../src/pages/api/auth/signup';
import loginHandler from '../src/pages/api/auth/login';
import meHandler from '../src/pages/api/auth/me';
import { prisma } from '../src/lib/prisma';

function createMockReqRes({ method = 'GET', body = {}, cookies = {} } = {}) {
  const req = { method, body, cookies } as any;
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
  findUnique: async ({ where }: any) =>
    users.find((u) => (where.email ? u.email === where.email : u.id === where.id)) || null,
  create: async ({ data }: any) => {
    const user = { id: users.length + 1, ...data };
    users.push(user);
    return { id: user.id, email: user.email, passwordHash: user.passwordHash, role: user.role };
  },
};

test('signup creates new user', async () => {
  users.length = 0;
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
  users.push({ id: 1, email: 'a@a.com', passwordHash: 'hash' });
  const { req, res } = createMockReqRes({
    method: 'POST',
    body: { email: 'a@a.com', password: 'pass' },
  });
  await signupHandler(req, res);
  assert.equal(res.getStatus(), 409);
});

test('login succeeds and sets cookie', async () => {
  users.length = 0;
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

test('me returns null when not authenticated', async () => {
  const { req, res } = createMockReqRes();
  await meHandler(req, res);
  assert.equal(res.getStatus(), 200);
  assert.deepEqual(res.getJSON(), { user: null });
});

test('me returns user when session cookie present', async () => {
  users.length = 0;
  const { req: sReq, res: sRes } = createMockReqRes({
    method: 'POST',
    body: { email: 'd@d.com', password: 'secret' },
  });
  await signupHandler(sReq, sRes);

  const { req, res } = createMockReqRes({ cookies: { session: '1' } });
  await meHandler(req, res);
  assert.equal(res.getStatus(), 200);
  assert.deepEqual(res.getJSON(), { user: { id: 1, email: 'd@d.com', role: 'CLIENT' } });
});
