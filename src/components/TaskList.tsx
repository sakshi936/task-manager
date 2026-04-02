import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useMemo } from "react";
import { useTaskContext } from "../context/useTaskContext";
import { filterSortSearchTasks } from "../utils/taskQuery";
import type { Task } from "../types/tasks";
import { EmptyState } from "./EmptyState";
import { SortableTaskRow } from "./SortableTaskRow";

export function TaskList({ onEditTask }: { onEditTask: (task: Task) => void }) {
  const {
    tasks,
    filter,
    sort,
    setSort,
    debouncedSearch,
    deleteTask,
    toggleStatus,
    reorderTasks,
    setFilter,
    setSearch,
  } = useTaskContext();

  const visibleTasks = useMemo(
    () => filterSortSearchTasks(tasks, filter, sort, debouncedSearch),
    [tasks, filter, sort, debouncedSearch]
  );

  const dndEnabled =
    filter === "all" &&
    debouncedSearch.trim() === "" &&
    visibleTasks.length === tasks.length &&
    tasks.length > 0;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !dndEnabled) return;
    const ids = visibleTasks.map((t) => t.id);
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    const next = arrayMove(ids, oldIndex, newIndex);
    reorderTasks(next);
    setSort("custom");
  };

  if (visibleTasks.length === 0) {
    const hasFilters =
      filter !== "all" || debouncedSearch.trim() !== "";
    return (
      <EmptyState
        hasFilters={hasFilters}
        onClearFilters={
          hasFilters
            ? () => {
                setFilter("all");
                setSearch("");
              }
            : undefined
        }
      />
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={visibleTasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul
          role="list"
          className="flex flex-col gap-2 rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-2 text-left shadow-sm sm:gap-2.5 sm:p-3"
        >
          {visibleTasks.map((task) => (
            <li key={task.id} className="list-none">
              <SortableTaskRow
                task={task}
                onEdit={onEditTask}
                onDelete={deleteTask}
                onToggle={toggleStatus}
                dragDisabled={!dndEnabled}
              />
            </li>
          ))}
        </ul>
      </SortableContext>
      {!dndEnabled && tasks.length > 0 && (
        <p
          className="mt-5 rounded-xl border border-dashed border-[var(--border)]/80 bg-[var(--code-bg)]/40 px-4 py-3 text-center text-[0.7rem] font-medium uppercase tracking-[0.12em] text-[var(--text)]/70"
          role="status"
        >
          Reorder: show all tasks, clear search — then drag rows (sort becomes
          Custom).
        </p>
      )}
    </DndContext>
  );
}
