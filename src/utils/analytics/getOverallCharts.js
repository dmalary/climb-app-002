import { startOfWeek } from "date-fns";

/**
 * Normalize any date input into a real Date
 */
function toDate(value) {
  if (value instanceof Date) return value;
  return new Date(value);
}

/**
 * Week key as timestamp (Monday start)
 */
function weekKey(date) {
  return startOfWeek(date, { weekStartsOn: 1 }).getTime();
}

// -------------------------
// Group attempts by week
// -------------------------
export function groupByWeek(attempts) {
  const map = {};

  attempts.forEach(a => {
    const d = toDate(a.date);
    if (isNaN(d)) return;

    const key = weekKey(d);
    if (!map[key]) map[key] = [];
    map[key].push(a);
  });

  return map;
}

// -------------------------
// Grade progression (hardest send per week)
// -------------------------
export function computeGradeProgression(attempts) {
  const byWeek = groupByWeek(attempts);

  return Object.entries(byWeek)
    .map(([week, weekAttempts]) => {
      const sends = weekAttempts.filter(
        a => a.isAscent && a.gradeNum != null
      );
      return {
        week: Number(week), // TIMESTAMP
        grade: sends.length
          ? Math.max(...sends.map(a => a.gradeNum))
          : null
      };
    })
    .sort((a, b) => a.week - b.week);
}

// -------------------------
// Send rate trend
// -------------------------
export function computeSendRateTrend(attempts) {
  const byWeek = groupByWeek(attempts);

  return Object.entries(byWeek)
    .map(([week, weekAttempts]) => {
      const sends = weekAttempts.filter(a => a.isAscent).length;
      return {
        week: Number(week),
        sendRate: weekAttempts.length
          ? sends / weekAttempts.length
          : 0
      };
    })
    .sort((a, b) => a.week - b.week);
}

// -------------------------
// Weekly volume
// -------------------------
export function computeWeeklyVolume(attempts) {
  const byWeek = groupByWeek(attempts);

  return Object.entries(byWeek)
    .map(([week, weekAttempts]) => ({
      week: Number(week),
      volume: weekAttempts.length
    }))
    .sort((a, b) => a.week - b.week);
}

// -------------------------
// Attempts-to-send
// -------------------------
export function computeAttemptsToSend(attempts) {
  return attempts
    .filter(a => a.isAscent && a.gradeNum != null)
    .map(a => ({
      grade: a.gradeNum,
      attemptsToSend: a.tries ?? 1
    }));
}

// -------------------------
// Angle distribution
// -------------------------
export function computeAngleDistribution(attempts) {
  const map = {};

  attempts.forEach(a => {
    if (a.angle == null) return;
    map[a.angle] = (map[a.angle] || 0) + 1;
  });

  return Object.entries(map).map(([angle, count]) => ({
    angle: Number(angle),
    count
  }));
}

// -------------------------
// Angle–Grade relationship
// -------------------------
export function computeAngleGradeRelationship(attempts) {
  return attempts
    .filter(a => a.angle != null && a.gradeNum != null)
    .map(a => ({
      angle: a.angle,
      grade: a.gradeNum
    }));
}

// -------------------------
// Angle heatmap
// -------------------------
export function computeAngleHeatmap(attempts) {
  const heatmap = {};

  attempts.forEach(a => {
    if (a.angle == null || a.gradeNum == null) return;
    heatmap[a.angle] ??= {};
    heatmap[a.angle][a.gradeNum] =
      (heatmap[a.angle][a.gradeNum] || 0) + 1;
  });

  return heatmap;
}

// -------------------------
// Cumulative volume
// -------------------------
export function computeCumulativeVolume(attempts) {
  const sorted = [...attempts]
    .map(a => ({ ...a, date: toDate(a.date) }))
    .filter(a => !isNaN(a.date))
    .sort((a, b) => a.date - b.date);

  let cumulative = 0;
  return sorted.map(a => ({
    date: a.date.getTime(), // timestamp
    cumulative: ++cumulative
  }));
}
