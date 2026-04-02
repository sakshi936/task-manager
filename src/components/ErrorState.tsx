type Props = {
  message: string;
  onRetry: () => void;
};

export function ErrorState({ message, onRetry }: Props) {
  return (
    <div
      className="mx-auto max-w-md rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-8 text-center"
      role="alert"
    >
      <p className="mb-1 font-medium text-[var(--text-h)]">Something went wrong</p>
      <p className="mb-6 text-sm text-[var(--text)]">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
