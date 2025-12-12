export function cleanAttempts(data) {
  return data.map(d => ({
    board: d.board,
    angle: Number(d.angle),
    climbName: d.climb_name,
    date: new Date(d.date),
    grade: d.displayed_grade,
    isBenchmark: d.is_benchmark === "True",
    tries: Number(d.tries),
    totalTries: Number(d.tries_total),
    isAscent: d.is_ascent === "True",
    isRepeat: d.is_repeat === "True",
  }));
}

export function filterByBoard(attempts, board) {
  return attempts.filter(a => a.board === board);
}

export function filterBySession(attempts, sessionDate) {
  return attempts.filter(a =>
    a.date.toDateString() === new Date(sessionDate).toDateString()
  );
}