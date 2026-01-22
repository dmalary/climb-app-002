import { apiFetch } from "./apiFetch"; 

export async function getUsers() {
  try {
    return await apiFetch("/api/users");
  } catch (err) {
    console.error("getUsers:", err);
    return null;
  }
}

export async function getUser(id, token) {
  try {
    return await apiFetch(`/api/users/${id}`, { token });
  } catch (err) {
    console.error("getUser:", err);
    return null;
  }
}

export async function getUserSessions(userId, token) {
  try {
    if (!userId) return [];

    return await apiFetch(`/api/sessions/user/${userId}`, { token });
  } catch (err) {
    // preserve your special 404 empty-state behavior
    if (err.status === 404) {
      return {
        empty: true,
        message: "Looks like there are no sessions yet — create your first climb session!",
      };
    }

    console.error("getUserSessions:", err);
    return [];
  }
}

export async function getSession(sessionId, token) {
  try {
    return await apiFetch(`/api/sessions/${sessionId}`, { token });
  } catch (err) {
    console.error("getSession:", err);
    return null;
  }
}

export async function getAllSessions() {
  try {
    return await apiFetch(`/api/sessions`);
  } catch (err) {
    console.error("getAllSessions:", err);
    return [];
  }
}

export async function getUserAttempts(userId, token) {
  try {
    if (!userId) return [];
    return await apiFetch(`/api/attempts/user/${userId}`, { token });
  } catch (err) {
    console.error("getUserAttempts:", err);
    return [];
  }
}

export async function getSessionAttempts(sessionId, token) {
  try {
    return await apiFetch(`/api/attempts/${sessionId}`, { token });
  } catch (err) {
    console.error("getSessionAttempts:", err);
    return null;
  }
}

export async function getAllAttempts() {
  try {
    return await apiFetch(`/api/attempts`);
  } catch (err) {
    console.error("getAllAttempts:", err);
    return null;
  }
}

export async function getFeed(token, { limit = 20, offset = 0 } = {}) {
    try {
    return await apiFetch(`/api/feed?limit=${limit}&offset=${offset}`, { token });
  } catch (err) {
    console.error("Feed fetch failed::", err);
    return null;
  }
}

// Likes
export async function likeSession(sessionId, token) {
  try {
    return await apiFetch(`/api/socials/sessions/${sessionId}/like`, {
      method: "POST",
      token,
    });
  } catch (err) {
    console.error("likeSession:", err);
    return null;
  }
}

export async function unlikeSession(sessionId, token) {
  try {
    return await apiFetch(`/api/socials/sessions/${sessionId}/like`, {
      method: "DELETE",
      token,
    });
  } catch (err) {
    console.error("unlikeSession:", err);
    return null;
  }
}

// Comments
export async function getSessionComments(sessionId, token, { limit = 50, offset = 0 } = {}) {
  try {
    const qs = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    return await apiFetch(`/api/socials/sessions/${sessionId}/comments?${qs.toString()}`, { token });
  } catch (err) {
    console.error("getSessionComments:", err);
    return [];
  }
}

export async function addSessionComment(sessionId, body, token) {
  try {
    return await apiFetch(`/api/socials/sessions/${sessionId}/comments`, {
      method: "POST",
      token,
      body: { body }, // matches server: req.body.body
    });
  } catch (err) {
    console.error("addSessionComment:", err);
    return null;
  }
}

export async function deleteComment(commentId, token) {
  try {
    return await apiFetch(`/api/socials/comments/${commentId}`, {
      method: "DELETE",
      token,
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