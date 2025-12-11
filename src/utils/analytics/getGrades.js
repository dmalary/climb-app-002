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
