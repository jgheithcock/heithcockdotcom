import Head from "next/head";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  loadLocalOverrides,
  mergeRoutines,
  mergeVideos,
  saveLocalOverrides,
} from "../../lib/chi/client-storage";
import { formatDurationClock } from "../../lib/chi/format-duration";

function newSlot(videoId) {
  return { key: `${Date.now()}-${Math.random().toString(36).slice(2)}`, videoId };
}

function LibraryCard({ video, onAddToRoutine }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `lib-${video.id}`,
      data: { type: "library", videoId: video.id },
    });
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, opacity: isDragging ? 0.35 : 1 }}
      className="chi-library-card"
      {...listeners}
      {...attributes}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={video.thumbSrc || ""}
        alt=""
        className="chi-library-card-thumb"
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />
      <div className="chi-library-card-title-row">
        <span className="chi-library-card-title">{video.title}</span>
        <button
          type="button"
          className="chi-library-card-add"
          aria-label="Add to routine"
          onClick={(e) => {
            e.stopPropagation();
            onAddToRoutine();
          }}
        >
          +
        </button>
      </div>
      <div className="chi-library-card-tags">
        {video.tags.length ? video.tags.join(", ") : "\u00a0"}
      </div>
    </div>
  );
}

function RoutineColumn({
  routineSlots,
  setRoutineSlots,
  videoMap,
  slotKeys,
}) {
  const { setNodeRef, isOver } = useDroppable({ id: "routine-drop" });

  return (
    <div
      ref={setNodeRef}
      className="chi-routine-drop"
      style={{
        outline: isOver ? "2px solid #7c3aed" : undefined,
      }}
    >
      <SortableContext items={slotKeys} strategy={verticalListSortingStrategy}>
        {routineSlots.length === 0 ? (
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#666" }}>
            Drag videos here or use Add. Reorder by dragging slots.
          </p>
        ) : null}
        {routineSlots.map((slot) => (
          <RoutineSlotRow
            key={slot.key}
            slot={slot}
            video={videoMap[slot.videoId]}
            onRemove={() =>
              setRoutineSlots((s) => s.filter((x) => x.key !== slot.key))
            }
          />
        ))}
      </SortableContext>
    </div>
  );
}

function RoutineSlotRow({ slot, video, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: slot.key,
      data: { type: "routine", videoId: slot.videoId },
    });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const dur =
    video && typeof video.duration === "number"
      ? formatDurationClock(video.duration)
      : "—";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="chi-slot-item"
      {...attributes}
      {...listeners}
    >
      <span className="chi-slot-title">{video?.title || slot.videoId}</span>
      <span className="chi-slot-duration">{dur}</span>
      <button
        type="button"
        className="chi-icon-btn"
        aria-label="Remove"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        ×
      </button>
    </div>
  );
}

/**
 * @param {{
 *  initialVideos: import('../../lib/chi/types').ChiVideo[];
 *  initialRoutines: import('../../lib/chi/types').ChiRoutine[];
 *  mode: 'create' | 'edit';
 *  routineId?: string;
 * }} props
 */
