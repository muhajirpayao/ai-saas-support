// src/pages/dashboard/knowledge-base/Knowledgebasepage.jsx
import { useState, useMemo, useRef, useEffect } from "react";

// ─── Theme + responsive helpers (same pattern as Dashboard / CustomersPage) ──
function isDarkTheme(t) {
  return t?.bg === "#0a0a0a" || (typeof t?.sidebar === "string" && t.sidebar.includes("20,21,24"));
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 768 : false);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 1, name: "Getting Started", color: "#6366f1" },
  { id: 2, name: "Account & Billing", color: "#f59e0b" },
  { id: 3, name: "Integrations", color: "#10b981" },
  { id: 4, name: "API Reference", color: "#3b82f6" },
  { id: 5, name: "Troubleshooting", color: "#ef4444" },
  { id: 6, name: "Security", color: "#8b5cf6" },
];

const ARTICLES = [
  {
    id: 1,
    title: "Getting started with SupportAI in 5 minutes",
    excerpt: "Complete walkthrough of the system architecture and initial setup process...",
    status: "published", category: "Getting Started",
    author: "Sarah Chen", authorInitials: "SC", authorGrad: "linear-gradient(135deg,#f472b6,#f43f5e)",
    updatedAt: "2h ago", views: 1240, tags: ["onboarding", "quick-start"],
  },
  {
    id: 2,
    title: "How to connect your Slack workspace",
    excerpt: "Technical documentation for setting up the Slack integration gateway...",
    status: "published", category: "Integrations",
    author: "Marcus Reid", authorInitials: "MR", authorGrad: "linear-gradient(135deg,#60a5fa,#6366f1)",
    updatedAt: "1 day ago", views: 876, tags: ["slack", "integration"],
  },
  {
    id: 3,
    title: "Understanding billing cycles and invoices",
    excerpt: "Changes to the 30-day satisfaction guarantee and enterprise billing...",
    status: "draft", category: "Account & Billing",
    author: "Priya Nair", authorInitials: "PN", authorGrad: "linear-gradient(135deg,#fbbf24,#f97316)",
    updatedAt: "3 days ago", views: 0, tags: ["billing", "payments"],
  },
  {
    id: 4,
    title: "Authenticating with the REST API",
    excerpt: "Step-by-step guide for OAuth 2.0 token generation and API key management...",
    status: "published", category: "API Reference",
    author: "Sarah Chen", authorInitials: "SC", authorGrad: "linear-gradient(135deg,#f472b6,#f43f5e)",
    updatedAt: "5 days ago", views: 2103, tags: ["api", "auth", "tokens"],
  },
  {
    id: 5,
    title: "Setting up SSO with Okta",
    excerpt: "Enterprise SSO configuration guide for Okta SAML 2.0 integration...",
    status: "draft", category: "Security",
    author: "Marcus Reid", authorInitials: "MR", authorGrad: "linear-gradient(135deg,#60a5fa,#6366f1)",
    updatedAt: "1 week ago", views: 0, tags: ["sso", "okta", "security"],
  },
  {
    id: 6,
    title: "Troubleshooting webhook delivery failures",
    excerpt: "Debugging guide for outgoing webhook events that fail to trigger...",
    status: "published", category: "Troubleshooting",
    author: "Priya Nair", authorInitials: "PN", authorGrad: "linear-gradient(135deg,#fbbf24,#f97316)",
    updatedAt: "2 weeks ago", views: 654, tags: ["webhooks", "errors"],
  },
  {
    id: 7,
    title: "Customizing your AI agent's tone and persona",
    excerpt: "Configure response style, language tone and brand voice for your AI agent...",
    status: "published", category: "Getting Started",
    author: "Sarah Chen", authorInitials: "SC", authorGrad: "linear-gradient(135deg,#f472b6,#f43f5e)",
    updatedAt: "3 weeks ago", views: 3421, tags: ["ai", "customization"],
  },
  {
    id: 8,
    title: "Managing team members and permissions",
    excerpt: "Role-based access control setup for admins, agents, and viewers...",
    status: "published", category: "Account & Billing",
    author: "Marcus Reid", authorInitials: "MR", authorGrad: "linear-gradient(135deg,#60a5fa,#6366f1)",
    updatedAt: "1 month ago", views: 987, tags: ["team", "permissions"],
  },
];

// ─── Icon helper (stroke-based, matches Dashboard's <Icon>) ──────────────────
const Ico = ({ d, size = 16, color, style = {} }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color || "currentColor"} strokeWidth={1.8} style={style}>
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

const D = {
  search:   "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  plus:     "M12 4v16m8-8H4",
  grid:     "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  list:     "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  dots:     "M5 12h.01M12 12h.01M19 12h.01",
  edit:     "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:    "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  eye:      "M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12zM12 15a3 3 0 100-6 3 3 0 000 6z",
  x:        "M6 18L18 6M6 6l12 12",
  folder:   "M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z",
  chevDown: "M19 9l-7 7-7-7",
  chevLeft: "M15 19l-7-7 7-7",
  chevRight:"M9 5l7 7-7 7",
  check:    "M5 13l4 4L19 7",
  clock:    "M12 2a10 10 0 100 20A10 10 0 0012 2zM12 6v6l4 2",
  book:     "M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15z",
  link:     "M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71",
  image:    "M21 15l-5-5L5 21M3 3h18v18H3zM8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3z",
  spark:    "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
  filter:   "M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z",
  share:    "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z",
};

