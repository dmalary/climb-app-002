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
