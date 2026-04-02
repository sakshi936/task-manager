import { createContext } from "react";
import type { Task, TaskFilter, TaskSortOrder } from "../types/tasks";

export type TaskContextValue = {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  retryFetch: () => void;
  filter: TaskFilter;
  setFilter: (f: TaskFilter) => void;
  sort: TaskSortOrder;
  setSort: (s: TaskSortOrder) => void;
  search: string;
  setSearch: (s: string) => void;
  debouncedSearch: string;
  theme: "light" | "dark";
  toggleTheme: () => void;
  addTask: (input: { title: string; description: string }) => void;
  updateTask: (
    id: string,
    patch: Partial<Pick<Task, "title" | "description" | "status">>
  ) => void;
  deleteTask: (id: string) => void;
  toggleStatus: (id: string) => void;
  reorderTasks: (orderedIds: string[]) => void;
};

export const TaskContext = createContext<TaskContextValue | null>(null);
