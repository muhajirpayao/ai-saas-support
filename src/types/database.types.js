// src/types/database.js

export const Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: "",
          name: "",
          industry: null,
          company_size: null,
          plan: "",
          ai_assistant_name: null,
          ai_tone: null,
          ai_instructions: null,
          created_at: "",
        },
      },

      profiles: {
        Row: {
          id: "",
          organization_id: null,
          full_name: null,
          role: "",
          avatar_url: null,
          created_at: "",
        },
      },

      customers: {
        Row: {
          id: "",
          organization_id: "",
          name: null,
          email: null,
          external_id: null,
          metadata: {},
          created_at: "",
        },
      },

      conversations: {
        Row: {
          id: "",
          organization_id: "",
          customer_id: "",
          assigned_agent_id: null,
          subject: null,
          status: "",
          priority: "",
          tag: null,
          last_message_at: "",
          created_at: "",
        },
      },

      messages: {
        Row: {
          id: "",
          conversation_id: "",
          organization_id: "",
          sender_type: "customer",
          sender_id: null,
          content: "",
          created_at: "",
        },
      },

      subscriptions: {
        Row: {
          id: "",
          organization_id: "",
          plan: "",
          status: "",
          current_period_end: null,
          stripe_customer_id: null,
          stripe_subscription_id: null,
          created_at: "",
        },
      },
    },
  },
};