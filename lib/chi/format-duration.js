/**
 * @param {number} totalSec
 * @returns {string} e.g. "23:27", "1:05:02"
 */
export function formatDurationClock(totalSec) {
  if (totalSec == null || Number.isNaN(totalSec) || totalSec < 0) return "0:00";
  const s = Math.floor(totalSec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }
  return `${m}:${String(sec).padStart(2, "0")}`;
}
