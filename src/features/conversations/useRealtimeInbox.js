import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

/**
 * useRealtimeInbox
 * Side-effect hook: marks a conversation as read when it becomes active.
 *
 * @param {{ activeConversationId: string | null }} options
 */
export function useRealtimeInbox({ activeConversationId }) {
  useEffect(() => {
    if (!activeConversationId) return;

    // Mark conversation as read (reset unread_count)
    supabase
      .from("conversations")
      .update({ unread_count: 0 })
      .eq("id", activeConversationId)
      .then(({ error }) => {
        if (error) console.error("[useRealtimeInbox] mark read:", error);
      });
  }, [activeConversationId]);
}