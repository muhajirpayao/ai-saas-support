/**
 * ChatHeader — restyled to match Dashboard's obsidian + emerald theme.
 *
 * Props:
 *   t                : theme token object
 *   conversation     : Conversation
 *   onBack?          : () => void   (mobile)
 *   onOpenDetails    : () => void
 *   showDetailsPanel : boolean
 *   isMobile         : boolean
 */
export default function ChatHeader({
    t,
    conversation,
    onBack,
    onOpenDetails,
    showDetailsPanel,
    isMobile = false,
  }) {
    const isDark = t?.bg === "#0a0a0a" || t?.sidebar?.includes("20,21,24");
    const { contact_name, contact_email, status, channel = "email" } = conversation;
  
    const statusLabel = { open: "Open", pending: "Pending", closed: "Closed" };
    const statusStyle = t.statusOpen
      ? { open: t.statusOpen, pending: t.statusWaiting, closed: t.statusResolved }
      : null;
  
    const channelIcon = {
      email: <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />,
      chat: <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
    };
  
    const badgeColors = statusStyle?.[status] || { bg: "rgba(16,185,129,0.12)", text: "#6ee7b7" };
  
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: `1px solid ${t.border}`, background: t.surface, flexShrink: 0, backdropFilter: isDark ? "blur(12px)" : "none", WebkitBackdropFilter: isDark ? "blur(12px)" : "none" }}>
        {/* Back button (mobile) */}
        {isMobile && onBack && (
          <button
            onClick={onBack}
            style={{ padding: 6, borderRadius: 10, color: t.textSub, background: "none", border: "none", cursor: "pointer", display: "flex" }}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
  
        {/* Channel icon */}
        <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(16,185,129,0.12)", border: isDark ? "1px solid rgba(110,231,183,0.2)" : "none", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} style={{ color: "#6ee7b7" }}>
            {channelIcon[channel] || channelIcon.email}
          </svg>
        </div>
  
        {/* Contact info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>
            {contact_name || contact_email || "Unknown"}
          </p>
          {contact_name && contact_email && (
            <p style={{ fontSize: 11, color: t.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>{contact_email}</p>
          )}
        </div>
  
        {/* Status badge */}
        <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 99, flexShrink: 0, background: badgeColors.bg, color: badgeColors.text }}>
          {statusLabel[status] || "Open"}
        </span>
  
        {/* Details toggle */}
        <button
          onClick={onOpenDetails}
          title="Customer details"
          style={{
            padding: 7, borderRadius: 10, border: "none", cursor: "pointer", display: "flex", transition: "background 0.2s",
            background: showDetailsPanel ? "rgba(16,185,129,0.15)" : "transparent",
            color: showDetailsPanel ? "#6ee7b7" : t.textMuted,
          }}
          onMouseEnter={(e) => { if (!showDetailsPanel) e.currentTarget.style.background = t.cardHover; }}
          onMouseLeave={(e) => { if (!showDetailsPanel) e.currentTarget.style.background = "transparent"; }}
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
      </div>
    );
  }