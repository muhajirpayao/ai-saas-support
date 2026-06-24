import { useState, useMemo } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_CUSTOMERS = [
  {
    id: 1, initials: "MR", avGradient: "linear-gradient(135deg,#a78bfa,#7c3aed)",
    name: "Maya Rodriguez", email: "m.rodriguez@acme.com", phone: "+1 415 555 0172",
    company: "Acme Corp", convos: 34, status: "active", lastActive: "2 min ago",
    agent: "Sarah M.", agentInitials: "SM", agentGradient: "linear-gradient(135deg,#34d399,#0d9488)",
    tags: ["VIP", "Returning"], firstContact: "Jan 12, 2024",
    notes: ["High-priority client. Prefers email communication."],
    conversations: [
      { subject: "Billing issue with Q2 invoice", status: "open", time: "Today 9:41 AM", preview: "Hi, I noticed a discrepancy in my latest invoice..." },
      { subject: "Feature request: bulk export", status: "resolved", time: "Jun 20", preview: "Would love to see a CSV export option for reporting..." },
      { subject: "Onboarding call follow-up", status: "resolved", time: "Jun 14", preview: "Thanks for the call today, just wanted to confirm..." },
    ],
  },
  {
    id: 2, initials: "JK", avGradient: "linear-gradient(135deg,#60a5fa,#6366f1)",
    name: "James Kim", email: "james.kim@vercel.dev", phone: "+1 628 555 0341",
    company: "Vercel", convos: 18, status: "active", lastActive: "1 hr ago",
    agent: "Alex T.", agentInitials: "AT", agentGradient: "linear-gradient(135deg,#f472b6,#f43f5e)",
    tags: ["Lead"], firstContact: "Mar 4, 2024", notes: [],
    conversations: [
      { subject: "SSO integration setup", status: "open", time: "Today 8:15 AM", preview: "We're trying to set up SSO with Okta..." },
      { subject: "Pricing plan upgrade", status: "resolved", time: "Jun 18", preview: "We'd like to move to the enterprise tier..." },
    ],
  },
  {
    id: 3, initials: "LP", avGradient: "linear-gradient(135deg,#34d399,#0d9488)",
    name: "Lena Park", email: "lena@stripe.com", phone: "+1 310 555 0879",
    company: "Stripe", convos: 7, status: "new", lastActive: "3 hr ago",
    agent: "", agentInitials: "", agentGradient: "",
    tags: ["Lead", "Needs Follow-up"], firstContact: "Jun 22, 2024",
    notes: ["Reached out via website chat. Needs follow-up by EOD."],
    conversations: [
      { subject: "Initial product inquiry", status: "open", time: "Jun 22", preview: "Hello, I came across SupportAI and would like to..." },
    ],
  },
  {
    id: 4, initials: "DW", avGradient: "linear-gradient(135deg,#fbbf24,#f97316)",
    name: "David Wu", email: "d.wu@notion.so", phone: "+1 212 555 0013",
    company: "Notion", convos: 52, status: "active", lastActive: "Yesterday",
    agent: "Sarah M.", agentInitials: "SM", agentGradient: "linear-gradient(135deg,#34d399,#0d9488)",
    tags: ["VIP", "Returning"], firstContact: "Sep 3, 2023",
    notes: ["Long-term customer. Enrolled in beta program."],
    conversations: [
      { subject: "API rate limit increase", status: "resolved", time: "Jun 21", preview: "We need our rate limit bumped to 5000 req/min..." },
      { subject: "Dashboard bug report", status: "resolved", time: "Jun 10", preview: "Found a rendering issue in Safari 17..." },
    ],
  },
  {
    id: 5, initials: "AJ", avGradient: "linear-gradient(135deg,#f472b6,#f43f5e)",
    name: "Amara Johnson", email: "amara@figma.com", phone: "+1 510 555 0267",
    company: "Figma", convos: 11, status: "active", lastActive: "2 days ago",
    agent: "Priya S.", agentInitials: "PS", agentGradient: "linear-gradient(135deg,#60a5fa,#6366f1)",
    tags: ["Returning"], firstContact: "Nov 18, 2023", notes: [],
    conversations: [
      { subject: "Plugin marketplace approval", status: "pending", time: "Jun 19", preview: "We submitted our plugin 3 days ago and haven't..." },
      { subject: "Account permissions question", status: "resolved", time: "Jun 5", preview: "Can admins restrict which plugins team members..." },
    ],
  },
  {
    id: 6, initials: "TC", avGradient: "linear-gradient(135deg,#6ee7b7,#10b981)",
    name: "Tom Chen", email: "tchen@linear.app", phone: "+1 669 555 0504",
    company: "Linear", convos: 3, status: "new", lastActive: "3 days ago",
    agent: "", agentInitials: "", agentGradient: "",
    tags: ["Lead"], firstContact: "Jun 19, 2024", notes: [],
    conversations: [
      { subject: "Trial extension request", status: "open", time: "Jun 19", preview: "We're still evaluating during our 14-day trial..." },
    ],
  },
  {
    id: 7, initials: "SR", avGradient: "linear-gradient(135deg,#a78bfa,#7c3aed)",
    name: "Sofia Reyes", email: "s.reyes@shopify.com", phone: "+1 647 555 0881",
    company: "Shopify", convos: 29, status: "active", lastActive: "4 days ago",
    agent: "Alex T.", agentInitials: "AT", agentGradient: "linear-gradient(135deg,#f472b6,#f43f5e)",
    tags: ["VIP"], firstContact: "Feb 7, 2024",
    notes: ["VIP account. Has a dedicated Slack channel."],
    conversations: [
      { subject: "White-label domain setup", status: "resolved", time: "Jun 17", preview: "We'd like to point support.shopify.com to..." },
      { subject: "Webhook events not firing", status: "resolved", time: "Jun 3", preview: "None of our outgoing webhooks are triggering..." },
    ],
  },
  {
    id: 8, initials: "BN", avGradient: "linear-gradient(135deg,#60a5fa,#6366f1)",
    name: "Ben Nakamura", email: "ben@linear.app", phone: "+1 408 555 0099",
    company: "Linear", convos: 1, status: "inactive", lastActive: "3 weeks ago",
    agent: "Priya S.", agentInitials: "PS", agentGradient: "linear-gradient(135deg,#60a5fa,#6366f1)",
    tags: [], firstContact: "Apr 29, 2024", notes: [],
    conversations: [
      { subject: "Cancellation feedback", status: "resolved", time: "Jun 4", preview: "We're moving to an in-house solution but wanted..." },
    ],
  },
];