// ─── Status / category chips (token-driven, mirrors CustomersPage badges) ────
const STATUS_CONFIG = {
  published: { light: { bg: "#d1fae5", text: "#065f46", dot: "#10b981" }, dark: { bg: "rgba(16,185,129,0.12)", text: "#6ee7b7", dot: "#10b981" }, label: "Published" },
  draft:     { light: { bg: "#f1f5f9", text: "#475569", dot: "#94a3b8" }, dark: { bg: "rgba(255,255,255,0.06)", text: "#a1a8bc", dot: "#64748b" }, label: "Draft" },
};

function StatusBadge({ status, t }) {
  const isDark = isDarkTheme(t);
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
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

function CatDot({ name, t }) {
  const cat = CATEGORIES.find(c => c.name === name);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      fontSize: 10, fontWeight: 700, color: t?.textSub || "#64748b",
      textTransform: "uppercase", letterSpacing: "0.05em",
      padding: "3px 8px", borderRadius: 99, whiteSpace: "nowrap",
      background: isDarkTheme(t) ? "rgba(255,255,255,0.05)" : "#f1f5f9",
      border: `1px solid ${t?.border || "#e2e8f0"}`,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: cat?.color || "#6b7280", flexShrink: 0 }} />
      {name}
    </span>
  );
}

