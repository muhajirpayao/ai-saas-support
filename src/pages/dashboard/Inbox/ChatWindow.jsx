import { useRef, useEffect, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

/**
 * ChatWindow
 *
 * Center panel of the Inbox. Renders the full conversation:
 *   - ChatHeader      : meta, assign, status actions
 *   - MessageList     : scrollable message thread
 *   - MessageInput    : composer with attachments and emoji
 *
 * Props:
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
  const [typingUsers, setTypingUsers] = useState([]); // realtime typing

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Subscribe to typing broadcast (Supabase Realtime Channel)
  // Handled by useRealtimeInbox; receives typing users via context/prop
  // For now typing state is managed locally and passed from parent

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Header ── */}
      <ChatHeader
        conversation={conversation}
        onBack={onBack}
        onOpenDetails={onOpenDetails}
        showDetailsPanel={showDetailsPanel}
        isMobile={isMobile}
      />

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-4 bg-gray-50 dark:bg-gray-950">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner size="md" />
          </div>
        ) : (
          <MessageList
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
          conversationId={conversation.id}
          onSend={onSendMessage}
          isSending={isSending}
          disabled={conversation.status === "closed"}
        />
      )}

      {/* Closed conversation notice */}
      {conversation.status === "closed" && (
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <p className="text-[13px] text-gray-500 dark:text-gray-400">
            This conversation is closed.
          </p>
          <button
            onClick={() => {/* reopen conversation handler */}}
            className="text-[13px] font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            Reopen
          </button>
        </div>
      )}
    </div>
  );
}