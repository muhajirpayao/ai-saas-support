/**
 * MessageList — restyled to match Dashboard's obsidian + emerald theme.
 *
 * Props:
 *   t            : theme token object
 *   messages     : Message[]
 *   conversation : Conversation
 *   typingUsers  : string[]
 */
export default function MessageList({ t, messages = [], conversation, typingUsers = [] }) {
    const isDark = t?.bg === "#0a0a0a" || t?.sidebar?.includes("20,21,24");
  
    if (messages.length === 0) {
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 160, textAlign: "center" }}>
          <p style={{ fontSize: 13, color: t.textMuted }}>No messages yet. Start the conversation!</p>
        </div>
      );
    }
  
    const grouped = groupMessages(messages);
  
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {grouped.map((group, gi) => (
          <MessageGroup key={gi} t={t} group={group} conversation={conversation} />
        ))}
  
        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: isDark ? "rgba(255,255,255,0.07)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: t.textMuted }}>
              {typingUsers[0]?.[0]?.toUpperCase()}
            </div>
            <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, borderBottomLeftRadius: 4, padding: "10px 16px", display: "flex", alignItems: "center", gap: 4 }}>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{ width: 6, height: 6, borderRadius: "50%", background: t.textMuted, display: "inline-block", animation: `db-bounce 1s ease-in-out ${i * 0.15}s infinite` }}
                />
              ))}
            </div>
            <style>{`@keyframes db-bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-4px)} }`}</style>
          </div>
        )}
      </div>
    );
  }
  
  function MessageGroup({ t, group, conversation }) {
    const isAgent = group.role === "agent" || group.role === "ai";
    const isAI = group.role === "ai";
  
    const avatarBg = isAI
      ? "linear-gradient(135deg,#10b981,#065f46)"
      : isAgent
      ? "linear-gradient(135deg,#60a5fa,#6366f1)"
      : "linear-gradient(135deg,#a78bfa,#7c3aed)";
  
    return (
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, flexDirection: isAgent ? "row-reverse" : "row" }}>
        {/* Avatar */}
        <div style={{
          width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 10, fontWeight: 700, color: "#fff", flexShrink: 0, marginBottom: 2,
          background: avatarBg,
          boxShadow: isAI ? "0 0 10px rgba(16,185,129,0.3)" : "none",
        }}>
          {isAI ? "AI" : isAgent ? "A" : (conversation?.contact_name?.[0] || "?")}
        </div>
  
        {/* Bubbles */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4, maxWidth: "72%", alignItems: isAgent ? "flex-end" : "flex-start" }}>
          {group.messages.map((msg, i) => (
            <MessageBubble key={msg.id} t={t} msg={msg} isAgent={isAgent} isAI={isAI} isLast={i === group.messages.length - 1} />
          ))}
        </div>
      </div>
    );
  }
  
  function MessageBubble({ t, msg, isAgent, isAI, isLast }) {
    const bubbleStyle = isAgent
      ? { background: "#065f46", color: "#fff", borderRadius: 16, borderBottomRightRadius: 4 }
      : { background: t.surface, color: t.text, border: `1px solid ${t.border}`, borderRadius: 16, borderBottomLeftRadius: 4 };
  
    return (
      <div>
        <div style={{ padding: "10px 16px", fontSize: 13, lineHeight: 1.6, ...bubbleStyle }}>
          {msg.content}
        </div>
        {isLast && (
          <p style={{ fontSize: 10, marginTop: 4, color: t.textMuted, textAlign: isAgent ? "right" : "left" }}>
            {formatTime(msg.created_at)}
            {isAI && <span style={{ marginLeft: 4, color: "#10b981" }}>· AI</span>}
          </p>
        )}
      </div>
    );
  }
  
  // ─── Helpers ──────────────────────────────────────────────────────────────────
  function groupMessages(messages) {
    const groups = [];
    let current = null;
    for (const msg of messages) {
      if (current && current.role === msg.role) {
        current.messages.push(msg);
      } else {
        current = { role: msg.role, messages: [msg] };
        groups.push(current);
      }
    }
    return groups;
  }
  
  function formatTime(dateStr) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }