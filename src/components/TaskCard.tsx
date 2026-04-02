import type { DraggableAttributes, DraggableSyntheticListeners } from "@dnd-kit/core";
import type { Task } from "../types/tasks";

type Props = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  dragAttributes?: DraggableAttributes;
  dragListeners?: DraggableSyntheticListeners;
  isDragging?: boolean;
};

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onToggle,
  dragAttributes,
  dragListeners,
  isDragging,
}: Props) {
  const done = task.status === "completed";

  return (
    <article
      className={`flex gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 text-left shadow-[var(--shadow)] transition ${
        isDragging ? "opacity-60 ring-2 ring-[var(--accent)]" : ""
      }`}
    >
      {dragListeners && (
        <button
          type="button"
          className="cursor-grab touch-none self-start rounded px-1 text-[var(--text)] hover:bg-[var(--code-bg)] active:cursor-grabbing"
          aria-label="Drag to reorder"
          {...dragAttributes}
          {...dragListeners}
        >
          ⋮⋮
        </button>
      )}

      <label className="flex flex-1 cursor-pointer gap-3">
        <input
          type="checkbox"
          checked={done}
          onChange={() => onToggle(task.id)}
          className="mt-1 h-4 w-4 rounded border-[var(--border)] accent-[var(--accent)]"
        />
        <span className="min-w-0 flex-1">
          <span
            className={`block font-medium text-[var(--text-h)] ${
              done ? "text-[var(--text)] line-through" : ""
            }`}
          >
            {task.title}
          </span>
          {task.description ? (
            <span className="mt-1 block text-sm text-[var(--text)] line-clamp-2">
              {task.description}
            </span>
          ) : null}
          <span className="mt-2 block text-xs text-[var(--text)]">
            {new Date(task.createdAt).toLocaleString()}
          </span>
        </span>
      </label>

      <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--text-h)] hover:border-[var(--accent-border)]"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(task.id)}
          className="rounded-lg border border-red-500/40 px-3 py-1.5 text-sm text-red-600 hover:bg-red-500/10 dark:text-red-400"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
