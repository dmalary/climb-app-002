export async function getUsers() {
  // const res = await fetch("/api/users"); 
  try {
    const res = await fetch("http://localhost:5000/api/users"); 

    if (!res.ok) {
      throw new Error(`Failed to fetch attempts: ${res.status}`);
    }

    return await res.json();

  } catch (err) {
    console.error("Error fetching session attempts:", err);
    return null;
  }
}

export async function getUserSessions(userId){
  try {
    const res = await fetch(`http://localhost:5000/api/user/sessions/${userId}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch attempts: ${res.status}`);
    }

    return await res.json();

  } catch (err) {
    console.error("Error fetching session attempts:", err);
    return null;
  }
}

export async function getSessionClimbs(sessionID){
  try {
      const res = await fetch(`http://localhost:5000/api/session/${sessionID}`);

      if (!res.ok) {
      throw new Error(`Failed to fetch attempts: ${res.status}`);
    }

    return await res.json();

  } catch (err) {
    console.error("Error fetching session attempts:", err);
    return null;
  }
}

export async function getUserSends(userId){
  try {  
    const res = await fetch(`http://localhost:5000/api/sends/${userId}`);
    
    if (!res.ok) {
      throw new Error(`Failed to fetch attempts: ${res.status}`);
    }

    return await res.json();

  } catch (err) {
    console.error("Error fetching session attempts:", err);
    return null;
  }
}

// export async function getHardestSend(userId){
// }

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