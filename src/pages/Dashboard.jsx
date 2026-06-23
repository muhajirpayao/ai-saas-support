import { useState, useEffect, useRef } from "react";

// ─── ICONS (inline SVG to avoid dependencies) ────────────────────────────────
const Icon = ({ name, className = "w-5 h-5" }) => {
  const icons = {
    dashboard: <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    inbox: <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />,
    customers: <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
    team: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
    knowledge: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />,
    analytics: <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
    settings: <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />,
    search: <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    bell: <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />,
    sun: <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />,
    moon: <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />,
    chevronDown: <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />,
    chevronLeft: <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />,
    chevronRight: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />,
    plus: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />,
    lightning: <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />,
    clock: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    check: <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />,
    chat: <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
    trending: <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
    menu: <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />,
    x: <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />,
    dot: <circle cx="12" cy="12" r="4" />,
    arrowUp: <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />,
    sparkles: <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />,
  };
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      {icons[name]}
    </svg>
  );
};

// ─── DATA ────────────────────────────────────────────────────────────────────
const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "inbox", label: "Inbox", icon: "inbox", badge: 12 },
  { id: "customers", label: "Customers", icon: "customers" },
  { id: "team", label: "Team", icon: "team" },
  { id: "knowledge", label: "Knowledge Base", icon: "knowledge" },
  { id: "analytics", label: "Analytics", icon: "analytics" },
  { id: "settings", label: "Settings", icon: "settings" },
];

const conversations = [
  { id: 1, name: "Sarah Chen", avatar: "SC", color: "from-pink-400 to-rose-500", subject: "Can't access my account after password reset", time: "2m ago", status: "open", priority: "high", tag: "Auth" },
  { id: 2, name: "Marcus Webb", avatar: "MW", color: "from-blue-400 to-indigo-500", subject: "Billing shows double charge for November", time: "14m ago", status: "waiting", priority: "high", tag: "Billing" },
  { id: 3, name: "Yuna Park", avatar: "YP", color: "from-violet-400 to-purple-500", subject: "How do I export my data as CSV?", time: "1h ago", status: "ai-resolved", priority: "low", tag: "Feature" },
  { id: 4, name: "Tom Gallagher", avatar: "TG", color: "from-emerald-400 to-teal-500", subject: "Integration with Zapier keeps failing", time: "2h ago", status: "open", priority: "medium", tag: "Integration" },
  { id: 5, name: "Priya Nair", avatar: "PN", color: "from-amber-400 to-orange-500", subject: "Request for enterprise pricing details", time: "3h ago", status: "waiting", priority: "medium", tag: "Sales" },
];

const teamActivity = [
  { agent: "Alex Kim", action: "resolved 3 tickets", time: "5m ago", avatar: "AK", color: "from-blue-400 to-indigo-500" },
  { agent: "SupportAI", action: "auto-resolved 8 tickets", time: "12m ago", avatar: "AI", color: "from-violet-500 to-purple-600", isAI: true },
  { agent: "Mia Torres", action: "escalated 1 ticket to engineering", time: "28m ago", avatar: "MT", color: "from-pink-400 to-rose-500" },
  { agent: "SupportAI", action: "drafted reply for Marcus Webb", time: "31m ago", avatar: "AI", color: "from-violet-500 to-purple-600", isAI: true },
  { agent: "James Obi", action: "updated 2 knowledge base articles", time: "1h ago", avatar: "JO", color: "from-emerald-400 to-teal-500" },
];

const notifications = [
  { text: "Marcus Webb replied to billing ticket", time: "2m ago", unread: true },
  { text: "AI resolved 8 tickets without escalation", time: "15m ago", unread: true },
  { text: "CSAT score reached 94% this week", time: "1h ago", unread: false },
];

// ─── ANIMATED COUNTER ────────────────────────────────────────────────────────
function AnimatedNumber({ target, duration = 1200 }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <>{value.toLocaleString()}</>;
}

// ─── MINI SPARKLINE ──────────────────────────────────────────────────────────
function Sparkline({ data, color = "#6366f1", fill = "#6366f120" }) {
  const max = Math.max(...data), min = Math.min(...data);
  const w = 80, h = 32;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return `${x},${y}`;
  }).join(" ");
  const fillPts = `0,${h} ${pts} ${w},${h}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polygon points={fillPts} fill={fill} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
function Sidebar({ active, onNav, collapsed, dark }) {
  return (
    <aside
      className={`flex flex-col h-full transition-all duration-300 ${
        dark ? "bg-slate-900 border-slate-800" : "bg-slate-950"
      } border-r border-slate-800/80 ${collapsed ? "w-16" : "w-60"}`}
    >
      {/* Brand */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-slate-800/60 ${collapsed ? "justify-center px-2" : ""}`}>
        <div className="relative shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-900/40">
            <span className="text-white text-sm font-bold">S</span>
          </div>
          {/* AI pulse */}
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
        </div>
        {!collapsed && (
          <div>
            <div className="text-white font-semibold text-sm tracking-tight leading-none">SupportAI</div>
            <div className="text-slate-500 text-[10px] font-medium mt-0.5 uppercase tracking-widest">Workspace</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className={`px-3 mb-1 ${collapsed ? "px-2" : ""}`}>
          {!collapsed && <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-2 mb-2">Menu</p>}
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-left transition-all group relative ${
                  collapsed ? "justify-center px-2" : ""
                } ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600/20 to-violet-600/10 text-white"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gradient-to-b from-blue-400 to-violet-500 rounded-full" />}
                <Icon name={item.icon} className={`w-[18px] h-[18px] shrink-0 transition-colors ${isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"}`} />
                {!collapsed && (
                  <>
                    <span className="text-sm font-medium flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {collapsed && item.badge && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* User footer */}
      <div className={`border-t border-slate-800/60 p-3 ${collapsed ? "flex justify-center" : ""}`}>
        <div className={`flex items-center gap-2.5 ${collapsed ? "" : "px-1"}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            JD
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-semibold truncate">Jamie Diaz</div>
              <div className="text-slate-500 text-[10px] truncate">Admin</div>
            </div>
          )}
          {!collapsed && <Icon name="chevronDown" className="w-3.5 h-3.5 text-slate-600 shrink-0" />}
        </div>
      </div>
    </aside>
  );
}

// ─── TOPBAR ──────────────────────────────────────────────────────────────────
function Topbar({ dark, onToggleDark, onToggleSidebar, collapsed, onMobileMenu }) {
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showOrg, setShowOrg] = useState(false);
  const notifRef = useRef();
  const profileRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className={`h-14 flex items-center justify-between px-4 border-b ${dark ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-100 text-slate-900"} shrink-0 z-20`}>
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenu}
          className={`lg:hidden p-2 rounded-lg ${dark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"} transition-colors`}
        >
          <Icon name="menu" className="w-5 h-5" />
        </button>
        <button
          onClick={onToggleSidebar}
          className={`hidden lg:flex p-2 rounded-lg ${dark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"} transition-colors`}
        >
          <Icon name={collapsed ? "chevronRight" : "chevronLeft"} className="w-4 h-4" />
        </button>

        {/* Org switcher */}
        <button
          onClick={() => setShowOrg(!showOrg)}
          className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
            dark ? "border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-700" : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
          }`}
        >
          <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-500 to-violet-600" />
          Acme Corp
          <Icon name="chevronDown" className="w-3.5 h-3.5 opacity-60" />
        </button>

        {/* Search */}
        <div className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border text-sm w-64 ${
          dark ? "bg-slate-800/60 border-slate-700 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-400"
        }`}>
          <Icon name="search" className="w-4 h-4 shrink-0" />
          <span className="flex-1 text-sm">Search conversations…</span>
          <kbd className={`text-[10px] px-1.5 py-0.5 rounded border font-mono ${dark ? "border-slate-600 bg-slate-700 text-slate-400" : "border-slate-200 bg-white text-slate-400"}`}>⌘K</kbd>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5">
        {/* Theme */}
        <button
          onClick={onToggleDark}
          className={`p-2 rounded-lg transition-colors ${dark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
        >
          <Icon name={dark ? "sun" : "moon"} className="w-4.5 h-4.5 w-[18px] h-[18px]" />
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className={`relative p-2 rounded-lg transition-colors ${dark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
          >
            <Icon name="bell" className="w-[18px] h-[18px]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-white" />
          </button>
          {showNotifs && (
            <div className={`absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-2xl border z-50 overflow-hidden ${dark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-100"}`}>
              <div className={`px-4 py-3 border-b flex items-center justify-between ${dark ? "border-slate-800" : "border-slate-100"}`}>
                <span className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-900"}`}>Notifications</span>
                <span className="text-xs font-medium text-blue-500 cursor-pointer">Mark all read</span>
              </div>
              {notifications.map((n, i) => (
                <div key={i} className={`px-4 py-3.5 flex items-start gap-3 border-b last:border-0 cursor-pointer transition-colors ${
                  dark ? "border-slate-800 hover:bg-slate-800/60" : "border-slate-50 hover:bg-slate-50"
                } ${n.unread ? dark ? "bg-blue-900/10" : "bg-blue-50/50" : ""}`}>
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.unread ? "bg-blue-500" : dark ? "bg-slate-700" : "bg-slate-200"}`} />
                  <div>
                    <p className={`text-sm ${dark ? "text-slate-300" : "text-slate-700"}`}>{n.text}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
              JD
            </div>
            <Icon name="chevronDown" className="w-3.5 h-3.5 text-slate-400" />
          </button>
          {showProfile && (
            <div className={`absolute right-0 top-full mt-2 w-52 rounded-2xl shadow-2xl border z-50 overflow-hidden ${dark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-100"}`}>
              <div className={`px-4 py-3.5 border-b ${dark ? "border-slate-800" : "border-slate-100"}`}>
                <p className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-900"}`}>Jamie Diaz</p>
                <p className="text-xs text-slate-400">jamie@acmecorp.com</p>
              </div>
              {["Profile", "Preferences", "Billing", "Sign out"].map((item) => (
                <button key={item} className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  item === "Sign out" ? "text-red-500 hover:bg-red-50" : dark ? "text-slate-300 hover:bg-slate-800" : "text-slate-700 hover:bg-slate-50"
                }`}>
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// ─── STAT CARD ───────────────────────────────────────────────────────────────
function StatCard({ label, value, change, icon, color, sparkData, dark }) {
  const isPositive = change >= 0;
  return (
    <div className={`rounded-2xl p-5 border transition-shadow hover:shadow-md ${
      dark ? "bg-slate-800/60 border-slate-700/60 hover:shadow-slate-900/40" : "bg-white border-slate-100 hover:shadow-slate-200/60"
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
          <Icon name={icon} className="w-4.5 h-4.5 w-[18px] h-[18px] text-white" />
        </div>
        <Sparkline data={sparkData} color={isPositive ? "#6366f1" : "#f43f5e"} fill={isPositive ? "#6366f115" : "#f43f5e15"} />
      </div>
      <div className={`text-2xl font-extrabold tracking-tight mb-0.5 ${dark ? "text-white" : "text-slate-900"}`}>
        <AnimatedNumber target={value} />
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium ${dark ? "text-slate-400" : "text-slate-500"}`}>{label}</span>
        <span className={`text-xs font-semibold flex items-center gap-0.5 ${isPositive ? "text-emerald-500" : "text-rose-500"}`}>
          <Icon name="arrowUp" className={`w-2.5 h-2.5 ${!isPositive ? "rotate-180" : ""}`} />
          {Math.abs(change)}%
        </span>
      </div>
    </div>
  );
}

// ─── STATUS BADGE ────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    open: { label: "Open", cls: "bg-blue-100 text-blue-700" },
    waiting: { label: "Waiting", cls: "bg-amber-100 text-amber-700" },
    "ai-resolved": { label: "AI Resolved", cls: "bg-emerald-100 text-emerald-700" },
    resolved: { label: "Resolved", cls: "bg-slate-100 text-slate-600" },
  };
  const s = map[status] || map.open;
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${s.cls}`}>{s.label}</span>;
}

// ─── AI PERFORMANCE CARD ─────────────────────────────────────────────────────
function AIPerformance({ dark }) {
  const metrics = [
    { label: "Auto-resolved", value: 80, color: "from-blue-500 to-violet-600" },
    { label: "Accuracy", value: 97, color: "from-emerald-400 to-teal-500" },
    { label: "CSAT from AI", value: 91, color: "from-amber-400 to-orange-500" },
  ];
  return (
    <div className={`rounded-2xl p-5 border ${dark ? "bg-slate-800/60 border-slate-700/60" : "bg-white border-slate-100"}`}>
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-200">
          <Icon name="sparkles" className="w-3.5 h-3.5 text-white" />
        </div>
        <div>
          <h3 className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-900"}`}>AI Performance</h3>
          <p className="text-[10px] text-slate-400">Last 7 days</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-emerald-500 font-semibold">Live</span>
        </div>
      </div>
      <div className="space-y-4">
        {metrics.map((m, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-xs font-medium ${dark ? "text-slate-400" : "text-slate-500"}`}>{m.label}</span>
              <span className={`text-xs font-bold ${dark ? "text-white" : "text-slate-900"}`}>{m.value}%</span>
            </div>
            <div className={`h-1.5 rounded-full ${dark ? "bg-slate-700" : "bg-slate-100"}`}>
              <div
                className={`h-full rounded-full bg-gradient-to-r ${m.color} transition-all duration-1000`}
                style={{ width: `${m.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className={`mt-5 pt-4 border-t flex items-center justify-between ${dark ? "border-slate-700" : "border-slate-100"}`}>
        <div className="text-center">
          <div className={`text-lg font-extrabold ${dark ? "text-white" : "text-slate-900"}`}>1,284</div>
          <div className="text-[10px] text-slate-400">Tickets handled</div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-extrabold ${dark ? "text-white" : "text-slate-900"}`}>8s</div>
          <div className="text-[10px] text-slate-400">Avg resolution</div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-extrabold text-emerald-500`}>$0.12</div>
          <div className="text-[10px] text-slate-400">Cost per ticket</div>
        </div>
      </div>
    </div>
  );
}

// ─── QUICK ACTIONS ───────────────────────────────────────────────────────────
function QuickActions({ dark }) {
  const actions = [
    { label: "New ticket", icon: "plus", color: "from-blue-500 to-violet-600", shadow: "shadow-blue-200" },
    { label: "AI draft reply", icon: "sparkles", color: "from-violet-500 to-purple-600", shadow: "shadow-violet-200" },
    { label: "View inbox", icon: "inbox", color: "from-slate-600 to-slate-700", shadow: "shadow-slate-200" },
    { label: "Analytics", icon: "trending", color: "from-emerald-500 to-teal-600", shadow: "shadow-emerald-200" },
  ];
  return (
    <div className={`rounded-2xl p-5 border ${dark ? "bg-slate-800/60 border-slate-700/60" : "bg-white border-slate-100"}`}>
      <h3 className={`text-sm font-semibold mb-4 ${dark ? "text-white" : "text-slate-900"}`}>Quick actions</h3>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((a, i) => (
          <button
            key={i}
            className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border transition-all hover:scale-[1.02] ${
              dark ? "bg-slate-700/40 border-slate-600/40 hover:bg-slate-700/60" : "bg-slate-50 border-slate-100 hover:bg-slate-100"
            }`}
          >
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${a.color} flex items-center justify-center shadow-md ${dark ? "" : a.shadow}`}>
              <Icon name={a.icon} className="w-4 h-4 text-white" />
            </div>
            <span className={`text-xs font-medium ${dark ? "text-slate-300" : "text-slate-600"}`}>{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── DASHBOARD PAGE ──────────────────────────────────────────────────────────
function DashboardPage({ dark }) {
  const stats = [
    { label: "Open Tickets", value: 47, change: -12, icon: "chat", color: "from-blue-500 to-blue-600", sparkData: [30, 45, 38, 52, 48, 41, 47] },
    { label: "Waiting Response", value: 13, change: 8, icon: "clock", color: "from-amber-400 to-orange-500", sparkData: [8, 12, 10, 15, 11, 14, 13] },
    { label: "Resolved Today", value: 128, change: 23, icon: "check", color: "from-emerald-400 to-teal-500", sparkData: [80, 95, 88, 110, 105, 118, 128] },
    { label: "Avg Response Time", value: 8, change: -34, icon: "lightning", color: "from-violet-500 to-purple-600", sparkData: [25, 20, 18, 14, 12, 10, 8] },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Welcome */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className={`text-xl font-bold tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>
            Good morning, Jamie 👋
          </h1>
          <p className={`text-sm mt-0.5 ${dark ? "text-slate-400" : "text-slate-500"}`}>
            Here's what's happening with your support queue today.
          </p>
        </div>
        <button className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-200/50 hover:opacity-90 transition-opacity">
          <Icon name="plus" className="w-4 h-4" />
          New ticket
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => <StatCard key={i} {...s} dark={dark} />)}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Conversations — spans 2 cols */}
        <div className={`xl:col-span-2 rounded-2xl border overflow-hidden ${dark ? "bg-slate-800/60 border-slate-700/60" : "bg-white border-slate-100"}`}>
          <div className={`px-5 py-4 border-b flex items-center justify-between ${dark ? "border-slate-700/60" : "border-slate-100"}`}>
            <div>
              <h2 className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-900"}`}>Recent conversations</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">5 conversations needing attention</p>
            </div>
            <button className="text-xs text-blue-500 font-semibold hover:text-blue-600 transition-colors">View all →</button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {conversations.map((c) => (
              <div
                key={c.id}
                className={`flex items-start gap-3.5 px-5 py-4 cursor-pointer transition-colors ${
                  dark ? "hover:bg-slate-700/30 divide-slate-700" : "hover:bg-slate-50/80"
                }`}
              >
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${c.color} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm`}>
                  {c.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-sm font-semibold truncate ${dark ? "text-white" : "text-slate-900"}`}>{c.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium border ${dark ? "border-slate-600 text-slate-400 bg-slate-700/40" : "border-slate-200 text-slate-500 bg-slate-50"}`}>{c.tag}</span>
                    {c.priority === "high" && <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wide">Urgent</span>}
                  </div>
                  <p className={`text-xs truncate ${dark ? "text-slate-400" : "text-slate-500"}`}>{c.subject}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-[10px] text-slate-400">{c.time}</span>
                  <StatusBadge status={c.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <AIPerformance dark={dark} />
          <QuickActions dark={dark} />
        </div>
      </div>

      {/* Team activity */}
      <div className={`rounded-2xl border ${dark ? "bg-slate-800/60 border-slate-700/60" : "bg-white border-slate-100"}`}>
        <div className={`px-5 py-4 border-b ${dark ? "border-slate-700/60" : "border-slate-100"}`}>
          <h2 className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-900"}`}>Team activity</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Real-time feed</p>
        </div>
        <div className="px-5 py-3 space-y-0">
          {teamActivity.map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-3 border-b last:border-0 border-slate-100/60">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-xs font-bold shrink-0 ${item.isAI ? "ring-2 ring-violet-300/40" : ""}`}>
                {item.avatar}
              </div>
              <div className="flex-1">
                <span className={`text-xs font-semibold ${dark ? "text-slate-300" : "text-slate-700"}`}>{item.agent}</span>
                <span className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}> {item.action}</span>
              </div>
              <span className="text-[11px] text-slate-400 shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PLACEHOLDER PAGE ─────────────────────────────────────────────────────────
function PlaceholderPage({ name, dark }) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-200/40">
          <Icon name="lightning" className="w-8 h-8 text-white" />
        </div>
        <h2 className={`text-xl font-bold mb-2 ${dark ? "text-white" : "text-slate-900"}`}>{name}</h2>
        <p className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>This section is under construction.</p>
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const pageNames = { dashboard: "Dashboard", inbox: "Inbox", customers: "Customers", team: "Team", knowledge: "Knowledge Base", analytics: "Analytics", settings: "Settings" };

  return (
    <div className={`flex h-screen overflow-hidden font-sans antialiased ${dark ? "bg-slate-950" : "bg-slate-50"}`}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="absolute left-0 top-0 h-full w-60">
            <Sidebar active={activeNav} onNav={(id) => { setActiveNav(id); setMobileOpen(false); }} collapsed={false} dark={dark} />
          </div>
        </div>
      )}

      {/* Sidebar — desktop */}
      <div className={`hidden lg:flex shrink-0 transition-all duration-300 ${collapsed ? "w-16" : "w-60"}`}>
        <Sidebar active={activeNav} onNav={setActiveNav} collapsed={collapsed} dark={dark} />
      </div>

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar
          dark={dark}
          onToggleDark={() => setDark(!dark)}
          onToggleSidebar={() => setCollapsed(!collapsed)}
          collapsed={collapsed}
          onMobileMenu={() => setMobileOpen(true)}
        />

        {/* Breadcrumb */}
        <div className={`px-6 py-2.5 border-b flex items-center gap-2 shrink-0 ${dark ? "border-slate-800 bg-slate-900/60" : "border-slate-100 bg-white"}`}>
          <span className="text-xs text-slate-400 font-medium">SupportAI</span>
          <Icon name="chevronRight" className="w-3 h-3 text-slate-300" />
          <span className={`text-xs font-semibold ${dark ? "text-slate-200" : "text-slate-700"}`}>{pageNames[activeNav]}</span>
        </div>

        {/* Page content */}
        {activeNav === "dashboard"
          ? <DashboardPage dark={dark} />
          : <PlaceholderPage name={pageNames[activeNav]} dark={dark} />
        }
      </div>
    </div>
  );
}