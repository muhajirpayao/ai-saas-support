// ─────────────────────────────────────────────────────────────────────────────
// ChatHeader.jsx
// ─────────────────────────────────────────────────────────────────────────────
import Avatar from "@/components/shared/Avatar";

const STATUS_ACTIONS = {
  open:    [{ label: "Resolve", action: "close",  class: "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950/40" },
             { label: "Pending", action: "pending", class: "text-gray-600 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-800" }],
  pending: [{ label: "Open",   action: "open",   class: "text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-950/40" },
             { label: "Resolve", action: "close", class: "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950/40" }],
  closed:  [{ label: "Reopen", action: "open",   class: "text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-950/40" }],
};

export function ChatHeader({ conversation, onBack, onOpenDetails, showDetailsPanel, isMobile }) {
  const { customer, status, assigned_agent, is_ai_handled } = conversation;
  const actions = STATUS_ACTIONS[status] ?? [];

  return (
    <div className="shrink-0 flex items-center gap-3 px-4 h-14 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
      {/* Mobile back button */}
      {isMobile && onBack && (
        <button
          onClick={onBack}
          aria-label="Back to conversations"
          className="p-1.5 -ml-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
      )}

      {/* Customer info */}
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <div className="relative shrink-0">
          <Avatar name={customer?.name ?? "?"} src={customer?.avatar_url} size="sm" />
          {customer?.is_online && (
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 border-2 border-white dark:border-gray-900 rounded-full" />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[14px] font-semibold text-gray-900 dark:text-white truncate leading-tight">
              {customer?.name ?? "Unknown"}
            </p>
            {is_ai_handled && (
              <span className="shrink-0 text-[10px] font-semibold text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 px-1.5 py-0.5 rounded leading-none">
                AI
              </span>
            )}
          </div>
          <p className="text-[12px] text-gray-400 dark:text-gray-500 truncate leading-tight">
            {customer?.email ?? customer?.company ?? ""}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Assign button */}
        <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          {assigned_agent ? (
            <>
              <Avatar name={assigned_agent.name} src={assigned_agent.avatar_url} size="xs" />
              <span className="hidden sm:inline">{assigned_agent.name.split(" ")[0]}</span>
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              <span className="hidden sm:inline">Assign</span>
            </>
          )}
        </button>

        {/* Status action buttons */}
        {actions.slice(0, isMobile ? 1 : 2).map(({ label, action, class: cls }) => (
          <button
            key={action}
            onClick={() => {/* handleStatusChange(action) */}}
            className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors ${cls}`}
          >
            {label}
          </button>
        ))}

        {/* Toggle details panel */}
        <button
          onClick={onOpenDetails}
          aria-label="Toggle customer details"
          aria-pressed={showDetailsPanel}
          className={`
            p-1.5 rounded-md transition-colors
            ${showDetailsPanel
              ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
              : "text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
            }
          `}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="7" r="4"/><path d="M1 20s2-4 11-4 11 4 11 4"/><line x1="17" y1="11" x2="21" y2="11"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MessageList.jsx
// ─────────────────────────────────────────────────────────────────────────────
import { Fragment } from "react";
import { format, isToday, isYesterday, isSameDay } from "date-fns";
import MessageBubble from "./MessageBubble";

export function MessageList({ messages, conversation, typingUsers }) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-12">
        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <p className="text-[14px] font-medium text-gray-600 dark:text-gray-300">Start of conversation</p>
        <p className="text-[13px] text-gray-400 dark:text-gray-500 mt-1">No messages yet. Say hello!</p>
      </div>
    );
  }

  // Group messages by date, then cluster consecutive same-sender messages
  const grouped = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col gap-1 pb-2">
      {grouped.map(({ dateLabel, messages: dayMsgs }) => (
        <Fragment key={dateLabel}>
          {/* Date divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
            <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 shrink-0">
              {dateLabel}
            </span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
          </div>

          {dayMsgs.map((msg, i) => {
            const prev = dayMsgs[i - 1];
            const isFirstInCluster = !prev || prev.sender_type !== msg.sender_type || prev.sender_id !== msg.sender_id;
            return (
              <MessageBubble
                key={msg.id}
                message={msg}
                isFirstInCluster={isFirstInCluster}
                customer={conversation.customer}
              />
            );
          })}
        </Fragment>
      ))}

      {/* Typing indicator */}
      {typingUsers.length > 0 && (
        <div className="flex items-center gap-2.5 px-1 py-1">
          <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
          <div className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-3 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
          </div>
          <span className="text-[11px] text-gray-400">typing…</span>
        </div>
      )}
    </div>
  );
}

function groupMessagesByDate(messages) {
  const groups = [];
  let currentDate = null;
  let currentGroup = null;

  for (const msg of messages) {
    const msgDate = new Date(msg.created_at);
    const dateLabel = isToday(msgDate)
      ? "Today"
      : isYesterday(msgDate)
      ? "Yesterday"
      : format(msgDate, "MMMM d, yyyy");

    if (dateLabel !== currentDate) {
      currentDate = dateLabel;
      currentGroup = { dateLabel, messages: [] };
      groups.push(currentGroup);
    }
    currentGroup.messages.push(msg);
  }
  return groups;
}

// ─────────────────────────────────────────────────────────────────────────────
// MessageBubble.jsx
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Message types:
 *   "customer"  — right-to-left incoming, gray bubble
 *   "agent"     — left-to-right outgoing, indigo bubble
 *   "ai"        — left-to-right, violet bubble with AI badge
 *   "system"    — centered, no bubble, muted label text
 */
export function MessageBubble({ message, isFirstInCluster, customer }) {
  const { sender_type, content, created_at, is_read, attachments = [] } = message;

  if (sender_type === "system") {
    return (
      <div className="flex items-center justify-center py-1">
        <span className="text-[11px] text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
          {content}
        </span>
      </div>
    );
  }

  const isOutgoing = sender_type === "agent" || sender_type === "ai";
  const timeStr = format(new Date(created_at), "h:mm a");

  const bubbleColors = {
    customer: "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-100",
    agent:    "bg-indigo-600 text-white",
    ai:       "bg-violet-600 text-white",
  };

  return (
    <div className={`flex items-end gap-2 ${isOutgoing ? "flex-row-reverse" : "flex-row"} ${isFirstInCluster ? "mt-3" : "mt-0.5"}`}>
      {/* Avatar — only first in cluster */}
      <div className="w-7 shrink-0">
        {isFirstInCluster && !isOutgoing && (
          <Avatar name={customer?.name ?? "?"} src={customer?.avatar_url} size="xs" />
        )}
        {isFirstInCluster && sender_type === "ai" && (
          <div className="w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-600 dark:text-violet-400" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
        )}
      </div>

      {/* Bubble + meta */}
      <div className={`flex flex-col gap-0.5 max-w-[70%] ${isOutgoing ? "items-end" : "items-start"}`}>
        {/* AI label */}
        {sender_type === "ai" && isFirstInCluster && (
          <span className="text-[10px] font-semibold text-violet-600 dark:text-violet-400 px-1">SupportAI</span>
        )}

        {/* Bubble */}
        <div className={`
          relative px-3.5 py-2 rounded-2xl text-[14px] leading-relaxed whitespace-pre-wrap break-words
          ${bubbleColors[sender_type] ?? bubbleColors.customer}
          ${isFirstInCluster
            ? isOutgoing
              ? "rounded-tr-md"
              : "rounded-tl-md"
            : ""
          }
        `}>
          {content}

          {/* File attachments */}
          {attachments.length > 0 && (
            <div className={`mt-2 flex flex-col gap-1.5 ${attachments.length > 0 && content ? "pt-2 border-t border-white/20" : ""}`}>
              {attachments.map((file, i) => (
                <a
                  key={i}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[12px] opacity-90 hover:opacity-100 transition-opacity"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  {file.name}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Time + read receipt */}
        <div className={`flex items-center gap-1.5 px-1 ${isOutgoing ? "flex-row-reverse" : ""}`}>
          <span className="text-[10px] text-gray-400 dark:text-gray-500">{timeStr}</span>
          {isOutgoing && (
            <span className="text-[10px] text-gray-400 dark:text-gray-500">
              {is_read ? "Read" : "Sent"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MessageInput.jsx
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export function MessageInput({ conversationId, onSend, isSending, disabled }) {
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef(null);
  const textareaRef = useRef(null);

  // Broadcast typing to Supabase Realtime channel
  const broadcastTyping = useCallback(() => {
    const channel = supabase.channel(`conversation:${conversationId}`);
    channel.send({ type: "broadcast", event: "typing", payload: { typing: true } });
  }, [conversationId]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed && attachments.length === 0) return;
    if (isSending || disabled) return;

    await onSend({ content: trimmed, attachments, sender_type: "agent" });
    setText("");
    setAttachments([]);
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setIsUploading(true);
    // Upload files to Supabase Storage — returns URLs
    // const uploaded = await uploadAttachments(files, conversationId);
    // setAttachments(prev => [...prev, ...uploaded]);
    setIsUploading(false);
  };

  return (
    <div className="shrink-0 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3">
      {/* Attachment previews */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {attachments.map((f, i) => (
            <div key={i} className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 text-[12px] text-gray-600 dark:text-gray-300">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
              {f.name}
              <button onClick={() => setAttachments(a => a.filter((_, j) => j !== i))} aria-label={`Remove ${f.name}`} className="ml-1 text-gray-400 hover:text-gray-600">×</button>
            </div>
          ))}
        </div>
      )}

      {/* Textarea */}
      <div className="flex items-end gap-2">
        <div className="flex-1 flex items-end gap-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-400 transition-all">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => { setText(e.target.value); broadcastTyping(); }}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Write a reply…"
            rows={1}
            className="flex-1 resize-none bg-transparent text-[14px] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none leading-relaxed max-h-32 overflow-y-auto"
            style={{ minHeight: "22px" }}
          />

          {/* Emoji button */}
          <button
            type="button"
            aria-label="Insert emoji"
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
            </svg>
          </button>

          {/* Attach file */}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            aria-label="Attach file"
            disabled={isUploading}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
          </button>
          <input ref={fileRef} type="file" multiple className="sr-only" onChange={handleFileChange} />
        </div>

        {/* Send button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={(!text.trim() && attachments.length === 0) || isSending || disabled}
          aria-label="Send message"
          className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          {isSending ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin" aria-hidden="true">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          )}
        </button>
      </div>

      {/* Keyboard shortcut hint */}
      <p className="text-[11px] text-gray-400 dark:text-gray-600 mt-1.5 text-right">
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}

// Re-export MessageBubble as default for import from own file
export default MessageBubble;