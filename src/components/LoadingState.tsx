export function LoadingState() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 py-20"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span
        className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]"
        aria-hidden
      />
      <p className="text-sm text-[var(--text)]">Loading tasks…</p>
    </div>
  );
}
