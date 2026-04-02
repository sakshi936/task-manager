import type { JsonPlaceholderTodo, Task } from "../types/tasks";

const API_URL = "https://jsonplaceholder.typicode.com/todos";

function mapTodoToTask(todo: JsonPlaceholderTodo, index: number): Task {
  const base = Date.now();
  return {
    id: String(todo.id),
    title: todo.title,
    description: todo.title ? `Imported: ${todo.title.slice(0, 80)}` : "",
    status: todo.completed ? "completed" : "pending",
    createdAt: base - (11 - todo.id) * 60_000 + index,
  };
}

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error(`Failed to load tasks (${res.status})`);
  }
  const data = (await res.json()) as JsonPlaceholderTodo[];
  const slice = data.slice(0, 10);
  return slice.map((todo, i) => mapTodoToTask(todo, i));
}
