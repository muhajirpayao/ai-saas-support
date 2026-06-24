/**
 * MessageList
 * Renders the message thread with grouping by sender.
 *
 * Props:
 *   messages     : Message[]
 *   conversation : Conversation
 *   typingUsers  : string[]
 */
export default function MessageList({ messages = [], conversation, typingUsers = [] }) {
    if (messages.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-40 text-center">
          <p className="text-[13px] text-gray-400 dark:text-gray-500">No messages yet. Start the conversation!</p>
        </div>
      );
    }
  
    // Group consecutive messages from same sender
    const grouped = groupMessages(messages);
  
    return (
      <div className="flex flex-col gap-4">
        {grouped.map((group, gi) => (
          <MessageGroup key={gi} group={group} conversation={conversation} />
        ))}
  
        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-500">
              {typingUsers[0]?.[0]?.toUpperCase()}
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-bl-sm px-4 py-2.5 flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500"
                  style={{ animation: `bounce 1s ease-in-out ${i * 0.15}s infinite` }}
                />
              ))}
            </div>
            <style>{`@keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-4px)} }`}</style>
          </div>
        )}
      </div>
    );
  }
  
  function MessageGroup({ group, conversation }) {
    const isAgent = group.role === "agent" || group.role === "ai";
    const isAI    = group.role === "ai";
  
    return (
      <div className={`flex items-end gap-2 ${isAgent ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar */}
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 mb-0.5 ${
          isAI
            ? "bg-gradient-to-br from-emerald-400 to-emerald-600"
            : isAgent
            ? "bg-gradient-to-br from-indigo-400 to-indigo-600"
            : "bg-gradient-to-br from-purple-400 to-pink-500"
        }`}>
          {isAI ? "AI" : isAgent ? "A" : (conversation?.contact_name?.[0] || "?")}
        </div>
  
        {/* Bubbles */}
        <div className={`flex flex-col gap-1 max-w-[72%] ${isAgent ? "items-end" : "items-start"}`}>
          {group.messages.map((msg, i) => (
            <MessageBubble key={msg.id} msg={msg} isAgent={isAgent} isAI={isAI} isLast={i === group.messages.length - 1} />
          ))}
        </div>
      </div>
    );
  }
  
  function MessageBubble({ msg, isAgent, isAI, isLast }) {
    const bubbleClass = isAgent
      ? "bg-indigo-600 text-white rounded-2xl rounded-br-sm"
      : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-bl-sm";
  
    return (
      <div>
        <div className={`px-4 py-2.5 text-[13px] leading-relaxed ${bubbleClass}`}>
          {msg.content}
        </div>
        {isLast && (
          <p className={`text-[10px] mt-1 text-gray-400 dark:text-gray-500 ${isAgent ? "text-right" : "text-left"}`}>
            {formatTime(msg.created_at)}
            {isAI && <span className="ml-1 text-emerald-500">· AI</span>}
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