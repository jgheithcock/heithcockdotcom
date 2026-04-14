/** Client-safe helpers (no Node fs). */

export function videoByIdMap(videos) {
  return Object.fromEntries(videos.map((v) => [v.id, v]));
}
