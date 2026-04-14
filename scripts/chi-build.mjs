#!/usr/bin/env node
/**
 * Build data/chi/videos.json and optional public/chi/thumbnails from a CSV.
 *
 * Usage:
 *   node scripts/chi-build.mjs --csv path/to/data.csv --mp4-dir path/to/mp4s \
 *     --video-base-url https://cdn.example.com/chi/videos/
 *
 * Env: CHI_CSV, CHI_MP4_DIR, CHI_VIDEO_BASE_URL (same as --video-base-url).
 * Use a base ending in .../tai-chi/videos/ so thumbSrc becomes .../tai-chi/thumbnails/{id}.jpg.
 *
 * CSV columns (header row): filename, thumbTime, …
 * - filename: local file name (e.g. arm-wrap.mp4 or subdir/arm-wrap.mp4); also used for slug and,
 *   when CHI_VIDEO_BASE_URL / --video-base-url is set, joined to that base to form `src`.
 * - videoUrl: optional full https URL per row; if present and absolute, overrides base+filename
 * - thumbTime: time into the local file for ffmpeg snapshot — plain seconds or
 *   timecode H:M:S[.mmm] (e.g. 0:02:47.000) (aliases: thumbTimeSec, thumb_timestamp).
 *   If missing or parsed as 0, uses 8 seconds (reasonable default frame).
 * - optional: duration, tags, title — duration uses the same formats as thumbTime
 */

import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { execSync } from "child_process";

/**
 * Parses duration / time offset: plain seconds (e.g. 167 or 167.5) or
 * colon-separated timecode H:M:S[.mmm] (e.g. 0:02:47 or 0:02:47.000).
 * Rightmost segment is seconds (with optional fraction); each step left multiplies by 60.
 */
/**
 * @param {Record<string, string>} row
 * @returns {string[]}
 */
