import Link from "next/link";
import { useMemo } from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { loadLocalOverrides, saveLocalOverrides } from "../../lib/chi/client-storage";

function SortableRoutineRow({ r, videoMap }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: r.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.55 : 1,
  };

  return (
    <section ref={setNodeRef} style={style} className="chi-routine-row">
      <div className="chi-routine-title-row">
        <button
          type="button"
          className="chi-routine-grip"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
        >
          <span className="chi-routine-grip-icon" aria-hidden>
            <span className="chi-routine-grip-lines" />
          </span>
        </button>
        <h2>
          <Link href={`/chi/${encodeURIComponent(r.id)}`} className="title">
            {r.title}
          </Link>
        </h2>
        <Link
          href={`/chi/edit/${encodeURIComponent(r.id)}`}
          className="chi-icon-btn"
          title="Edit routine"
          aria-label="Edit routine"
        >
          ✎
        </Link>
      </div>
      <div className="chi-thumbs">
        {r.videoIds.map((vid) => {
          const v = videoMap[vid];
          if (!v) return null;
          return (
            <Link
              key={`${r.id}-${vid}`}
              href={`/chi/videos/${encodeURIComponent(v.id)}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- remote/local thumb URLs */}
              <img
                src={v.thumbSrc || ""}
                alt=""
                className="chi-thumb"
                onError={(e) => {
                  e.target.style.background = "#ccc";
                  e.target.removeAttribute("src");
                }}
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/**
 * @param {{
 *   routines: import('../../lib/chi/types').ChiRoutine[];
 *   setRoutines: import('react').Dispatch<import('react').SetStateAction<import('../../lib/chi/types').ChiRoutine[]>>;
 *   videoMap: Record<string, import('../../lib/chi/types').ChiVideo>;
 * }} props
 */
export default function RoutineIndexList({ routines, setRoutines, videoMap }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const ids = useMemo(() => routines.map((r) => r.id), [routines]);

  const onDragEnd = (e) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setRoutines((items) => {
      const oldIndex = items.findIndex((r) => r.id === active.id);
      const newIndex = items.findIndex((r) => r.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return items;
      const next = arrayMove(items, oldIndex, newIndex);
      const o = loadLocalOverrides() || {};
      saveLocalOverrides({ ...o, routines: next });
      return next;
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        {routines.map((r) => (
          <SortableRoutineRow key={r.id} r={r} videoMap={videoMap} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
