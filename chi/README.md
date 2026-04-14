# Chi — exercise routines app

Standalone UI at `/chi` (not wired into the blog layout). It lists routines, plays ordered remote MP4s with a segmented progress bar, and supports editing routines and video metadata in the browser.

## Data

- **`data/chi/videos.json`** — built from CSV (see below) or edited by hand. Each video has `id`, `title`, `src` (HTTPS URL to the MP4), **`duration`** (length in **seconds**, number), `tags`, **`thumbSrc`** (HTTPS URL to a JPEG, hosted next to the videos on the same server). Legacy **`durationSec`** in old data is normalized to `duration` when merging. The CSV does **not** list `thumbSrc`; the build sets it from **`CHI_VIDEO_BASE_URL`** (see below) after extracting a frame at **`thumbTime`** when `--mp4-dir` is set.
- **`data/chi/routines.json`** — `{ id, title, videoIds[] }` defaults at deploy time.

## Local overrides

The app merges **localStorage** key `chi:v1` over the JSON from the build. Saving from the editor or video detail page updates that key. Use **Settings → Push to gist** to publish JSON to a GitHub Gist (requires a PAT with `gist` scope, stored only in localStorage as `chi:gistToken`).

## CSV build

**Portable URLs (recommended):** set a single base ending in **`.../tai-chi/videos/`** and only list filenames in the CSV. The build joins `filename` to that base for each **`src`**, and sets **`thumbSrc`** to **`.../tai-chi/thumbnails/{id}.jpg`** on the same host.

```bash
export CHI_VIDEO_BASE_URL="https://44westwind.indigodomo.net/public/tai-chi/videos/"
npm run chi:build -- --csv ~/Downloads/videos.csv --mp4-dir ~/Downloads/compressed-tai-chi \
  --video-base-url "$CHI_VIDEO_BASE_URL"
```

Or rely on env only: `CHI_CSV`, `CHI_MP4_DIR`, `CHI_VIDEO_BASE_URL`.

**Columns (header row):**

| Column      | Required | Notes                                                                                                                                                                                                                                                                                  |
| ----------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `filename`  | yes      | Local file path (e.g. `arm-wrap.mp4` or `week1/arm-wrap.mp4`). Used for `id` slug, local ffmpeg input under `--mp4-dir`, and — when **`--video-base-url` / `CHI_VIDEO_BASE_URL`** is set — joined to that base for **`src`**.                                                          |
| `videoUrl`  | no*      | Full `https://…` URL for that row only (aliases: `url`, `src`). If set and absolute, **overrides** base+`filename` for that row. If you use a video base URL, you can omit this column. *Required only when no base URL is configured.*                                                |
| `thumbTime` | yes*     | Offset into the **local** file for the thumbnail frame. Same format as **`duration`** below. Aliases: `thumbTimeSec`, `thumb_timestamp`. If omitted, empty, or **`0`** / **`0:0:0`** (parses to zero), the build uses **8 seconds** in. *Meaningful thumbs need ffmpeg + `--mp4-dir`.* |
| `duration`  | no       | Clip length. **Preferred column name.** Same formats: plain seconds (`167` or `167.5`) or timecode **`H:M:S`** / **`H:M:S.mmm`** (e.g. `0:02:47`, `0:02:47.000`). Alias: `durationSec` (also parsed as timecode). Stored in `videos.json` as numeric **`duration`** (seconds).         |
| `tags`      | no       | Space-separated → JSON array.                                                                                                                                                                                                                                                          |
| `title`     | no       | Defaults from filename stem.                                                                                                                                                                                                                                                           |

Thumbnails are generated with **ffmpeg** into **`public/chi/thumbnails/{id}.jpg`** when `--mp4-dir` is set (for local preview or upload to your server). **`thumbSrc` in `videos.json`** uses the remote **`.../tai-chi/thumbnails/`** URL when **`CHI_VIDEO_BASE_URL`** ends with **`/videos/`**; otherwise it falls back to **`/chi/thumbnails/{id}.jpg`**.

## Player chrome

- Top and bottom **164px** bands, full width of the player, background **`#e1e1e1`**, `pointer-events: none` so **native `<video controls>`** (play/pause, seek, volume, fullscreen) stay interactive.
- The segmented routine bar sits in the **top** band area at **150px** from the top of the player, **16px** tall, **56px** gutters left/right; a full-width track under the segments uses `#e1e1e1` to mask the stock scrubber.

## Video hosting

Keep large MP4s on a CDN or object store; only URLs live in `videos.json`. Re-encode to smaller profiles if needed for mobile.
