/**
 * ChatHeader
 * Top bar of the chat window.
 *
 * Props:
 *   conversation     : Conversation
 *   onBack?          : () => void   (mobile)
 *   onOpenDetails    : () => void
 *   showDetailsPanel : boolean
 *   isMobile         : boolean
 */
export default function ChatHeader({
    conversation,
    onBack,
    onOpenDetails,
    showDetailsPanel,
    isMobile = false,
  }) {
    const { contact_name, contact_email, status, channel = "email" } = conversation;
  
    const statusLabel = { open: "Open", pending: "Pending", closed: "Closed" };
    const statusColor = {
      open:    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      closed:  "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
    };
  
    const channelIcon = {
      email: (
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      ),
      chat: (
        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      ),
    };
  
    return (
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
        {/* Back button (mobile) */}
        {isMobile && onBack && (
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
  
        {/* Channel icon */}
        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="text-indigo-500">
            {channelIcon[channel] || channelIcon.email}
          </svg>
        </div>
  
        {/* Contact info */}
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-gray-900 dark:text-white truncate">
            {contact_name || contact_email || "Unknown"}
          </p>
          {contact_name && contact_email && (
            <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">{contact_email}</p>
          )}
        </div>
  
        {/* Status badge */}
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${statusColor[status] || statusColor.open}`}>
          {statusLabel[status] || "Open"}
        </span>
  
        {/* Details toggle */}
        <button
          onClick={onOpenDetails}
          title="Customer details"
          className={`p-1.5 rounded-lg transition-colors ${
            showDetailsPanel
              ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400"
              : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300"
          }`}
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
      </div>
    );
  }