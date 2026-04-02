import { describe, expect, it } from "vitest";
import type { Task } from "../types/tasks";
import { filterSortSearchTasks } from "./taskQuery";

const base = (partial: Partial<Task> & Pick<Task, "id" | "title">): Task => ({
  id: partial.id,
  title: partial.title,
  description: partial.description ?? "",
  status: partial.status ?? "pending",
  createdAt: partial.createdAt ?? 0,
});

describe("filterSortSearchTasks", () => {
  const tasks: Task[] = [
    base({ id: "1", title: "Alpha Task", createdAt: 100, status: "pending" }),
    base({ id: "2", title: "Beta done", createdAt: 300, status: "completed" }),
    base({ id: "3", title: "Gamma", createdAt: 200, status: "pending" }),
  ];

  it("filters by title case-insensitively", () => {
    const r = filterSortSearchTasks(tasks, "all", "newest", "beta");
    expect(r).toHaveLength(1);
    expect(r[0]?.id).toBe("2");
  });

  it("filters completed only", () => {
    const r = filterSortSearchTasks(tasks, "completed", "newest", "");
    expect(r.map((t) => t.id)).toEqual(["2"]);
  });

  it("sorts newest first by createdAt", () => {
    const r = filterSortSearchTasks(tasks, "all", "newest", "");
    expect(r.map((t) => t.id)).toEqual(["2", "3", "1"]);
  });

  it("sorts oldest first by createdAt", () => {
    const r = filterSortSearchTasks(tasks, "all", "oldest", "");
    expect(r.map((t) => t.id)).toEqual(["1", "3", "2"]);
  });

  it("preserves order for custom sort", () => {
    const r = filterSortSearchTasks(tasks, "all", "custom", "");
    expect(r.map((t) => t.id)).toEqual(["1", "2", "3"]);
  });
});
