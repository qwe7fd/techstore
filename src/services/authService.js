import { apiFetch, getToken } from './apiClient';
import { migrateLocalCart } from './cartService';

const TOKEN_KEY = 'techstore_token';
const USER_KEY = 'techstore_user';

export const emitAuthChange = () => window.dispatchEvent(new Event('authUpdated'));

export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const persistSession = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  emitAuthChange();
};

export const login = async (email, password) => {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  });
  persistSession(data.accessToken, data.user);
  // Move anything left in the legacy localStorage cart into the API cart.
  void migrateLocalCart();
  return data.user;
};

export const register = async (email, password) => {
  await apiFetch('/auth/register', {
    method: 'POST',
    body: { email, password },
    auth: false,
  });
  // The API creates a customer and their empty cart — sign in right away.
  return login(email, password);
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  emitAuthChange();
};

// Called once on app start: refreshes the stored user and drops
// the session when the token has expired.
export const initAuth = async () => {
  if (!getToken()) {
    return null;
  }
  try {
    const profile = await apiFetch('/auth/profile');
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
    emitAuthChange();
    return profile;
  } catch (error) {
    if (error.status === 401) {
      logout();
    }
    return null;
  }
};
