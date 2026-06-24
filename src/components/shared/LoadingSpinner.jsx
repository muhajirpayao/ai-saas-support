/**
 * LoadingSpinner — restyled to emerald accent matching Dashboard theme.
 * Props: size = "sm" | "md" | "lg", t = theme token object (optional)
 */
export default function LoadingSpinner({ size = "md", t }) {
  const sizes = { sm: 16, md: 24, lg: 36 };
  const px = sizes[size] || 24;
  const color = t ? "#10b981" : "#10b981";
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: "db-spinner 0.8s linear infinite", color }}
    >
      <style>{`@keyframes db-spinner { to { transform: rotate(360deg); } }`}</style>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}