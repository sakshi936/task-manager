import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useDebounce } from "../hooks/useDebounce";
import { fetchTasks } from "../services/taskService";
import { readBootState } from "../storage/boot";
import {
  loadPrefs,
  savePrefs,
  saveTasks,
  type UiPrefs,
} from "../storage/persist";
import type { Task, TaskFilter, TaskSortOrder } from "../types/tasks";
import { createTaskId } from "../utils/createTaskId";
import { TaskContext, type TaskContextValue } from "./task-context";

function applyTheme(theme: "light" | "dark") {
  document.documentElement.dataset.theme = theme;
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const prefs = useMemo(() => loadPrefs(), []);
  const initial = useMemo(() => readBootState(), []);
  const [tasks, setTasks] = useState(() => initial.tasks);
  const [loading, setLoading] = useState(() => initial.needsFetch);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilterState] = useState<TaskFilter>(prefs.filter);
  const [sort, setSortState] = useState<TaskSortOrder>(prefs.sort);
  const [search, setSearch] = useState(prefs.search);
  const [theme, setTheme] = useState<"light" | "dark">(prefs.theme);

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (!initial.needsFetch) return;

    let cancelled = false;
    fetchTasks()
      .then((t) => {
        if (!cancelled) {
          setTasks(t);
          saveTasks(t);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load tasks");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [initial.needsFetch]);

  useEffect(() => {
    if (!loading) {
      saveTasks(tasks);
    }
  }, [tasks, loading]);

  useEffect(() => {
    const p: UiPrefs = { filter, sort, search, theme };
    savePrefs(p);
  }, [filter, sort, search, theme]);

  const retryFetch = useCallback(() => {
    setError(null);
    setLoading(true);
    fetchTasks()
      .then((t) => {
        setTasks(t);
        saveTasks(t);
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : "Failed to load tasks");
      })
      .finally(() => setLoading(false));
  }, []);

  const setFilter = useCallback((f: TaskFilter) => setFilterState(f), []);
  const setSort = useCallback((s: TaskSortOrder) => setSortState(s), []);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }, []);

  const addTask = useCallback((input: { title: string; description: string }) => {
    const next: Task = {
      id: createTaskId(),
      title: input.title.trim(),
      description: input.description.trim(),
      status: "pending",
      createdAt: Date.now(),
    };
    setTasks((t) => [next, ...t]);
  }, []);

  const updateTask = useCallback(
    (
      id: string,
      patch: Partial<Pick<Task, "title" | "description" | "status">>
    ) => {
      setTasks((list) =>
        list.map((t) => (t.id === id ? { ...t, ...patch } : t))
      );
    },
    []
  );

  const deleteTask = useCallback((id: string) => {
    setTasks((list) => list.filter((t) => t.id !== id));
  }, []);

  const toggleStatus = useCallback((id: string) => {
    setTasks((list) =>
      list.map((t) =>
        t.id === id
          ? {
              ...t,
              status: t.status === "completed" ? "pending" : "completed",
            }
          : t
      )
    );
  }, []);

  const reorderTasks = useCallback((orderedIds: string[]) => {
    setTasks((prev) => {
      const map = new Map(prev.map((t) => [t.id, t]));
      const next = orderedIds
        .map((id) => map.get(id))
        .filter((t): t is Task => Boolean(t));
      if (next.length !== orderedIds.length) return prev;
      return next;
    });
  }, []);

  const value = useMemo<TaskContextValue>(
    () => ({
      tasks,
      loading,
      error,
      retryFetch,
      filter,
      setFilter,
      sort,
      setSort,
      search,
      setSearch,
      debouncedSearch,
      theme,
      toggleTheme,
      addTask,
      updateTask,
      deleteTask,
      toggleStatus,
      reorderTasks,
    }),
    [
      tasks,
      loading,
      error,
      retryFetch,
      filter,
      setFilter,
      sort,
      setSort,
      search,
      debouncedSearch,
      theme,
      toggleTheme,
      addTask,
      updateTask,
      deleteTask,
      toggleStatus,
      reorderTasks,
    ]
  );

  return (
    <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
  );
}
