import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { chiPlayerControls as C } from "../../lib/chi/player-controls-assets";

function SegmentBar({ count, currentIndex, currentProgress }) {
  if (count <= 0) return null;

  return (
    <div className="chi-segment-wrap" aria-hidden>
      <div className="chi-segment-track">
        <div className="chi-segment-track-under" />
        <div className="chi-segment-cells">
          {Array.from({ length: count }).map((_, i) => {
            let widthPct = 0;
            if (i < currentIndex) widthPct = 100;
            else if (i === currentIndex) {
              widthPct = Math.round(currentProgress * 1000) / 10;
            }
            return (
              <div key={i} className="chi-segment-cell">
                <div
                  className="chi-segment-cell-fill"
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * @param {{ playlist: import('../../lib/chi/types').ChiVideo[] }} props
 */
export default function RoutinePlayer({ playlist }) {
  const router = useRouter();
  const videoRef = useRef(null);
  const frameRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [paused, setPaused] = useState(true);
  const [frameFullscreen, setFrameFullscreen] = useState(false);

  const current = playlist[index];
  const count = playlist.length;

  const onTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    setProgress(v.currentTime);
    if (v.duration && !Number.isNaN(v.duration)) setDuration(v.duration);
  }, []);

  const onLoadedMeta = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.duration && !Number.isNaN(v.duration)) setDuration(v.duration);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !current) return;

    const onEnded = () => {
      setIndex((i) => {
        if (i < playlist.length - 1) return i + 1;
        return i;
      });
    };
    const onPlay = () => setPaused(false);
    const onPause = () => setPaused(true);

    v.addEventListener("timeupdate", onTimeUpdate);
    v.addEventListener("loadedmetadata", onLoadedMeta);
    v.addEventListener("ended", onEnded);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    setPaused(v.paused);
    return () => {
      v.removeEventListener("timeupdate", onTimeUpdate);
      v.removeEventListener("loadedmetadata", onLoadedMeta);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, [current, onLoadedMeta, onTimeUpdate, playlist.length]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !current) return;
    v.pause();
    v.src = current.src;
    v.load();
    setProgress(0);
    setDuration(0);
    const p = v.play();
    if (p !== undefined) p.catch(() => {});
  }, [index, current]);

  useEffect(() => {
    const syncFs = () => {
      const fr = frameRef.current;
      const active =
        document.fullscreenElement || document.webkitFullscreenElement || null;
      setFrameFullscreen(!!fr && active === fr);
    };
    document.addEventListener("fullscreenchange", syncFs);
    document.addEventListener("webkitfullscreenchange", syncFs);
    syncFs();
    return () => {
      document.removeEventListener("fullscreenchange", syncFs);
      document.removeEventListener("webkitfullscreenchange", syncFs);
    };
  }, []);

  const currentProgress =
    duration > 0 ? Math.min(1, progress / duration) : 0;

  const onVideoDoubleClick = () => {
    if (!current) return;
    router.push(`/chi/videos/${encodeURIComponent(current.id)}`);
  };

  const goPrevVideo = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const goNextVideo = useCallback(() => {
    setIndex((i) => Math.min(playlist.length - 1, i + 1));
  }, [playlist.length]);

  const togglePlayPause = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      const p = v.play();
      if (p !== undefined) p.catch(() => {});
    } else {
      v.pause();
    }
  }, []);

  const toggleFrameFullscreen = useCallback(() => {
    const el = frameRef.current;
    if (!el) return;
    const doc = document;
    const active =
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      null;
    if (active) {
      if (doc.exitFullscreen) doc.exitFullscreen();
      else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
    } else if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    }
  }, []);

  if (!playlist.length) {
    return (
      <div className="chi-player">
        <p className="chi-main-pad">No videos in this routine.</p>
      </div>
    );
  }

  return (
    <div className="chi-player">
      <div className="chi-player-main">
        <div ref={frameRef} className="chi-video-frame">
          <div className="chi-video-canvas">
            <video
              ref={videoRef}
              className="chi-video"
              controls
              controlsList="nofullscreen"
              playsInline
              onDoubleClick={onVideoDoubleClick}
            />
            {/* eslint-disable-next-line @next/next/no-img-element -- static asset from /public */}
            <img
              className="chi-player-bottom-cover"
              src={C.bottomCover}
              alt=""
              aria-hidden
              draggable={false}
            />
          </div>
          <button
            type="button"
            className="chi-frame-fullscreen-btn"
            onClick={toggleFrameFullscreen}
            aria-label={
              frameFullscreen ? "Exit full screen" : "Enter full screen"
            }
            title={
              frameFullscreen
                ? "Exit full screen"
                : "Full screen (segment bar stays visible)"
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- static assets from /public */}
            <img
              className="chi-frame-fullscreen-btn-img"
              src={
                frameFullscreen ? C.fullscreenExit : C.fullscreenEnter
              }
              alt=""
              width={48}
              height={48}
              draggable={false}
            />
          </button>
          <SegmentBar
            count={count}
            currentIndex={index}
            currentProgress={currentProgress}
          />
          <div
            className="chi-player-transport"
            role="group"
            aria-label="Playlist controls"
          >
            <button
              type="button"
              className="chi-transport-btn"
              onClick={goPrevVideo}
              disabled={index <= 0}
              aria-label="Previous video"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- static assets from /public */}
              <img
                src={C.transportPrev}
                alt=""
                width={72}
                height={72}
                draggable={false}
              />
            </button>
            <button
              type="button"
              className="chi-transport-btn"
              onClick={togglePlayPause}
              aria-label={paused ? "Play" : "Pause"}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- static assets from /public */}
              <img
                src={paused ? C.transportPlay : C.transportPause}
                alt=""
                width={72}
                height={72}
                draggable={false}
              />
            </button>
            <button
              type="button"
              className="chi-transport-btn"
              onClick={goNextVideo}
              disabled={index >= count - 1}
              aria-label="Next video"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- static assets from /public */}
              <img
                src={C.transportNext}
                alt=""
                width={72}
                height={72}
                draggable={false}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
