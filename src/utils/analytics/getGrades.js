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
export function getGradeProgression(attempts, gradeToNum) {
  return attempts
    .filter(a => a.isAscent)
    .sort((a, b) => a.date - b.date)
    .map(a => ({
      date: a.date,
      grade: gradeToNum(a.grade),
    }));
}