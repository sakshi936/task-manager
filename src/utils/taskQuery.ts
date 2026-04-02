import type { Task, TaskFilter, TaskSortOrder } from "../types/tasks";

export function filterSortSearchTasks(
  tasks: Task[],
  filter: TaskFilter,
  sort: TaskSortOrder,
  search: string
): Task[] {
  const q = search.trim().toLowerCase();
  const matchesSearch = (t: Task) =>
    q ? t.title.toLowerCase().includes(q) : true;

  let list = tasks.filter(matchesSearch);

  if (filter === "completed") {
    list = list.filter((t) => t.status === "completed");
  } else if (filter === "pending") {
    list = list.filter((t) => t.status === "pending");
  }

  if (sort === "custom") {
    return list;
  }

  return [...list].sort((a, b) =>
    sort === "newest"
      ? b.createdAt - a.createdAt
      : a.createdAt - b.createdAt
  );
}