function parseTags(row) {
  let raw =
    row.tags ??
    row.Tags ??
    row.tag ??
    row.Tag ??
    "";
  if (raw === "" || raw == null) {
    const key = Object.keys(row).find(
      (k) => k.trim().toLowerCase() === "tags"
    );
    if (key) raw = row[key];
  }
  if (raw == null || raw === "") return [];
  if (Array.isArray(raw)) {
    return raw.map((t) => String(t).trim()).filter(Boolean);
  }
  const s = String(raw).trim();
  if (!s) return [];
  return s
    .split(/[\s,;]+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

function parseTimecodeToSeconds(input) {
  if (input == null || input === "") return 0;
  const str = String(input).trim();
  if (!str) return 0;
  if (/^\d+(\.\d+)?$/.test(str)) return parseFloat(str);
  const parts = str.split(":").map((p) => p.trim());
  if (parts.length === 1) return parseFloat(parts[0]) || 0;
  let mult = 1;
  let total = 0;
  for (let i = parts.length - 1; i >= 0; i--) {
    const v = parseFloat(parts[i]);
    if (Number.isNaN(v)) return 0;
    total += v * mult;
    mult *= 60;
  }
  return total;
}

/**
 * Remote thumbnail URL next to video host: .../tai-chi/videos/ → .../tai-chi/thumbnails/{id}.jpg
 * Without --video-base-url, falls back to local /chi/thumbnails/ for dev.
 * @param {string} id - slug id
 * @param {string} [videoBaseUrl]
 */
function resolveThumbSrc(id, videoBaseUrl) {
  const v = videoBaseUrl?.trim();
  if (!v) return `/chi/thumbnails/${id}.jpg`;
  const withSlash = v.endsWith("/") ? v : `${v}/`;
  const m = withSlash.match(/^(.*\/)videos\/$/i);
  if (m) return `${m[1]}thumbnails/${id}.jpg`;
  return `/chi/thumbnails/${id}.jpg`;
}

/**
 * @param {string} filename - path as in CSV (may include subdirs)
 * @param {string} [videoBaseUrl] - e.g. https://example.com/public/tai-chi/videos/
 */
function resolveVideoSrc(row, filename, videoBaseUrl) {
  const explicit = row.videoUrl || row.url || row.src;
  const trimmed =
    explicit != null && String(explicit).trim() !== ""
      ? String(explicit).trim()
      : "";
  if (trimmed && /^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  if (videoBaseUrl) {
    const base = videoBaseUrl.trim().endsWith("/")
      ? videoBaseUrl.trim()
      : `${videoBaseUrl.trim()}/`;
    const rel = String(filename).replace(/\\/g, "/").replace(/^\.\//, "");
    const pathPart = rel
      .split("/")
      .filter(Boolean)
      .map((seg) => encodeURIComponent(seg))
      .join("/");
    try {
      return new URL(pathPart, base).href;
    } catch (e) {
      console.warn(`Bad video URL for ${filename}:`, e.message);
      return "";
    }
  }
  return trimmed;
}

const argv = process.argv.slice(2);
let csvPath = process.env.CHI_CSV;
let mp4Dir = process.env.CHI_MP4_DIR;
let videoBaseUrl = process.env.CHI_VIDEO_BASE_URL || "";
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === "--csv") csvPath = argv[++i];
  else if (argv[i] === "--mp4-dir") mp4Dir = argv[++i];
  else if (argv[i] === "--video-base-url") videoBaseUrl = argv[++i] || "";
}

if (!csvPath) {
  console.error("Provide --csv path/to.csv or CHI_CSV");
  process.exit(1);
}

const raw = fs.readFileSync(csvPath, "utf8");
const rows = parse(raw, { columns: true, skip_empty_lines: true, trim: true });

const outVideos = [];
const root = process.cwd();
const thumbDir = path.join(root, "public", "chi", "thumbnails");
/** Matches shipped thumbs in public/chi/thumbnails (16:9, cover crop). */
const THUMB_W = 640;
const THUMB_H = 360;
fs.mkdirSync(thumbDir, { recursive: true });

for (const row of rows) {
  const filename = row.filename || row.file || row.name;
  if (!filename) continue;
  const base = path.basename(filename, path.extname(filename));
  const id = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const durationRaw = row.duration ?? row.durationSec ?? "";
  const duration = parseTimecodeToSeconds(durationRaw);
  const tags = parseTags(row);
  const thumbRaw =
    row.thumbTime ?? row.thumbTimeSec ?? row.thumb_timestamp ?? "";
  let thumbTimeSec = parseTimecodeToSeconds(thumbRaw);
  if (thumbTimeSec === 0) thumbTimeSec = 8;
  const videoUrl = resolveVideoSrc(row, filename, videoBaseUrl);
  if (!videoUrl) {
    console.warn(
      `Skipping ${filename}: set CHI_VIDEO_BASE_URL / --video-base-url, or a full videoUrl in CSV`
    );
    continue;
  }

  const thumbRel = resolveThumbSrc(id, videoBaseUrl);
  const thumbAbs = path.join(thumbDir, `${id}.jpg`);

  if (mp4Dir) {
    const localMp4 = path.join(mp4Dir, filename);
    if (fs.existsSync(localMp4)) {
      try {
        const vf = `scale=${THUMB_W}:${THUMB_H}:force_original_aspect_ratio=increase,crop=${THUMB_W}:${THUMB_H}`;
        execSync(
          `ffmpeg -y -hide_banner -loglevel error -ss ${thumbTimeSec} -i "${localMp4}" -vf "${vf}" -frames:v 1 -q:v 2 "${thumbAbs}"`,
          { stdio: "inherit" }
        );
      } catch (e) {
        console.warn(`ffmpeg failed for ${filename}`, e.message);
      }
    } else {
      console.warn(`No local file ${localMp4}; skip thumbnail`);
    }
  }

  outVideos.push({
    id,
    title: row.title || base.replace(/[-_]+/g, " "),
    src: videoUrl,
    duration,
    tags,
    thumbSrc: thumbRel,
  });
}

const dataDir = path.join(root, "data", "chi");
fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(
  path.join(dataDir, "videos.json"),
  JSON.stringify(outVideos, null, 2),
  "utf8"
);
console.log(`Wrote ${outVideos.length} videos to data/chi/videos.json`);
if (videoBaseUrl) {
  console.log(`Video base URL: ${videoBaseUrl.trim()}`);
}
