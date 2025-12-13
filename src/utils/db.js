export async function getUsers() {
  // const res = await fetch("/api/users"); 
  try {
    // const res = await fetch("/api/users"); 
    const res = await fetch("/api/users"); 

    if (!res.ok) {
      throw new Error(`Failed to fetch attempts: ${res.status}`);
    }

    return await res.json();

  } catch (err) {
    console.error("Error fetching session attempts:", err);
    return null;
  }
}

export async function getUser(id, token) {
  try {
    const res = await fetch(`/api/users/${id}`, { 
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }); 

    // if (!res.ok) {
    //   throw new Error(`Failed to fetch user: ${res.status}`);
    // }

    return await res.json();

  } catch (err) {
    console.error("Error fetching session user:", err);
    return null;
  }
}

export async function getUserSessions(userId, token) {
  try {
    if (!userId) {
      console.warn("getUserSessions: no userId provided");
      return [];
    }

    const res = await fetch(`/api/sessions/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` })
      }
    });

    if (res.status === 404) {
      console.warn("No sessions found for this user.");
      return {
        empty: true,
        message: "Looks like there are no sessions yet — create your first climb session!"
      };
    }

    if (!res.ok) {
      console.warn(`getUserSessions: received ${res.status}`);
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error("Error fetching user sessions:", err);
    return [];
  }
}

export async function getAllSessions() {
  try {
    const res = await fetch(`/api/sessions`, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      console.warn(`getAllSessions: received ${res.status}`);
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error("Error fetching all sessions:", err);
    return [];
  }
}

export async function getUserAttempts(userId, token) {
  try {
    // Single fetch for ALL attempts
    const res = await fetch(`/api/attempts/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error(`Failed to fetch attempts: ${res.status}`);

    return await res.json();
  } catch (err) {
    console.error("Error fetching user attempts:", err);
    return [];
  }
}

export async function getSessionAttempts(sessionId, token){
  try {  
    const res = await fetch(`/api/attempts/session/${sessionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch attempts: ${res.status}`);
    }

    return await res.json();

  } catch (err) {
    console.error("Error fetching session attempts:", err);
    return null;
  }
}



// review below =====================================

export async function getFollowingSends(userId){
}

export async function getFollowers(userId){ 
}

export async function getFollowing(userId){
}

export async function getClimberLeaderboard(climbId){
}

export async function getGymClimberLeaderboard(climbId){
}

export async function getGymLeaderboard(climbId){
}

// export async function getHardestSend(userId){
// }

export async function getAllAttempts(sessionId, token){
  try {  
    const res = await fetch(`/api/attempts/`, {
      headers: {
        // Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch attempts: ${res.status}`);
    }

    return await res.json();

  } catch (err) {
    console.error("Error fetching session attempts:", err);
    return null;
  }
}

export async function getUserSessionAttempts(sessionId, token){
  try {  
    const res = await fetch(`/api/attempts/${sessionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch attempts: ${res.status}`);
    }

    return await res.json();

  } catch (err) {
    console.error("Error fetching session attempts:", err);
    return null;
  }
}

export async function getSessionClimbs(sessionID, token){
  try {
      const res = await fetch(`/api/session/${sessionID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

      if (!res.ok) {
      throw new Error(`Failed to fetch attempts: ${res.status}`);
    }

    return await res.json();

  } catch (err) {
    console.error("Error fetching session attempts:", err);
    return null;
  }
}

export async function getUserSends(userId, token){
  try {  
    const res = await fetch(`/api/sends/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch attempts: ${res.status}`);
    }

    return await res.json();

  } catch (err) {
    console.error("Error fetching session attempts:", err);
    return null;
  }
}
