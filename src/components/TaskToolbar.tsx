import { useTaskContext } from "../context/useTaskContext";
import type { TaskFilter, TaskSortOrder } from "../types/tasks";

const filters: { value: TaskFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
];

const sorts: { value: TaskSortOrder; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "custom", label: "Custom (drag order)" },
];

export function TaskToolbar() {
  const {
    filter,
    setFilter,
    sort,
    setSort,
    search,
    setSearch,
  } = useTaskContext();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
      <div className="flex flex-wrap gap-2">
        <span className="sr-only">Filter by status</span>
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              filter === f.value
                ? "bg-[var(--accent)] text-white"
                : "border border-[var(--border)] bg-[var(--code-bg)] text-[var(--text-h)] hover:border-[var(--accent-border)]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex flex-col gap-1 text-left text-xs font-medium uppercase tracking-wide text-[var(--text)]">
          Sort
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as TaskSortOrder)}
            className="min-w-[160px] rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm font-normal normal-case text-[var(--text-h)]"
          >
            {sorts.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-left text-xs font-medium uppercase tracking-wide text-[var(--text)]">
          Search title
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type to filter…"
            className="min-w-[200px] rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm font-normal normal-case text-[var(--text-h)] placeholder:text-[var(--text)]"
            autoComplete="off"
          />
        </label>
      </div>
    </div>
  );
}