// ─── Tag config ───────────────────────────────────────────────────────────────
const TAG_CONFIG = {
  VIP:              { light: { bg: "#fef3c7", text: "#92400e", border: "#fde68a" }, dark: { bg: "rgba(251,191,36,0.12)", text: "#fcd34d", border: "rgba(251,191,36,0.2)" } },
  Lead:             { light: { bg: "#ede9fe", text: "#5b21b6", border: "#ddd6fe" }, dark: { bg: "rgba(167,139,250,0.12)", text: "#c4b5fd", border: "rgba(167,139,250,0.2)" } },
  Returning:        { light: { bg: "#d1fae5", text: "#065f46", border: "#a7f3d0" }, dark: { bg: "rgba(16,185,129,0.12)", text: "#6ee7b7", border: "rgba(16,185,129,0.2)" } },
  "Needs Follow-up":{ light: { bg: "#fee2e2", text: "#991b1b", border: "#fecaca" }, dark: { bg: "rgba(239,68,68,0.12)", text: "#fca5a5", border: "rgba(239,68,68,0.2)" } },
};

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  active:   { light: { bg: "#d1fae5", text: "#065f46", dot: "#10b981" }, dark: { bg: "rgba(16,185,129,0.12)", text: "#6ee7b7", dot: "#10b981" }, label: "Active" },
  new:      { light: { bg: "#dbeafe", text: "#1e40af", dot: "#3b82f6" }, dark: { bg: "rgba(59,130,246,0.12)", text: "#93c5fd", dot: "#3b82f6" }, label: "New" },
  inactive: { light: { bg: "#f1f5f9", text: "#475569", dot: "#94a3b8" }, dark: { bg: "rgba(255,255,255,0.06)", text: "#a1a8bc", dot: "#64748b" }, label: "Inactive" },
  open:     { light: { bg: "#dbeafe", text: "#1e40af", dot: "#3b82f6" }, dark: { bg: "rgba(59,130,246,0.12)", text: "#93c5fd", dot: "#3b82f6" }, label: "Open" },
  resolved: { light: { bg: "#f1f5f9", text: "#475569", dot: "#94a3b8" }, dark: { bg: "rgba(255,255,255,0.06)", text: "#a1a8bc", dot: "#64748b" }, label: "Resolved" },
  pending:  { light: { bg: "#fef3c7", text: "#b45309", dot: "#f59e0b" }, dark: { bg: "rgba(245,158,11,0.12)", text: "#fcd34d", dot: "#f59e0b" }, label: "Pending" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function isDarkTheme(t) {
  return t?.bg === "#0a0a0a" || (typeof t?.sidebar === "string" && t.sidebar.includes("20,21,24"));
}

function StatusBadge({ status, t }) {
  const isDark = isDarkTheme(t);
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.inactive;
  const s = isDark ? cfg.dark : cfg.light;
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

function CustomerTag({ tag, t }) {
  const isDark = isDarkTheme(t);
  const cfg = TAG_CONFIG[tag];
  if (!cfg) return null;
  const s = isDark ? cfg.dark : cfg.light;
  return (
    <span style={{
      padding: "2px 8px", borderRadius: 99,
      fontSize: 10, fontWeight: 600,
      background: s.bg, color: s.text,
      border: `1px solid ${s.border}`,
      whiteSpace: "nowrap",
      letterSpacing: "0.03em",
    }}>
      {tag}
    </span>
  );
}

// ─── Stat Cards ───────────────────────────────────────────────────────────────
function StatCards({ customers, t }) {
  const isDark = isDarkTheme(t);
  const total = customers.length;
  const active = customers.filter(c => c.status === "active").length;
  const newCount = customers.filter(c => c.status === "new").length;
  const unassigned = customers.filter(c => !c.agentInitials).length;

  const stats = [
    { label: "Total customers", value: "2,841", sub: "+12% this month", accent: t?.accent || "#10b981" },
    { label: "Active", value: active, sub: `${Math.round((active / total) * 100)}% of total`, accent: t?.accent || "#10b981" },
    { label: "New this week", value: newCount, sub: "+8 vs last week", accent: t?.accent || "#10b981" },
    { label: "Unassigned", value: unassigned, sub: "Needs attention", accent: "#f59e0b" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
      {stats.map((s, i) => (
        <div
          key={i}
          style={{
            background: t?.surface || "#fff",
            border: `1px solid ${t?.border || "#e2e8f0"}`,
            borderRadius: 16, padding: 16,
            backdropFilter: isDark ? "blur(14px)" : "none",
            WebkitBackdropFilter: isDark ? "blur(14px)" : "none",
            transition: "border-color 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = isDark ? "rgba(110,231,183,0.22)" : "rgba(16,185,129,0.3)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = t?.border || "#e2e8f0"}
        >
          <div style={{ fontSize: 11, color: t?.textSub || "#64748b", fontWeight: 500, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: i === 3 ? s.accent : (t?.text || "#0f172a"), letterSpacing: "-0.02em", marginBottom: 4 }}>{s.value}</div>
          <div style={{ fontSize: 11, color: s.accent, fontWeight: 600 }}>{s.sub}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────
function CustomerToolbar({ search, onSearch, filter, onFilter, sort, onSort, t }) {
  const isDark = isDarkTheme(t);
  const [focused, setFocused] = useState(false);
  const filters = ["all", "active", "new", "vip", "unassigned"];
  const filterLabels = { all: "All", active: "Active", new: "New", vip: "VIP", unassigned: "Unassigned" };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
      {/* Search */}
      <div style={{
        position: "relative", flex: 1, minWidth: 180, maxWidth: 280,
        display: "flex", alignItems: "center",
        border: `1px solid ${focused ? "rgba(110,231,183,0.5)" : (t?.inputBorder || "#e2e8f0")}`,
        borderRadius: 10, background: t?.inputBg || "#f8fafc",
        boxShadow: focused ? (isDark ? "0 0 0 3px rgba(16,185,129,0.1)" : "0 0 0 3px rgba(16,185,129,0.08)") : "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
        height: 36, padding: "0 12px", gap: 8,
      }}>
        <svg width={14} height={14} fill="none" viewBox="0 0 24 24" stroke={t?.textMuted || "#94a3b8"} strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          value={search}
          onChange={e => onSearch(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search customers…"
          style={{
            flex: 1, background: "transparent", border: "none", outline: "none",
            color: t?.text || "#0f172a", fontSize: 13, fontFamily: "inherit",
          }}
        />
      </div>

      {/* Filter tabs */}
      <div style={{
        display: "flex", gap: 2,
        background: isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9",
        borderRadius: 10, padding: 3,
        border: `1px solid ${t?.border || "#e2e8f0"}`,
      }}>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => onFilter(f)}
            style={{
              padding: "5px 12px", borderRadius: 8,
              border: filter === f ? `1px solid ${t?.border || "#e2e8f0"}` : "none",
              background: filter === f ? (isDark ? "rgba(255,255,255,0.07)" : "#fff") : "transparent",
              color: filter === f ? (t?.text || "#0f172a") : (t?.textSub || "#64748b"),
              fontWeight: filter === f ? 600 : 400,
              fontSize: 12, cursor: "pointer", whiteSpace: "nowrap",
              transition: "all 0.15s", fontFamily: "inherit",
            }}
          >
            {filterLabels[f]}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div style={{ position: "relative" }}>
        <select
          value={sort}
          onChange={e => onSort(e.target.value)}
          style={{
            padding: "7px 28px 7px 10px", borderRadius: 10,
            border: `1px solid ${t?.inputBorder || "#e2e8f0"}`,
            background: t?.inputBg || "#f8fafc",
            color: t?.text || "#0f172a",
            fontSize: 12, cursor: "pointer", outline: "none",
            fontFamily: "inherit", appearance: "none",
          }}
        >
          <option value="name">Sort: Name</option>
          <option value="convos">Sort: Conversations</option>
          <option value="lastactive">Sort: Last active</option>
        </select>
        <svg width={12} height={12} fill="none" viewBox="0 0 24 24" stroke={t?.textMuted || "#94a3b8"} strokeWidth={2}
          style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

// ─── Customer Row ─────────────────────────────────────────────────────────────
function CustomerRow({ customer, isSelected, onClick, t }) {
  const isDark = isDarkTheme(t);
  const [hovered, setHovered] = useState(false);

  const rowBg = isSelected
    ? (isDark ? "rgba(16,185,129,0.08)" : "rgba(16,185,129,0.05)")
    : hovered
    ? (t?.cardHover || "rgba(0,0,0,0.02)")
    : "transparent";

  const cellStyle = {
    padding: "12px 14px",
    borderBottom: `1px solid ${t?.borderSubtle || "#f1f5f9"}`,
    verticalAlign: "middle",
    color: t?.text || "#0f172a",
  };

  return (
    <tr
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: rowBg, cursor: "pointer", transition: "background 0.15s" }}
    >
      <td style={cellStyle}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: customer.avGradient,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0,
          boxShadow: isSelected ? "0 0 0 2px #10b981" : "none",
        }}>
          {customer.initials}
        </div>
      </td>
      <td style={cellStyle}>
        <div style={{ fontWeight: 600, fontSize: 13, color: t?.text || "#0f172a" }}>{customer.name}</div>
        <div style={{ fontSize: 11, color: t?.textSub || "#64748b", marginTop: 1 }}>{customer.email}</div>
      </td>
      <td style={{ ...cellStyle, fontSize: 12, color: t?.textSub || "#64748b" }}>{customer.phone}</td>
      <td style={{ ...cellStyle, textAlign: "center" }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: t?.text || "#0f172a" }}>{customer.convos}</span>
      </td>
      <td style={cellStyle}><StatusBadge status={customer.status} t={t} /></td>
      <td style={{ ...cellStyle, fontSize: 12, color: t?.textSub || "#64748b" }}>{customer.lastActive}</td>
      <td style={cellStyle}>
        {customer.agentInitials ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 22, height: 22, borderRadius: "50%",
              background: customer.agentGradient,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 8, fontWeight: 700,
            }}>
              {customer.agentInitials}
            </div>
            <span style={{ fontSize: 12, color: t?.textSub || "#64748b" }}>{customer.agent}</span>
          </div>
        ) : (
          <span style={{ fontSize: 12, color: t?.textMuted || "#94a3b8" }}>Unassigned</span>
        )}
      </td>
      <td style={{ ...cellStyle, textAlign: "center" }}>
        <button
          onClick={e => e.stopPropagation()}
          style={{
            padding: "4px 6px", borderRadius: 6, border: "none",
            background: "transparent", cursor: "pointer",
            color: t?.textMuted || "#94a3b8", fontSize: 16,
            display: "flex", alignItems: "center",
          }}
          onMouseEnter={e => e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          ···
        </button>
      </td>
    </tr>
  );
}

// ─── Customer Table ───────────────────────────────────────────────────────────
function CustomerTable({ customers, selectedId, onSelect, t }) {
  const isDark = isDarkTheme(t);
  if (customers.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "56px 16px", color: t?.textMuted || "#94a3b8" }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: isDark ? "rgba(16,185,129,0.1)" : "rgba(16,185,129,0.08)",
          border: `1px solid ${isDark ? "rgba(110,231,183,0.2)" : "rgba(16,185,129,0.2)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 12px",
        }}>
          <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke={isDark ? "#6ee7b7" : "#10b981"} strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div style={{ fontWeight: 600, fontSize: 14, color: t?.text || "#0f172a", marginBottom: 4 }}>No customers found</div>
        <div style={{ fontSize: 12 }}>Try adjusting your search or filters</div>
      </div>
    );
  }

  const headers = ["", "Customer", "Phone", "Convos", "Status", "Last active", "Agent", ""];
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
        <colgroup>
          <col style={{ width: 48 }} /><col style={{ width: 190 }} /><col style={{ width: 130 }} />
          <col style={{ width: 80 }} /><col style={{ width: 100 }} /><col style={{ width: 110 }} />
          <col style={{ width: 130 }} /><col style={{ width: 44 }} />
        </colgroup>
        <thead>
          <tr style={{ background: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc" }}>
            {headers.map((h, i) => (
              <th key={i} style={{
                textAlign: i === 3 || i === 7 ? "center" : "left",
                padding: "10px 14px",
                fontSize: 10, fontWeight: 700, color: t?.textMuted || "#94a3b8",
                letterSpacing: "0.07em", textTransform: "uppercase",
                borderBottom: `1px solid ${t?.border || "#e2e8f0"}`,
                whiteSpace: "nowrap",
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <CustomerRow key={c.id} customer={c} isSelected={c.id === selectedId} onClick={() => onSelect(c)} t={t} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Profile Drawer ───────────────────────────────────────────────────────────
function CustomerProfileDrawer({ customer, onClose, onAddNote, t }) {
  const isDark = isDarkTheme(t);
  const [noteText, setNoteText] = useState("");
  const [noteFocused, setNoteFocused] = useState(false);

  if (!customer) return null;

  const handleSaveNote = () => {
    if (!noteText.trim()) return;
    onAddNote(noteText.trim());
    setNoteText("");
  };

  const infoItems = [
    { label: "Company", value: customer.company },
    { label: "Phone", value: customer.phone },
    { label: "First contact", value: customer.firstContact },
    { label: "Last active", value: customer.lastActive },
    { label: "Conversations", value: customer.convos },
    { label: "Agent", value: customer.agent || "Unassigned" },
  ];

  const sectionLabel = (text) => (
    <div style={{
      fontSize: 10, fontWeight: 700, color: t?.textMuted || "#94a3b8",
      letterSpacing: "0.07em", textTransform: "uppercase",
      marginBottom: 10, marginTop: 20,
    }}>
      {text}
    </div>
  );

  return (
    <div style={{
      width: 320, flexShrink: 0,
      borderLeft: `1px solid ${t?.border || "#e2e8f0"}`,
      background: t?.surface || "#fff",
      display: "flex", flexDirection: "column", overflow: "hidden",
      backdropFilter: isDark ? "blur(14px)" : "none",
      WebkitBackdropFilter: isDark ? "blur(14px)" : "none",
    }}>
      {/* Header */}
      <div style={{
        padding: "14px 16px", borderBottom: `1px solid ${t?.border || "#e2e8f0"}`,
        display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: t?.text || "#0f172a" }}>Customer profile</span>
        <button
          onClick={onClose}
          style={{
            width: 28, height: 28, borderRadius: 8,
            border: `1px solid ${t?.border || "#e2e8f0"}`,
            background: "transparent", cursor: "pointer",
            color: t?.textSub || "#64748b", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <svg width={14} height={14} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        {/* Avatar + name */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: customer.avGradient,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 15, fontWeight: 700, flexShrink: 0,
            boxShadow: isDark ? "0 0 16px rgba(16,185,129,0.2)" : "none",
          }}>
            {customer.initials}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: t?.text || "#0f172a" }}>{customer.name}</div>
            <div style={{ fontSize: 11, color: t?.textSub || "#64748b", marginTop: 2 }}>{customer.email}</div>
          </div>
        </div>

        {/* Status badge */}
        <div style={{ marginBottom: 4 }}>
          <StatusBadge status={customer.status} t={t} />
        </div>

        {/* Info grid */}
        {sectionLabel("Customer information")}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {infoItems.map(item => (
            <div key={item.label} style={{
              background: isDark ? "rgba(255,255,255,0.03)" : "#f8fafc",
              border: `1px solid ${t?.border || "#e2e8f0"}`,
              borderRadius: 10, padding: "10px 12px",
            }}>
              <div style={{ fontSize: 10, color: t?.textMuted || "#94a3b8", marginBottom: 3, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{item.label}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: t?.text || "#0f172a" }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Tags */}
        {sectionLabel("Tags")}
        {customer.tags.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {customer.tags.map(tag => <CustomerTag key={tag} tag={tag} t={t} />)}
          </div>
        ) : (
          <span style={{ fontSize: 12, color: t?.textMuted || "#94a3b8" }}>No tags assigned</span>
        )}

        {/* Conversations */}
        {sectionLabel("Conversation history")}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {customer.conversations.map((c, i) => (
            <div key={i} style={{
              border: `1px solid ${t?.border || "#e2e8f0"}`,
              borderRadius: 10, padding: "10px 12px", cursor: "pointer",
              background: isDark ? "rgba(255,255,255,0.02)" : "transparent",
              transition: "background 0.15s, border-color 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.04)" : "#f8fafc"; e.currentTarget.style.borderColor = isDark ? "rgba(110,231,183,0.2)" : "rgba(16,185,129,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.02)" : "transparent"; e.currentTarget.style.borderColor = t?.border || "#e2e8f0"; }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4, gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: t?.text || "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.subject}</span>
                <StatusBadge status={c.status} t={t} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <span style={{ fontSize: 11, color: t?.textSub || "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.preview}</span>
                <span style={{ fontSize: 10, color: t?.textMuted || "#94a3b8", flexShrink: 0 }}>{c.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Notes */}
        {sectionLabel("Internal notes")}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
          {customer.notes.map((n, i) => (
            <div key={i} style={{
              background: isDark ? "rgba(16,185,129,0.06)" : "rgba(16,185,129,0.04)",
              border: `1px solid ${isDark ? "rgba(110,231,183,0.15)" : "rgba(16,185,129,0.15)"}`,
              borderRadius: 10, padding: "10px 12px",
              borderLeft: `3px solid #10b981`,
            }}>
              <div style={{ fontSize: 10, color: t?.textMuted || "#94a3b8", marginBottom: 4, fontWeight: 600 }}>Agent note</div>
              <div style={{ fontSize: 12, color: t?.text || "#0f172a", lineHeight: 1.5 }}>{n}</div>
            </div>
          ))}
        </div>

        {/* Add note */}
        <textarea
          value={noteText}
          onChange={e => setNoteText(e.target.value)}
          onFocus={() => setNoteFocused(true)}
          onBlur={() => setNoteFocused(false)}
          placeholder="Add an internal note…"
          style={{
            width: "100%", border: `1px solid ${noteFocused ? "rgba(110,231,183,0.5)" : (t?.inputBorder || "#e2e8f0")}`,
            borderRadius: 10, padding: "10px 12px",
            fontSize: 12, fontFamily: "inherit",
            color: t?.text || "#0f172a",
            background: t?.inputBg || "#f8fafc",
            resize: "none", outline: "none", minHeight: 72,
            boxSizing: "border-box",
            boxShadow: noteFocused ? "0 0 0 3px rgba(16,185,129,0.1)" : "none",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
        />
        <button
          onClick={handleSaveNote}
          style={{
            marginTop: 8, width: "100%", padding: "9px 12px",
            background: "#065f46", color: "#fff", border: "none",
            borderRadius: 10, fontSize: 12, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 0 16px rgba(16,185,129,0.25)",
            transition: "background 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#047857"}
          onMouseLeave={e => e.currentTarget.style.background = "#065f46"}
        >
          Save note
        </button>
      </div>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ filtered, t }) {
  const isDark = isDarkTheme(t);
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 16px", borderTop: `1px solid ${t?.border || "#e2e8f0"}`,
    }}>
      <span style={{ fontSize: 12, color: t?.textSub || "#64748b" }}>
        Showing 1–{filtered} of {filtered} customers
      </span>
      <div style={{ display: "flex", gap: 4 }}>
        {["‹", "1", "2", "3", "›"].map((p, i) => (
          <button key={i} style={{
            padding: "4px 9px", borderRadius: 7,
            border: `1px solid ${p === "1" ? "#10b981" : (t?.border || "#e2e8f0")}`,
            background: p === "1" ? "#065f46" : "transparent",
            color: p === "1" ? "#fff" : (t?.textSub || "#64748b"),
            fontSize: 12, cursor: "pointer", fontFamily: "inherit",
            transition: "all 0.15s",
          }}>
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function CustomersPage({ t = {} }) {
  const isDark = isDarkTheme(t);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("name");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customersData, setCustomersData] = useState(MOCK_CUSTOMERS);

  const filtered = useMemo(() => {
    let result = customersData.filter(c => {
      const q = search.toLowerCase();
      const matchSearch = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.company.toLowerCase().includes(q);
      const matchFilter =
        filter === "all" ||
        (filter === "active" && c.status === "active") ||
        (filter === "new" && c.status === "new") ||
        (filter === "vip" && c.tags.includes("VIP")) ||
        (filter === "unassigned" && !c.agentInitials);
      return matchSearch && matchFilter;
    });
    if (sort === "name") result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "convos") result = [...result].sort((a, b) => b.convos - a.convos);
    return result;
  }, [customersData, search, filter, sort]);

  const handleAddNote = (text) => {
    setCustomersData(prev => prev.map(c => c.id === selectedCustomer.id ? { ...c, notes: [...c.notes, text] } : c));
    setSelectedCustomer(prev => ({ ...prev, notes: [...prev.notes, text] }));
  };

  const handleSelectCustomer = (c) => {
    setSelectedCustomer(prev => prev?.id === c.id ? null : c);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: t?.bg || "#f8fafc", position: "relative" }}>

      {/* Ambient glow dark only */}
      {isDark && (
        <>
          <div style={{ position: "absolute", top: "-10%", right: "-5%", width: "40%", height: "40%", borderRadius: "50%", background: "rgba(16,185,129,0.04)", filter: "blur(140px)", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: "35%", height: "35%", borderRadius: "50%", background: "rgba(6,95,70,0.05)", filter: "blur(120px)", pointerEvents: "none", zIndex: 0 }} />
        </>
      )}

      {/* Page header */}
      <div style={{
        padding: "16px 20px",
        borderBottom: `1px solid ${t?.border || "#e2e8f0"}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: t?.surface || "#fff",
        backdropFilter: isDark ? "blur(14px)" : "none",
        WebkitBackdropFilter: isDark ? "blur(14px)" : "none",
        flexShrink: 0, zIndex: 1, position: "relative",
      }}>
        <div>
          <h1 style={{ fontSize: 16, fontWeight: 700, color: t?.text || "#0f172a", margin: 0, letterSpacing: "-0.01em" }}>Customers</h1>
          <p style={{ fontSize: 12, color: t?.textSub || "#64748b", margin: "2px 0 0" }}>Manage and view all customer profiles and support history</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 14px", borderRadius: 10,
            border: `1px solid ${t?.border || "#e2e8f0"}`,
            background: "transparent", color: t?.textSub || "#64748b",
            fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
            transition: "background 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <svg width={13} height={13} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
          <button style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 14px", borderRadius: 10,
            border: "none", background: "#065f46", color: "#fff",
            fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 0 16px rgba(16,185,129,0.25)",
            transition: "background 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#047857"}
            onMouseLeave={e => e.currentTarget.style.background = "#065f46"}
          >
            <svg width={13} height={13} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add customer
          </button>
        </div>
      </div>

      {/* Main content + drawer */}
      <div style={{ flex: 1, display: "flex", minHeight: 0, overflow: "hidden", position: "relative", zIndex: 1 }}>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          <StatCards customers={customersData} t={t} />

          <CustomerToolbar search={search} onSearch={setSearch} filter={filter} onFilter={setFilter} sort={sort} onSort={setSort} t={t} />

          {/* Table card */}
          <div style={{
            background: t?.surface || "#fff",
            border: `1px solid ${t?.border || "#e2e8f0"}`,
            borderRadius: 16, overflow: "hidden",
            backdropFilter: isDark ? "blur(14px)" : "none",
            WebkitBackdropFilter: isDark ? "blur(14px)" : "none",
          }}>
            {/* Table header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 16px", borderBottom: `1px solid ${t?.border || "#e2e8f0"}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: t?.text || "#0f172a" }}>Customer list</span>
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  background: isDark ? "rgba(16,185,129,0.15)" : "rgba(16,185,129,0.1)",
                  color: isDark ? "#6ee7b7" : "#065f46",
                  padding: "2px 8px", borderRadius: 99,
                  border: `1px solid ${isDark ? "rgba(110,231,183,0.22)" : "rgba(16,185,129,0.2)"}`,
                }}>
                  {filtered.length} customers
                </span>
              </div>
            </div>

            <CustomerTable customers={filtered} selectedId={selectedCustomer?.id} onSelect={handleSelectCustomer} t={t} />
            <Pagination filtered={filtered.length} t={t} />
          </div>
        </div>

        {/* Profile Drawer */}
        {selectedCustomer && (
          <CustomerProfileDrawer
            customer={selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
            onAddNote={handleAddNote}
            t={t}
          />
        )}
      </div>
    </div>
  );
}