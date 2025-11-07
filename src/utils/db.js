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

export async function getUserSessions(){
  try {
    // const res = await fetch(`/api/sessions/${userId}`, {
    const res = await fetch(`/api/sessions`, {
      headers: {
        // Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      // throw new Error(`Failed to fetch attempts: ${res.status}`); 
      // currently getting this error because i log in with a user not yet created. i need a check + error "oops looks like there's no user, please create account" or something like that
      console.warn(`getUserSessions: received ${res.status}`);
      return [];
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