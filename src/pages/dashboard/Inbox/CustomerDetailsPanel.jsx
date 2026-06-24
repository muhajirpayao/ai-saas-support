/**
 * CustomerDetailsPanel
 * Right sidebar — shows contact info, conversation metadata, quick actions.
 *
 * Props:
 *   conversation : Conversation | undefined
 *   onBack?      : () => void   (mobile)
 *   onClose?     : () => void   (tablet overlay)
 *   isMobile?    : boolean
 */
export default function CustomerDetailsPanel({ conversation, onBack, onClose, isMobile = false }) {
    if (!conversation) {
      return (
        <div className="flex items-center justify-center h-full text-gray-400 text-[13px]">
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
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 shrink-0">
          {isMobile && onBack ? (
            <button onClick={onBack} className="p-1 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : (
            <span className="text-[13px] font-semibold text-gray-700 dark:text-gray-200">Customer details</span>
          )}
          {onClose && (
            <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {!isMobile && !onClose && (
            <span className="text-[13px] font-semibold text-gray-700 dark:text-gray-200">Customer details</span>
          )}
        </div>
  
        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
          {/* Avatar + name */}
          <div className="flex flex-col items-center text-center py-2">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-[18px] font-bold mb-2">
              {initials}
            </div>
            <p className="text-[14px] font-semibold text-gray-900 dark:text-white">{contact_name || "Unknown"}</p>
            {contact_email && <p className="text-[12px] text-gray-400 dark:text-gray-500 mt-0.5">{contact_email}</p>}
          </div>
  
          {/* Info rows */}
          <Section title="Contact info">
            <InfoRow label="Email" value={contact_email} />
            <InfoRow label="Phone" value={contact_phone || "—"} />
            <InfoRow label="Channel" value={channel} capitalize />
          </Section>
  
          <Section title="Conversation">
            <InfoRow label="Status" value={status} capitalize />
            <InfoRow label="Created" value={created_at ? new Date(created_at).toLocaleDateString() : "—"} />
          </Section>
  
          {/* Tags */}
          {tags.length > 0 && (
            <Section title="Tags">
              <div className="flex flex-wrap gap-1.5 mt-1">
                {tags.map((tag) => (
                  <span key={tag} className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
                    {tag}
                  </span>
                ))}
              </div>
            </Section>
          )}
  
          {/* Quick actions */}
          <Section title="Actions">
            <div className="space-y-1.5 mt-1">
              {[
                { label: "Assign to me", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
                { label: "Add note", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
                { label: "Close conversation", icon: "M5 13l4 4L19 7" },
              ].map(({ label, icon }) => (
                <button
                  key={label}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                >
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="text-gray-400 shrink-0">
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
  
  function Section({ title, children }) {
    return (
      <div>
        <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">{title}</p>
        {children}
      </div>
    );
  }
  
  function InfoRow({ label, value, capitalize = false }) {
    return (
      <div className="flex justify-between items-start py-1.5 border-b border-gray-50 dark:border-gray-800/60 last:border-0">
        <span className="text-[12px] text-gray-400 dark:text-gray-500">{label}</span>
        <span className={`text-[12px] font-medium text-gray-700 dark:text-gray-200 text-right max-w-[60%] truncate ${capitalize ? "capitalize" : ""}`}>
          {value || "—"}
        </span>
      </div>
    );
  }