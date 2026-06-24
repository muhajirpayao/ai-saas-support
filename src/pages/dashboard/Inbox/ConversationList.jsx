import { useRef } from "react";
import ConversationItem from "./ConversationItem";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

/**
 * FILTER CONFIG
 */
const FILTERS = [
  { key: "all",     label: "All" },
  { key: "open",    label: "Open" },
  { key: "pending", label: "Pending" },
  { key: "closed",  label: "Closed" },
];

/**
 * ConversationList — restyled to match Dashboard's obsidian + emerald theme.
 *
 * Props:
 *   t              : theme token object
 *   conversations  : Conversation[]
 *   activeId       : string | null
 *   isLoading      : boolean
 *   filter         : string
 *   onFilterChange : (key: string) => void
 *   searchQuery    : string
 *   onSearchChange : (q: string) => void
 *   onSelect       : (id: string) => void
 *   isMobile?      : boolean
 */
export default function ConversationList({
  t,
  conversations = [],
  activeId,
  isLoading,
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  onSelect,
  isMobile = false,
}) {
  const searchRef = useRef(null);
  const isDark = t?.bg === "#0a0a0a" || t?.sidebar?.includes("20,21,24");

  const countByFilter = {
    all: conversations.length,
    open: conversations.filter((c) => c.status === "open").length,
    pending: conversations.filter((c) => c.status === "pending").length,
    closed: conversations.filter((c) => c.status === "closed").length,
  };

  const unreadTotal = conversations.filter((c) => c.unread_count > 0).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* ── Header ── */}
      <div style={{ padding: "16px 16px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h1 style={{ fontSize: 15, fontWeight: 700, color: t.text, letterSpacing: "-0.01em" }}>Inbox</h1>
          {unreadTotal > 0 && (
            <span style={{ fontSize: 11, fontWeight: 700, background: "rgba(16,185,129,0.15)", color: isDark ? "#6ee7b7" : "#065f46", border: isDark ? "1px solid rgba(110,231,183,0.25)" : "none", borderRadius: 99, padding: "2px 8px", lineHeight: 1.4 }}>
              {unreadTotal}
            </span>
          )}
        </div>

        {/* Search */}
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: t.textMuted, display: "flex" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
          </span>
          <input
            ref={searchRef}
            type="text"
            placeholder="Search conversations…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: "100%",
              paddingLeft: 32,
              paddingRight: 12,
              paddingTop: 7,
              paddingBottom: 7,
              fontSize: 13,
              background: t.inputBg,
              border: `1px solid ${t.inputBorder}`,
              borderRadius: 10,
              outline: "none",
              color: t.text,
              fontFamily: "inherit",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onFocus={(e) => { e.target.style.borderColor = "rgba(110,231,183,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(16,185,129,0.1)"; }}
            onBlur={(e) => { e.target.style.borderColor = t.inputBorder; e.target.style.boxShadow = "none"; }}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: t.textMuted, background: "none", border: "none", cursor: "pointer", display: "flex" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ── Filter Tabs ── */}
      <div style={{ display: "flex", gap: 4, padding: "0 16px 8px", borderBottom: `1px solid ${t.border}`, overflowX: "auto" }}>
        {FILTERS.map(({ key, label }) => {
          const active = filter === key;
          return (
            <button
              key={key}
              onClick={() => onFilterChange(key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "background 0.2s, color 0.2s",
                background: active ? "#065f46" : "transparent",
                color: active ? "#fff" : t.textSub,
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9"; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              {label}
              {countByFilter[key] > 0 && (
                <span style={{
                  fontSize: 10,
                  fontWeight: 700,
                  borderRadius: 99,
                  padding: "0 6px",
                  lineHeight: "16px",
                  background: active ? "rgba(255,255,255,0.2)" : (isDark ? "rgba(255,255,255,0.07)" : "#f1f5f9"),
                  color: active ? "#fff" : t.textMuted,
                }}>
                  {countByFilter[key]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Conversation List ── */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {isLoading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 128 }}>
            <LoadingSpinner size="sm" t={t} />
          </div>
        ) : conversations.length === 0 ? (
          <ConversationListEmpty filter={filter} searchQuery={searchQuery} t={t} />
        ) : (
          <ul style={{ listStyle: "none" }}>
            {conversations.map((conversation, i) => (
              <div key={conversation.id} style={{ borderBottom: i < conversations.length - 1 ? `1px solid ${t.borderSubtle}` : "none" }}>
                <ConversationItem
                  t={t}
                  conversation={conversation}
                  isActive={conversation.id === activeId}
                  onSelect={onSelect}
                />
              </div>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function ConversationListEmpty({ filter, searchQuery, t }) {
  const isDark = t?.bg === "#0a0a0a" || t?.sidebar?.includes("20,21,24");
  const message = searchQuery
    ? `No results for "${searchQuery}"`
    : `No ${filter === "all" ? "" : filter} conversations`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 160, padding: "0 24px", textAlign: "center" }}>
      <div style={{ width: 40, height: 40, borderRadius: "50%", background: isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: t.textMuted }}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <p style={{ fontSize: 13, fontWeight: 600, color: t.textSub }}>{message}</p>
      <p style={{ fontSize: 12, color: t.textMuted, marginTop: 4 }}>
        {searchQuery ? "Try a different search term." : "New conversations will appear here."}
      </p>
    </div>
  );
}