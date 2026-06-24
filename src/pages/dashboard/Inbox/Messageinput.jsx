import { useState, useRef } from "react";

/**
 * MessageInput
 * Composer bar at the bottom of ChatWindow.
 *
 * Props:
 *   conversationId : string
 *   onSend         : (payload) => Promise<void>
 *   isSending      : boolean
 *   disabled       : boolean
 */
export default function MessageInput({ conversationId, onSend, isSending, disabled }) {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  const canSend = text.trim().length > 0 && !isSending && !disabled;

  const handleSubmit = async () => {
    if (!canSend) return;
    const content = text.trim();
    setText("");
    textareaRef.current?.focus();
    await onSend({ content, role: "agent" });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  const handleChange = (e) => {
    setText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
  };

  return (
    <div className="shrink-0 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3">
      {/* Toolbar */}
      <div className="flex items-center gap-1 mb-2">
        {[
          { label: "Attach", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /> },
          { label: "Emoji", icon: <><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" d="M8 13s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></> },
          { label: "Template", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
        ].map(({ label, icon }) => (
          <button
            key={label}
            title={label}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              {icon}
            </svg>
          </button>
        ))}
        <div className="flex-1" />
        <span className="text-[11px] text-gray-300 dark:text-gray-600">Shift+Enter for new line</span>
      </div>

      {/* Input row */}
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Write a reply…"
          className="flex-1 resize-none overflow-hidden bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-[13px] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all leading-relaxed disabled:opacity-50"
          style={{ minHeight: 40 }}
        />
        <button
          onClick={handleSubmit}
          disabled={!canSend}
          className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
            canSend
              ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-500/20"
              : "bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed"
          }`}
        >
          {isSending ? (
            <svg className="animate-spin" width="14" height="14" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}