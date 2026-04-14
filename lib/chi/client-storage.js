/** Client-only: merged state for routines and per-video metadata. */

export const CHI_STORAGE_KEY = "chi:v1";

/**
 * @typedef {{ routines?: import('./types').ChiRoutine[]; videoMeta?: Record<string, Partial<import('./types').ChiVideo>> }} ChiOverrides
 */

/** @returns {ChiOverrides | null} */
export function loadLocalOverrides() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CHI_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** @param {ChiOverrides} data */
export function saveLocalOverrides(data) {
  localStorage.setItem(CHI_STORAGE_KEY, JSON.stringify(data));
}

function normalizeVideo(v) {
  const duration = v.duration ?? v.durationSec ?? 0;
  const { durationSec: _legacy, ...rest } = v;
  return { ...rest, duration };
}

/** Drop empty url fields so stale overrides cannot wipe src/thumbSrc from videos.json. */
function sanitizeVideoMetaPartial(partial) {
  if (!partial) return partial;
  const next = { ...partial };
  if (next.src === "") delete next.src;
  if (next.thumbSrc === "") delete next.thumbSrc;
  return next;
}

/** @param {import('./types').ChiVideo[]} base */
/** @param {ChiOverrides | null} overrides */
export function mergeVideos(base, overrides) {
  if (!overrides?.videoMeta) return base.map(normalizeVideo);
  return base.map((v) => {
    const m = sanitizeVideoMetaPartial(overrides.videoMeta[v.id]);
    return normalizeVideo(m ? { ...v, ...m } : v);
  });
}

/** @param {import('./types').ChiRoutine[]} base */
/** @param {ChiOverrides | null} overrides */
export function mergeRoutines(base, overrides) {
  if (overrides?.routines?.length) return overrides.routines;
  return base;
}

/** @returns {ChiOverrides} */
export function buildOverridesFromState(routines, videos) {
  const videoMeta = {};
  for (const v of videos) {
    videoMeta[v.id] = {
      title: v.title,
      tags: v.tags,
      thumbSrc: v.thumbSrc,
      src: v.src,
      duration: v.duration ?? v.durationSec,
    };
  }
  return { routines, videoMeta };
}
