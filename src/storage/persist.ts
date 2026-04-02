import type { Task, TaskFilter, TaskSortOrder } from "../types/tasks";

const TASKS_KEY = "task-manager:tasks";
const PREFS_KEY = "task-manager:prefs";

export type UiPrefs = {
  filter: TaskFilter;
  sort: TaskSortOrder;
  search: string;
  theme: "light" | "dark";
};

const defaultPrefs: UiPrefs = {
  filter: "all",
  sort: "newest",
  search: "",
  theme: "light",
};

export function loadTasks(): Task[] | null {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    return parsed as Task[];
  } catch {
    return null;
  }
}

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export function loadPrefs(): UiPrefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return { ...defaultPrefs };
    const p = JSON.parse(raw) as Partial<UiPrefs>;
    const sort =
      p.sort === "newest" || p.sort === "oldest" || p.sort === "custom"
        ? p.sort
        : defaultPrefs.sort;
    const filter =
      p.filter === "all" || p.filter === "completed" || p.filter === "pending"
        ? p.filter
        : defaultPrefs.filter;
    return {
      filter,
      sort,
      search: typeof p.search === "string" ? p.search : defaultPrefs.search,
      theme: p.theme === "dark" ? "dark" : "light",
    };
  } catch {
    return { ...defaultPrefs };
  }
}

export function savePrefs(prefs: UiPrefs): void {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}
