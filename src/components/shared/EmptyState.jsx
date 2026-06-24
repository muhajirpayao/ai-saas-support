/**
 * EmptyState
 * Props: icon, title, description
 */
const ICONS = {
    inbox: (
      <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    ),
    chat: (
      <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    ),
  };
  
  export default function EmptyState({ icon = "inbox", title, description }) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="text-gray-400">
            {ICONS[icon] || ICONS.inbox}
          </svg>
        </div>
        {title && <p className="text-[14px] font-semibold text-gray-700 dark:text-gray-200 mb-1">{title}</p>}
        {description && <p className="text-[13px] text-gray-400 dark:text-gray-500 max-w-xs">{description}</p>}
      </div>
    );
  }