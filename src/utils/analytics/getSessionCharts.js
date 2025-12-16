export function getSessionCharts(attempts = []) {
  if (!attempts.length) return null;

  // -------------------------
  // Attempts per climb
  // -------------------------
  const byClimb = {};

  attempts.forEach(a => {
    const key = `${a.grade ?? "–"} @ ${a.angle ?? "–"}°`;
    byClimb[key] ??= { climb: key, attempts: 0 };
    byClimb[key].attempts += a.totalTries || 1;
  });

  const attemptsPerClimb = Object.values(byClimb);

  // -------------------------
  // Sends vs attempts
  // -------------------------
  const sends = attempts.filter(a => a.isAscent).length;

  const sendsVsAttempts = [
    { name: "Sends", value: sends },
    { name: "Non-sends", value: attempts.length - sends },
  ];

  // -------------------------
  // Grade mix
  // -------------------------
  const gradeMap = {};

  attempts.forEach(a => {
    if (!a.grade) return;
    gradeMap[a.grade] = (gradeMap[a.grade] || 0) + 1;
  });

  const gradeMix = Object.entries(gradeMap).map(([grade, count]) => ({
    grade,
    count,
  }));

  // -------------------------
  // Angle mix
  // -------------------------
  const angleMap = {};

  attempts.forEach(a => {
    if (a.angle == null) return;
    angleMap[a.angle] = (angleMap[a.angle] || 0) + 1;
  });

  const angleMix = Object.entries(angleMap).map(([angle, count]) => ({
    angle: Number(angle),
    count,
  }));

  // -------------------------
  // Timeline
  // -------------------------
  const timeline = [...attempts]
    .sort((a, b) => a.date - b.date)
    .map((a, i) => ({
      index: i + 1,
      grade: a.gradeNum,
      attempts: a.totalTries,
      isAscent: a.isAscent,
    }));

  // -------------------------
  // Micro progression
  // -------------------------
  let maxSoFar = null;

  const microProgression = timeline.map(t => {
    if (t.isAscent && t.grade != null) {
      maxSoFar = maxSoFar == null ? t.grade : Math.max(maxSoFar, t.grade);
    }
    return {
      index: t.index,
      maxGrade: maxSoFar,
    };
  });

  return {
    attemptsPerClimb,
    sendsVsAttempts,
    gradeMix,
    angleMix,
    timeline,
    microProgression,
  };
}