function AuthorAvatar({ initials, grad, size = 28 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: grad,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 700, fontSize: size * 0.32, flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

// ─── Stats grid (matches CustomersPage StatCards exactly) ────────────────────
function StatsBento({ articles, t, isMobile }) {
  const isDark = isDarkTheme(t);
  const published = articles.filter(a => a.status === "published").length;
  const drafts = articles.filter(a => a.status === "draft").length;
  const totalViews = articles.reduce((s, a) => s + a.views, 0);

  const stats = [
    { label: "Total articles", value: articles.length, sub: "+5 this month", accent: t?.accent || "#10b981" },
    { label: "Published", value: published, sub: "Active", accent: t?.accent || "#10b981" },
    { label: "Drafts", value: drafts, sub: "Review req.", accent: "#f59e0b" },
    { label: "Total views", value: totalViews.toLocaleString(), sub: "All time", accent: t?.accent || "#10b981" },
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
          padding: isMobile ? "14px 14px" : 16,
          backdropFilter: isDark ? "blur(14px)" : "none",
          WebkitBackdropFilter: isDark ? "blur(14px)" : "none",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2,
            background: i === 2 ? "#f59e0b" : (isDark ? "rgba(16,185,129,0.4)" : "rgba(16,185,129,0.3)"),
            borderRadius: "14px 14px 0 0",
          }} />
          <div style={{
            fontSize: isMobile ? 10 : 11, color: t?.textSub || "#64748b", fontWeight: 500,
            marginBottom: isMobile ? 8 : 6, textTransform: "uppercase", letterSpacing: "0.05em", lineHeight: 1.3,
          }}>
            {s.label}
          </div>
          <div style={{
            fontSize: isMobile ? 26 : 24, fontWeight: 800, color: t?.text || "#0f172a",
            letterSpacing: "-0.02em", marginBottom: 4, lineHeight: 1,
          }}>
            {s.value}
          </div>
          <div style={{ fontSize: isMobile ? 10 : 11, color: s.accent, fontWeight: 600 }}>{s.sub}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Toolbar (matches CustomersPage CustomerToolbar) ─────────────────────────
function KBToolbar({ search, onSearch, filter, onFilter, sort, onSort, view, onView, t, isMobile }) {
  const isDark = isDarkTheme(t);
  const [focused, setFocused] = useState(false);
  const filters = ["all", "published", "drafts"];
  const filterLabels = { all: "All Articles", published: "Published", drafts: "Drafts" };

  return (
    <div style={{
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      alignItems: isMobile ? "stretch" : "center",
      gap: 10,
      marginBottom: 16,
    }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flex: isMobile ? undefined : 1 }}>
        {/* View toggle */}
        <div style={{ display: "flex", gap: 2, background: isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9", borderRadius: 10, padding: 3, border: `1px solid ${t?.border || "#e2e8f0"}`, flexShrink: 0 }}>
          {[{ v: "list", icon: D.list }, { v: "grid", icon: D.grid }].map(({ v, icon }) => (
            <button key={v} onClick={() => onView(v)} style={{
              display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: 8,
              border: view === v ? `1px solid ${t?.border || "#e2e8f0"}` : "none",
              background: view === v ? (isDark ? "rgba(255,255,255,0.07)" : "#fff") : "transparent",
              color: view === v ? (t?.text || "#0f172a") : (t?.textSub || "#64748b"),
              fontWeight: view === v ? 600 : 400, fontSize: 12, cursor: "pointer", fontFamily: "inherit",
            }}>
              <Ico d={icon} size={13} />
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{
          position: "relative", flex: 1,
          display: "flex", alignItems: "center",
          border: `1px solid ${focused ? "rgba(110,231,183,0.5)" : (t?.inputBorder || "#e2e8f0")}`,
          borderRadius: 10, background: t?.inputBg || "#f8fafc",
          boxShadow: focused ? (isDark ? "0 0 0 3px rgba(16,185,129,0.1)" : "0 0 0 3px rgba(16,185,129,0.08)") : "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
          height: 38, padding: "0 12px", gap: 8,
        }}>
          <Ico d={D.search} size={14} color={t?.textMuted || "#94a3b8"} />
          <input
            value={search}
            onChange={e => onSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search knowledge base…"
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: t?.text || "#0f172a", fontSize: 13, fontFamily: "inherit" }}
          />
          {search && (
            <button onClick={() => onSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: t?.textMuted || "#94a3b8", display: "flex" }}>
              <Ico d={D.x} size={12} />
            </button>
          )}
        </div>

        {/* Sort */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <select value={sort} onChange={e => onSort(e.target.value)} style={{
            padding: "8px 28px 8px 10px", borderRadius: 10,
            border: `1px solid ${t?.inputBorder || "#e2e8f0"}`,
            background: t?.inputBg || "#f8fafc", color: t?.text || "#0f172a",
            fontSize: 12, cursor: "pointer", outline: "none", fontFamily: "inherit", appearance: "none", height: 38,
          }}>
            <option value="updated">Last Updated</option>
            <option value="views">Views</option>
            <option value="az">A–Z</option>
          </select>
          <Ico d={D.chevDown} size={12} color={t?.textMuted || "#94a3b8"} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ overflowX: isMobile ? "auto" : "visible", WebkitOverflowScrolling: "touch" }}>
        <div style={{
          display: "flex", gap: 2,
          background: isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9",
          borderRadius: 10, padding: 3, border: `1px solid ${t?.border || "#e2e8f0"}`,
          width: isMobile ? "max-content" : "auto", minWidth: isMobile ? "100%" : undefined,
        }}>
          {filters.map(f => (
            <button key={f} onClick={() => onFilter(f)} style={{
              padding: isMobile ? "6px 14px" : "5px 12px", borderRadius: 8,
              border: filter === f ? `1px solid ${t?.border || "#e2e8f0"}` : "none",
              background: filter === f ? (isDark ? "rgba(255,255,255,0.07)" : "#fff") : "transparent",
              color: filter === f ? (t?.text || "#0f172a") : (t?.textSub || "#64748b"),
              fontWeight: filter === f ? 600 : 400, fontSize: isMobile ? 13 : 12,
              cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s", fontFamily: "inherit",
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

// ─── Desktop table row ────────────────────────────────────────────────────────
function ArticleRow({ article, onEdit, onView, onDelete, t }) {
  const isDark = isDarkTheme(t);
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const h = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const cellStyle = { padding: "12px 14px", borderBottom: `1px solid ${t?.borderSubtle || "#f1f5f9"}`, verticalAlign: "middle", color: t?.text || "#0f172a" };

  return (
    <tr onClick={() => onView(article)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? (t?.cardHover || "rgba(0,0,0,0.02)") : "transparent", cursor: "pointer", transition: "background 0.15s" }}>
      <td style={cellStyle}>
        <div style={{ fontWeight: 600, fontSize: 13, color: t?.text || "#0f172a", marginBottom: 2 }}>{article.title}</div>
        <div style={{ fontSize: 11, color: t?.textSub || "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 320 }}>{article.excerpt}</div>
      </td>
      <td style={cellStyle}><CatDot name={article.category} t={t} /></td>
      <td style={cellStyle}><StatusBadge status={article.status} t={t} /></td>
      <td style={cellStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <AuthorAvatar initials={article.authorInitials} grad={article.authorGrad} size={22} />
          <span style={{ fontSize: 12, color: t?.textSub || "#64748b" }}>{article.author}</span>
        </div>
      </td>
      <td style={{ ...cellStyle, fontSize: 12, color: t?.textSub || "#64748b", whiteSpace: "nowrap" }}>{article.updatedAt}</td>
      <td style={{ ...cellStyle, textAlign: "right", fontSize: 12, fontWeight: 700, color: t?.accent || "#10b981" }}>
        {article.views > 0 ? article.views.toLocaleString() : "—"}
      </td>
      <td style={{ ...cellStyle, textAlign: "center" }} onClick={e => e.stopPropagation()}>
        <div style={{ position: "relative", display: "inline-block" }} ref={menuRef}>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{
            padding: "4px 6px", borderRadius: 6, border: "none", background: "transparent",
            cursor: "pointer", color: t?.textMuted || "#94a3b8", fontSize: 16, display: "flex", alignItems: "center",
          }}>
            <Ico d={D.dots} size={14} />
          </button>
          {menuOpen && (
            <div style={{
              position: "absolute", right: 0, top: "100%", marginTop: 4, width: 150, zIndex: 20,
              borderRadius: 10, border: `1px solid ${t?.border || "#e2e8f0"}`,
              background: isDark ? "rgba(20,21,24,0.98)" : "#fff",
              boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.6)" : "0 8px 32px rgba(0,0,0,0.12)",
              overflow: "hidden", textAlign: "left",
            }}>
              {[
                { label: "Edit article", icon: D.edit, action: () => { onEdit(article); setMenuOpen(false); } },
                { label: "Preview", icon: D.eye, action: () => { onView(article); setMenuOpen(false); } },
                { label: "Delete", icon: D.trash, danger: true, action: () => { onDelete(article.id); setMenuOpen(false); } },
              ].map(item => (
                <button key={item.label} onClick={item.action} style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 12px",
                  fontSize: 12, fontWeight: 500, textAlign: "left", border: "none", background: "transparent",
                  cursor: "pointer", color: item.danger ? "#ef4444" : (t?.menuItem || "#374151"),
                  borderBottom: `1px solid ${t?.borderSubtle || "#f1f5f9"}`,
                }}>
                  <Ico d={item.icon} size={12} />{item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

function ArticleTable({ articles, onEdit, onView, onDelete, t }) {
  const isDark = isDarkTheme(t);
  const headers = ["Article Title", "Category", "Status", "Author", "Last Updated", "Views", ""];
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc" }}>
            {headers.map((h, i) => (
              <th key={i} style={{
                textAlign: i === 5 ? "right" : i === 6 ? "center" : "left",
                padding: "10px 14px", fontSize: 10, fontWeight: 700, color: t?.textMuted || "#94a3b8",
                letterSpacing: "0.07em", textTransform: "uppercase",
                borderBottom: `1px solid ${t?.border || "#e2e8f0"}`, whiteSpace: "nowrap",
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {articles.map(a => <ArticleRow key={a.id} article={a} onEdit={onEdit} onView={onView} onDelete={onDelete} t={t} />)}
        </tbody>
      </table>
    </div>
  );
}

// ─── Mobile card (matches CustomersPage CustomerCard) ────────────────────────
function ArticleCard({ article, onView, onEdit, onDelete, t }) {
  const isDark = isDarkTheme(t);
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={() => onView(article)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
      padding: "14px 16px", borderBottom: `1px solid ${t?.borderSubtle || "#f1f5f9"}`, cursor: "pointer",
      background: hovered ? (isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)") : "transparent",
      transition: "background 0.15s",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: t?.text || "#0f172a", marginBottom: 4, lineHeight: 1.3 }}>{article.title}</div>
          <div style={{ fontSize: 12, color: t?.textSub || "#64748b", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{article.excerpt}</div>
        </div>
        <StatusBadge status={article.status} t={t} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
        <CatDot name={article.category} t={t} />
        {article.tags.slice(0, 2).map(tag => (
          <span key={tag} style={{ fontSize: 10, fontWeight: 600, color: t?.textSub || "#64748b", background: isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9", border: `1px solid ${t?.border || "#e2e8f0"}`, padding: "3px 8px", borderRadius: 6, textTransform: "uppercase", letterSpacing: "0.03em" }}>{tag}</span>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <AuthorAvatar initials={article.authorInitials} grad={article.authorGrad} size={20} />
          <span style={{ fontSize: 11, color: t?.textSub || "#64748b" }}>{article.author}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {article.views > 0 && <span style={{ fontSize: 11, fontWeight: 700, color: t?.accent || "#10b981" }}>{article.views.toLocaleString()}</span>}
          <span style={{ fontSize: 10, color: t?.textMuted || "#94a3b8" }}>{article.updatedAt}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Article preview drawer / bottom sheet (matches CustomerProfileDrawer) ───
function PreviewDrawer({ article, onClose, onEdit, t, isMobile }) {
  const isDark = isDarkTheme(t);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const sectionLabel = (text) => (
    <div style={{ fontSize: 10, fontWeight: 700, color: t?.textMuted || "#94a3b8", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 10, marginTop: 20 }}>{text}</div>
  );

  const body = (
    <>
      <h1 style={{ fontSize: isMobile ? 18 : 20, fontWeight: 700, color: t?.text || "#0f172a", lineHeight: 1.3, margin: 0 }}>{article.title}</h1>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 0", borderTop: `1px solid ${t?.border || "#e2e8f0"}`, borderBottom: `1px solid ${t?.border || "#e2e8f0"}`, marginTop: 14 }}>
        <AuthorAvatar initials={article.authorInitials} grad={article.authorGrad} size={32} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: t?.text || "#0f172a" }}>{article.author}</div>
          <div style={{ fontSize: 11, color: t?.textMuted || "#94a3b8" }}>Last updated {article.updatedAt}</div>
        </div>
        {article.views > 0 && <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 700, color: t?.accent || "#10b981" }}>{article.views.toLocaleString()} views</span>}
      </div>

      <div style={{ fontSize: 13, color: t?.textSub || "#64748b", lineHeight: 1.7, marginTop: 16 }}>
        <p style={{ margin: 0 }}>This guide provides a comprehensive overview of the topic and the steps to configure it for your workflow.</p>
        <h3 style={{ color: t?.text || "#0f172a", fontSize: 14, fontWeight: 700, margin: "16px 0 8px" }}>Core Concepts</h3>
        <p style={{ margin: 0 }}>This section covers the fundamentals behind this feature, which will help with configuration and troubleshooting.</p>
      </div>

      {sectionLabel("Tags")}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {article.tags.map(tag => (
          <span key={tag} style={{ fontSize: 10, fontWeight: 600, color: t?.textSub || "#64748b", background: isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9", border: `1px solid ${t?.border || "#e2e8f0"}`, padding: "3px 8px", borderRadius: 6, textTransform: "uppercase", letterSpacing: "0.03em" }}>{tag}</span>
        ))}
      </div>
    </>
  );

  const footer = (
    <div style={{ display: "flex", gap: 8 }}>
      <button onClick={() => { onClose(); onEdit(article); }} style={{
        flex: 1, padding: isMobile ? "12px" : "9px 12px", background: "#065f46", color: "#fff", border: "none",
        borderRadius: isMobile ? 12 : 10, fontSize: isMobile ? 14 : 12, fontWeight: 600, cursor: "pointer",
        fontFamily: "inherit", boxShadow: "0 0 16px rgba(16,185,129,0.25)",
      }}>
        Edit article
      </button>
      <button style={{ padding: isMobile ? "12px" : "9px 12px", borderRadius: isMobile ? 12 : 10, border: `1px solid ${t?.border || "#e2e8f0"}`, background: "transparent", color: t?.textSub || "#64748b", cursor: "pointer" }}>
        <Ico d={D.share} size={14} />
      </button>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", zIndex: 100 }} />
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: t?.surface || "#fff", borderRadius: "20px 20px 0 0", boxShadow: "0 -8px 40px rgba(0,0,0,0.2)", zIndex: 101, display: "flex", flexDirection: "column", maxHeight: "88vh" }}>
          <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: isDark ? "rgba(255,255,255,0.15)" : "#e2e8f0" }} />
          </div>
          <div style={{ padding: "8px 16px 14px", borderBottom: `1px solid ${t?.border || "#e2e8f0"}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <StatusBadge status={article.status} t={t} />
              <CatDot name={article.category} t={t} />
            </div>
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${t?.border || "#e2e8f0"}`, background: "transparent", cursor: "pointer", color: t?.textSub || "#64748b", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ico d={D.x} size={14} />
            </button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "4px 16px 16px" }}>{body}</div>
          <div style={{ padding: "12px 16px", borderTop: `1px solid ${t?.border || "#e2e8f0"}`, flexShrink: 0 }}>{footer}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", zIndex: 100 }} />
      <div style={{
        position: "fixed", inset: "0 0 0 auto", right: 0, top: 0, bottom: 0, width: 420,
        background: t?.surface || "#fff", borderLeft: `1px solid ${t?.border || "#e2e8f0"}`,
        zIndex: 101, display: "flex", flexDirection: "column",
        backdropFilter: isDark ? "blur(14px)" : "none", WebkitBackdropFilter: isDark ? "blur(14px)" : "none",
      }}>
        <div style={{ padding: "14px 16px", borderBottom: `1px solid ${t?.border || "#e2e8f0"}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <StatusBadge status={article.status} t={t} />
            <CatDot name={article.category} t={t} />
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 8, border: `1px solid ${t?.border || "#e2e8f0"}`, background: "transparent", cursor: "pointer", color: t?.textSub || "#64748b", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ico d={D.x} size={14} />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>{body}</div>
        <div style={{ padding: 16, borderTop: `1px solid ${t?.border || "#e2e8f0"}`, flexShrink: 0 }}>{footer}</div>
      </div>
    </>
  );
}

// ─── Article editor (full-screen) — restyled with theme tokens ──────────────
function ArticleEditor({ article, onClose, t, isMobile }) {
  const isDark = isDarkTheme(t);
  const [title, setTitle] = useState(article.title || "");
  const [body, setBody] = useState(
    "Write your article here.\n\nOverview\nExplain what this article covers and who it's for.\n\nSteps\n1. First step\n2. Second step\n3. Third step"
  );
  const [category, setCategory] = useState(article.category || "");
  const [tags, setTags] = useState(article.tags?.join(", ") || "");
  const [status, setStatus] = useState(article.status || "draft");
  const [catOpen, setCatOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (s) => { setStatus(s); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: t?.bg || "#fff", display: "flex", flexDirection: "column" }}>
      <header style={{
        height: 56, padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: `1px solid ${t?.border || "#e2e8f0"}`, background: t?.topbar || (t?.surface || "#fff"), flexShrink: 0, gap: 8,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: t?.textSub || "#64748b", padding: 6, borderRadius: 8, display: "flex" }}>
            <Ico d={D.x} size={16} />
          </button>
          <span style={{ fontSize: 12, fontWeight: 600, color: t?.text || "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title || "New Article"}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {saved && <span style={{ fontSize: 11, fontWeight: 700, color: t?.accent || "#10b981" }}>Saved</span>}
          <button onClick={() => handleSave("draft")} style={{ padding: "7px 12px", borderRadius: 10, border: `1px solid ${t?.border || "#e2e8f0"}`, background: "transparent", color: t?.text || "#0f172a", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            {isMobile ? "Draft" : "Save Draft"}
          </button>
          <button onClick={() => handleSave("published")} style={{ padding: "7px 14px", borderRadius: 10, border: "none", background: "#065f46", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 0 16px rgba(16,185,129,0.25)" }}>
            Publish
          </button>
        </div>
      </header>

      <div style={{ flex: 1, display: "flex", overflow: "hidden", flexDirection: isMobile ? "column" : "row" }}>
        <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? 16 : 32 }}>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Untitled Article"
            style={{ width: "100%", background: "transparent", border: "none", outline: "none", fontSize: isMobile ? 22 : 28, fontWeight: 700, color: t?.text || "#0f172a", marginBottom: 16, fontFamily: "inherit" }}
          />
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            style={{ width: "100%", minHeight: 360, border: "none", outline: "none", resize: "vertical", fontSize: 14, lineHeight: 1.7, color: t?.textSub || "#64748b", background: "transparent", fontFamily: "inherit" }}
          />
        </div>

        <aside style={{
          width: isMobile ? "100%" : 280, flexShrink: 0,
          borderTop: isMobile ? `1px solid ${t?.border || "#e2e8f0"}` : "none",
          borderLeft: isMobile ? "none" : `1px solid ${t?.border || "#e2e8f0"}`,
          padding: 16, overflowY: "auto", background: t?.surface || "#fff",
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: t?.textMuted || "#94a3b8", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 14 }}>Article settings</div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: t?.textMuted || "#94a3b8", display: "block", marginBottom: 6 }}>Status</label>
            <div style={{ display: "flex", gap: 6 }}>
              {["draft", "published"].map(s => (
                <button key={s} onClick={() => setStatus(s)} style={{
                  flex: 1, padding: "7px 0", borderRadius: 8, fontSize: 11, fontWeight: 600, textTransform: "capitalize", cursor: "pointer", fontFamily: "inherit",
                  border: `1px solid ${status === s ? (s === "published" ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)") : (t?.border || "#e2e8f0")}`,
                  background: status === s ? (s === "published" ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)") : "transparent",
                  color: status === s ? (s === "published" ? "#10b981" : "#f59e0b") : (t?.textSub || "#64748b"),
                }}>{s}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16, position: "relative" }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: t?.textMuted || "#94a3b8", display: "block", marginBottom: 6 }}>Category</label>
            <button onClick={() => setCatOpen(!catOpen)} style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "9px 12px", borderRadius: 10, border: `1px solid ${t?.inputBorder || "#e2e8f0"}`,
              background: t?.inputBg || "#f8fafc", cursor: "pointer", fontFamily: "inherit",
            }}>
              <span style={{ fontSize: 12, color: category ? (t?.text || "#0f172a") : (t?.textMuted || "#94a3b8") }}>{category || "Select category…"}</span>
              <Ico d={D.chevDown} size={12} color={t?.textMuted || "#94a3b8"} />
            </button>
            {catOpen && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4, zIndex: 10, borderRadius: 10, border: `1px solid ${t?.border || "#e2e8f0"}`, background: isDark ? "rgba(20,21,24,0.98)" : "#fff", boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.6)" : "0 8px 32px rgba(0,0,0,0.12)", overflow: "hidden" }}>
                {CATEGORIES.map(cat => (
                  <button key={cat.id} onClick={() => { setCategory(cat.name); setCatOpen(false); }} style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", fontSize: 12,
                    color: t?.menuItem || "#374151", background: "transparent", border: "none", cursor: "pointer", textAlign: "left",
                    borderBottom: `1px solid ${t?.borderSubtle || "#f1f5f9"}`, fontFamily: "inherit",
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: cat.color, flexShrink: 0 }} />{cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: t?.textMuted || "#94a3b8", display: "block", marginBottom: 6 }}>Tags</label>
            <input value={tags} onChange={e => setTags(e.target.value)} placeholder="onboarding, api…" style={{
              width: "100%", padding: "9px 12px", borderRadius: 10, border: `1px solid ${t?.inputBorder || "#e2e8f0"}`,
              background: t?.inputBg || "#f8fafc", color: t?.text || "#0f172a", fontSize: 12, outline: "none", fontFamily: "inherit", boxSizing: "border-box",
            }} />
            {tags && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
                {tags.split(",").map(tg => tg.trim()).filter(Boolean).map(tg => (
                  <span key={tg} style={{ fontSize: 10, fontWeight: 600, color: t?.accent || "#10b981", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", padding: "3px 8px", borderRadius: 6, textTransform: "uppercase", letterSpacing: "0.03em" }}>{tg}</span>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

// ─── Category manager modal ───────────────────────────────────────────────────
function CategoryManager({ onClose, t }) {
  const isDark = isDarkTheme(t);
  const [cats, setCats] = useState(CATEGORIES);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#6366f1");

  const addCat = () => { if (newName.trim()) { setCats(p => [...p, { id: Date.now(), name: newName.trim(), color: newColor }]); setNewName(""); } };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: "100%", maxWidth: 380, borderRadius: 16, border: `1px solid ${t?.border || "#e2e8f0"}`,
        background: t?.surface || "#fff", overflow: "hidden", boxShadow: isDark ? "0 24px 80px rgba(0,0,0,0.7)" : "0 24px 80px rgba(0,0,0,0.2)",
      }}>
        <div style={{ padding: "14px 16px", borderBottom: `1px solid ${t?.border || "#e2e8f0"}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: t?.text || "#0f172a" }}>Manage categories</span>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 8, border: `1px solid ${t?.border || "#e2e8f0"}`, background: "transparent", cursor: "pointer", color: t?.textSub || "#64748b", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ico d={D.x} size={14} />
          </button>
        </div>
        <div style={{ padding: 16 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <input type="color" value={newColor} onChange={e => setNewColor(e.target.value)} style={{ width: 38, height: 38, borderRadius: 10, border: `1px solid ${t?.border || "#e2e8f0"}`, padding: 2, cursor: "pointer", flexShrink: 0 }} />
            <input value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === "Enter" && addCat()} placeholder="New category…" style={{
              flex: 1, padding: "9px 12px", borderRadius: 10, border: `1px solid ${t?.inputBorder || "#e2e8f0"}`,
              background: t?.inputBg || "#f8fafc", color: t?.text || "#0f172a", fontSize: 13, outline: "none", fontFamily: "inherit",
            }} />
            <button onClick={addCat} style={{ width: 38, height: 38, borderRadius: 10, border: "none", background: "#065f46", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Ico d={D.plus} size={15} />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 220, overflowY: "auto" }}>
            {cats.map(cat => (
              <div key={cat.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, border: `1px solid ${t?.border || "#e2e8f0"}`, background: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: cat.color, flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: t?.text || "#0f172a" }}>{cat.name}</span>
                <button onClick={() => setCats(p => p.filter(c => c.id !== cat.id))} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", display: "flex" }}>
                  <Ico d={D.trash} size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${t?.border || "#e2e8f0"}`, display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "9px 16px", borderRadius: 10, border: "none", background: "#065f46", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Done</button>
        </div>
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ query, onClear, onCreate, t }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 16px", color: t?.textMuted || "#94a3b8" }}>
      <div style={{ fontWeight: 600, fontSize: 14, color: t?.text || "#0f172a", marginBottom: 4 }}>
        {query ? `No articles matching "${query}"` : "No articles yet"}
      </div>
      <div style={{ fontSize: 12, marginBottom: 16 }}>
        {query ? "Try a different search term or clear the filter." : "Create your first article to get started."}
      </div>
      {query ? (
        <button onClick={onClear} style={{ padding: "8px 16px", borderRadius: 10, border: `1px solid ${t?.border || "#e2e8f0"}`, background: "transparent", color: t?.textSub || "#64748b", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Clear search</button>
      ) : (
        <button onClick={onCreate} style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: "#065f46", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>New article</button>
      )}
    </div>
  );
}

function Pagination({ filtered, t, isMobile }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: isMobile ? "center" : "space-between", padding: "12px 16px", borderTop: `1px solid ${t?.border || "#e2e8f0"}`, gap: 12 }}>
      {!isMobile && <span style={{ fontSize: 12, color: t?.textSub || "#64748b" }}>Showing 1–{Math.min(filtered, 10)} of {filtered} articles</span>}
      <div style={{ display: "flex", gap: 4 }}>
        {["‹", "1", "2", "3", "›"].map((p, i) => (
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

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function KnowledgeBasePage({ t = {} }) {
  const isDark = isDarkTheme(t);
  const isMobile = useIsMobile();

  const [view, setView] = useState("list");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [articles, setArticles] = useState(ARTICLES);
  const [editingArticle, setEditingArticle] = useState(null);
  const [viewingArticle, setViewingArticle] = useState(null);
  const [showCatManager, setShowCatManager] = useState(false);
  const [sortBy, setSortBy] = useState("updated");

  const effectiveView = isMobile ? "grid" : view;

  const filtered = useMemo(() => {
    let result = articles.filter(a => {
      const q = search.toLowerCase();
      const matchSearch = !q || a.title.toLowerCase().includes(q) || a.tags.some(tg => tg.includes(q)) || a.category.toLowerCase().includes(q);
      const matchFilter = activeFilter === "all" || (activeFilter === "published" && a.status === "published") || (activeFilter === "drafts" && a.status === "draft");
      return matchSearch && matchFilter;
    });
    if (sortBy === "views") result = [...result].sort((a, b) => b.views - a.views);
    if (sortBy === "az") result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    return result;
  }, [articles, search, activeFilter, sortBy]);

  const handleDelete = (id) => setArticles(prev => prev.filter(a => a.id !== id));
  const handleCreate = () => setEditingArticle({ title: "", status: "draft", category: "", tags: [] });

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: t?.bg || "#f8fafc", position: "relative" }}>

      {editingArticle && <ArticleEditor article={editingArticle} onClose={() => setEditingArticle(null)} t={t} isMobile={isMobile} />}
      {viewingArticle && (
        <PreviewDrawer
          article={viewingArticle}
          onClose={() => setViewingArticle(null)}
          onEdit={(a) => { setViewingArticle(null); setEditingArticle(a); }}
          t={t}
          isMobile={isMobile}
        />
      )}
      {showCatManager && <CategoryManager onClose={() => setShowCatManager(false)} t={t} />}

      {isDark && (
        <>
          <div style={{ position: "absolute", top: "-10%", right: "-5%", width: "40%", height: "40%", borderRadius: "50%", background: "rgba(16,185,129,0.04)", filter: "blur(140px)", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: "35%", height: "35%", borderRadius: "50%", background: "rgba(6,95,70,0.05)", filter: "blur(120px)", pointerEvents: "none", zIndex: 0 }} />
        </>
      )}

      {/* Page header — matches CustomersPage header exactly */}
      <div style={{
        padding: isMobile ? "14px 16px" : "16px 20px",
        borderBottom: `1px solid ${t?.border || "#e2e8f0"}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: t?.surface || "#fff",
        backdropFilter: isDark ? "blur(14px)" : "none",
        WebkitBackdropFilter: isDark ? "blur(14px)" : "none",
        flexShrink: 0, zIndex: 1, position: "relative", gap: 12,
      }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ fontSize: isMobile ? 15 : 16, fontWeight: 700, color: t?.text || "#0f172a", margin: 0, letterSpacing: "-0.01em" }}>Knowledge Base</h1>
          {!isMobile && <p style={{ fontSize: 12, color: t?.textSub || "#64748b", margin: "2px 0 0" }}>Manage and monitor your documentation ecosystem</p>}
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          {!isMobile && (
            <button onClick={() => setShowCatManager(true)} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 10,
              border: `1px solid ${t?.border || "#e2e8f0"}`, background: "transparent", color: t?.textSub || "#64748b",
              fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
            }}>
              <Ico d={D.folder} size={13} /> Categories
            </button>
          )}
          <button onClick={handleCreate} style={{
            display: "flex", alignItems: "center", gap: 6, padding: isMobile ? "8px 12px" : "8px 14px", borderRadius: 10,
            border: "none", background: "#065f46", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer",
            fontFamily: "inherit", boxShadow: "0 0 16px rgba(16,185,129,0.25)", whiteSpace: "nowrap",
          }}>
            <Ico d={D.plus} size={13} /> {isMobile ? "New" : "New article"}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "14px 12px" : "20px" }}>
        <StatsBento articles={articles} t={t} isMobile={isMobile} />
        <KBToolbar
          search={search} onSearch={setSearch}
          filter={activeFilter} onFilter={setActiveFilter}
          sort={sortBy} onSort={setSortBy}
          view={effectiveView} onView={setView}
          t={t} isMobile={isMobile}
        />

        <div style={{
          background: t?.surface || "#fff",
          border: `1px solid ${t?.border || "#e2e8f0"}`,
          borderRadius: 16, overflow: "hidden",
          backdropFilter: isDark ? "blur(14px)" : "none",
          WebkitBackdropFilter: isDark ? "blur(14px)" : "none",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${t?.border || "#e2e8f0"}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: t?.text || "#0f172a" }}>Article list</span>
              <span style={{
                fontSize: 10, fontWeight: 700,
                background: isDark ? "rgba(16,185,129,0.15)" : "rgba(16,185,129,0.1)",
                color: isDark ? "#6ee7b7" : "#065f46",
                padding: "2px 8px", borderRadius: 99,
                border: `1px solid ${isDark ? "rgba(110,231,183,0.22)" : "rgba(16,185,129,0.2)"}`,
              }}>
                {filtered.length} articles
              </span>
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState query={search} onClear={() => { setSearch(""); setActiveFilter("all"); }} onCreate={handleCreate} t={t} />
          ) : effectiveView === "list" ? (
            <ArticleTable articles={filtered} onEdit={setEditingArticle} onView={setViewingArticle} onDelete={handleDelete} t={t} />
          ) : (
            isMobile ? (
              filtered.map(a => <ArticleCard key={a.id} article={a} onView={setViewingArticle} onEdit={setEditingArticle} onDelete={handleDelete} t={t} />)
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12, padding: 16 }}>
                {filtered.map(a => (
                  <div key={a.id} style={{ borderRadius: 12, border: `1px solid ${t?.border || "#e2e8f0"}` }}>
                    <ArticleCard article={a} onView={setViewingArticle} onEdit={setEditingArticle} onDelete={handleDelete} t={t} />
                  </div>
                ))}
              </div>
            )
          )}

          <Pagination filtered={filtered.length} t={t} isMobile={isMobile} />
        </div>
      </div>
    </div>
  );
}