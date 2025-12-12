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
