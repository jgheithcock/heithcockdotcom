/**
 * Server-side GitHub Gist API proxy (avoids CORS on PATCH).
 * POST body: { action: 'get' | 'patch', gistId, token, filename?, content? }
 */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { action, gistId, token, filename, content } = req.body || {};

  if (!gistId) {
    return res.status(400).json({ error: "gistId required" });
  }

  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    if (action === "get") {
      const r = await fetch(`https://api.github.com/gists/${gistId}`, {
        headers,
      });
      const data = await r.json();
      if (!r.ok) {
        return res.status(r.status).json({ error: data.message || r.statusText });
      }
      return res.status(200).json({ gist: data });
    }

    if (action === "patch") {
      if (!token) {
        return res.status(400).json({ error: "token required for patch" });
      }
      if (typeof content !== "string") {
        return res.status(400).json({ error: "content string required" });
      }
      const fname = filename || "chi-data.json";
      const r = await fetch(`https://api.github.com/gists/${gistId}`, {
        method: "PATCH",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          files: {
            [fname]: { content },
          },
        }),
      });
      const data = await r.json();
      if (!r.ok) {
        return res.status(r.status).json({ error: data.message || r.statusText });
      }
      return res.status(200).json({ gist: data });
    }

    return res.status(400).json({ error: "Unknown action" });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Server error" });
  }
}
