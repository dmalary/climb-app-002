export async function getUsers() {
  // const res = await fetch("/api/users"); 
  const res = await fetch("http://localhost:5000/api/users"); 
  // const data = await res.json();
  // console.log(data);
  return res.json();
}

export async function getUserSessions(userId){
  const res = await fetch(`http://localhost:5000/api/sessions/${userId}`);
  return res.json();
}

// export async function getSessionClimbs(userId){
export async function getSessionClimbs(userId){
    const res = await fetch(`http://localhost:5000/api/sessions/${sessionID}/attempts/${userId}`);
  return res.json();
}

export async function getUserSends(userId){
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