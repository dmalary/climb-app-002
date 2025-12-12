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
export function getAverageGrade(attempts, gradeToNum) {
  const numeric = attempts.map(a => gradeToNum(a.grade));
  return numeric.reduce((a, b) => a + b, 0) / numeric.length;
}

// Highest grade
export function getMaxGrade(attempts, gradeToNum) {
  return attempts.reduce((max, a) =>
    gradeToNum(a.grade) > gradeToNum(max.grade) ? a : max
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
export function getTopClimbs(attempts, gradeToNum, count = 3) {
  return attempts
    .sort((a, b) => gradeToNum(b.grade) - gradeToNum(a.grade))
    .slice(0, count);
}