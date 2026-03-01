import test from 'node:test';
import assert from 'node:assert/strict';
import signupHandler from '../src/pages/api/auth/signup';
import loginHandler from '../src/pages/api/auth/login';
import meHandler from '../src/pages/api/auth/me';
import recoverHandler from '../src/pages/api/auth/recover';
import { rateLimiters } from '../src/lib/rateLimit';
import { clearStore } from '../src/lib/store';

function createMockReqRes({ method = 'GET', body = {}, cookies = {}, query = {} } = {}) {
  const req = { method, body, cookies, query } as any;
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

test('signup creates new user', async () => {
  clearStore();
  rateLimiters.signup.reset('global');
  const { req, res } = createMockReqRes({ method: 'POST', body: { email: 'a@a.com', password: 'pass' } });
  await signupHandler(req, res);
  assert.equal(res.getStatus(), 201);
  assert.deepEqual(res.getJSON(), { id: 1, email: 'a@a.com', role: 'CLIENT' });
});

test('login succeeds and sets cookie', async () => {
  clearStore();
  rateLimiters.signup.reset('global');
  rateLimiters.login.reset('global');

  const { req: sReq, res: sRes } = createMockReqRes({ method: 'POST', body: { email: 'b@b.com', password: 'secret' } });
  await signupHandler(sReq, sRes);

  const { req, res } = createMockReqRes({ method: 'POST', body: { email: 'b@b.com', password: 'secret' } });
  await loginHandler(req, res);
  assert.equal(res.getStatus(), 200);
  assert.match(res.getHeaders()['set-cookie'][0], /session=1/);
});

test('me returns session user', async () => {
  clearStore();
  rateLimiters.signup.reset('global');

  const { req: sReq, res: sRes } = createMockReqRes({ method: 'POST', body: { email: 'c@c.com', password: 'secret' } });
  await signupHandler(sReq, sRes);

  const { req, res } = createMockReqRes({ cookies: { session: '1' } });
  await meHandler(req, res);
  assert.equal(res.getStatus(), 200);
  assert.deepEqual(res.getJSON(), { user: { id: 1, email: 'c@c.com', role: 'CLIENT' } });
});

test('recover updates password with valid token', async () => {
  clearStore();
  rateLimiters.signup.reset('global');
  rateLimiters.recover.reset('global');

  await signupHandler(
    createMockReqRes({ method: 'POST', body: { email: 'd@d.com', password: 'old' } }).req,
    createMockReqRes().res,
  );

  const reset = createMockReqRes({ method: 'POST', body: { email: 'd@d.com' } });
  await recoverHandler(reset.req, reset.res);
  assert.equal(reset.res.getStatus(), 200);
  const token = reset.res.getJSON().token;

  const update = createMockReqRes({ method: 'PUT', body: { token, password: 'newpass' } });
  await recoverHandler(update.req, update.res);
  assert.equal(update.res.getStatus(), 200);

  const login = createMockReqRes({ method: 'POST', body: { email: 'd@d.com', password: 'newpass' } });
  await loginHandler(login.req, login.res);
  assert.equal(login.res.getStatus(), 200);
});
