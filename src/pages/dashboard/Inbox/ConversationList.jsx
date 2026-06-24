import { useRef } from "react";
import ConversationItem from "./ConversationItem";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

/**
 * FILTER CONFIG
 * Maps filter key → label + badge color
 * Unread counts come from the conversations query.
 */
const FILTERS = [
  { key: "all",     label: "All" },
  { key: "open",    label: "Open" },
  { key: "pending", label: "Pending" },
  { key: "closed",  label: "Closed" },
];

/**
 * ConversationList
 *
 * Props:
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

  // Derive unread count per filter tab from conversation data
  const countByFilter = {
    all: conversations.length,
    open: conversations.filter((c) => c.status === "open").length,
    pending: conversations.filter((c) => c.status === "pending").length,
    closed: conversations.filter((c) => c.status === "closed").length,
  };

  const unreadTotal = conversations.filter((c) => c.unread_count > 0).length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Header ── */}
      <div className="px-4 pt-4 pb-2 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-[15px] font-semibold text-gray-900 dark:text-white tracking-tight">
            Inbox
          </h1>
          {unreadTotal > 0 && (
            <span className="text-[11px] font-semibold bg-indigo-600 text-white rounded-full px-2 py-0.5 leading-none">
              {unreadTotal}
            </span>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          </span>
          <input
            ref={searchRef}
            type="text"
            placeholder="Search conversations…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-[7px] text-[13px] bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 placeholder-gray-400 dark:placeholder-gray-500 text-gray-700 dark:text-gray-200 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex gap-1 px-4 pb-2 shrink-0 border-b border-gray-100 dark:border-gray-800">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onFilterChange(key)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all
              ${filter === key
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200"
              }
            `}
          >
            {label}
            {countByFilter[key] > 0 && (
              <span className={`
                text-[10px] font-semibold rounded-full px-1.5 leading-[16px]
                ${filter === key
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }
              `}>
                {countByFilter[key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Conversation List ── */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <LoadingSpinner size="sm" />
          </div>
        ) : conversations.length === 0 ? (
          <ConversationListEmpty filter={filter} searchQuery={searchQuery} />
        ) : (
          <ul role="list" className="divide-y divide-gray-50 dark:divide-gray-800/60">
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === activeId}
                onSelect={onSelect}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function ConversationListEmpty({ filter, searchQuery }) {
  const message = searchQuery
    ? `No results for "${searchQuery}"`
    : `No ${filter === "all" ? "" : filter} conversations`;

  return (
    <div className="flex flex-col items-center justify-center h-40 px-6 text-center">
      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </div>
      <p className="text-[13px] font-medium text-gray-600 dark:text-gray-300">{message}</p>
      <p className="text-[12px] text-gray-400 dark:text-gray-500 mt-1">
        {searchQuery ? "Try a different search term." : "New conversations will appear here."}
      </p>
    </div>
  );
}