export default function RoutineEditor({
  initialVideos,
  initialRoutines,
  mode,
  routineId,
}) {
  const router = useRouter();
  const titleInputRef = useRef(null);
  const merged = useMemo(() => {
    const o = loadLocalOverrides();
    return {
      routines: mergeRoutines(initialRoutines, o),
      videos: mergeVideos(initialVideos, o),
    };
  }, [initialRoutines, initialVideos]);

  const existing =
    mode === "edit"
      ? merged.routines.find((r) => r.id === routineId)
      : null;

  const [title, setTitle] = useState(existing?.title || "");
  const [titleEditing, setTitleEditing] = useState(false);
  const [routineSlots, setRoutineSlots] = useState(() =>
    existing
      ? existing.videoIds.map((videoId) => newSlot(videoId))
      : []
  );
  const [filterTag, setFilterTag] = useState(null);
  const [search, setSearch] = useState("");
  const [activeDrag, setActiveDrag] = useState(null);

  const videoMap = useMemo(
    () => Object.fromEntries(merged.videos.map((v) => [v.id, v])),
    [merged.videos]
  );

  const allTags = useMemo(() => {
    const s = new Set();
    for (const v of merged.videos) for (const t of v.tags) s.add(t);
    return [...s].sort();
  }, [merged.videos]);

  const routineVideoIds = useMemo(
    () => new Set(routineSlots.map((s) => s.videoId)),
    [routineSlots]
  );

  const routineTotalSeconds = useMemo(() => {
    let t = 0;
    for (const slot of routineSlots) {
      const v = videoMap[slot.videoId];
      if (v && typeof v.duration === "number") t += v.duration;
    }
    return t;
  }, [routineSlots, videoMap]);

  const filteredLibrary = useMemo(() => {
    let list = merged.videos.filter((v) => !routineVideoIds.has(v.id));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.id.toLowerCase().includes(q)
      );
    }
    if (filterTag) list = list.filter((v) => v.tags.includes(filterTag));
    list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [merged.videos, routineVideoIds, search, filterTag]);

  useEffect(() => {
    if (titleEditing) titleInputRef.current?.focus();
  }, [titleEditing]);

  const displayHeaderText =
    title.trim() ||
    (mode === "create" ? "New routine" : existing?.title || "Routine");

  const documentTitle = `${displayHeaderText} · Chi`;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const slotKeys = routineSlots.map((s) => s.key);

  const persistRoutines = (nextRoutines) => {
    const o = loadLocalOverrides() || {};
    saveLocalOverrides({ ...o, routines: nextRoutines });
  };

  const saveRoutine = () => {
    const id =
      mode === "create"
        ? title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "") || `routine-${Date.now()}`
        : routineId;
    const videoIds = routineSlots.map((s) => s.videoId);
    const prev = merged.routines;
    const next = { id, title: title.trim() || id, videoIds };
    const editIdx = mode === "edit" ? prev.findIndex((r) => r.id === id) : -1;
    let nextRoutines;
    if (mode === "edit" && editIdx >= 0) {
      nextRoutines = [...prev];
      nextRoutines[editIdx] = next;
    } else {
      nextRoutines = [...prev.filter((r) => r.id !== id), next];
    }
    persistRoutines(nextRoutines);
    router.push("/chi");
  };

  const addVideo = (videoId) => {
    setRoutineSlots((s) => [...s, newSlot(videoId)]);
  };

  const onDragStart = (e) => {
    setActiveDrag(e.active);
  };

  const onDragEnd = (e) => {
    const { active, over } = e;
    setActiveDrag(null);
    if (!over) return;

    if (active.id.toString().startsWith("lib-")) {
      const videoId = active.id.toString().slice(4);
      if (over.id === "routine-drop") {
        setRoutineSlots((slots) => [...slots, newSlot(videoId)]);
        return;
      }
      if (slotKeys.includes(over.id.toString())) {
        setRoutineSlots((slots) => {
          const copy = [...slots];
          const overIndex = copy.findIndex((s) => s.key === over.id);
          const insert = newSlot(videoId);
          if (overIndex >= 0) copy.splice(overIndex, 0, insert);
          else copy.push(insert);
          return copy;
        });
      }
      return;
    }

    if (active.id !== over.id && slotKeys.includes(active.id.toString())) {
      setRoutineSlots((items) => {
        const oldIndex = items.findIndex((s) => s.key === active.id);
        const newIndex = items.findIndex((s) => s.key === over.id);
        if (oldIndex < 0 || newIndex < 0) return items;
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const dragOverlayNode = activeDrag?.id?.toString().startsWith("lib-")
    ? videoMap[activeDrag.id.toString().slice(4)]
    : null;

  const routinePanelTitle = `Routine (${formatDurationClock(routineTotalSeconds)})`;

  return (
    <div className="chi-main-pad chi-editor-main">
      <Head>
        <title>{documentTitle}</title>
      </Head>

      {titleEditing ? (
        <input
          ref={titleInputRef}
          className="chi-editor-title-input"
          value={title}
          placeholder={mode === "create" ? "New routine" : "Routine name"}
          aria-label="Routine name"
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => setTitleEditing(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              setTitleEditing(false);
            }
            if (e.key === "Escape") setTitleEditing(false);
          }}
        />
      ) : (
        <h1
          className="chi-editor-title chi-editor-title--clickable"
          title="Click to edit name"
          onClick={() => setTitleEditing(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setTitleEditing(true);
            }
          }}
          role="button"
          tabIndex={0}
        >
          {displayHeaderText}
        </h1>
      )}

      <div className="chi-editor-dnd-outer">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          <div className="chi-editor-dnd-shell">
            <div className="chi-editor-grid">
          <div className="chi-panel">
            <h3>Library</h3>
            <input
              className="chi-search"
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="chi-tag-chips">
              <button
                type="button"
                className={`chi-tag-chip ${filterTag === null ? "is-on" : ""}`}
                onClick={() => setFilterTag(null)}
              >
                All tags
              </button>
              {allTags.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`chi-tag-chip ${filterTag === t ? "is-on" : ""}`}
                  onClick={() => setFilterTag(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="chi-library-list">
              {filteredLibrary.map((v) => (
                <LibraryCard
                  key={v.id}
                  video={v}
                  onAddToRoutine={() => addVideo(v.id)}
                />
              ))}
            </div>
          </div>

          <div className="chi-panel">
            <h3>{routinePanelTitle}</h3>
            <div className="chi-routine-panel-body">
              <RoutineColumn
                routineSlots={routineSlots}
                setRoutineSlots={setRoutineSlots}
                videoMap={videoMap}
                slotKeys={slotKeys}
              />
            </div>
          </div>
        </div>

            <DragOverlay>
              {dragOverlayNode ? (
                <div className="chi-library-card" style={{ cursor: "grabbing" }}>
                  {dragOverlayNode.title}
                </div>
              ) : null}
            </DragOverlay>
          </div>
        </DndContext>
      </div>

      <div className="chi-actions-row">
        <button
          type="button"
          className="chi-btn chi-btn-primary"
          onClick={saveRoutine}
        >
          Save
        </button>
      </div>
    </div>
  );
}
