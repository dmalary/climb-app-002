/**
 * Usage patterns:
 *  - apiFetch("/api/users")                     // public
 *  - apiFetch("/api/users/123", { token })      // token provided
 *  - apiFetch("/api/users/123", { getToken })   // token callback (recommended from components)
 *
 * Options:
 *  - method, body, headers
 *  - token OR getToken
 *  - allowNonJson: true (if you ever fetch blobs/text)
 */

export async function apiFetch(path, { getToken, token, retry = true, ...opts } = {}) {
  const authToken = token ?? (getToken ? await getToken() : null);

  const headers = new Headers(opts.headers || {});
  if (authToken) headers.set("Authorization", `Bearer ${authToken}`);
  headers.set("Accept", "application/json");

  const res = await fetch(path, { ...opts, headers });
  const contentType = res.headers.get("content-type") || "";

  // If we got HTML, it's almost certainly middleware rewrite due to auth
  const isJson = contentType.includes("application/json");
  if (!isJson) {
    const text = await res.text().catch(() => "");
    const preview = text.slice(0, 200).replace(/\s+/g, " ");
    const err = new Error(
      `Non-JSON response (${res.status}) for ${res.url}. content-type="${contentType}". preview="${preview}"`
    );
    err.status = res.status;
    err.contentType = contentType;
    err.url = res.url;

    // If token likely expired, retry once with a freshly fetched token
    if (retry && getToken) {
      const fresh = await getToken({ skipCache: true }).catch(() => null);
      if (fresh && fresh !== authToken) {
        return apiFetch(path, { ...opts, getToken, token: fresh, retry: false });
      }
    }

    throw err;
  }

  // JSON path
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const err = new Error(`Request failed (${res.status}) for ${res.url}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return res.json();
}
