import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

/**
 * useConversations
 * Fetches conversations for the current org/user from Supabase.
 *
 * Supabase table: conversations
 *   id, contact_name, contact_email, contact_phone, contact_avatar_url,
 *   status (open | pending | closed), channel (email | chat),
 *   last_message, last_message_at, unread_count, tags (text[]),
 *   created_at, updated_at, assigned_to (uuid), org_id (uuid)
 *
 * @param {{ filter: string, search: string }} options
 */
export function useConversations({ filter = "all", search = "" } = {}) {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      setIsLoading(true);
      setError(null);

      try {
        let query = supabase
          .from("conversations")
          .select("*")
          .order("last_message_at", { ascending: false });

        // Status filter
        if (filter !== "all") {
          query = query.eq("status", filter);
        }

        // Full-text search on contact name/email/last message
        if (search.trim()) {
          query = query.or(
            `contact_name.ilike.%${search}%,contact_email.ilike.%${search}%,last_message.ilike.%${search}%`
          );
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        if (!cancelled) setConversations(data || []);
      } catch (err) {
        if (!cancelled) setError(err);
        console.error("[useConversations]", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetch();
    return () => { cancelled = true; };
  }, [filter, search]);

  // Realtime: subscribe to INSERT/UPDATE/DELETE on conversations table
  useEffect(() => {
    const channel = supabase
      .channel("conversations-list")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "conversations" },
        (payload) => {
          setConversations((prev) => {
            if (payload.eventType === "INSERT") {
              return [payload.new, ...prev];
            }
            if (payload.eventType === "UPDATE") {
              return prev
                .map((c) => (c.id === payload.new.id ? payload.new : c))
                .sort((a, b) => new Date(b.last_message_at) - new Date(a.last_message_at));
            }
            if (payload.eventType === "DELETE") {
              return prev.filter((c) => c.id !== payload.old.id);
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { conversations, isLoading, error };
}