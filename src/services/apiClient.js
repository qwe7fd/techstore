const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://techstore-api-mdzs.onrender.com/api';

export const getToken = () => localStorage.getItem('techstore_token');

// Single HTTP entry point: JSON body, optional Bearer token and
// parsed error messages from the API ({ statusCode, message }).
export const apiFetch = async (path, { method = 'GET', body, auth = true } = {}) => {
  const headers = {};
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (auth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Unable to reach the API. Please try again.');
  }

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = Array.isArray(data?.message)
      ? data.message.join('; ')
      : data?.message || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
};
