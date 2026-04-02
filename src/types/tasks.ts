export type TaskStatus = "pending" | "completed";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: number;
};

export type TaskFilter = "all" | "completed" | "pending";

/** `custom` preserves array order after drag-and-drop reordering */
export type TaskSortOrder = "newest" | "oldest" | "custom";

export type JsonPlaceholderTodo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};
