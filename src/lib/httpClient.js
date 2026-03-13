function joinUrl(baseUrl, path) {
  if (!baseUrl) return path;
  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

export function createHttpClient({
  baseUrl = import.meta.env.VITE_API_BASE_URL || '',
  headers: baseHeaders = {},
  onRequest,
  onResponse,
} = {}) {
  async function request(path, options = {}) {
    const url = joinUrl(baseUrl, path);
    const headers = {
      'Content-Type': 'application/json',
      ...baseHeaders,
      ...options.headers,
    };

    const config = {
      credentials: 'include',
      ...options,
      headers,
    };

    if (config.body && typeof config.body !== 'string' && !(config.body instanceof FormData)) {
      config.body = JSON.stringify(config.body);
    }

    if (config.body instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    const finalConfig = onRequest ? await onRequest({ url, config }) || config : config;
    const response = await fetch(url, finalConfig);
    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json') ? await response.json() : await response.text();

    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}`);
      error.status = response.status;
      error.payload = payload;
      throw error;
    }

    return onResponse ? onResponse(payload, response) : payload;
  }

  return {
    request,
    get(path, options) {
      return request(path, { ...options, method: 'GET' });
    },
    post(path, body, options) {
      return request(path, { ...options, method: 'POST', body });
    },
    put(path, body, options) {
      return request(path, { ...options, method: 'PUT', body });
    },
    patch(path, body, options) {
      return request(path, { ...options, method: 'PATCH', body });
    },
    delete(path, options) {
      return request(path, { ...options, method: 'DELETE' });
    },
  };
}

export const httpClient = createHttpClient();
