import { useState, useMemo, useEffect } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_MEMBERS = [
  {
    id: 1, initials: "SM", avGradient: "linear-gradient(135deg,#34d399,#0d9488)",
    name: "Sarah Mitchell", email: "s.mitchell@smartcentria.com", phone: "+1 415 555 0172",
    role: "owner", status: "active", lastActive: "Just now", joinedDate: "Jan 5, 2024",
    assignedConvos: 0, resolvedConvos: 142,
    activity: [
      { action: "Promoted Alex Torres to Admin", time: "Today 9:00 AM" },
      { action: "Updated team permissions", time: "Jun 23" },
      { action: "Invited 3 new agents", time: "Jun 20" },
    ],
  },
  {
    id: 2, initials: "AT", avGradient: "linear-gradient(135deg,#f472b6,#f43f5e)",
    name: "Alex Torres", email: "a.torres@smartcentria.com", phone: "+1 628 555 0341",
    role: "admin", status: "active", lastActive: "5 min ago", joinedDate: "Feb 12, 2024",
    assignedConvos: 4, resolvedConvos: 89,
    activity: [
      { action: "Resolved conversation #3421", time: "Today 10:15 AM" },
      { action: "Added article to Knowledge Base", time: "Today 8:30 AM" },
      { action: "Assigned conversation to Priya", time: "Jun 24" },
    ],
  },
  {
    id: 3, initials: "PS", avGradient: "linear-gradient(135deg,#60a5fa,#6366f1)",
    name: "Priya Sharma", email: "p.sharma@smartcentria.com", phone: "+1 310 555 0879",
    role: "agent", status: "active", lastActive: "12 min ago", joinedDate: "Mar 4, 2024",
    assignedConvos: 7, resolvedConvos: 203,
    activity: [
      { action: "Replied to Maya Rodriguez", time: "Today 11:02 AM" },
      { action: "Resolved 3 conversations", time: "Today 9:45 AM" },
      { action: "Updated customer profile", time: "Jun 24" },
    ],
  },
  {
    id: 4, initials: "JD", avGradient: "linear-gradient(135deg,#fbbf24,#f97316)",
    name: "James Donovan", email: "j.donovan@smartcentria.com", phone: "+1 212 555 0013",
    role: "agent", status: "active", lastActive: "1 hr ago", joinedDate: "Mar 18, 2024",
    assignedConvos: 5, resolvedConvos: 178,
    activity: [
      { action: "Replied to Lena Park", time: "Today 10:30 AM" },
      { action: "Merged duplicate conversations", time: "Jun 23" },
    ],
  },
  {
    id: 5, initials: "NL", avGradient: "linear-gradient(135deg,#a78bfa,#7c3aed)",
    name: "Nina Liu", email: "n.liu@smartcentria.com", phone: "+1 510 555 0267",
    role: "admin", status: "active", lastActive: "3 hr ago", joinedDate: "Apr 2, 2024",
    assignedConvos: 2, resolvedConvos: 61,
    activity: [
      { action: "Published knowledge base article", time: "Jun 24" },
      { action: "Updated team SLA settings", time: "Jun 22" },
    ],
  },
  {
    id: 6, initials: "BO", avGradient: "linear-gradient(135deg,#6ee7b7,#10b981)",
    name: "Ben Okafor", email: "b.okafor@smartcentria.com", phone: "+1 669 555 0504",
    role: "agent", status: "inactive", lastActive: "5 days ago", joinedDate: "Apr 29, 2024",
    assignedConvos: 0, resolvedConvos: 44,
    activity: [
      { action: "Logged out of dashboard", time: "Jun 20" },
    ],
  },
  {
    id: 7, initials: "CR", avGradient: "linear-gradient(135deg,#f472b6,#a855f7)",
    name: "Clara Reyes", email: "c.reyes@smartcentria.com", phone: "+1 647 555 0881",
    role: "agent", status: "active", lastActive: "Yesterday", joinedDate: "May 10, 2024",
    assignedConvos: 9, resolvedConvos: 95,
    activity: [
      { action: "Reopened conversation #3388", time: "Jun 24" },
      { action: "Tagged conversation as urgent", time: "Jun 23" },
    ],
  },
];

const MOCK_INVITATIONS = [
  { id: 1, email: "d.kim@company.com", role: "agent", sentDate: "Jun 23, 2024", expiresIn: "5 days" },
  { id: 2, email: "r.patel@startup.io", role: "admin", sentDate: "Jun 22, 2024", expiresIn: "4 days" },
  { id: 3, email: "l.chen@enterprise.com", role: "agent", sentDate: "Jun 21, 2024", expiresIn: "3 days" },
];

// ─── Design tokens (mirrors Customers page) ───────────────────────────────────
const ROLE_CONFIG = {
  owner: {
    light: { bg: "#fef3c7", text: "#92400e", border: "#fde68a" },
    dark:  { bg: "rgba(251,191,36,0.12)", text: "#fcd34d", border: "rgba(251,191,36,0.2)" },
    label: "Owner", icon: "◆",
    permissions: ["Full access to all features", "Manage billing & subscription", "Manage team & roles", "Delete workspace"],
  },
  admin: {
    light: { bg: "#ede9fe", text: "#5b21b6", border: "#ddd6fe" },
    dark:  { bg: "rgba(167,139,250,0.12)", text: "#c4b5fd", border: "rgba(167,139,250,0.2)" },
    label: "Admin", icon: "▲",
    permissions: ["Manage conversations", "Manage customers", "Manage knowledge base", "Manage team"],
  },
  agent: {
    light: { bg: "#d1fae5", text: "#065f46", border: "#a7f3d0" },
    dark:  { bg: "rgba(16,185,129,0.12)", text: "#6ee7b7", border: "rgba(16,185,129,0.2)" },
    label: "Agent", icon: "●",
    permissions: ["Manage conversations", "View customers"],
  },
};

