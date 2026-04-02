import { useTaskContext } from "../context/useTaskContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTaskContext();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--code-bg)] px-3 py-2 text-sm text-[var(--text-h)] transition hover:border-[var(--accent-border)]"
      aria-pressed={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="text-base" aria-hidden>
        {isDark ? "🌙" : "☀️"}
      </span>
      <span>{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}
