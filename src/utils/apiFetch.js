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
export async function apiFetch(
  url,
  {
    method = "GET",
    body,
    headers = {},
    token,
    getToken,
    allowNonJson = false,
  } = {}
) {
  // Resolve token if a token callback is provided
  const resolvedToken =
    token ?? (typeof getToken === "function" ? await getToken() : undefined);

  const mergedHeaders = {
    // only set JSON content-type if we're sending a body
    ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...(resolvedToken ? { Authorization: `Bearer ${resolvedToken}` } : {}),
    ...headers,
  };

  const res = await fetch(url, {
    method,
    headers: mergedHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // 204 No Content
  if (res.status === 204) return null;

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  // If caller expects non-JSON (rare), let them handle it.
  if (!isJson) {
    if (allowNonJson) {
      const text = await res.text().catch(() => "");
      if (!res.ok) {
        throw new Error(
          `Request failed (${res.status}): ${text || res.statusText}`
        );
      }
      return text;
    }

    // Your guard
    throw new Error(
      `Non-JSON response received (${res.status}). content-type="${contentType}"`
    );
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    // Prefer server-provided error fields
    const msg =
      data?.error ||
      data?.message ||
      data?.details ||
      `Request failed (${res.status})`;

    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}
