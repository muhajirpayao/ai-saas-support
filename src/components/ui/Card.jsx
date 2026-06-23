export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 ${className}`}>
      {children}
    </div>
  );
}