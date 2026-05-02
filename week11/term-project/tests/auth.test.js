import request from 'supertest';
import bcrypt from 'bcrypt';
import { jest } from '@jest/globals';

process.env.NODE_ENV = 'test';
process.env.SESSION_SECRET = 'test-session-secret';

const users = new Map();
let nextUserId = 1;

function normalizeEmail(email) {
  return String(email).toLowerCase().trim();
}

function resetUsers() {
  users.clear();
  nextUserId = 1;
}

function hydrateUser(record) {
  return record ? new MockUser({ ...record }) : null;
}

function getUserByEmail(email) {
  return [...users.values()].find((user) => user.email === normalizeEmail(email));
}

function getUserByGoogleId(googleId) {
  return [...users.values()].find((user) => user.googleId === googleId);
}

class MockUser {
  constructor(data = {}) {
    Object.assign(this, data);
    this._id = this._id || `user-${nextUserId++}`;
    this.id = this.id || this._id;
    this.provider = this.provider || 'local';
    this.role = this.role || 'user';
    if (this.email) {
      this.email = normalizeEmail(this.email);
    }
  }

  async save() {
    if (this.email) {
      this.email = normalizeEmail(this.email);
    }

    const duplicate = [...users.values()].find(
      (user) => user.email === this.email && user._id !== this._id
    );
    if (duplicate) {
      const error = new Error('Duplicate email');
      error.code = 11000;
      throw error;
    }

    if (this.password && !this.password.startsWith('$2')) {
      this.password = await bcrypt.hash(this.password, 10);
    }

    users.set(this._id, { ...this });
    return this;
  }

  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }

  static async findOne(query) {
    if (query.email) {
      return hydrateUser(getUserByEmail(query.email));
    }
    if (query.googleId) {
      return hydrateUser(getUserByGoogleId(query.googleId));
    }
    return null;
  }

  static async findById(id) {
    return hydrateUser(users.get(id));
  }

  static async findOneAndUpdate(query, update, options = {}) {
    const existing = query.googleId ? getUserByGoogleId(query.googleId) : getUserByEmail(query.email);

    if (!existing && !options.upsert) {
      return null;
    }

    const record = existing ? { ...existing } : {
      _id: `user-${nextUserId++}`,
      provider: 'local',
      role: 'user'
    };
    record.id = record.id || record._id;

    const values = update.$set || update;
    Object.assign(record, values);
    if (record.email) {
      record.email = normalizeEmail(record.email);
    }

    users.set(record._id, record);
    return hydrateUser(record);
  }

  static async deleteMany() {
    resetUsers();
  }
}

jest.unstable_mockModule('../models/User.js', () => ({
  default: MockUser,
  __getUserByEmail: getUserByEmail,
  __getUserByGoogleId: getUserByGoogleId,
  __resetUsers: resetUsers
}));

jest.unstable_mockModule('../models/Property.js', () => ({
  default: {
    find: jest.fn(async () => [])
  }
}));

const { default: app } = await import('../server.js');
const {
  default: User,
  __getUserByEmail,
  __getUserByGoogleId,
  __resetUsers
} = await import('../models/User.js');

describe('Authentication Acceptance Criteria', () => {
  beforeEach(() => {
    __resetUsers();
  });

  test('AC-3: local sign-up creates a hashed user and redirects to /admin/dashboard', async () => {
    const res = await request(app)
      .post('/admin/register')
      .send({
        email: 'new-user@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('/admin/dashboard');

    const user = __getUserByEmail('new-user@example.com');
    expect(user).toBeDefined();
    expect(user.password).not.toBe('password123');
    expect(await bcrypt.compare('password123', user.password)).toBe(true);
  });

  test('AC-4: local sign-in with correct credentials redirects and sets a session cookie', async () => {
    const user = new User({ email: 'login@example.com', password: 'password123' });
    await user.save();

    const res = await request(app)
      .post('/admin/login')
      .send({
        email: 'login@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('/admin/dashboard');
    expect(res.headers['set-cookie']).toEqual(
      expect.arrayContaining([expect.stringContaining('connect.sid')])
    );
  });

  test('AC-5: mocked Google OAuth callback creates a Google user and redirects to /admin/dashboard', async () => {
    const res = await request(app)
      .get('/admin/auth/google/callback')
      .query({
        googleId: 'google-123',
        email: 'google-user@example.com',
        displayName: 'Google Test User'
      });

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('/admin/dashboard');

    const user = __getUserByGoogleId('google-123');
    expect(user).toMatchObject({
      email: 'google-user@example.com',
      googleId: 'google-123',
      provider: 'google'
    });
  });

  test('AC-6: protected dashboard redirects unauthenticated visitors to /admin/login', async () => {
    const res = await request(app).get('/admin/dashboard');

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('/admin/login');
    expect(res.text).not.toContain('Hawaii Hospitality Admin');
  });

  test('AC-7: logout clears the session and blocks the next dashboard request', async () => {
    const user = new User({ email: 'logout@example.com', password: 'password123' });
    await user.save();

    const agent = request.agent(app);
    const loginRes = await agent
      .post('/admin/login')
      .send({
        email: 'logout@example.com',
        password: 'password123'
      });
    expect(loginRes.statusCode).toBe(302);

    const authenticatedRes = await agent.get('/admin/dashboard');
    expect(authenticatedRes.statusCode).toBe(200);

    const logoutRes = await agent.post('/admin/logout');
    expect(logoutRes.statusCode).toBe(302);
    expect(logoutRes.headers.location).toBe('/admin/login');
    expect(logoutRes.headers['set-cookie']).toEqual(
      expect.arrayContaining([expect.stringContaining('connect.sid=;')])
    );

    const nextRes = await agent.get('/admin/dashboard');
    expect(nextRes.statusCode).toBe(302);
    expect(nextRes.headers.location).toBe('/admin/login');
  });
});
