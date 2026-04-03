import { useCallback, useState } from "react";
import { TaskProvider } from "./context/TaskProvider";
import { useTaskContext } from "./context/useTaskContext";
import { ErrorState } from "./components/ErrorState";
import { LoadingState } from "./components/LoadingState";
import { TaskList } from "./components/TaskList";
import { TaskModal } from "./components/TaskModal";
import { TaskToolbar } from "./components/TaskToolbar";
import { ThemeToggle } from "./components/ThemeToggle";
import type { Task } from "./types/tasks";
import "./App.css";

function TaskApp() {
  const { loading, error, retryFetch, addTask, updateTask } = useTaskContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const openCreate = () => {
    setModalMode("create");
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEdit = (task: Task) => {
    setModalMode("edit");
    setEditingTask(task);
    setModalOpen(true);
  };

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditingTask(null);
  }, []);

  return (
    <div className="task-app flex min-h-0 flex-1 flex-col px-5 py-8 text-left sm:px-8">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-1 text-3xl font-medium tracking-tight text-[var(--text-h)] sm:text-4xl">
            Task Pilot
          </h1>
          <p className="text-sm text-[var(--text)]">
            Rise above the chaos and take charge of your day.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={openCreate}
            className="rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white shadow-[var(--shadow)] transition hover:opacity-95"
          >
            New task
          </button>
        </div>
      </header>

      <TaskToolbar />

      <section className="mt-8 flex-1" aria-live="polite">
        {loading && <LoadingState />}
        {!loading && error && (
          <ErrorState message={error} onRetry={retryFetch} />
        )}
        {!loading && !error && (
          <TaskList onEditTask={openEdit} />
        )}
      </section>

      {modalOpen && (
        <TaskModal
          key={`${modalMode}-${editingTask?.id ?? "new"}`}
          mode={modalMode}
          task={editingTask}
          onClose={closeModal}
          onSubmit={(data) => {
            if (modalMode === "create") {
              addTask({ title: data.title, description: data.description });
            } else if (editingTask) {
              updateTask(editingTask.id, {
                title: data.title,
                description: data.description,
                ...(data.status ? { status: data.status } : {}),
              });
            }
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <TaskProvider>
      <TaskApp />
    </TaskProvider>
  );
}
