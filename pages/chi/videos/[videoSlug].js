import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ChiLayout from "../../../components/chi/ChiLayout";
import {
  loadLocalOverrides,
  mergeVideos,
  saveLocalOverrides,
} from "../../../lib/chi/client-storage";
import { readChiVideos } from "../../../lib/chi/server-data";

export async function getStaticPaths() {
  const videos = readChiVideos();
  return {
    paths: videos.map((v) => ({
      params: { videoSlug: v.id },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const videos = readChiVideos();
  const video = videos.find((v) => v.id === params.videoSlug);
  return {
    props: {
      videoSlug: params.videoSlug,
      initialVideos: videos,
      initialFound: Boolean(video),
    },
  };
}

export default function ChiVideoPage({
  videoSlug,
  initialVideos,
  initialFound,
}) {
  const [videos, setVideos] = useState(initialVideos);
  const [title, setTitle] = useState("");
  const [tagsStr, setTagsStr] = useState("");

  useEffect(() => {
    const o = loadLocalOverrides();
    if (o) setVideos(mergeVideos(initialVideos, o));
  }, [initialVideos]);

  const video = useMemo(
    () => videos.find((v) => v.id === videoSlug),
    [videos, videoSlug]
  );

  useEffect(() => {
    if (!video) return;
    setTitle(video.title);
    setTagsStr(video.tags.join(" "));
  }, [video]);

  const saveMeta = () => {
    if (!video) return;
    const o = loadLocalOverrides() || {};
    const tags = tagsStr
      .split(/\s+/)
      .map((t) => t.trim())
      .filter(Boolean);
    saveLocalOverrides({
      ...o,
      videoMeta: {
        ...(o.videoMeta || {}),
        [video.id]: { ...video, title, tags },
      },
    });
    setVideos(mergeVideos(initialVideos, loadLocalOverrides()));
  };

  if (!initialFound || !video) {
    return (
      <ChiLayout title="Video">
        <p className="chi-main-pad">Video not found.</p>
      </ChiLayout>
    );
  }

  return (
    <ChiLayout title={video.title}>
      <div className="chi-main-pad">
        <p>
          <Link href="/chi">← Routines</Link>
        </p>
        <video
          src={video.src}
          controls
          playsInline
          style={{ width: "100%", maxWidth: 960, background: "#000" }}
        />
        <div className="chi-form-row" style={{ marginTop: "1rem" }}>
          <label htmlFor="chi-v-title">Title</label>
          <input
            id="chi-v-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="chi-form-row">
          <label htmlFor="chi-v-tags">Tags (space-separated)</label>
          <input
            id="chi-v-tags"
            value={tagsStr}
            onChange={(e) => setTagsStr(e.target.value)}
          />
        </div>
        <div className="chi-actions">
          <button type="button" className="chi-btn chi-btn-primary" onClick={saveMeta}>
            Save
          </button>
        </div>
      </div>
    </ChiLayout>
  );
}
