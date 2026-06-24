import { useState, useEffect, useCallback } from "react";
import { useConversations } from "@/features/conversations/useConversations";
import { useMessages } from "@/features/conversations/useMessages";
import { useRealtimeInbox } from "@/features/conversations/useRealtimeInbox";

import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import CustomerDetailsPanel from "./CustomerDetailsPanel";

import EmptyState from "@/components/shared/EmptyState";

/**
 * InboxPage — 3-column SaaS inbox layout
 * Restyled to match Dashboard.jsx's obsidian + emerald theme system.
 *
 * Props:
 *   t : theme token object (T.dark | T.light) — passed down from Dashboard
 *
 * Desktop : [ConversationList 300px | ChatWindow flex | CustomerDetailsPanel 280px]
 * Tablet  : [ConversationList | ChatWindow] — details as overlay
 * Mobile  : single-panel stack (list → chat → details)
 */
export default function InboxPage({ t }) {
  const isDark = t?.bg === "#0a0a0a" || t?.sidebar?.includes("20,21,24");

  // ─── Responsive ───────────────────────────────────────────────────────────
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  const isMobile = windowWidth <= 640;
  const isTablet = windowWidth <= 1024 && windowWidth > 640;

  // ─── State ────────────────────────────────────────────────────────────────
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [mobileView, setMobileView] = useState("list"); // "list" | "chat" | "details"
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [activeFilter, setActiveFilter] = useState("open");
  const [searchQuery, setSearchQuery] = useState("");

  // ─── Data ─────────────────────────────────────────────────────────────────
  const { conversations, isLoading: convLoading } = useConversations({
    filter: activeFilter,
    search: searchQuery,
  });

  const { messages, isLoading: msgsLoading, sendMessage, isSending } = useMessages(activeConversationId);

  useRealtimeInbox({ activeConversationId });

  const activeConversation = conversations?.find((c) => c.id === activeConversationId);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleSelectConversation = useCallback((id) => {
    setActiveConversationId(id);
    if (isMobile) setMobileView("chat");
  }, [isMobile]);

  const handleBackToList = useCallback(() => {
    setMobileView("list");
    setActiveConversationId(null);
  }, []);

  const handleOpenDetails = useCallback(() => {
    if (isMobile) setMobileView("details");
    else setShowDetailsPanel((p) => !p);
  }, [isMobile]);

  // Auto-select first conversation on desktop
  useEffect(() => {
    if (!isMobile && !activeConversationId && conversations?.length > 0) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, isMobile, activeConversationId]);

  // ─── Mobile: single-panel ─────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", background: t.bg }}>
        {mobileView === "list" && (
          <ConversationList
            t={t}
            conversations={conversations}
            activeId={activeConversationId}
            isLoading={convLoading}
            filter={activeFilter}
            onFilterChange={setActiveFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelect={handleSelectConversation}
            isMobile
          />
        )}
        {mobileView === "chat" && (
          <ChatWindow
            t={t}
            conversation={activeConversation}
            messages={messages}
            isLoading={msgsLoading}
            isSending={isSending}
            onSendMessage={sendMessage}
            onBack={handleBackToList}
            onOpenDetails={handleOpenDetails}
            isMobile
          />
        )}
        {mobileView === "details" && (
          <CustomerDetailsPanel
            t={t}
            conversation={activeConversation}
            onBack={() => setMobileView("chat")}
            isMobile
          />
        )}
      </div>
    );
  }

  // ─── Desktop / Tablet: multi-column ──────────────────────────────────────
  return (
    <div style={{ height: "100%", display: "flex", overflow: "hidden", background: t.bg, position: "relative" }}>

      {/* Ambient glow (dark only) — matches Dashboard's background treatment */}
      {isDark && (
        <>
          <div style={{ position: "absolute", top: "-10%", right: "-5%", width: "40%", height: "40%", borderRadius: "50%", background: "rgba(16,185,129,0.04)", filter: "blur(140px)", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: "35%", height: "35%", borderRadius: "50%", background: "rgba(6,95,70,0.05)", filter: "blur(120px)", pointerEvents: "none", zIndex: 0 }} />
        </>
      )}

      {/* LEFT: Conversation List */}
      <aside style={{
        width: 300,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        borderRight: `1px solid ${t.border}`,
        background: t.surface,
        backdropFilter: isDark ? "blur(14px)" : "none",
        WebkitBackdropFilter: isDark ? "blur(14px)" : "none",
        position: "relative",
        zIndex: 1,
      }}>
        <ConversationList
          t={t}
          conversations={conversations}
          activeId={activeConversationId}
          isLoading={convLoading}
          filter={activeFilter}
          onFilterChange={setActiveFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelect={handleSelectConversation}
        />
      </aside>

      {/* CENTER: Chat Window */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: t.bg, position: "relative", zIndex: 1 }}>
        {activeConversationId ? (
          <ChatWindow
            t={t}
            conversation={activeConversation}
            messages={messages}
            isLoading={msgsLoading}
            isSending={isSending}
            onSendMessage={sendMessage}
            onOpenDetails={handleOpenDetails}
            showDetailsPanel={showDetailsPanel}
          />
        ) : (
          <EmptyState
            icon="inbox"
            title="No conversation selected"
            description="Pick a conversation from the list to get started."
          />
        )}
      </main>

      {/* RIGHT: Customer Details Panel */}
      {(!isTablet || showDetailsPanel) && (
        <aside style={{
          width: 280,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          borderLeft: `1px solid ${t.border}`,
          background: t.surface,
          backdropFilter: isDark ? "blur(14px)" : "none",
          WebkitBackdropFilter: isDark ? "blur(14px)" : "none",
          zIndex: 2,
          ...(isTablet ? {
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            boxShadow: isDark ? "-8px 0 32px rgba(0,0,0,0.5)" : "-4px 0 24px rgba(0,0,0,0.08)",
          } : {}),
        }}>
          <CustomerDetailsPanel
            t={t}
            conversation={activeConversation}
            onClose={isTablet ? () => setShowDetailsPanel(false) : undefined}
          />
        </aside>
      )}
    </div>
  );
}