/**
 * CustomerDetailsPanel — restyled to match Dashboard's obsidian + emerald theme.
 * Right sidebar — shows contact info, conversation metadata, quick actions.
 *
 * Props:
 *   t            : theme token object
 *   conversation : Conversation | undefined
 *   onBack?      : () => void   (mobile)
 *   onClose?     : () => void   (tablet overlay)
 *   isMobile?    : boolean
 */
export default function CustomerDetailsPanel({ t, conversation, onBack, onClose, isMobile = false }) {
  const isDark = t?.bg === "#0a0a0a" || t?.sidebar?.includes("20,21,24");

  if (!conversation) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: t.textMuted, fontSize: 13 }}>
        No conversation selected
      </div>
    );
  }

  const {
    contact_name,
    contact_email,
    contact_phone,
    status,
    channel = "email",
    created_at,
    tags = [],
  } = conversation;

  const initials = contact_name
    ? contact_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${t.border}`, flexShrink: 0 }}>
        {isMobile && onBack ? (
          <button onClick={onBack} style={{ padding: 4, borderRadius: 8, color: t.textSub, background: "none", border: "none", cursor: "pointer", display: "flex" }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        ) : (
          <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>Customer details</span>
        )}
        {onClose && (
          <button onClick={onClose} style={{ padding: 4, borderRadius: 8, color: t.textMuted, background: "none", border: "none", cursor: "pointer", display: "flex" }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Avatar + name */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "8px 0" }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "linear-gradient(135deg,#10b981,#065f46)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 8,
            boxShadow: isDark ? "0 0 24px rgba(16,185,129,0.25)" : "none",
          }}>
            {initials}
          </div>
          <p style={{ fontSize: 14, fontWeight: 700, color: t.text, margin: 0 }}>{contact_name || "Unknown"}</p>
          {contact_email && <p style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>{contact_email}</p>}
        </div>

        {/* Info rows */}
        <Section title="Contact info" t={t}>
          <InfoRow label="Email" value={contact_email} t={t} />
          <InfoRow label="Phone" value={contact_phone || "—"} t={t} />
          <InfoRow label="Channel" value={channel} capitalize t={t} />
        </Section>

        <Section title="Conversation" t={t}>
          <InfoRow label="Status" value={status} capitalize t={t} />
          <InfoRow label="Created" value={created_at ? new Date(created_at).toLocaleDateString() : "—"} t={t} />
        </Section>

        {/* Tags */}
        {tags.length > 0 && (
          <Section title="Tags" t={t}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
              {tags.map((tag) => (
                <span key={tag} style={{
                  fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99,
                  background: "rgba(16,185,129,0.10)", color: "#6ee7b7",
                  border: "1px solid rgba(110,231,183,0.22)",
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Quick actions */}
        <Section title="Actions" t={t}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
            {[
              { label: "Assign to me", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
              { label: "Add note", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
              { label: "Close conversation", icon: "M5 13l4 4L19 7" },
            ].map(({ label, icon }) => (
              <button
                key={label}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 12px", borderRadius: 10, fontSize: 12, fontWeight: 600,
                  color: t.textSub, background: "none", border: "none", cursor: "pointer",
                  textAlign: "left", transition: "background 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = t.cardHover}
                onMouseLeave={(e) => e.currentTarget.style.background = "none"}
              >
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} style={{ color: t.textMuted, flexShrink: 0 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
                {label}
              </button>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, t, children }) {
  return (
    <div>
      <p style={{ fontSize: 10, fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{title}</p>
      {children}
    </div>
  );
}

function InfoRow({ label, value, capitalize = false, t }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "6px 0", borderBottom: `1px solid ${t.borderSubtle}` }}>
      <span style={{ fontSize: 12, color: t.textMuted }}>{label}</span>
      <span style={{
        fontSize: 12, fontWeight: 600, color: t.textSub, textAlign: "right",
        maxWidth: "60%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        textTransform: capitalize ? "capitalize" : "none",
      }}>
        {value || "—"}
      </span>
    </div>
  );
}