const STATUS_CONFIG = {
  active:   { light: { bg: "#d1fae5", text: "#065f46", dot: "#10b981" }, dark: { bg: "rgba(16,185,129,0.12)", text: "#6ee7b7", dot: "#10b981" }, label: "Active" },
  inactive: { light: { bg: "#f1f5f9", text: "#475569", dot: "#94a3b8" }, dark: { bg: "rgba(255,255,255,0.06)", text: "#a1a8bc", dot: "#64748b" }, label: "Inactive" },
  pending:  { light: { bg: "#fef3c7", text: "#b45309", dot: "#f59e0b" }, dark: { bg: "rgba(245,158,11,0.12)", text: "#fcd34d", dot: "#f59e0b" }, label: "Pending" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function isDark(t) {
  return t?.bg === "#0a0a0a" || (typeof t?.sidebar === "string" && t.sidebar.includes("20,21,24"));
}

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return mobile;
}

// ─── Role Badge ───────────────────────────────────────────────────────────────
function RoleBadge({ role, t }) {
  const dark = isDark(t);
  const cfg = ROLE_CONFIG[role];
  if (!cfg) return null;
  const s = dark ? cfg.dark : cfg.light;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 9px", borderRadius: 99,
      fontSize: 10, fontWeight: 700,
      background: s.bg, color: s.text,
      border: `1px solid ${s.border}`,
      letterSpacing: "0.04em", textTransform: "uppercase",
      whiteSpace: "nowrap",
    }}>
      <span style={{ fontSize: 8 }}>{cfg.icon}</span>
      {cfg.label}
    </span>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status, t }) {
  const dark = isDark(t);
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.inactive;
  const s = dark ? cfg.dark : cfg.light;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: s.bg, color: s.text,
      padding: "3px 8px", borderRadius: 99,
      fontSize: 10, fontWeight: 700,
      textTransform: "uppercase", letterSpacing: "0.05em",
      whiteSpace: "nowrap",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ member, size = 32, ring = false }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: member.avGradient,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontSize: size * 0.34, fontWeight: 700, flexShrink: 0,
      boxShadow: ring ? "0 0 0 2px #10b981, 0 0 0 4px rgba(16,185,129,0.2)" : "none",
    }}>
      {member.initials}
    </div>
  );
}

// ─── Stat Cards ───────────────────────────────────────────────────────────────
function TeamStatsCards({ members, invitations, t, isMobile }) {
  const dark = isDark(t);
  const total = members.length;
  const active = members.filter(m => m.status === "active").length;
  const online = members.filter(m => ["Just now", "5 min ago", "12 min ago", "1 hr ago"].includes(m.lastActive)).length;
  const pending = invitations.length;

  const stats = [
    { label: "Total members", value: total, sub: "In workspace", accent: t?.accent || "#10b981" },
    { label: "Active", value: active, sub: `${Math.round((active / total) * 100)}% of team`, accent: t?.accent || "#10b981" },
    { label: "Pending invites", value: pending, sub: "Awaiting response", accent: "#f59e0b" },
    { label: "Online now", value: online, sub: "Currently active", accent: "#3b82f6" },
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
      gap: isMobile ? 10 : 12,
      marginBottom: isMobile ? 16 : 20,
    }}>
      {stats.map((s, i) => (
        <div key={i} style={{
          background: t?.surface || "#fff",
          border: `1px solid ${t?.border || "#e2e8f0"}`,
          borderRadius: isMobile ? 14 : 16,
          padding: isMobile ? "14px" : 16,
          backdropFilter: dark ? "blur(14px)" : "none",
          WebkitBackdropFilter: dark ? "blur(14px)" : "none",
          position: "relative", overflow: "hidden",
          transition: "border-color 0.2s",
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = dark ? "rgba(110,231,183,0.22)" : "rgba(16,185,129,0.3)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = t?.border || "#e2e8f0"}
        >
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2,
            background: i === 2 ? "#f59e0b" : i === 3 ? "#3b82f6" : (dark ? "rgba(16,185,129,0.4)" : "rgba(16,185,129,0.3)"),
            borderRadius: "14px 14px 0 0",
          }} />
          <div style={{ fontSize: 10, color: t?.textSub || "#64748b", fontWeight: 500, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em", lineHeight: 1.3 }}>{s.label}</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: i === 2 ? "#f59e0b" : i === 3 ? "#3b82f6" : (t?.text || "#0f172a"), letterSpacing: "-0.02em", marginBottom: 4, lineHeight: 1 }}>{s.value}</div>
          <div style={{ fontSize: 10, color: s.accent, fontWeight: 600 }}>{s.sub}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────
function TeamToolbar({ search, onSearch, filter, onFilter, roleFilter, onRoleFilter, sort, onSort, onInvite, t, isMobile }) {
  const dark = isDark(t);
  const [focused, setFocused] = useState(false);
  const filters = ["all", "active", "inactive", "pending"];
  const filterLabels = { all: "All", active: "Active", inactive: "Inactive", pending: "Pending" };

  return (
    <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "stretch" : "center", gap: isMobile ? 10 : 10, marginBottom: 16 }}>
      {/* Row 1: search + sort + invite */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", flex: 1 }}>
        {/* Search */}
        <div style={{
          flex: 1, display: "flex", alignItems: "center",
          border: `1px solid ${focused ? "rgba(110,231,183,0.5)" : (t?.inputBorder || "#e2e8f0")}`,
          borderRadius: 10, background: t?.inputBg || "#f8fafc",
          boxShadow: focused ? (dark ? "0 0 0 3px rgba(16,185,129,0.1)" : "0 0 0 3px rgba(16,185,129,0.08)") : "none",
          height: 38, padding: "0 12px", gap: 8,
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}>
          <svg width={14} height={14} fill="none" viewBox="0 0 24 24" stroke={t?.textMuted || "#94a3b8"} strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search} onChange={e => onSearch(e.target.value)}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            placeholder="Search members…"
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: t?.text || "#0f172a", fontSize: 13, fontFamily: "inherit" }}
          />
        </div>

        {/* Role filter select */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <select value={roleFilter} onChange={e => onRoleFilter(e.target.value)}
            style={{
              padding: "8px 28px 8px 10px", borderRadius: 10,
              border: `1px solid ${t?.inputBorder || "#e2e8f0"}`,
              background: t?.inputBg || "#f8fafc", color: t?.text || "#0f172a",
              fontSize: 12, cursor: "pointer", outline: "none", fontFamily: "inherit", appearance: "none", height: 38,
            }}>
            <option value="all">All roles</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
          </select>
          <svg width={12} height={12} fill="none" viewBox="0 0 24 24" stroke={t?.textMuted || "#94a3b8"} strokeWidth={2}
            style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Sort */}
        {!isMobile && (
          <div style={{ position: "relative", flexShrink: 0 }}>
            <select value={sort} onChange={e => onSort(e.target.value)}
              style={{
                padding: "8px 28px 8px 10px", borderRadius: 10,
                border: `1px solid ${t?.inputBorder || "#e2e8f0"}`,
                background: t?.inputBg || "#f8fafc", color: t?.text || "#0f172a",
                fontSize: 12, cursor: "pointer", outline: "none", fontFamily: "inherit", appearance: "none", height: 38,
              }}>
              <option value="name">Name</option>
              <option value="role">Role</option>
              <option value="joined">Joined date</option>
              <option value="active">Last active</option>
            </select>
            <svg width={12} height={12} fill="none" viewBox="0 0 24 24" stroke={t?.textMuted || "#94a3b8"} strokeWidth={2}
              style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}

        {/* Invite button */}
        <button onClick={onInvite} style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: isMobile ? "8px 12px" : "8px 14px", borderRadius: 10,
          border: "none", background: "#065f46", color: "#fff",
          fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          boxShadow: "0 0 16px rgba(16,185,129,0.25)", whiteSpace: "nowrap", height: 38,
          flexShrink: 0,
        }}
          onMouseEnter={e => e.currentTarget.style.background = "#047857"}
          onMouseLeave={e => e.currentTarget.style.background = "#065f46"}
        >
          <svg width={13} height={13} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {isMobile ? "Invite" : "Invite member"}
        </button>
      </div>

      {/* Status filters */}
      <div style={{ overflowX: isMobile ? "auto" : "visible", WebkitOverflowScrolling: "touch" }}>
        <div style={{
          display: "flex", gap: 2,
          background: dark ? "rgba(255,255,255,0.04)" : "#f1f5f9",
          borderRadius: 10, padding: 3,
          border: `1px solid ${t?.border || "#e2e8f0"}`,
          width: isMobile ? "max-content" : "auto",
          minWidth: isMobile ? "100%" : undefined,
        }}>
          {filters.map(f => (
            <button key={f} onClick={() => onFilter(f)} style={{
              padding: isMobile ? "6px 14px" : "5px 12px", borderRadius: 8,
              border: filter === f ? `1px solid ${t?.border || "#e2e8f0"}` : "none",
              background: filter === f ? (dark ? "rgba(255,255,255,0.07)" : "#fff") : "transparent",
              color: filter === f ? (t?.text || "#0f172a") : (t?.textSub || "#64748b"),
              fontWeight: filter === f ? 600 : 400,
              fontSize: isMobile ? 13 : 12, cursor: "pointer", whiteSpace: "nowrap",
              transition: "all 0.15s", fontFamily: "inherit",
              flex: isMobile ? 1 : undefined,
            }}>
              {filterLabels[f]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Desktop Table Row ────────────────────────────────────────────────────────
function TeamMemberRow({ member, isSelected, onClick, onAction, t }) {
  const dark = isDark(t);
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const cellStyle = {
    padding: "12px 14px",
    borderBottom: `1px solid ${t?.borderSubtle || "#f1f5f9"}`,
    verticalAlign: "middle",
  };

  const actions = [
    { label: "View profile", icon: "👤" },
    { label: "Edit role", icon: "✏️" },
    { label: "Deactivate", icon: "⏸" },
    { label: "Remove member", icon: "🗑", danger: true },
  ];

  return (
    <tr
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); }}
      style={{
        background: isSelected
          ? (dark ? "rgba(16,185,129,0.08)" : "rgba(16,185,129,0.05)")
          : hovered ? (dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)") : "transparent",
        cursor: "pointer", transition: "background 0.15s",
      }}
    >
      <td style={cellStyle}>
        <Avatar member={member} size={32} ring={isSelected} />
      </td>
      <td style={cellStyle}>
        <div style={{ fontWeight: 600, fontSize: 13, color: t?.text || "#0f172a" }}>{member.name}</div>
        <div style={{ fontSize: 11, color: t?.textSub || "#64748b", marginTop: 1 }}>{member.email}</div>
      </td>
      <td style={cellStyle}><RoleBadge role={member.role} t={t} /></td>
      <td style={cellStyle}><StatusBadge status={member.status} t={t} /></td>
      <td style={{ ...cellStyle, fontSize: 12, color: t?.textSub || "#64748b" }}>{member.lastActive}</td>
      <td style={{ ...cellStyle, fontSize: 12, color: t?.textSub || "#64748b" }}>{member.joinedDate}</td>
      <td style={{ ...cellStyle, textAlign: "center", position: "relative" }}
        onClick={e => e.stopPropagation()}>
        <button
          onClick={e => { e.stopPropagation(); setMenuOpen(v => !v); }}
          style={{
            padding: "4px 6px", borderRadius: 6, border: "none",
            background: "transparent", cursor: "pointer",
            color: t?.textMuted || "#94a3b8", fontSize: 16,
            display: "flex", alignItems: "center",
          }}
          onMouseEnter={e => e.currentTarget.style.background = dark ? "rgba(255,255,255,0.06)" : "#f1f5f9"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          ···
        </button>
        {menuOpen && (
          <ActionMenu actions={actions} onClose={() => setMenuOpen(false)} onAction={onAction} t={t} />
        )}
      </td>
    </tr>
  );
}

// ─── Action Menu ──────────────────────────────────────────────────────────────
function ActionMenu({ actions, onClose, onAction, t }) {
  const dark = isDark(t);
  useEffect(() => {
    const handler = () => onClose();
    setTimeout(() => document.addEventListener("click", handler), 0);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <div style={{
      position: "absolute", right: 8, top: "100%", zIndex: 50,
      background: t?.surface || "#fff",
      border: `1px solid ${t?.border || "#e2e8f0"}`,
      borderRadius: 12, boxShadow: dark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 24px rgba(0,0,0,0.12)",
      minWidth: 160, overflow: "hidden",
      padding: "4px",
    }} onClick={e => e.stopPropagation()}>
      {actions.map((a, i) => (
        <button key={i} onClick={() => { onAction?.(a.label); onClose(); }}
          style={{
            width: "100%", padding: "8px 12px", borderRadius: 8,
            border: "none", background: "transparent", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8,
            fontSize: 12, fontWeight: 500,
            color: a.danger ? "#ef4444" : (t?.text || "#0f172a"),
            fontFamily: "inherit", textAlign: "left",
            transition: "background 0.12s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = a.danger ? "rgba(239,68,68,0.08)" : (dark ? "rgba(255,255,255,0.05)" : "#f8fafc")}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <span style={{ fontSize: 13 }}>{a.icon}</span>
          {a.label}
        </button>
      ))}
    </div>
  );
}

// ─── Mobile Member Card ───────────────────────────────────────────────────────
function MemberCard({ member, isSelected, onClick, t }) {
  const dark = isDark(t);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "14px 16px",
        borderBottom: `1px solid ${t?.borderSubtle || "#f1f5f9"}`,
        cursor: "pointer",
        background: isSelected
          ? (dark ? "rgba(16,185,129,0.08)" : "rgba(16,185,129,0.05)")
          : hovered ? (dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)") : "transparent",
        transition: "background 0.15s",
        borderLeft: isSelected ? "3px solid #10b981" : "3px solid transparent",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
        <Avatar member={member} size={40} ring={isSelected} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: t?.text || "#0f172a" }}>{member.name}</span>
            <StatusBadge status={member.status} t={t} />
          </div>
          <div style={{ fontSize: 12, color: t?.textSub || "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{member.email}</div>
        </div>
        <button onClick={e => e.stopPropagation()} style={{
          width: 30, height: 30, borderRadius: 8, border: "none",
          background: "transparent", cursor: "pointer",
          color: t?.textMuted || "#94a3b8", fontSize: 18,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>···</button>
      </div>
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
        <RoleBadge role={member.role} t={t} />
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 500,
          color: t?.textSub || "#64748b",
          background: dark ? "rgba(255,255,255,0.05)" : "#f1f5f9",
          padding: "3px 8px", borderRadius: 6, border: `1px solid ${t?.border || "#e2e8f0"}`,
        }}>
          <svg width={10} height={10} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {member.lastActive}
        </span>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 500,
          color: t?.textSub || "#64748b",
          background: dark ? "rgba(255,255,255,0.05)" : "#f1f5f9",
          padding: "3px 8px", borderRadius: 6, border: `1px solid ${t?.border || "#e2e8f0"}`,
        }}>
          Joined {member.joinedDate}
        </span>
      </div>
    </div>
  );
}

// ─── Desktop Team Table ───────────────────────────────────────────────────────
function TeamMembersTable({ members, selectedId, onSelect, t }) {
  const dark = isDark(t);
  if (members.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "56px 16px", color: t?.textMuted || "#94a3b8" }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: dark ? "rgba(16,185,129,0.1)" : "rgba(16,185,129,0.08)",
          border: `1px solid ${dark ? "rgba(110,231,183,0.2)" : "rgba(16,185,129,0.2)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 12px",
        }}>
          <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke={dark ? "#6ee7b7" : "#10b981"} strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div style={{ fontWeight: 600, fontSize: 14, color: t?.text || "#0f172a", marginBottom: 4 }}>No members found</div>
        <div style={{ fontSize: 12 }}>Try adjusting your search or filters</div>
      </div>
    );
  }

  const headers = ["", "Member", "Role", "Status", "Last active", "Joined", ""];
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
        <colgroup>
          <col style={{ width: 48 }} /><col style={{ width: 210 }} /><col style={{ width: 110 }} />
          <col style={{ width: 100 }} /><col style={{ width: 120 }} /><col style={{ width: 130 }} />
          <col style={{ width: 48 }} />
        </colgroup>
        <thead>
          <tr style={{ background: dark ? "rgba(255,255,255,0.02)" : "#f8fafc" }}>
            {headers.map((h, i) => (
              <th key={i} style={{
                textAlign: i === 6 ? "center" : "left",
                padding: "10px 14px",
                fontSize: 10, fontWeight: 700, color: t?.textMuted || "#94a3b8",
                letterSpacing: "0.07em", textTransform: "uppercase",
                borderBottom: `1px solid ${t?.border || "#e2e8f0"}`,
                whiteSpace: "nowrap",
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {members.map(m => (
            <TeamMemberRow key={m.id} member={m} isSelected={m.id === selectedId} onClick={() => onSelect(m)} t={t} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Pending Invitations ──────────────────────────────────────────────────────
function PendingInvitations({ invitations, onResend, onCancel, t }) {
  const dark = isDark(t);
  if (invitations.length === 0) return null;

  return (
    <div style={{
      background: t?.surface || "#fff",
      border: `1px solid ${t?.border || "#e2e8f0"}`,
      borderRadius: 16, overflow: "hidden",
      backdropFilter: dark ? "blur(14px)" : "none",
      WebkitBackdropFilter: dark ? "blur(14px)" : "none",
      marginBottom: 16,
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 16px", borderBottom: `1px solid ${t?.border || "#e2e8f0"}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: t?.text || "#0f172a" }}>Pending invitations</span>
          <span style={{
            fontSize: 10, fontWeight: 700,
            background: "rgba(245,158,11,0.12)", color: "#f59e0b",
            padding: "2px 8px", borderRadius: 99,
            border: "1px solid rgba(245,158,11,0.2)",
          }}>
            {invitations.length}
          </span>
        </div>
      </div>
      <div>
        {invitations.map((inv, i) => (
          <div key={inv.id} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 16px",
            borderBottom: i < invitations.length - 1 ? `1px solid ${t?.borderSubtle || "#f1f5f9"}` : "none",
            gap: 12, flexWrap: "wrap",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: dark ? "rgba(245,158,11,0.15)" : "#fef3c7",
                border: "1px solid rgba(245,158,11,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, flexShrink: 0,
              }}>✉</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: t?.text || "#0f172a" }}>{inv.email}</div>
                <div style={{ fontSize: 11, color: t?.textSub || "#64748b", marginTop: 1 }}>
                  Sent {inv.sentDate} · Expires in {inv.expiresIn}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <RoleBadge role={inv.role} t={t} />
              <button onClick={() => onResend?.(inv)} style={{
                padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600,
                border: `1px solid ${t?.border || "#e2e8f0"}`,
                background: "transparent", color: t?.textSub || "#64748b",
                cursor: "pointer", fontFamily: "inherit",
                transition: "background 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = dark ? "rgba(255,255,255,0.05)" : "#f1f5f9"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >Resend</button>
              <button onClick={() => onCancel?.(inv)} style={{
                padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600,
                border: "1px solid rgba(239,68,68,0.3)",
                background: "transparent", color: "#ef4444",
                cursor: "pointer", fontFamily: "inherit",
                transition: "background 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.06)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >Cancel</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Invite Member Modal ──────────────────────────────────────────────────────
function InviteMemberModal({ onClose, onSend, t }) {
  const dark = isDark(t);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("agent");
  const [emailFocused, setEmailFocused] = useState(false);

  const roleOptions = [
    { value: "owner", label: "Owner", desc: "Full workspace access" },
    { value: "admin", label: "Admin", desc: "Manage team & settings" },
    { value: "agent", label: "Agent", desc: "Handle conversations" },
  ];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 16,
    }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: "absolute", inset: 0,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
      }} />

      {/* Modal */}
      <div style={{
        position: "relative", zIndex: 1,
        background: t?.surface || "#fff",
        border: `1px solid ${t?.border || "#e2e8f0"}`,
        borderRadius: 20, width: "100%", maxWidth: 440,
        boxShadow: dark ? "0 24px 64px rgba(0,0,0,0.6)" : "0 24px 48px rgba(0,0,0,0.15)",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 24px 16px",
          borderBottom: `1px solid ${t?.border || "#e2e8f0"}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: t?.text || "#0f172a" }}>Invite team member</div>
            <div style={{ fontSize: 12, color: t?.textSub || "#64748b", marginTop: 2 }}>They'll receive an email with a link to join</div>
          </div>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: 8,
            border: `1px solid ${t?.border || "#e2e8f0"}`,
            background: "transparent", cursor: "pointer",
            color: t?.textSub || "#64748b",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width={14} height={14} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px 24px" }}>
          {/* Email */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: t?.textMuted || "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>
              Email address
            </label>
            <div style={{
              display: "flex", alignItems: "center",
              border: `1px solid ${emailFocused ? "rgba(110,231,183,0.5)" : (t?.inputBorder || "#e2e8f0")}`,
              borderRadius: 10, background: t?.inputBg || "#f8fafc",
              height: 40, padding: "0 12px", gap: 8,
              boxShadow: emailFocused ? "0 0 0 3px rgba(16,185,129,0.1)" : "none",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}>
              <svg width={14} height={14} fill="none" viewBox="0 0 24 24" stroke={t?.textMuted || "#94a3b8"} strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input
                value={email} onChange={e => setEmail(e.target.value)}
                onFocus={() => setEmailFocused(true)} onBlur={() => setEmailFocused(false)}
                placeholder="colleague@company.com" type="email"
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: t?.text || "#0f172a", fontSize: 13, fontFamily: "inherit" }}
              />
            </div>
          </div>

          {/* Role */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: t?.textMuted || "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 8 }}>
              Role
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {roleOptions.map(opt => {
                const selected = role === opt.value;
                const cfg = ROLE_CONFIG[opt.value];
                const s = dark ? cfg.dark : cfg.light;
                return (
                  <button key={opt.value} onClick={() => setRole(opt.value)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "12px 14px", borderRadius: 10, cursor: "pointer",
                      border: selected ? `1.5px solid ${s.border}` : `1px solid ${t?.border || "#e2e8f0"}`,
                      background: selected ? s.bg : "transparent",
                      fontFamily: "inherit", textAlign: "left",
                      transition: "all 0.15s",
                    }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                      background: selected ? s.bg : (dark ? "rgba(255,255,255,0.04)" : "#f8fafc"),
                      border: `1px solid ${selected ? s.border : (t?.border || "#e2e8f0")}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, color: selected ? s.text : (t?.textMuted || "#94a3b8"),
                    }}>
                      {cfg.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: selected ? s.text : (t?.text || "#0f172a") }}>{opt.label}</div>
                      <div style={{ fontSize: 11, color: t?.textSub || "#64748b", marginTop: 1 }}>{opt.desc}</div>
                    </div>
                    {selected && (
                      <div style={{
                        width: 18, height: 18, borderRadius: "50%",
                        background: "#065f46", display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        <svg width={10} height={10} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Permissions preview */}
          <div style={{
            background: dark ? "rgba(16,185,129,0.06)" : "rgba(16,185,129,0.04)",
            border: `1px solid ${dark ? "rgba(110,231,183,0.15)" : "rgba(16,185,129,0.15)"}`,
            borderRadius: 10, padding: "12px 14px", marginBottom: 20,
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: t?.textMuted || "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
              {ROLE_CONFIG[role].label} permissions
            </div>
            {ROLE_CONFIG[role].permissions.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: i < ROLE_CONFIG[role].permissions.length - 1 ? 5 : 0 }}>
                <svg width={12} height={12} fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span style={{ fontSize: 12, color: t?.text || "#0f172a" }}>{p}</span>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onClose} style={{
              flex: 1, padding: "10px", borderRadius: 10,
              border: `1px solid ${t?.border || "#e2e8f0"}`,
              background: "transparent", color: t?.textSub || "#64748b",
              fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>Cancel</button>
            <button onClick={() => { if (email) { onSend({ email, role }); onClose(); } }}
              style={{
                flex: 2, padding: "10px", borderRadius: 10,
                border: "none", background: "#065f46", color: "#fff",
                fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                boxShadow: "0 0 16px rgba(16,185,129,0.3)",
                opacity: email ? 1 : 0.5,
              }}>
              Send invitation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Activity Timeline ────────────────────────────────────────────────────────
function ActivityTimeline({ activities, t }) {
  const dark = isDark(t);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, position: "relative" }}>
      {activities.map((a, i) => (
        <div key={i} style={{ display: "flex", gap: 12, paddingBottom: i < activities.length - 1 ? 14 : 0, position: "relative" }}>
          {/* Line */}
          {i < activities.length - 1 && (
            <div style={{
              position: "absolute", left: 6, top: 14, bottom: 0, width: 1,
              background: dark ? "rgba(255,255,255,0.08)" : "#e2e8f0",
            }} />
          )}
          <div style={{
            width: 13, height: 13, borderRadius: "50%",
            background: dark ? "rgba(16,185,129,0.2)" : "rgba(16,185,129,0.15)",
            border: `2px solid #10b981`,
            flexShrink: 0, marginTop: 1,
          }} />
          <div>
            <div style={{ fontSize: 12, color: t?.text || "#0f172a", lineHeight: 1.4 }}>{a.action}</div>
            <div style={{ fontSize: 10, color: t?.textMuted || "#94a3b8", marginTop: 2 }}>{a.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Member Profile Drawer ────────────────────────────────────────────────────
function MemberProfileDrawer({ member, onClose, t, isMobile }) {
  const dark = isDark(t);

  useEffect(() => {
    if (isMobile && member) { document.body.style.overflow = "hidden"; }
    else { document.body.style.overflow = ""; }
    return () => { document.body.style.overflow = ""; };
  }, [isMobile, member]);

  if (!member) return null;

  const sectionLabel = (text) => (
    <div style={{
      fontSize: 10, fontWeight: 700, color: t?.textMuted || "#94a3b8",
      letterSpacing: "0.07em", textTransform: "uppercase",
      marginBottom: 10, marginTop: 20,
    }}>{text}</div>
  );

  const infoItems = [
    { label: "Role", value: <RoleBadge role={member.role} t={t} /> },
    { label: "Status", value: <StatusBadge status={member.status} t={t} /> },
    { label: "Phone", value: member.phone },
    { label: "Joined", value: member.joinedDate },
    { label: "Last active", value: member.lastActive },
    { label: "Resolved", value: `${member.resolvedConvos} convos` },
  ];

  const body = (
    <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
      {/* Avatar + name */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <Avatar member={member} size={isMobile ? 44 : 44} ring />
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: t?.text || "#0f172a" }}>{member.name}</div>
          <div style={{ fontSize: 11, color: t?.textSub || "#64748b", marginTop: 2 }}>{member.email}</div>
        </div>
      </div>
      <div style={{ marginBottom: 4 }}><RoleBadge role={member.role} t={t} /></div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 16, marginBottom: 4 }}>
        <div style={{
          background: dark ? "rgba(16,185,129,0.07)" : "rgba(16,185,129,0.05)",
          border: `1px solid ${dark ? "rgba(110,231,183,0.15)" : "rgba(16,185,129,0.15)"}`,
          borderRadius: 10, padding: "10px 12px", textAlign: "center",
        }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: t?.text || "#0f172a", letterSpacing: "-0.02em" }}>{member.resolvedConvos}</div>
          <div style={{ fontSize: 10, color: t?.textSub || "#64748b", fontWeight: 500, marginTop: 2 }}>Resolved</div>
        </div>
        <div style={{
          background: dark ? "rgba(59,130,246,0.07)" : "rgba(59,130,246,0.05)",
          border: `1px solid ${dark ? "rgba(96,165,250,0.15)" : "rgba(59,130,246,0.15)"}`,
          borderRadius: 10, padding: "10px 12px", textAlign: "center",
        }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: t?.text || "#0f172a", letterSpacing: "-0.02em" }}>{member.assignedConvos}</div>
          <div style={{ fontSize: 10, color: t?.textSub || "#64748b", fontWeight: 500, marginTop: 2 }}>Assigned</div>
        </div>
      </div>

      {sectionLabel("Personal & work info")}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        {infoItems.map((item, i) => (
          <div key={i} style={{
            background: dark ? "rgba(255,255,255,0.03)" : "#f8fafc",
            border: `1px solid ${t?.border || "#e2e8f0"}`,
            borderRadius: 10, padding: "10px 12px",
          }}>
            <div style={{ fontSize: 10, color: t?.textMuted || "#94a3b8", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{item.label}</div>
            {typeof item.value === "string"
              ? <div style={{ fontSize: 12, fontWeight: 600, color: t?.text || "#0f172a" }}>{item.value}</div>
              : item.value}
          </div>
        ))}
      </div>

      {sectionLabel("Permissions")}
      <div style={{
        background: dark ? "rgba(255,255,255,0.02)" : "#f8fafc",
        border: `1px solid ${t?.border || "#e2e8f0"}`,
        borderRadius: 10, padding: "12px 14px",
      }}>
        {ROLE_CONFIG[member.role].permissions.map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: i < ROLE_CONFIG[member.role].permissions.length - 1 ? 6 : 0 }}>
            <svg width={12} height={12} fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span style={{ fontSize: 12, color: t?.text || "#0f172a" }}>{p}</span>
          </div>
        ))}
      </div>

      {sectionLabel("Recent activity")}
      <ActivityTimeline activities={member.activity} t={t} />

      {/* Actions */}
      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 8 }}>
        <button style={{
          width: "100%", padding: "10px", borderRadius: 10,
          border: `1px solid ${t?.border || "#e2e8f0"}`,
          background: "transparent", color: t?.textSub || "#64748b",
          fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
        }}>Edit role</button>
        <button style={{
          width: "100%", padding: "10px", borderRadius: 10,
          border: "1px solid rgba(239,68,68,0.3)",
          background: "transparent", color: "#ef4444",
          fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
        }}>Remove member</button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", zIndex: 100 }} />
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          background: t?.surface || "#fff",
          borderRadius: "20px 20px 0 0",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.2)",
          zIndex: 101, display: "flex", flexDirection: "column", maxHeight: "88vh",
        }}>
          <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: dark ? "rgba(255,255,255,0.15)" : "#e2e8f0" }} />
          </div>
          <div style={{ padding: "4px 16px 10px", borderBottom: `1px solid ${t?.border || "#e2e8f0"}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: t?.text || "#0f172a" }}>Member profile</span>
            <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 8, border: `1px solid ${t?.border || "#e2e8f0"}`, background: "transparent", cursor: "pointer", color: t?.textSub || "#64748b", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={14} height={14} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          {body}
        </div>
      </>
    );
  }

  return (
    <div style={{
      width: 320, flexShrink: 0,
      borderLeft: `1px solid ${t?.border || "#e2e8f0"}`,
      background: t?.surface || "#fff",
      display: "flex", flexDirection: "column", overflow: "hidden",
      backdropFilter: dark ? "blur(14px)" : "none",
      WebkitBackdropFilter: dark ? "blur(14px)" : "none",
    }}>
      <div style={{ padding: "14px 16px", borderBottom: `1px solid ${t?.border || "#e2e8f0"}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: t?.text || "#0f172a" }}>Member profile</span>
        <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 8, border: `1px solid ${t?.border || "#e2e8f0"}`, background: "transparent", cursor: "pointer", color: t?.textSub || "#64748b", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={14} height={14} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      {body}
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ total, t, isMobile }) {
  return (
    <div style={{
      display: "flex", alignItems: "center",
      justifyContent: isMobile ? "center" : "space-between",
      padding: "12px 16px", borderTop: `1px solid ${t?.border || "#e2e8f0"}`,
      gap: 12,
    }}>
      {!isMobile && (
        <span style={{ fontSize: 12, color: t?.textSub || "#64748b" }}>Showing 1–{total} of {total} members</span>
      )}
      <div style={{ display: "flex", gap: 4 }}>
        {["‹", "1", "2", "›"].map((p, i) => (
          <button key={i} style={{
            padding: isMobile ? "6px 12px" : "4px 9px", borderRadius: 7,
            border: `1px solid ${p === "1" ? "#10b981" : (t?.border || "#e2e8f0")}`,
            background: p === "1" ? "#065f46" : "transparent",
            color: p === "1" ? "#fff" : (t?.textSub || "#64748b"),
            fontSize: 13, cursor: "pointer", fontFamily: "inherit",
          }}>{p}</button>
        ))}
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function TeamPage({ t = {} }) {
  const dark = isDark(t);
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sort, setSort] = useState("name");
  const [selectedMember, setSelectedMember] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [membersData, setMembersData] = useState(MOCK_MEMBERS);
  const [invitations, setInvitations] = useState(MOCK_INVITATIONS);

  const filtered = useMemo(() => {
    let result = membersData.filter(m => {
      const q = search.toLowerCase();
      const matchSearch = !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
      const matchStatus = filter === "all" || m.status === filter;
      const matchRole = roleFilter === "all" || m.role === roleFilter;
      return matchSearch && matchStatus && matchRole;
    });
    if (sort === "name") result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "role") result = [...result].sort((a, b) => a.role.localeCompare(b.role));
    return result;
  }, [membersData, search, filter, roleFilter, sort]);

  const handleSelect = (m) => setSelectedMember(prev => prev?.id === m.id ? null : m);
  const handleSendInvite = ({ email, role }) => {
    const newInv = { id: Date.now(), email, role, sentDate: "Just now", expiresIn: "7 days" };
    setInvitations(prev => [newInv, ...prev]);
  };
  const handleCancelInvite = (inv) => setInvitations(prev => prev.filter(i => i.id !== inv.id));

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: t?.bg || "#f8fafc", position: "relative" }}>

      {dark && (
        <>
          <div style={{ position: "absolute", top: "-10%", right: "-5%", width: "40%", height: "40%", borderRadius: "50%", background: "rgba(16,185,129,0.04)", filter: "blur(140px)", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: "35%", height: "35%", borderRadius: "50%", background: "rgba(6,95,70,0.05)", filter: "blur(120px)", pointerEvents: "none", zIndex: 0 }} />
        </>
      )}

      {/* Page header */}
      <div style={{
        padding: isMobile ? "14px 16px" : "16px 20px",
        borderBottom: `1px solid ${t?.border || "#e2e8f0"}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: t?.surface || "#fff",
        backdropFilter: dark ? "blur(14px)" : "none",
        WebkitBackdropFilter: dark ? "blur(14px)" : "none",
        flexShrink: 0, zIndex: 1, position: "relative", gap: 12,
      }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ fontSize: isMobile ? 15 : 16, fontWeight: 700, color: t?.text || "#0f172a", margin: 0, letterSpacing: "-0.01em" }}>Team</h1>
          {!isMobile && (
            <p style={{ fontSize: 12, color: t?.textSub || "#64748b", margin: "2px 0 0" }}>Manage agents, admins, and workspace permissions</p>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          {!isMobile && (
            <button style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 14px", borderRadius: 10,
              border: `1px solid ${t?.border || "#e2e8f0"}`,
              background: "transparent", color: t?.textSub || "#64748b",
              fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
            }}
              onMouseEnter={e => e.currentTarget.style.background = dark ? "rgba(255,255,255,0.05)" : "#f1f5f9"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <svg width={13} height={13} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </button>
          )}
          <button onClick={() => setShowInviteModal(true)} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: isMobile ? "8px 12px" : "8px 14px", borderRadius: 10,
            border: "none", background: "#065f46", color: "#fff",
            fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 0 16px rgba(16,185,129,0.25)", whiteSpace: "nowrap",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#047857"}
            onMouseLeave={e => e.currentTarget.style.background = "#065f46"}
          >
            <svg width={13} height={13} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {isMobile ? "Invite" : "Invite member"}
          </button>
        </div>
      </div>

      {/* Main content + drawer */}
      <div style={{ flex: 1, display: "flex", minHeight: 0, overflow: "hidden", position: "relative", zIndex: 1 }}>

        {/* Scrollable area */}
        <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "14px 12px" : "20px" }}>
          <TeamStatsCards members={membersData} invitations={invitations} t={t} isMobile={isMobile} />

          <TeamToolbar
            search={search} onSearch={setSearch}
            filter={filter} onFilter={setFilter}
            roleFilter={roleFilter} onRoleFilter={setRoleFilter}
            sort={sort} onSort={setSort}
            onInvite={() => setShowInviteModal(true)}
            t={t} isMobile={isMobile}
          />

          {/* Pending invitations */}
          <PendingInvitations invitations={invitations} onResend={() => {}} onCancel={handleCancelInvite} t={t} />

          {/* Members table / card list */}
          <div style={{
            background: t?.surface || "#fff",
            border: `1px solid ${t?.border || "#e2e8f0"}`,
            borderRadius: 16, overflow: "hidden",
            backdropFilter: dark ? "blur(14px)" : "none",
            WebkitBackdropFilter: dark ? "blur(14px)" : "none",
          }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 16px", borderBottom: `1px solid ${t?.border || "#e2e8f0"}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: t?.text || "#0f172a" }}>Team members</span>
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  background: dark ? "rgba(16,185,129,0.15)" : "rgba(16,185,129,0.1)",
                  color: dark ? "#6ee7b7" : "#065f46",
                  padding: "2px 8px", borderRadius: 99,
                  border: `1px solid ${dark ? "rgba(110,231,183,0.22)" : "rgba(16,185,129,0.2)"}`,
                }}>
                  {filtered.length} members
                </span>
              </div>
            </div>

            {isMobile ? (
              filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 16px", color: t?.textMuted || "#94a3b8" }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: t?.text || "#0f172a", marginBottom: 4 }}>No members found</div>
                  <div style={{ fontSize: 12 }}>Try adjusting your search or filters</div>
                </div>
              ) : filtered.map(m => (
                <MemberCard key={m.id} member={m} isSelected={m.id === selectedMember?.id} onClick={() => handleSelect(m)} t={t} />
              ))
            ) : (
              <TeamMembersTable members={filtered} selectedId={selectedMember?.id} onSelect={handleSelect} t={t} />
            )}

            <Pagination total={filtered.length} t={t} isMobile={isMobile} />
          </div>
        </div>

        {/* Desktop drawer */}
        {!isMobile && selectedMember && (
          <MemberProfileDrawer member={selectedMember} onClose={() => setSelectedMember(null)} t={t} isMobile={false} />
        )}
      </div>

      {/* Mobile bottom sheet */}
      {isMobile && selectedMember && (
        <MemberProfileDrawer member={selectedMember} onClose={() => setSelectedMember(null)} t={t} isMobile={true} />
      )}

      {/* Invite modal */}
      {showInviteModal && (
        <InviteMemberModal onClose={() => setShowInviteModal(false)} onSend={handleSendInvite} t={t} />
      )}
    </div>
  );
}