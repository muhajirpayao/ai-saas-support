import { useRef, useEffect, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

/**
 * ChatWindow — restyled to match Dashboard's obsidian + emerald theme.
 *
 * Props:
 *   t                 : theme token object
 *   conversation      : Conversation | undefined
 *   messages          : Message[]
 *   isLoading         : boolean
 *   isSending         : boolean
 *   onSendMessage     : (payload: SendMessagePayload) => Promise<void>
 *   onBack?           : () => void        (mobile only)
 *   onOpenDetails     : () => void
 *   showDetailsPanel? : boolean           (desktop toggle state)
 *   isMobile?         : boolean
 */
export default function ChatWindow({
  t,
  conversation,
  messages = [],
  isLoading,
  isSending,
  onSendMessage,
  onBack,
  onOpenDetails,
  showDetailsPanel,
  isMobile = false,
}) {
  const bottomRef = useRef(null);
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (!conversation) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LoadingSpinner size="md" t={t} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* ── Header ── */}
      <ChatHeader
        t={t}
        conversation={conversation}
        onBack={onBack}
        onOpenDetails={onOpenDetails}
        showDetailsPanel={showDetailsPanel}
        isMobile={isMobile}
      />

      {/* ── Messages ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px", background: t.bg }}>
        {isLoading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <LoadingSpinner size="md" t={t} />
          </div>
        ) : (
          <MessageList
            t={t}
            messages={messages}
            conversation={conversation}
            typingUsers={typingUsers}
          />
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Composer ── */}
      {conversation.status !== "closed" && (
        <MessageInput
          t={t}
          conversationId={conversation.id}
          onSend={onSendMessage}
          isSending={isSending}
          disabled={conversation.status === "closed"}
        />
      )}

      {/* Closed conversation notice */}
      {conversation.status === "closed" && (
        <div style={{ padding: "12px 24px", background: t.surfaceAlt, borderTop: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: 13, color: t.textSub, margin: 0 }}>
            This conversation is closed.
          </p>
          <button
            onClick={() => {/* reopen conversation handler */}}
            style={{ fontSize: 13, fontWeight: 600, color: "#6ee7b7", background: "none", border: "none", cursor: "pointer" }}
          >
            Reopen
          </button>
        </div>
      )}
    </div>
  );
}