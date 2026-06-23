export function AuthLayout({ children, wide = false }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/20 to-violet-50/20 flex flex-col">
      <nav className="h-16 flex items-center px-8 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-md shadow-blue-200">
            <span className="text-white text-sm font-bold">S</span>
          </div>
          <span className="font-semibold text-slate-900 text-lg tracking-tight">SupportAI</span>
        </div>
      </nav>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className={`w-full ${wide ? "max-w-4xl" : "max-w-md"}`}>{children}</div>
      </div>
    </div>
  );
}