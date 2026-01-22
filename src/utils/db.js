import { apiFetch } from "./apiFetch";

/**
 * Helpers:
 * Prefer passing `getToken` from Clerk useAuth() (fresh token each request).
 * We keep `token` for backward compatibility.
 */
function withAuth(tokenOrGetToken) {
  // supports calling style: fn(id, token) OR fn(id, getToken)
  if (typeof tokenOrGetToken === "function") return { getToken: tokenOrGetToken };
  if (typeof tokenOrGetToken === "string" && tokenOrGetToken.length) return { token: tokenOrGetToken };
  return {}; // unauth / public
}

// --- Users ---
export async function getUsers(tokenOrGetToken) {
  try {
    return await apiFetch("/api/users", withAuth(tokenOrGetToken));
  } catch (err) {
    console.error("getUsers:", err);
    return []; // safe default
  }
}

export async function getUser(id, tokenOrGetToken) {
  try {
    if (!id) return null;
    return await apiFetch(`/api/users/${id}`, withAuth(tokenOrGetToken));
  } catch (err) {
    console.error("getUser:", err);
    return null;
  }
}

// --- Sessions ---
export async function getUserSessions(userId, tokenOrGetToken) {
  try {
    if (!userId) return [];
    return await apiFetch(`/api/sessions/user/${userId}`, withAuth(tokenOrGetToken));
  } catch (err) {
    // preserve your special 404 empty-state behavior
    if (err?.status === 404) {
      return {
        empty: true,
        message: "Looks like there are no sessions yet — create your first climb session!",
      };
    }

    console.error("getUserSessions:", err);
    return [];
  }
}

export async function getSession(sessionId, tokenOrGetToken) {
  try {
    if (!sessionId) return null;
    return await apiFetch(`/api/sessions/${sessionId}`, withAuth(tokenOrGetToken));
  } catch (err) {
    console.error("getSession:", err);
    return null;
  }
}

export async function getAllSessions(tokenOrGetToken) {
  try {
    return await apiFetch(`/api/sessions`, withAuth(tokenOrGetToken));
  } catch (err) {
    console.error("getAllSessions:", err);
    return [];
  }
}

// --- Attempts ---
export async function getUserAttempts(userId, tokenOrGetToken) {
  try {
    if (!userId) return [];
    return await apiFetch(`/api/attempts/user/${userId}`, withAuth(tokenOrGetToken));
  } catch (err) {
    console.error("getUserAttempts:", err);
    return [];
  }
}

export async function getSessionAttempts(sessionId, tokenOrGetToken) {
  try {
    if (!sessionId) return [];
    return await apiFetch(`/api/attempts/${sessionId}`, withAuth(tokenOrGetToken));
  } catch (err) {
    console.error("getSessionAttempts:", err);
    return []; // <-- critical: never return null for list
  }
}

export async function getAllAttempts(tokenOrGetToken) {
  try {
    return await apiFetch(`/api/attempts`, withAuth(tokenOrGetToken));
  } catch (err) {
    console.error("getAllAttempts:", err);
    return [];
  }
}

// --- Feed ---
export async function getFeed(tokenOrGetToken, { limit = 20, offset = 0 } = {}) {
  try {
    return await apiFetch(`/api/feed?limit=${limit}&offset=${offset}`, withAuth(tokenOrGetToken));
  } catch (err) {
    console.error("getFeed:", err);
    return {
      items: [],
      limit,
      offset,
      empty: true,
      message: "Could not load feed. Please try again.",
    };
  }
}

// --- Likes ---
export async function likeSession(sessionId, tokenOrGetToken) {
  try {
    if (!sessionId) return null;
    return await apiFetch(`/api/socials/sessions/${sessionId}/like`, {
      method: "POST",
      ...withAuth(tokenOrGetToken),
    });
  } catch (err) {
    console.error("likeSession:", err);
    return null;
  }
}

export async function unlikeSession(sessionId, tokenOrGetToken) {
  try {
    if (!sessionId) return null;
    return await apiFetch(`/api/socials/sessions/${sessionId}/like`, {
      method: "DELETE",
      ...withAuth(tokenOrGetToken),
    });
  } catch (err) {
    console.error("unlikeSession:", err);
    return null;
  }
}

// --- Comments ---
export async function getSessionComments(sessionId, tokenOrGetToken, { limit = 50, offset = 0 } = {}) {
  try {
    if (!sessionId) return [];
    const qs = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    return await apiFetch(`/api/socials/sessions/${sessionId}/comments?${qs.toString()}`, withAuth(tokenOrGetToken));
  } catch (err) {
    console.error("getSessionComments:", err);
    return [];
  }
}

export async function addSessionComment(sessionId, body, tokenOrGetToken) {
  try {
    if (!sessionId) return null;
    return await apiFetch(`/api/socials/sessions/${sessionId}/comments`, {
      method: "POST",
      ...withAuth(tokenOrGetToken),
      body: { body }, // matches server: req.body.body
    });
  } catch (err) {
    console.error("addSessionComment:", err);
    return null;
  }
}

export async function deleteComment(commentId, tokenOrGetToken) {
  try {
    if (!commentId) return null;
    return await apiFetch(`/api/socials/comments/${commentId}`, {
      method: "DELETE",
      ...withAuth(tokenOrGetToken),
    });
  } catch (err) {
    console.error("deleteComment:", err);
    return null;
  }
}


// review below (i may need to implement down the line) 
// =====================================

// export async function getFollowingSends(userId){
// }

// export async function getFollowers(userId){ 
// }

// export async function getFollowing(userId){
// }

// export async function getClimberLeaderboard(climbId){
// }

// export async function getGymClimberLeaderboard(climbId){
// }

// export async function getGymLeaderboard(climbId){
// }

// export async function getHardestSend(userId){
// }

// export async function getUserSessionAttempts(userId, sessionId, token){
// }