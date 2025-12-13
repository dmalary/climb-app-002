export function getAttemptVsSendCounts(attempts) {
  let sends = 0;
  let attemptsOnly = 0;

  attempts.forEach(a => {
    if (a.is_ascent) sends++;
    else attemptsOnly++;
  });

  return {
    sends,
    attempts: attemptsOnly,
  };
}

export function getSessionBreakdown(attempts) {
  const total = attempts.length;
  const sends = attempts.filter(a => a.is_ascent).length;
  const flashes = attempts.filter(a => a.is_ascent && a.tries === 1).length;
  const tries = total - sends; // non-sends

  return {
    flashes,
    sends,
    attempts: tries,
  };
}

// Average grade (if you map grades to numeric scale)
export function getAverageGrade(attempts) {
  const numeric = attempts.map(a => a.grade);
  return numeric.reduce((a, b) => a + b, 0) / numeric.length;
}

// Highest grade
export function getMaxGrade(attempts) {
  return attempts.reduce((max, a) =>
    a.gradeNum > max.gradeNum ? a : max
  );
}

// Tries-to-send ratio
export function getTriesToSendRatio(attempts) {
  const sends = attempts.filter(a => a.isAscent);
  if (sends.length === 0) return 0;
  return (
    sends.reduce((sum, s) => sum + s.tries, 0) / sends.length
  );
}

// Flash rate
export function getFlashRate(attempts) {
  const sends = attempts.filter(a => a.isAscent).length;
  if (sends === 0) return 0;
  const flashes = attempts.filter(a => a.isAscent && a.tries === 1).length;
  return flashes / sends;
}

// Top climbs (by grade or by tries)
export function getTopClimbs(attempts, count = 3) {
  return attempts
    .sort((a, b) => b.grade - a.grade)
    .slice(0, count);
}

// ————————————— existing code stays —————————————

// Send percentage
export function getSendPercentage(attempts) {
  if (!attempts.length) return 0;
  const sends = attempts.filter(a => a.isAscent).length;
  return sends / attempts.length;
}

// Hardest flash (grade-based)
export function getMaxFlashGrade(attempts) {
  const flashes = attempts.filter(a => a.isAscent && a.tries === 1);
  if (flashes.length === 0) return null;
  return flashes.reduce((max, a) =>
    a.grade > max.grade ? a : max
  );
}

// Total unique climbs
export function getTotalUniqueClimbs(attempts) {
  const set = new Set(attempts.map(a => a.climbName));
  return set.size;
}

// Benchmark sends only
export function getBenchmarkCount(attempts) {
  return attempts.filter(a => a.isAscent && a.isBenchmark).length;
}

// Repeat sends only
export function getRepeatCount(attempts) {
  return attempts.filter(a => a.isAscent && a.isRepeat).length;
}

// Avg attempts per send
export function getAverageAttemptsPerSend(attempts) {
  const sends = attempts.filter(a => a.isAscent);
  if (sends.length === 0) return 0;
  const total = sends.reduce((sum, s) => sum + s.tries, 0);
  return total / sends.length;
}
