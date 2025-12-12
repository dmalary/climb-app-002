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
