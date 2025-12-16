export function getSessionNums(attempts = []) { //make sure attempts format is clean. may have to take from getOverallNums or move that function to an analytics global utility.
  if (!attempts.length) return null;

  const sends = attempts.filter(a => a.isAscent);
  const flashes = sends.filter(a => a.tries === 1);
  const benchmarkSends = sends.filter(a => a.isBenchmark);

  const uniqueClimbs = new Set(
    attempts.map(a => a.climbName || `${a.angle}-${a.grade}`)
  );

  const grades = sends
    .map(a => a.gradeNum)
    .filter(g => g != null);

  const avgGrade =
    grades.length
      ? (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1)
      : null;

  const maxGrade =
    grades.length
      ? `V${Math.max(...grades)}`
      : null;

  const angles = [
    ...new Set(
      attempts
        .map(a => a.angle)
        .filter(a => a != null)
    ),
  ].sort((a, b) => a - b);

  const board =
    attempts[0]?.board
      ? `${attempts[0].board.charAt(0).toUpperCase()}${attempts[0].board.slice(1)}`
      : "–";

  return {
    // core counts
    attempts: attempts.length,
    sends: sends.length,
    flashes: flashes.length,

    // derived rates
    attemptsPerClimb: uniqueClimbs.size
      ? (attempts.length / uniqueClimbs.size).toFixed(2)
      : "–",

    // grades
    avgGrade,
    maxGrade,

    // metadata
    angles: angles.join(", "),
    board,

    // benchmarks
    benchmarkCount: benchmarkSends.length,
  };
}
