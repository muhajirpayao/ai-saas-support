// src/pages/dashboard/Dashboard.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useProfile } from "@/hooks/useProfile";
// import InboxPage from "./Inbox/InboxPage";
// ─── THEME TOKENS ─────────────────────────────────────────────────────────────
// Light: clean slate
// Dark: obsidian + emerald (matches Landpage / SignupPage)
const T = {
  light: {
    bg: "#f8fafc",
    surface: "#ffffff",
    surfaceAlt: "#f1f5f9",
    border: "#e2e8f0",
    borderSubtle: "#f1f5f9",
    text: "#0f172a",
    textSub: "#64748b",
    textMuted: "#94a3b8",
    sidebar: "#0f172a",
    sidebarText: "#94a3b8",
    sidebarActive: "rgba(16,185,129,0.12)",
    sidebarActiveText: "#10b981",
    sidebarActiveBorder: "#10b981",
    topbar: "#ffffff",
    topbarBorder: "#e2e8f0",
    accent: "#10b981",
    accentText: "#fff",
    inputBg: "#f8fafc",
    inputBorder: "#e2e8f0",
    cardHover: "rgba(0,0,0,0.02)",
    statusOpen: { bg: "#dbeafe", text: "#1d4ed8" },
    statusWaiting: { bg: "#fef3c7", text: "#b45309" },
    statusAI: { bg: "#d1fae5", text: "#065f46" },
    statusResolved: { bg: "#f1f5f9", text: "#475569" },
    tagBg: "#f1f5f9",
    tagText: "#64748b",
    tagBorder: "#e2e8f0",
    breadcrumbText: "#64748b",
    breadcrumbActive: "#0f172a",
    scrollbar: "rgba(0,0,0,0.1)",
    notifUnread: "#eff6ff",
    profileBadge: { bg: "rgba(16,185,129,0.12)", text: "#065f46" },
    menuItem: "#374151",
    menuHover: "#f8fafc",
    signOutHover: "#fff1f2",
  },
  dark: {
    bg: "#0a0a0a",
    surface: "rgba(255,255,255,0.03)",
    surfaceAlt: "rgba(255,255,255,0.03)",
    border: "rgba(255,255,255,0.07)",
    borderSubtle: "rgba(255,255,255,0.04)",
    text: "#f1f0f5",
    textSub: "#a1a8bc",
    textMuted: "#64748b",
    sidebar: "rgba(20,21,24,0.97)",
    sidebarText: "#64748b",
    sidebarActive: "rgba(16,185,129,0.10)",
    sidebarActiveText: "#6ee7b7",
    sidebarActiveBorder: "#10b981",
    topbar: "rgba(20,21,24,0.85)",
    topbarBorder: "rgba(255,255,255,0.05)",
    accent: "#10b981",
    accentText: "#0a0a0a",
    inputBg: "rgba(255,255,255,0.04)",
    inputBorder: "rgba(255,255,255,0.09)",
    cardHover: "rgba(255,255,255,0.02)",
    statusOpen: { bg: "rgba(59,130,246,0.12)", text: "#93c5fd" },
    statusWaiting: { bg: "rgba(245,158,11,0.12)", text: "#fcd34d" },
    statusAI: { bg: "rgba(16,185,129,0.12)", text: "#6ee7b7" },
    statusResolved: { bg: "rgba(255,255,255,0.06)", text: "#a1a8bc" },
    tagBg: "rgba(255,255,255,0.04)",
    tagText: "#64748b",
    tagBorder: "rgba(255,255,255,0.07)",
    breadcrumbText: "#64748b",
    breadcrumbActive: "#f1f0f5",
    scrollbar: "rgba(255,255,255,0.07)",
    notifUnread: "rgba(16,185,129,0.06)",
    profileBadge: { bg: "rgba(16,185,129,0.12)", text: "#6ee7b7" },
    menuItem: "#cbd5e1",
    menuHover: "rgba(255,255,255,0.05)",
    signOutHover: "rgba(239,68,68,0.08)",
  },
};

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, className = "w-5 h-5", style = {} }) => {
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
    arrowUp: <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />,
    sparkles: <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />,
    logout: <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />,
    user: <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
  };
  const sizeMap = { "w-5 h-5": 20, "w-4 h-4": 16, "w-3.5 h-3.5": 14, "w-3 h-3": 12, "w-[18px] h-[18px]": 18, "w-8 h-8": 32, "w-2.5 h-2.5": 10 };
  const size = sizeMap[className] || 20;
  return (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} style={style}>
      {icons[name]}
    </svg>
  );
};

// ─── NAV ITEMS ────────────────────────────────────────────────────────────────
const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "inbox", label: "Inbox", icon: "inbox", badge: 12 },
  { id: "customers", label: "Customers", icon: "customers" },
  { id: "team", label: "Team", icon: "team" },
  { id: "knowledge", label: "Knowledge Base", icon: "knowledge" },
  { id: "analytics", label: "Analytics", icon: "analytics" },
  { id: "settings", label: "Settings", icon: "settings" },
];

// ─── STATIC DATA ──────────────────────────────────────────────────────────────
const conversations = [
  { id: 1, name: "Sarah Chen", avatar: "SC", color: "linear-gradient(135deg,#f472b6,#f43f5e)", subject: "Can't access my account after password reset", time: "2m ago", status: "open", priority: "high", tag: "Auth" },
  { id: 2, name: "Marcus Webb", avatar: "MW", color: "linear-gradient(135deg,#60a5fa,#6366f1)", subject: "Billing shows double charge for November", time: "14m ago", status: "waiting", priority: "high", tag: "Billing" },
  { id: 3, name: "Yuna Park", avatar: "YP", color: "linear-gradient(135deg,#a78bfa,#7c3aed)", subject: "How do I export my data as CSV?", time: "1h ago", status: "ai-resolved", priority: "low", tag: "Feature" },
  { id: 4, name: "Tom Gallagher", avatar: "TG", color: "linear-gradient(135deg,#34d399,#0d9488)", subject: "Integration with Zapier keeps failing", time: "2h ago", status: "open", priority: "medium", tag: "Integration" },
  { id: 5, name: "Priya Nair", avatar: "PN", color: "linear-gradient(135deg,#fbbf24,#f97316)", subject: "Request for enterprise pricing details", time: "3h ago", status: "waiting", priority: "medium", tag: "Sales" },
];

const teamActivity = [
  { agent: "Alex Kim", action: "resolved 3 tickets", time: "5m ago", avatar: "AK", color: "linear-gradient(135deg,#60a5fa,#6366f1)", isAI: false },
  { agent: "SupportAI", action: "auto-resolved 8 tickets", time: "12m ago", avatar: "AI", color: "linear-gradient(135deg,#10b981,#065f46)", isAI: true },
  { agent: "Mia Torres", action: "escalated 1 ticket to engineering", time: "28m ago", avatar: "MT", color: "linear-gradient(135deg,#f472b6,#f43f5e)", isAI: false },
  { agent: "SupportAI", action: "drafted reply for Marcus Webb", time: "31m ago", avatar: "AI", color: "linear-gradient(135deg,#10b981,#065f46)", isAI: true },
  { agent: "James Obi", action: "updated 2 knowledge base articles", time: "1h ago", avatar: "JO", color: "linear-gradient(135deg,#34d399,#0d9488)", isAI: false },
];

const notifications = [
  { text: "Marcus Webb replied to billing ticket", time: "2m ago", unread: true },
  { text: "AI resolved 8 tickets without escalation", time: "15m ago", unread: true },
  { text: "CSAT score reached 94% this week", time: "1h ago", unread: false },
];

// ─── UTILS ────────────────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

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

