/**
 * LoadingSpinner
 * Props: size = "sm" | "md" | "lg"
 */
export default function LoadingSpinner({ size = "md" }) {
    const sizes = { sm: 16, md: 24, lg: 36 };
    const px = sizes[size] || 24;
    return (
      <svg
        width={px}
        height={px}
        viewBox="0 0 24 24"
        fill="none"
        className="animate-spin text-indigo-500"
        style={{ animation: "spin 0.8s linear infinite" }}
      >
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }