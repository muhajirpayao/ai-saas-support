import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

/**
 * useMessages
 * Fetches messages for a conversation and provides sendMessage.
 *
 * Supabase table: messages
 *   id, conversation_id (uuid), role (agent | customer | ai),
 *   content (text), created_at, sender_id (uuid, nullable)
 *
 * @param {string | null} conversationId
 */
export function useMessages(conversationId) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  // Fetch initial messages when conversation changes
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .then(({ data, error: fetchError }) => {
        if (cancelled) return;
        if (fetchError) { setError(fetchError); console.error("[useMessages]", fetchError); }
        else setMessages(data || []);
        setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [conversationId]);

  // Realtime: subscribe to new messages in this conversation
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => {
            // Avoid duplicates (optimistic update may already be there)
            if (prev.some((m) => m.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversationId]);

  // Send a message
  const sendMessage = useCallback(
    async ({ content, role = "agent" }) => {
      if (!conversationId || !content.trim()) return;

      // Optimistic insert
      const optimistic = {
        id: `opt-${Date.now()}`,
        conversation_id: conversationId,
        role,
        content,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimistic]);
      setIsSending(true);

      try {
        const { data, error: sendError } = await supabase
          .from("messages")
          .insert({ conversation_id: conversationId, role, content })
          .select()
          .single();

        if (sendError) throw sendError;

        // Replace optimistic with real
        setMessages((prev) =>
          prev.map((m) => (m.id === optimistic.id ? data : m))
        );

        // Update last_message + last_message_at on conversation
        await supabase
          .from("conversations")
          .update({
            last_message: content,
            last_message_at: data.created_at,
            // Reset unread for agent replies
            unread_count: 0,
          })
          .eq("id", conversationId);
      } catch (err) {
        // Roll back optimistic on failure
        setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
        console.error("[sendMessage]", err);
      } finally {
        setIsSending(false);
      }
    },
    [conversationId]
  );

  return { messages, isLoading, isSending, sendMessage, error };
}