function Sparkline({ data, color, fill }) {
  const max = Math.max(...data), min = Math.min(...data);
  const w = 80, h = 32;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={fill} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Avatar({ initials, avatarUrl, size = 32 }) {
  const s = { width: size, height: size, borderRadius: "50%", flexShrink: 0 };
  if (avatarUrl) return <img src={avatarUrl} alt="avatar" style={{ ...s, objectFit: "cover" }} />;
  return (
    <div style={{ ...s, background: "linear-gradient(135deg,#10b981,#065f46)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: size * 0.35, fontWeight: 700 }}>
      {initials}
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
function Sidebar({ active, onNav, collapsed, t, fullName, initials, avatarUrl, role }) {
  const isDark = t === T.dark;
  return (
    <aside style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      width: collapsed ? 64 : 240,
      background: t.sidebar,
      borderRight: `1px solid ${t.border}`,
      transition: "width 0.3s",
      flexShrink: 0,
      backdropFilter: isDark ? "blur(20px)" : "none",
      WebkitBackdropFilter: isDark ? "blur(20px)" : "none",
      position: "relative",
      zIndex: 20,
    }}>
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: collapsed ? "20px 0" : "20px 16px", borderBottom: `1px solid ${t.border}`, justifyContent: collapsed ? "center" : "flex-start" }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: isDark ? "rgba(16,185,129,0.15)" : "#065f46", display: "flex", alignItems: "center", justifyContent: "center", border: isDark ? "1px solid rgba(110,231,183,0.25)" : "none" }}>
            <span style={{ color: isDark ? "#6ee7b7" : "#fff", fontWeight: 800, fontSize: 15, letterSpacing: "0.18em" }}>S</span>
          </div>
          <span style={{ position: "absolute", top: -2, right: -2, width: 10, height: 10, background: "#10b981", borderRadius: "50%", border: `2px solid ${t.sidebar}` }} />
        </div>
        {!collapsed && (
          <div>
            <div style={{ color: "#f1f0f5", fontWeight: 700, fontSize: 13, letterSpacing: "0.18em", lineHeight: 1 }}>SupportAI</div>
            <div style={{ color: t.sidebarText, fontSize: 10, fontWeight: 600, marginTop: 2, letterSpacing: "0.1em", textTransform: "uppercase" }}>Workspace</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
        {navItems.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: collapsed ? "10px 0" : "10px 12px",
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius: 10,
                marginBottom: 2,
                background: isActive ? t.sidebarActive : "transparent",
                color: isActive ? t.sidebarActiveText : t.sidebarText,
                border: "none",
                cursor: "pointer",
                position: "relative",
                textAlign: "left",
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#f1f0f5"; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = t.sidebarText; } }}
            >
              {isActive && <span style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: 20, background: "#10b981", borderRadius: "0 3px 3px 0" }} />}
              <Icon name={item.icon} className="w-[18px] h-[18px]" style={{ color: isActive ? "#10b981" : t.sidebarText }} />
              {!collapsed && (
                <>
                  <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{item.label}</span>
                  {item.badge && (
                    <span style={{ fontSize: 10, fontWeight: 700, background: "rgba(16,185,129,0.15)", color: "#6ee7b7", padding: "2px 7px", borderRadius: 99, border: "1px solid rgba(110,231,183,0.22)" }}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {collapsed && item.badge && (
                <span style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, background: "#10b981", borderRadius: "50%" }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* User footer */}
      <div style={{ borderTop: `1px solid ${t.border}`, padding: 12, display: "flex", justifyContent: collapsed ? "center" : "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: collapsed ? 0 : "0 4px" }}>
          <Avatar initials={initials} avatarUrl={avatarUrl} size={32} />
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: "#f1f0f5", fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{fullName || "Loading…"}</div>
              <div style={{ color: t.sidebarText, fontSize: 10, textTransform: "capitalize" }}>{role || "Member"}</div>
            </div>
          )}
          {!collapsed && <Icon name="chevronDown" className="w-3.5 h-3.5" style={{ color: t.sidebarText }} />}
        </div>
      </div>
    </aside>
  );
}

// ─── TOPBAR ──────────────────────────────────────────────────────────────────
function Topbar({ t, onToggleDark, dark, onToggleSidebar, collapsed, onMobileMenu, fullName, email, initials, avatarUrl, role, onSignOut }) {
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const notifRef = useRef();
  const profileRef = useRef();
  const isDark = t === T.dark;

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const iconBtn = (onClick, children, badge = false) => (
    <button onClick={onClick} style={{ background: "none", border: "none", cursor: "pointer", color: t.textSub, padding: 8, borderRadius: 10, display: "flex", alignItems: "center", position: "relative", transition: "background 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9"}
      onMouseLeave={e => e.currentTarget.style.background = "none"}
    >
      {children}
      {badge && <span style={{ position: "absolute", top: 7, right: 7, width: 7, height: 7, background: "#10b981", borderRadius: "50%", border: `2px solid ${t.topbar}` }} />}
    </button>
  );

  const dropdownBase = {
    position: "absolute",
    right: 0,
    top: "calc(100% + 8px)",
    width: 300,
    borderRadius: 16,
    border: `1px solid ${t.border}`,
    background: isDark ? "rgba(20,21,24,0.98)" : "#fff",
    backdropFilter: isDark ? "blur(20px)" : "none",
    WebkitBackdropFilter: isDark ? "blur(20px)" : "none",
    boxShadow: isDark ? "0 8px 40px rgba(0,0,0,0.6)" : "0 8px 40px rgba(0,0,0,0.12)",
    zIndex: 100,
    overflow: "hidden",
  };

  return (
    <header style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", borderBottom: `1px solid ${t.topbarBorder}`, background: t.topbar, backdropFilter: isDark ? "blur(12px)" : "none", WebkitBackdropFilter: isDark ? "blur(12px)" : "none", flexShrink: 0, zIndex: 20, gap: 8 }}>
      {/* Left */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0 }}>
        {/* Mobile menu */}
        <button onClick={onMobileMenu} className="db-mobile-menu-btn" style={{ background: "none", border: "none", cursor: "pointer", color: t.textSub, padding: 8, borderRadius: 10, flexShrink: 0 }}>
          <Icon name="menu" className="w-5 h-5" />
        </button>
        {/* Sidebar toggle (desktop) */}
        <button onClick={onToggleSidebar} className="db-sidebar-toggle" style={{ background: "none", border: "none", cursor: "pointer", color: t.textSub, padding: 8, borderRadius: 10, flexShrink: 0 }}
          onMouseEnter={e => e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9"}
          onMouseLeave={e => e.currentTarget.style.background = "none"}
        >
          <Icon name={collapsed ? "chevronRight" : "chevronLeft"} className="w-4 h-4" />
        </button>
        {/* Search — real input */}
        <div className="db-search-wrap" style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "0 12px", borderRadius: 10,
          border: `1px solid ${searchFocused ? "rgba(110,231,183,0.5)" : t.inputBorder}`,
          background: t.inputBg,
          boxShadow: searchFocused ? (isDark ? "0 0 0 3px rgba(16,185,129,0.1)" : "0 0 0 3px rgba(16,185,129,0.08)") : "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
          maxWidth: 260,
          width: "100%",
          height: 36,
          flexShrink: 1,
        }}>
          <Icon name="search" className="w-4 h-4" style={{ color: t.textMuted, flexShrink: 0 }} />
          <input
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search conversations…"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: t.text,
              fontSize: 13,
              fontFamily: "inherit",
              minWidth: 0,
            }}
          />
          {searchVal.length === 0 && (
            <kbd style={{ fontSize: 10, padding: "2px 5px", borderRadius: 5, border: `1px solid ${t.border}`, background: isDark ? "rgba(255,255,255,0.04)" : "#fff", color: t.textMuted, fontFamily: "monospace", flexShrink: 0 }}>⌘K</kbd>
          )}
        </div>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
        {iconBtn(onToggleDark, <Icon name={dark ? "sun" : "moon"} className="w-[18px] h-[18px]" />)}

        {/* Notifications */}
        <div ref={notifRef} style={{ position: "relative" }}>
          {iconBtn(() => setShowNotifs(!showNotifs), <Icon name="bell" className="w-[18px] h-[18px]" />, true)}
          {showNotifs && (
            <div style={dropdownBase}>
              <div style={{ padding: "12px 16px", borderBottom: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: t.text, fontSize: 13, fontWeight: 600 }}>Notifications</span>
                <span style={{ color: "#10b981", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Mark all read</span>
              </div>
              {notifications.map((n, i) => (
                <div key={i} style={{ padding: "12px 16px", display: "flex", gap: 10, alignItems: "flex-start", borderBottom: i < notifications.length - 1 ? `1px solid ${t.borderSubtle}` : "none", background: n.unread ? t.notifUnread : "transparent", cursor: "pointer" }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: n.unread ? "#10b981" : t.border, marginTop: 5, flexShrink: 0 }} />
                  <div>
                    <p style={{ color: t.text, fontSize: 12, margin: 0 }}>{n.text}</p>
                    <p style={{ color: t.textMuted, fontSize: 11, margin: "2px 0 0" }}>{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <div ref={profileRef} style={{ position: "relative" }}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 8px 4px 4px", borderRadius: 12, background: "none", border: "none", cursor: "pointer", transition: "background 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >
            <Avatar initials={initials} avatarUrl={avatarUrl} size={28} />
            <Icon name="chevronDown" className="w-3.5 h-3.5" style={{ color: t.textMuted }} />
          </button>
          {showProfile && (
            <div style={{ ...dropdownBase, width: 220 }}>
              <div style={{ padding: "14px 16px", borderBottom: `1px solid ${t.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <Avatar initials={initials} avatarUrl={avatarUrl} size={36} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ color: t.text, fontSize: 13, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{fullName || "—"}</p>
                    <p style={{ color: t.textMuted, fontSize: 11, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{email || "—"}</p>
                  </div>
                </div>
                <span style={{ display: "inline-block", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, textTransform: "uppercase", letterSpacing: "0.05em", background: t.profileBadge.bg, color: t.profileBadge.text }}>{role || "Member"}</span>
              </div>
              {["Profile", "Preferences", "Billing"].map((item) => (
                <button key={item} style={{ width: "100%", textAlign: "left", padding: "10px 16px", fontSize: 13, color: t.menuItem, background: "none", border: "none", cursor: "pointer", transition: "background 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = t.menuHover}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                >{item}</button>
              ))}
              <div style={{ borderTop: `1px solid ${t.border}` }}>
                <button onClick={onSignOut} style={{ width: "100%", textAlign: "left", padding: "10px 16px", fontSize: 13, color: "#ef4444", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "background 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = t.signOutHover}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                >
                  <Icon name="logout" className="w-4 h-4" style={{ color: "#ef4444" }} />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ label, value, change, icon, sparkData, t }) {
  const isPos = change >= 0;
  const isDark = t === T.dark;
  return (
    <div style={{
      background: t.surface,
      border: `1px solid ${t.border}`,
      borderRadius: 16,
      padding: 18,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      transition: "border-color 0.2s, box-shadow 0.2s",
      backdropFilter: isDark ? "blur(14px)" : "none",
      WebkitBackdropFilter: isDark ? "blur(14px)" : "none",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = isDark ? "rgba(110,231,183,0.22)" : "rgba(16,185,129,0.3)"; e.currentTarget.style.boxShadow = isDark ? "0 0 20px rgba(16,185,129,0.08)" : "0 4px 16px rgba(16,185,129,0.08)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: isDark ? "rgba(16,185,129,0.15)" : "#065f46", border: isDark ? "1px solid rgba(110,231,183,0.22)" : "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={icon} className="w-[18px] h-[18px]" style={{ color: isDark ? "#6ee7b7" : "#fff" }} />
        </div>
        <Sparkline data={sparkData} color="#10b981" fill="rgba(16,185,129,0.10)" />
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: t.text, letterSpacing: "-0.02em", marginBottom: 2 }}>
        <AnimatedNumber target={value} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: t.textSub, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: isPos ? "#10b981" : "#f43f5e", display: "flex", alignItems: "center", gap: 2 }}>
          <Icon name="arrowUp" className="w-2.5 h-2.5" style={{ color: isPos ? "#10b981" : "#f43f5e", transform: !isPos ? "rotate(180deg)" : "none" }} />
          {Math.abs(change)}%
        </span>
      </div>
    </div>
  );
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
function StatusBadge({ status, t }) {
  const map = { open: t.statusOpen, waiting: t.statusWaiting, "ai-resolved": t.statusAI, resolved: t.statusResolved };
  const labels = { open: "Open", waiting: "Waiting", "ai-resolved": "AI Resolved", resolved: "Resolved" };
  const s = map[status] || t.statusOpen;
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 99, textTransform: "uppercase", letterSpacing: "0.05em", background: s.bg, color: s.text, whiteSpace: "nowrap" }}>
      {labels[status] || "Open"}
    </span>
  );
}

// ─── AI PERFORMANCE ───────────────────────────────────────────────────────────
function AIPerformance({ t }) {
  const isDark = t === T.dark;
  const metrics = [
    { label: "Auto-resolved", value: 80, color: "linear-gradient(90deg,#10b981,#6ee7b7)" },
    { label: "Accuracy", value: 97, color: "linear-gradient(90deg,#6ee7b7,#34d399)" },
    { label: "CSAT from AI", value: 91, color: "linear-gradient(90deg,#f59e0b,#fbbf24)" },
  ];
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: 18, backdropFilter: isDark ? "blur(14px)" : "none", WebkitBackdropFilter: isDark ? "blur(14px)" : "none" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(110,231,183,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="sparkles" className="w-3.5 h-3.5" style={{ color: "#6ee7b7" }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: t.text, fontSize: 13, fontWeight: 600 }}>AI Performance</div>
          <div style={{ color: t.textMuted, fontSize: 10 }}>Last 7 days</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
          <span style={{ fontSize: 10, color: "#6ee7b7", fontWeight: 700 }}>Live</span>
        </div>
      </div>
      {metrics.map((m, i) => (
        <div key={i} style={{ marginBottom: i < metrics.length - 1 ? 14 : 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 12, color: t.textSub }}>{m.label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: t.text }}>{m.value}%</span>
          </div>
          <div style={{ height: 4, borderRadius: 99, background: isDark ? "rgba(255,255,255,0.07)" : "#f1f5f9" }}>
            <div style={{ height: "100%", borderRadius: 99, background: m.color, width: `${m.value}%`, transition: "width 1s" }} />
          </div>
        </div>
      ))}
      <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between" }}>
        {[["1,284", "Tickets"], ["8s", "Resolution"], ["$0.12", "Cost/ticket"]].map(([val, lbl], i) => (
          <div key={i} style={{ textAlign: "center", flex: 1, borderRight: i < 2 ? `1px solid ${t.border}` : "none" }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: i === 2 ? "#6ee7b7" : t.text }}>{val}</div>
            <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{lbl}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── QUICK ACTIONS ────────────────────────────────────────────────────────────
function QuickActions({ t }) {
  const isDark = t === T.dark;
  const actions = [
    { label: "New ticket", icon: "plus", iconColor: "#6ee7b7" },
    { label: "AI draft", icon: "sparkles", iconColor: "#a78bfa" },
    { label: "View inbox", icon: "inbox", iconColor: "#fbbf24" },
    { label: "Analytics", icon: "trending", iconColor: "#60a5fa" },
  ];
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: 18, backdropFilter: isDark ? "blur(14px)" : "none", WebkitBackdropFilter: isDark ? "blur(14px)" : "none" }}>
      <h3 style={{ color: t.text, fontSize: 13, fontWeight: 600, margin: "0 0 12px" }}>Quick actions</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {actions.map((a, i) => (
          <button key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, padding: "12px 8px", borderRadius: 12, border: `1px solid ${t.border}`, background: "transparent", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = isDark ? "rgba(16,185,129,0.06)" : "rgba(16,185,129,0.04)"; e.currentTarget.style.borderColor = "rgba(110,231,183,0.22)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = t.border; }}
          >
            <div style={{ width: 30, height: 30, borderRadius: 9, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(110,231,183,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name={a.icon} className="w-4 h-4" style={{ color: a.iconColor }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 500, color: t.textSub }}>{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── DASHBOARD PAGE ──────────────────────────────────────────────────────────
function DashboardPage({ t, firstName }) {
  const isDark = t === T.dark;
  const stats = [
    { label: "Open Tickets", value: 47, change: -12, icon: "chat", sparkData: [30, 45, 38, 52, 48, 41, 47] },
    { label: "Waiting Response", value: 13, change: 8, icon: "clock", sparkData: [8, 12, 10, 15, 11, 14, 13] },
    { label: "Resolved Today", value: 128, change: 23, icon: "check", sparkData: [80, 95, 88, 110, 105, 118, 128] },
    { label: "Avg Response (s)", value: 8, change: -34, icon: "lightning", sparkData: [25, 20, 18, 14, 12, 10, 8] },
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px" }} className="db-main-scroll">
      {/* Greeting */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ color: t.text, fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>
            {getGreeting()}{firstName ? `, ${firstName}` : ""} 👋
          </h1>
          <p style={{ color: t.textSub, fontSize: 13, margin: "4px 0 0" }}>Here's what's happening with your support queue today.</p>
        </div>
        <button className="db-new-ticket-btn" style={{ display: "flex", alignItems: "center", gap: 6, background: "#065f46", color: "#fff", fontSize: 13, fontWeight: 600, padding: "9px 18px", borderRadius: 10, border: "none", cursor: "pointer", flexShrink: 0, boxShadow: "0 0 20px rgba(16,185,129,0.25)", transition: "background 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.background = "#047857"}
          onMouseLeave={e => e.currentTarget.style.background = "#065f46"}
        >
          <Icon name="plus" className="w-4 h-4" style={{ color: "#fff" }} />
          New ticket
        </button>
      </div>

      {/* Stats grid */}
      <div className="db-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        {stats.map((s, i) => <StatCard key={i} {...s} t={t} />)}
      </div>

      {/* Main grid */}
      <div className="db-main-grid" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, marginBottom: 20 }}>
        {/* Conversations */}
        <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, overflow: "hidden", backdropFilter: isDark ? "blur(14px)" : "none", WebkitBackdropFilter: isDark ? "blur(14px)" : "none" }}>
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 style={{ color: t.text, fontSize: 13, fontWeight: 600, margin: 0 }}>Recent conversations</h2>
              <p style={{ color: t.textMuted, fontSize: 11, margin: "2px 0 0" }}>5 conversations needing attention</p>
            </div>
            <button style={{ fontSize: 12, color: "#6ee7b7", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>View all →</button>
          </div>
          {conversations.map((c, i) => (
            <div key={c.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 18px", borderBottom: i < conversations.length - 1 ? `1px solid ${t.borderSubtle}` : "none", cursor: "pointer", transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = t.cardHover}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: c.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                {c.avatar}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2, flexWrap: "wrap" }}>
                  <span style={{ color: t.text, fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
                  <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 99, background: t.tagBg, color: t.tagText, border: `1px solid ${t.tagBorder}`, whiteSpace: "nowrap" }}>{c.tag}</span>
                  {c.priority === "high" && <span style={{ fontSize: 10, color: "#f87171", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Urgent</span>}
                </div>
                <p style={{ color: t.textSub, fontSize: 12, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.subject}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5, flexShrink: 0 }}>
                <span style={{ fontSize: 10, color: t.textMuted }}>{c.time}</span>
                <StatusBadge status={c.status} t={t} />
              </div>
            </div>
          ))}
        </div>

        {/* Right col */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <AIPerformance t={t} />
          <QuickActions t={t} />
        </div>
      </div>

      {/* Team activity */}
      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, overflow: "hidden", backdropFilter: isDark ? "blur(14px)" : "none", WebkitBackdropFilter: isDark ? "blur(14px)" : "none", marginBottom: 24 }}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${t.border}` }}>
          <h2 style={{ color: t.text, fontSize: 13, fontWeight: 600, margin: 0 }}>Team activity</h2>
          <p style={{ color: t.textMuted, fontSize: 11, margin: "2px 0 0" }}>Real-time feed</p>
        </div>
        <div style={{ padding: "4px 18px" }}>
          {teamActivity.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 0", borderBottom: i < teamActivity.length - 1 ? `1px solid ${t.borderSubtle}` : "none" }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: item.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0, boxShadow: item.isAI && isDark ? "0 0 10px rgba(16,185,129,0.25)" : "none" }}>
                {item.avatar}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ color: t.text, fontSize: 12, fontWeight: 600 }}>{item.agent}</span>
                <span style={{ color: t.textSub, fontSize: 12 }}> {item.action}</span>
              </div>
              <span style={{ color: t.textMuted, fontSize: 11, flexShrink: 0 }}>{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Ambient glow (dark only) */}
      {isDark && (
        <>
          <div style={{ position: "fixed", top: "-10%", right: "-10%", width: "50%", height: "50%", borderRadius: "50%", background: "rgba(16,185,129,0.04)", filter: "blur(140px)", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ position: "fixed", bottom: "-10%", left: "-5%", width: "40%", height: "40%", borderRadius: "50%", background: "rgba(6,95,70,0.05)", filter: "blur(120px)", pointerEvents: "none", zIndex: 0 }} />
        </>
      )}
    </div>
  );
}

// ─── PLACEHOLDER PAGE ─────────────────────────────────────────────────────────
function PlaceholderPage({ name, t }) {
  const isDark = t === T.dark;
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(110,231,183,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 0 30px rgba(16,185,129,0.15)" }}>
          <Icon name="lightning" className="w-8 h-8" style={{ color: "#6ee7b7" }} />
        </div>
        <h2 style={{ color: t.text, fontSize: 20, fontWeight: 700, margin: "0 0 8px" }}>{name}</h2>
        <p style={{ color: t.textSub, fontSize: 14, margin: 0 }}>This section is under construction.</p>
      </div>
    </div>
  );
}

// ─── LOADING SCREEN ───────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(110,231,183,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
          <span style={{ color: "#6ee7b7", fontWeight: 800, fontSize: 15, letterSpacing: "0.18em" }}>S</span>
        </div>
        <p style={{ color: "#64748b", fontSize: 13, fontFamily: "'Inter', sans-serif" }}>Loading your workspace…</p>
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const { profile, user, loading, initials, firstName } = useProfile();

  const [activeNav, setActiveNav] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  // Auto dark mode on mount — always starts dark to match Landpage/Signup
  const [dark, setDark] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const t = dark ? T.dark : T.light;
  const isDark = dark;

  const pageNames = {
    dashboard: "Dashboard", inbox: "Inbox", customers: "Customers",
    team: "Team", knowledge: "Knowledge Base", analytics: "Analytics", settings: "Settings",
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) return <LoadingScreen />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${t.scrollbar}; border-radius: 10px; }

        /* Responsive breakpoints */
        @media (max-width: 1024px) {
          .db-sidebar-toggle { display: none !important; }
          .db-mobile-menu-btn { display: flex !important; }
          .db-desktop-sidebar { display: none !important; }
        }
        @media (min-width: 1025px) {
          .db-mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 900px) {
          .db-main-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .db-stats-grid { grid-template-columns: 1fr 1fr !important; }
          .db-new-ticket-btn span { display: none; }
          .db-search-wrap { max-width: 160px !important; }
        }
        @media (max-width: 380px) {
          .db-stats-grid { grid-template-columns: 1fr !important; }
          .db-search-wrap { display: none !important; }
        }
      `}</style>

      <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: isDark ? "#0a0a0a" : "#f8fafc", fontFamily: "'Inter', sans-serif" }}>

        {/* Mobile overlay */}
        {mobileOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={() => setMobileOpen(false)}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }} />
            <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: 240 }} onClick={e => e.stopPropagation()}>
              <Sidebar active={activeNav} onNav={(id) => { setActiveNav(id); setMobileOpen(false); }} collapsed={false} t={t} fullName={profile?.full_name} initials={initials} avatarUrl={profile?.avatar_url} role={profile?.role} />
            </div>
          </div>
        )}

        {/* Sidebar desktop */}
        <div className="db-desktop-sidebar" style={{ flexShrink: 0, height: "100%" }}>
          <Sidebar active={activeNav} onNav={setActiveNav} collapsed={collapsed} t={t} fullName={profile?.full_name} initials={initials} avatarUrl={profile?.avatar_url} role={profile?.role} />
        </div>

        {/* Main */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
          <Topbar t={t} dark={dark} onToggleDark={() => setDark(!dark)} onToggleSidebar={() => setCollapsed(!collapsed)} collapsed={collapsed} onMobileMenu={() => setMobileOpen(true)} fullName={profile?.full_name} email={user?.email} initials={initials} avatarUrl={profile?.avatar_url} role={profile?.role} onSignOut={handleSignOut} />

          {/* Breadcrumb */}
          <div style={{ padding: "7px 16px", borderBottom: `1px solid ${t.borderSubtle}`, background: t.topbar, backdropFilter: isDark ? "blur(8px)" : "none", WebkitBackdropFilter: isDark ? "blur(8px)" : "none", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <span style={{ color: t.textMuted, fontSize: 12, fontWeight: 500 }}>SupportAI</span>
            <Icon name="chevronRight" className="w-3 h-3" style={{ color: t.textMuted }} />
            <span style={{ color: t.text, fontSize: 12, fontWeight: 600 }}>{pageNames[activeNav]}</span>
          </div>

          {/* Content */}
          {activeNav === "dashboard" && <DashboardPage t={t} firstName={firstName} />}
{activeNav === "inbox" && <InboxPage t={t} />}
{!["dashboard", "inbox"].includes(activeNav) && <PlaceholderPage name={pageNames[activeNav]} t={t} />}
        </div>
      </div>
    </>
  );
}