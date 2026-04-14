import { useCallback, useEffect, useState } from "react";
import ChiLayout from "../../components/chi/ChiLayout";
import {
  CHI_STORAGE_KEY,
  loadLocalOverrides,
  saveLocalOverrides,
} from "../../lib/chi/client-storage";

export default function ChiSettingsPage() {
  const [gistId, setGistId] = useState("");
  const [filename, setFilename] = useState("chi-data.json");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");

  const loadFromStorage = useCallback(() => {
    if (typeof window === "undefined") return;
    setGistId(localStorage.getItem("chi:gistId") || "");
    setFilename(localStorage.getItem("chi:gistFilename") || "chi-data.json");
  }, []);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  /** Writes gist ID, filename, and token (if present in the field) to localStorage. */
  const persistGistConfig = () => {
    localStorage.setItem("chi:gistId", gistId);
    localStorage.setItem("chi:gistFilename", filename);
    if (token.trim()) localStorage.setItem("chi:gistToken", token.trim());
  };

  const pullFromGist = async () => {
    setMessage("");
    try {
      const r = await fetch("/api/chi/gist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "get",
          gistId,
          token: token.trim() || localStorage.getItem("chi:gistToken") || "",
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Failed");
      const files = data.gist?.files || {};
      const f =
        files[filename] ||
        Object.values(files)[0];
      if (!f?.content) throw new Error("No file content in gist");
      const parsed = JSON.parse(f.content);
      const o = loadLocalOverrides() || {};
      saveLocalOverrides({
        ...o,
        routines: parsed.routines || o.routines,
        videoMeta: parsed.videoMeta || o.videoMeta,
      });
      persistGistConfig();
      setMessage(
        "Loaded from gist into local storage. Gist settings saved for next visit."
      );
    } catch (e) {
      setMessage(e.message || String(e));
    }
  };

  const downloadLocalData = () => {
    setMessage("");
    const o = loadLocalOverrides();
    const payload = {
      routines: o?.routines ?? [],
      videoMeta: o?.videoMeta ?? {},
    };
    const text = JSON.stringify(payload, null, 2);
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename.trim() || "chi-data.json";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setMessage(`Download started (${a.download}).`);
  };

  const pushToGist = async () => {
    setMessage("");
    const pat = token.trim() || localStorage.getItem("chi:gistToken");
    if (!pat) {
      setMessage("Personal access token required to push.");
      return;
    }
    const o = loadLocalOverrides() || {};
    const payload = JSON.stringify(
      {
        routines: o.routines,
        videoMeta: o.videoMeta,
      },
      null,
      2
    );
    try {
      const r = await fetch("/api/chi/gist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "patch",
          gistId,
          token: pat,
          filename,
          content: payload,
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Failed");
      persistGistConfig();
      setMessage("Pushed to gist. Gist settings saved for next visit.");
    } catch (e) {
      setMessage(e.message || String(e));
    }
  };

  return (
    <ChiLayout title="Settings">
      <div className="chi-main-pad">
        <h1>Chi settings</h1>
        <p className="chi-settings-note">
          After a successful <strong>Pull from gist</strong> or{" "}
          <strong>Push to gist</strong>, your Gist ID, filename, and token (if you
          filled it in) are saved automatically for next time (
          <code>chi:gistId</code>, <code>chi:gistFilename</code>,{" "}
          <code>chi:gistToken</code>). That does not write routines or videos;
          those live under <code>{CHI_STORAGE_KEY}</code> as you edit routines
          elsewhere. A GitHub PAT with <code>gist</code> scope is required to
          push; the token never leaves your device except when calling GitHub.
        </p>

        <div className="chi-form-row">
          <label htmlFor="gist-id">Gist ID</label>
          <input
            id="gist-id"
            value={gistId}
            onChange={(e) => setGistId(e.target.value)}
            placeholder="hex id from gist URL"
          />
        </div>
        <div className="chi-form-row">
          <label htmlFor="gist-fn">Filename in gist</label>
          <input
            id="gist-fn"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
          />
        </div>
        <div className="chi-form-row">
          <label htmlFor="gist-token">Personal access token (push)</label>
          <input
            id="gist-token"
            type="password"
            autoComplete="off"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ghp_…"
          />
        </div>

        <div className="chi-actions">
          <button type="button" className="chi-btn" onClick={downloadLocalData}>
            Download local data
          </button>
          <button type="button" className="chi-btn" onClick={pullFromGist}>
            Pull from gist
          </button>
          <button type="button" className="chi-btn chi-btn-primary" onClick={pushToGist}>
            Push to gist
          </button>
        </div>

        {message ? <p role="status">{message}</p> : null}

        <p className="chi-settings-note" style={{ marginTop: "1.5rem" }}>
          <strong>Download local data</strong> saves a JSON file with the same{" "}
          <code>routines</code> and <code>videoMeta</code> shape as a gist push,
          sourced from <code>{CHI_STORAGE_KEY}</code>. Use it for backup or to
          edit offline; the filename defaults to the “Filename in gist” field
          above.
        </p>
      </div>
    </ChiLayout>
  );
}
