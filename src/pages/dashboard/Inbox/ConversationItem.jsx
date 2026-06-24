/**
 * ConversationItem
 * Single row in the conversation list.
 *
 * Props:
 *   conversation : Conversation
 *   isActive     : boolean
 *   onSelect     : (id: string) => void
 */
export default function ConversationItem({ conversation, isActive, onSelect }) {
    const {
      id,
      contact_name,
      contact_email,
      contact_avatar_url,
      last_message,
      last_message_at,
      status,
      unread_count = 0,
      channel = "email",
    } = conversation;
  
    const initials = contact_name
      ? contact_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
      : "??";
  
    const timeLabel = last_message_at
      ? formatRelative(last_message_at)
      : "";
  
    const statusColors = {
      open:    "bg-emerald-400",
      pending: "bg-amber-400",
      closed:  "bg-gray-400",
    };
  
    return (
      <li>
        <button
          onClick={() => onSelect(id)}
          className={`
            w-full text-left px-4 py-3 flex items-start gap-3 transition-colors
            ${isActive
              ? "bg-indigo-50 dark:bg-indigo-950/40 border-l-2 border-indigo-500"
              : "hover:bg-gray-50 dark:hover:bg-gray-800/60 border-l-2 border-transparent"
            }
          `}
        >
          {/* Avatar */}
          <div className="relative shrink-0 mt-0.5">
            {contact_avatar_url ? (
              <img
                src={contact_avatar_url}
                alt={contact_name}
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-[12px] font-bold">
                {initials}
              </div>
            )}
            {/* Status dot */}
            <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-gray-900 ${statusColors[status] || "bg-gray-400"}`} />
          </div>
  
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <span className={`text-[13px] truncate ${unread_count > 0 ? "font-semibold text-gray-900 dark:text-white" : "font-medium text-gray-700 dark:text-gray-200"}`}>
                {contact_name || contact_email || "Unknown"}
              </span>
              <span className="text-[11px] text-gray-400 dark:text-gray-500 shrink-0">{timeLabel}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <p className={`text-[12px] truncate ${unread_count > 0 ? "text-gray-700 dark:text-gray-300" : "text-gray-400 dark:text-gray-500"}`}>
                {last_message || "No messages yet"}
              </p>
              {unread_count > 0 && (
                <span className="shrink-0 text-[10px] font-bold bg-indigo-600 text-white rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {unread_count > 9 ? "9+" : unread_count}
                </span>
              )}
            </div>
          </div>
        </button>
      </li>
    );
  }
  
  function formatRelative(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
  
    if (diffMin < 1) return "now";
    if (diffMin < 60) return `${diffMin}m`;
    if (diffHr < 24) return `${diffHr}h`;
    if (diffDay < 7) return `${diffDay}d`;
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }