import { useEffect, useState, type FormEvent } from "react";
import type { Task, TaskStatus } from "../types/tasks";

type Props = {
  mode: "create" | "edit";
  task: Task | null;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    status?: TaskStatus;
  }) => void;
};

export function TaskModal({ mode, task, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState(() =>
    mode === "edit" && task ? task.title : ""
  );
  const [description, setDescription] = useState(() =>
    mode === "edit" && task ? task.description : ""
  );
  const [status, setStatus] = useState<TaskStatus>(() =>
    mode === "edit" && task ? task.status : "pending"
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    if (mode === "edit") {
      onSubmit({ title: t, description: description.trim(), status });
    } else {
      onSubmit({ title: t, description: description.trim() });
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-6 shadow-[var(--shadow)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="task-modal-title" className="text-xl font-medium text-[var(--text-h)]">
          {mode === "create" ? "New task" : "Edit task"}
        </h2>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-left text-sm font-medium text-[var(--text-h)]">
            Title
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text-h)]"
              placeholder="Task title"
            />
          </label>
          <label className="flex flex-col gap-1 text-left text-sm font-medium text-[var(--text-h)]">
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="resize-y rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text-h)]"
              placeholder="Optional details"
            />
          </label>
          {mode === "edit" && (
            <label className="flex flex-col gap-1 text-left text-sm font-medium text-[var(--text-h)]">
              Status
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text-h)]"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </label>
          )}
          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-h)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white"
            >
              {mode === "create" ? "Create" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
