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
  // const timeline = [...attempts]
  //   .sort((a, b) => a.date - b.date)
  //   .map((a, i) => ({
  //     index: i + 1,
  //     grade: a.gradeNum,
  //     attempts: a.totalTries,
  //     isAscent: a.isAscent,
  //   }));
// -------------------------
// Timeline (grouped by climb)
// -------------------------
const toTime = (d) => {
  if (!d) return 0;
  if (typeof d === "number") return d;
  const t = Date.parse(d);
  return Number.isFinite(t) ? t : 0;
};

// Group attempts by climb_uuid (preferred). Fall back to grade@angle key.
const groups = new Map();

for (const a of attempts) {
  const climbKey =
    a.climb_uuid ||
    a.climbUuid ||
    a.climb_id ||
    a.climbId ||
    `${a.grade ?? "–"} @ ${a.angle ?? "–"}°`;

  if (!groups.has(climbKey)) groups.set(climbKey, []);
  groups.get(climbKey).push(a);
}

// Turn each climb group into one timeline point
const timeline = [...groups.entries()]
  .map(([key, rows]) => {
    // sort within group to compute first/last time reliably
    const sorted = [...rows].sort((x, y) => toTime(x.date) - toTime(y.date));
    const first = sorted[0];

    const isAscent = sorted.some(r => Boolean(r.isAscent ?? r.is_ascent ?? r.sent ?? r.isSend));
    const attemptsCount = sorted.reduce((sum, r) => sum + (r.totalTries || 1), 0);

    return {
      // keep key for debugging / stable identity
      key,

      // choose a reasonable timestamp for ordering the point
      time: toTime(first.date),

      // y positioning: prefer numeric grade value if you have it
      grade: first.gradeNum ?? first.grade_num ?? first.grade_number ?? first.grade,

      // for tooltip + display
      attempts: attemptsCount,
      isAscent,

      climb_uuid: first.climb_uuid ?? first.climbUuid,
      climb_id: first.climb_id ?? first.climbId,
      climb_name: first.climb_name ?? first.name,
      angle: first.angle,
      displayed_grade: first.displayed_grade ?? first.grade_label ?? first.grade,
    };
  })
  .sort((a, b) => a.time - b.time)
  .map((d, i) => ({
    ...d,
    index: i + 1,
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
