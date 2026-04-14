/**
 * @typedef {Object} ChiVideo
 * @property {string} id
 * @property {string} title
 * @property {string} src
 * @property {number} duration — length in seconds (may come from CSV timecode; legacy `durationSec` accepted when merging)
 * @property {string[]} tags
 * @property {string} [thumbSrc]
 */

/**
 * @typedef {Object} ChiRoutine
 * @property {string} id
 * @property {string} title
 * @property {string[]} videoIds
 */

export {};
