import type { Task } from "../types/tasks";
import { loadTasks } from "./persist";

export function readBootState(): { tasks: Task[]; needsFetch: boolean } {
  const s = loadTasks();
  if (s && s.length > 0) {
    return { tasks: s, needsFetch: false };
  }
  return { tasks: [], needsFetch: true };
}
