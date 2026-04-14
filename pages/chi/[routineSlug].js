import { useEffect, useMemo, useState } from "react";
import ChiLayout from "../../components/chi/ChiLayout";
import RoutinePlayer from "../../components/chi/RoutinePlayer";
import {
  loadLocalOverrides,
  mergeRoutines,
  mergeVideos,
} from "../../lib/chi/client-storage";
import { videoByIdMap } from "../../lib/chi/maps";
import { readChiRoutines, readChiVideos } from "../../lib/chi/server-data";

export async function getStaticPaths() {
  const routines = readChiRoutines();
  return {
    paths: routines.map((r) => ({
      params: { routineSlug: r.id },
    })),
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const videos = readChiVideos();
  const routines = readChiRoutines();
  return {
    props: {
      routineSlug: params.routineSlug,
      initialVideos: videos,
      initialRoutines: routines,
    },
  };
}

export default function ChiRoutinePage({
  routineSlug,
  initialVideos,
  initialRoutines,
}) {
  const [routines, setRoutines] = useState(initialRoutines);
  const [videos, setVideos] = useState(initialVideos);
  const [storageLoaded, setStorageLoaded] = useState(false);

  useEffect(() => {
    const o = loadLocalOverrides();
    if (o) {
      setRoutines(mergeRoutines(initialRoutines, o));
      setVideos(mergeVideos(initialVideos, o));
    }
    setStorageLoaded(true);
  }, [initialRoutines, initialVideos]);

  const routine = useMemo(
    () => routines.find((r) => r.id === routineSlug),
    [routines, routineSlug]
  );

  const playlist = useMemo(() => {
    if (!routine) return [];
    const map = videoByIdMap(videos);
    return routine.videoIds.map((id) => map[id]).filter(Boolean);
  }, [routine, videos]);

  const knownOnServer = initialRoutines.some((r) => r.id === routineSlug);

  if (!storageLoaded && !knownOnServer) {
    return (
      <ChiLayout title="Routines">
        <p className="chi-main-pad">Loading…</p>
      </ChiLayout>
    );
  }

  if (!routine) {
    return (
      <ChiLayout title="Not found">
        <p className="chi-main-pad">Routine not found.</p>
      </ChiLayout>
    );
  }

  return (
    <ChiLayout title={routine.title} overlayHeader>
      <RoutinePlayer playlist={playlist} />
    </ChiLayout>
  );
}
