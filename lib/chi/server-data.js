import fs from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data", "chi");

export function readChiVideos() {
  const raw = fs.readFileSync(join(DATA_DIR, "videos.json"), "utf8");
  return JSON.parse(raw);
}

export function readChiRoutines() {
  const raw = fs.readFileSync(join(DATA_DIR, "routines.json"), "utf8");
  return JSON.parse(raw);
}
