import api, { USE_MOCK, TOKEN_KEY, USER_KEY } from './api';
import { mockUsers } from '../mock/users';
import { respond } from '../mock/_helpers';
import { ROLES } from '../utils/constants';

const fakeJwt = (user) =>
  `mock.${btoa(JSON.stringify({ sub: user.id, role: user.role, exp: Date.now() + 864e5 }))}.token`;

export const authService = {
  async login({ email, password, role }) {
    if (USE_MOCK) {
      const user =
        mockUsers.find((u) => u.email.toLowerCase() === String(email).toLowerCase()) ||
        mockUsers.find((u) => u.role === role) ||
        mockUsers[0];
      if (!password || password.length < 4) {
        await respond(null, 400);
        throw new Error('Password must be at least 4 characters.');
      }
      const data = await respond({ token: fakeJwt(user), user }, 700);
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      return data;
    }
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem(TOKEN_KEY, data.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return { token: data.access_token, user: data.user };
  },

  async register(payload) {
    if (USE_MOCK) {
      const user = {
        id: `usr-${Math.random().toString(36).slice(2, 7)}`,
        name: payload.name,
        email: payload.email,
        role: payload.role || ROLES.RESEARCHER,
        organization: payload.organization || '—',
        designation: '—', phone: payload.phone || '—', region: '—',
        joined: new Date().toISOString(), status: 'active', avatarTone: 'moss',
      };
      const data = await respond({ token: fakeJwt(user), user }, 800);
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      return data;
    }
    const { data } = await api.post('/auth/register', payload);

    localStorage.setItem(TOKEN_KEY, data.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));

    return {
      token: data.access_token,
      user: data.user,
    };
  },

  async updateProfile(patch) {
    if (USE_MOCK) {
      const current = JSON.parse(localStorage.getItem(USER_KEY) || '{}');
      const user = await respond({ ...current, ...patch }, 600);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return user;
    }
    const { data } = await api.patch('/auth/me', patch);
    localStorage.setItem(USER_KEY, JSON.stringify(data));
    return data;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getStoredUser() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY));
    } catch {
      return null;
    }
  },

  getToken: () => localStorage.getItem(TOKEN_KEY),
};
