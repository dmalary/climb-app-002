import { normalizeVGrade } from "@/utils/grades";

// Angle distribution histogram
export function getAngleHistogram(attempts) {
  const counts = {};

  attempts.forEach(a => {
    const angle = a.angle;
    if (!counts[angle]) counts[angle] = 0;
    counts[angle]++;
  });

  return Object.entries(counts)
    .map(([angle, count]) => ({ angle: Number(angle), count }))
    .sort((a, b) => a.angle - b.angle);
}

// Angle x Grade heatmap
export function getAngleGradeHeatmap(attempts) {
  const heat = {};

  attempts.forEach(a => {
    const key = `${a.angle}_${a.grade}`;
    if (!heat[key]) heat[key] = 0;
    heat[key]++;
  });

  return Object.entries(heat).map(([key, count]) => {
    const [angle, grade] = key.split("_");
    return { angle: Number(angle), grade, count };
  });
}

export function cleanAttempts(data) {
  return data.map(d => {
    const grade = normalizeVGrade(d.displayed_grade);

    return {
      board: d.board,
      angle: Number(d.angle),
      climbName: d.climb_name,
      date: new Date(d.date),
      grade,                    // ✅ normalized V-grade
      gradeNum: grade ? Number(grade.replace("V", "")) : null,
      isBenchmark: d.is_benchmark === true || d.is_benchmark === "True",
      tries: Number(d.tries),
      totalTries: Number(d.tries_total),
      isAscent: d.is_ascent === true || d.is_ascent === "True",
      isRepeat: d.is_repeat === true || d.is_repeat === "True",
    };
  });
}

export function filterByBoard(attempts, board) {
  return attempts.filter(a => a.board === board);
}

export function filterBySession(attempts, sessionDate) {
  return attempts.filter(a =>
    a.date.toDateString() === new Date(sessionDate).toDateString()
  );
}

export function getGradeHistogram(attempts) {
  const counts = {};

  attempts.forEach(a => {
    const grade = a.grade;
    if (!counts[grade]) counts[grade] = 0;
    counts[grade]++;
  });

  return Object.entries(counts)
    .map(([grade, count]) => ({ grade, count }))
    .sort((a, b) => a.grade.localeCompare(b.grade));
}

// Grade progression over time
export function getGradeProgression(attempts) {
  return attempts
    .filter(a => a.isAscent)
    .sort((a, b) => a.date - b.date)
    .map(a => ({
      date: a.date,
      grade: a.grade,
    }));
}

export function getSessionSummary(climbs) {
  let sends = 0;
  let flashes = 0;
  let fails = 0;

  for (const c of climbs) {
    if (c.flash) flashes += 1;
    else if (c.sent) sends += 1;
    else fails += 1;
  }

  return [
    { name: "Flashes", value: flashes },
    { name: "Sends", value: sends },
    { name: "Fails", value: fails }
  ];
}

export function getAttemptVsSendCounts(attempts) {
  let sends = 0;
  let attemptsOnly = 0;

  attempts.forEach(a => {
    if (a.isAscent) sends++;
    else attemptsOnly++;
  });

  return {
    sends,
    attempts: attemptsOnly,
  };
}

export function getSessionBreakdown(attempts) {
  const total = attempts.length;
  const sends = attempts.filter(a => a.isAscent).length;
  const flashes = attempts.filter(a => a.isAscent && a.tries === 1).length;
  const tries = total - sends; // non-sends

  return {
    flashes,
    sends,
    attempts: tries,
  };
}

// Average grade (if you map grades to numeric scale)
export function getAverageGrade(attempts) {
  const numeric = attempts.map(a => a.gradeNum);
  return numeric.reduce((a, b) => a + b, 0) / numeric.length;
}

// Highest grade
export function getMaxGrade(attempts) {
  const ascents = attempts.filter(a => a.isAscent);
  if (ascents.length === 0) return null;

  return ascents.reduce((max, a) => (a.gradeNum > max.gradeNum ? a : max));
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

// trends.js

// Weekly volume
export function getWeeklyVolume(attempts) {
  const weeks = {};

  attempts.forEach(a => {
    const week = getISOWeek(a.date);
    if (!weeks[week]) weeks[week] = 0;
    weeks[week]++;
  });

  return Object.entries(weeks).map(([week, count]) => ({
    week,
    count
  }));
}

function getISOWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((d - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
    )
  );
}

// Send percentage over time
export function getSendTrend(attempts) {
  const byDate = {};

  attempts.forEach(a => {
    const key = a.date.toDateString();
    if (!byDate[key]) byDate[key] = { attempts: 0, sends: 0 };
    byDate[key].attempts++;
    if (a.isAscent) byDate[key].sends++;
  });

  return Object.entries(byDate).map(([date, v]) => ({
    date: new Date(date),
    sendRate: v.sends / v.attempts,
  }));
}
