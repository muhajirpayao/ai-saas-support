import { Icon } from "@/components/ui/Icon";

export function Input({ label, type = "text", placeholder, value, onChange, icon, rightEl, error }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon name={icon} className="w-4 h-4" />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full ${icon ? "pl-10" : "pl-4"} ${rightEl ? "pr-10" : "pr-4"} py-2.5 text-sm border rounded-xl outline-none transition-all
            ${error ? "border-rose-300 bg-rose-50 focus:ring-2 focus:ring-rose-200" : "border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100"}
            text-slate-900 placeholder:text-slate-400`}
        />
        {rightEl && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</div>}
      </div>
      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
}