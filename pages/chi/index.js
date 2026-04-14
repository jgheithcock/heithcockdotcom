import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ChiLayout from "../../components/chi/ChiLayout";
import RoutineIndexList from "../../components/chi/RoutineIndexList";
import {
  loadLocalOverrides,
  mergeRoutines,
  mergeVideos,
} from "../../lib/chi/client-storage";
import { readChiRoutines, readChiVideos } from "../../lib/chi/server-data";

export async function getStaticProps() {
  return {
    props: {
      initialVideos: readChiVideos(),
      initialRoutines: readChiRoutines(),
    },
  };
}

export default function ChiIndex({ initialVideos, initialRoutines }) {
  const [routines, setRoutines] = useState(initialRoutines);
  const [videos, setVideos] = useState(initialVideos);

  useEffect(() => {
    const o = loadLocalOverrides();
    if (o) {
      setRoutines(mergeRoutines(initialRoutines, o));
      setVideos(mergeVideos(initialVideos, o));
    }
  }, [initialRoutines, initialVideos]);

  const videoMap = useMemo(
    () => Object.fromEntries(videos.map((v) => [v.id, v])),
    [videos]
  );

  return (
    <ChiLayout title="Routines">
      <div className="chi-main-pad">
        <div className="chi-toolbar">
          <h1 className="chi-toolbar-title">Routines</h1>
          <Link
            href="/chi/edit/new"
            className="chi-btn chi-btn-primary chi-toolbar-new"
            style={{ textDecoration: "none" }}
          >
            + New Routine
          </Link>
        </div>

        <RoutineIndexList
          routines={routines}
          setRoutines={setRoutines}
          videoMap={videoMap}
        />
      </div>
    </ChiLayout>
  );
}
