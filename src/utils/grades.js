// Extract V-grade from strings like:
// "V6c/V0", "6c+/V5", "V8", "7A+/V7"
export function normalizeVGrade(raw) {
  if (!raw) return null;

  const match = raw.match(/V\d{1,2}/i);
  return match ? match[0].toUpperCase() : null;
}
