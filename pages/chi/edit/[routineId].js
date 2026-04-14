import ChiLayout from "../../../components/chi/ChiLayout";
import RoutineEditor from "../../../components/chi/RoutineEditor";
import { readChiRoutines, readChiVideos } from "../../../lib/chi/server-data";

export async function getStaticPaths() {
  const routines = readChiRoutines();
  const paths = [
    { params: { routineId: "new" } },
    ...routines.map((r) => ({ params: { routineId: r.id } })),
  ];
  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  return {
    props: {
      routineId: params.routineId,
      initialVideos: readChiVideos(),
      initialRoutines: readChiRoutines(),
    },
  };
}

export default function ChiEditPage({
  routineId,
  initialVideos,
  initialRoutines,
}) {
  const mode = routineId === "new" ? "create" : "edit";

  return (
    <ChiLayout>
      <RoutineEditor
        initialVideos={initialVideos}
        initialRoutines={initialRoutines}
        mode={mode}
        routineId={mode === "edit" ? routineId : undefined}
      />
    </ChiLayout>
  );
}
