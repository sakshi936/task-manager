type Props = {
  hasFilters: boolean;
  onClearFilters?: () => void;
};

export function EmptyState({ hasFilters, onClearFilters }: Props) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--code-bg)]/50 px-8 py-16 text-center">
      <p className="text-lg font-medium text-[var(--text-h)]">No tasks to show</p>
      <p className="mt-2 text-sm text-[var(--text)]">
        {hasFilters
          ? "Try adjusting filters or search."
          : "Add a task or reload from the API to get started."}
      </p>
      {hasFilters && onClearFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-6 text-sm font-medium text-[var(--accent)] underline-offset-2 hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
