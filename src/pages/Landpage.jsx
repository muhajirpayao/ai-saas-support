import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ─── Style injection (once) ────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Base ── */
  .lp-root {
    background: #0a0a0a;
    color: #f1f0f5;
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
  }
  .lp-root a { text-decoration: none; }
  .lp-serif { font-family: 'Playfair Display', serif; }

  /* ── Utilities ── */
  .lp-glass {
    background: rgba(255,255,255,0.03);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid rgba(255,255,255,0.07);
  }
  .lp-glow-sm { box-shadow: 0 0 40px -12px rgba(16,185,129,0.3); }
  .lp-glow-lg { box-shadow: 0 0 70px -6px rgba(16,185,129,0.45); }
  .lp-emerald-badge {
    background: rgba(16,185,129,0.10);
    border: 1px solid rgba(16,185,129,0.25);
    color: #6ee7b7;
  }
  .lp-pulse { animation: lp-pulse 2s ease-in-out infinite; }
  @keyframes lp-pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
  .lp-bounce { animation: lp-bounce 1.2s ease-in-out infinite; }
  @keyframes lp-bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }

  /* ── Nav ── */
  .lp-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 32px;
    background: rgba(20,21,24,0.82);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.05);
    transition: background .3s;
  }
  .lp-nav.lp-nav-solid { background: rgba(10,10,10,0.97); }
  .lp-nav-logo {
    font-size: 13px; font-weight: 700; letter-spacing: .18em;
    color: #f1f0f5; white-space: nowrap;
  }
  .lp-nav-links { display: flex; gap: 28px; align-items: center; }
  .lp-nav-links a {
    font-size: 13px; font-weight: 500; color: rgba(161,168,188,0.8);
    transition: color .2s;
  }
  .lp-nav-links a:hover { color: #f1f0f5; }
  .lp-nav-actions { display: flex; gap: 10px; align-items: center; }
  .lp-btn-signin {
    background: none; border: none; color: rgba(161,168,188,0.85);
    font-size: 13px; font-weight: 500; cursor: pointer; padding: 8px 10px;
    transition: color .2s; white-space: nowrap;
  }
  .lp-btn-signin:hover { color: #f1f0f5; }
  .lp-btn-cta {
    background: #065f46; color: #fff; border: none;
    border-radius: 999px; padding: 9px 20px;
    font-size: 13px; font-weight: 600; cursor: pointer;
    transition: background .2s, transform .1s; white-space: nowrap;
  }
  .lp-btn-cta:hover { background: #047857; }
  .lp-btn-cta:active { transform: scale(.97); }

  /* ── Hero ── */
  .lp-hero {
    position: relative; overflow: hidden;
    padding: 140px 24px 80px; text-align: center;
  }
  .lp-hero-radial {
    position: absolute; top: -60px; left: 50%; transform: translateX(-50%);
    width: 800px; height: 500px;
    background: rgba(6,95,70,0.13);
    filter: blur(110px); border-radius: 50%;
    pointer-events: none; z-index: 0;
  }
  .lp-hero-inner {
    position: relative; z-index: 1;
    max-width: 1120px; margin: 0 auto;
  }
  .lp-pill {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 5px 14px; border-radius: 999px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(110,231,183,0.25);
    font-size: 11px; font-weight: 600; letter-spacing: .06em;
    color: #6ee7b7; margin-bottom: 22px;
  }
  .lp-pill-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #6ee7b7;
  }
  .lp-hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(36px, 5.5vw, 62px); font-weight: 700; line-height: 1.09;
    letter-spacing: -.02em; color: #f1f0f5; margin-bottom: 18px;
  }
  .lp-hero-sub {
    font-size: 17px; color: rgba(161,168,188,0.82); max-width: 520px;
    margin: 0 auto 36px; line-height: 1.65;
  }
  .lp-hero-btns {
    display: flex; justify-content: center; gap: 12px;
    flex-wrap: wrap; margin-bottom: 64px;
  }
  .lp-btn-hero-primary {
    background: #065f46; color: #fff; border: none; border-radius: 12px;
    padding: 13px 28px; font-size: 13px; font-weight: 600; cursor: pointer;
    transition: background .2s;
  }
  .lp-btn-hero-primary:hover { background: #047857; }
  .lp-btn-hero-ghost {
    background: rgba(255,255,255,0.04); color: #f1f0f5;
    border: 1px solid rgba(255,255,255,0.10); border-radius: 12px;
    padding: 13px 24px; font-size: 13px; font-weight: 600; cursor: pointer;
    display: flex; align-items: center; gap: 7px; transition: background .2s;
  }
  .lp-btn-hero-ghost:hover { background: rgba(255,255,255,0.08); }
  .lp-hero-note { font-size: 11px; color: rgba(161,168,188,0.45); margin-top: -48px; margin-bottom: 48px; }

  /* ── Hero Demo ── */
  .lp-demo-outer { position: relative; max-width: 820px; margin: 0 auto; }
  .lp-demo-floating-badges {
    display: flex; gap: 10px;
    position: absolute; top: -36px; left: 4px; z-index: 20;
  }
  .lp-demo-badge {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 14px; border-radius: 10px;
  }
  .lp-demo-badge-num { font-size: 20px; font-weight: 700; line-height: 1; }
  .lp-demo-badge-lbl { font-size: 10px; font-weight: 600; line-height: 1.35; }
  .lp-demo-card { border-radius: 24px; padding: 8px; }
  .lp-demo-screen {
    width: 100%; aspect-ratio: 16/9; border-radius: 16px; overflow: hidden;
    background: #111 url('https://lh3.googleusercontent.com/aida-public/AB6AXuABGRCDtER2PZ8xE-6StV4UnnlsJ-Ko1RQHaosjVfguLaD119YdkPAFoc09FBZATDhJ5YfjOmSXF5wD458PAGjtjU3kqn5bO-uhoRQfaQFqF6yZa0GyUnyonMRW_ZXWfThzQD44v8A8i8VpHRZbwDqoVCZWZuAIZEGYuHnUPZXOLS5PGDhrvq-jDf8eW8GMHyduwwvhzrhTdVakgbrPTxIUbiuLYCjdk3ASekZAItqV8OmL2ZUIM8ofkNRi2G8-QjmVa7nNUYuoE6E') center/cover no-repeat;
    position: relative;
  }
  .lp-demo-overlay {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0.48); backdrop-filter: blur(3px);
    display: flex; flex-direction: column; justify-content: flex-end;
    padding: 20px; gap: 10px; align-items: flex-start;
  }
  .lp-demo-bubble {
    max-width: 75%; padding: 10px 14px; border-radius: 14px;
    font-size: 13px; line-height: 1.5;
  }
  .lp-demo-bubble.user {
    background: rgba(255,255,255,0.13);
    border: 1px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.92);
    border-bottom-left-radius: 4px;
  }
  .lp-demo-bubble.ai {
    background: rgba(6,95,70,0.30);
    border: 1px solid rgba(110,231,183,0.22);
    color: #f1f0f5; border-bottom-left-radius: 4px;
  }
  .lp-demo-ai-tag {
    display: flex; align-items: center; gap: 5px; margin-bottom: 5px;
    font-size: 10px; font-weight: 600; color: #6ee7b7;
  }

  /* ── Animated chat widget (compact) ── */
  .lp-chat-widget {
    background: rgba(255,255,255,0.035);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px; padding: 16px;
    width: 100%; max-width: 300px;
  }
  .lp-chat-header {
    display: flex; align-items: center; gap: 7px;
    padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 12px; font-size: 10px; font-weight: 600;
    color: #6ee7b7; letter-spacing: .07em; text-transform: uppercase;
  }
  .lp-chat-messages { display: flex; flex-direction: column; gap: 8px; min-height: 80px; }
  .lp-chat-row-user { display: flex; justify-content: flex-end; }
  .lp-chat-row-ai   { display: flex; justify-content: flex-start; }
  .lp-chat-msg {
    max-width: 82%; padding: 8px 11px; border-radius: 12px;
    font-size: 12px; line-height: 1.45;
  }
  .lp-chat-msg.user {
    background: rgba(255,255,255,0.09);
    border: 1px solid rgba(255,255,255,0.07); color: rgba(255,255,255,0.88);
    border-bottom-right-radius: 3px;
  }
  .lp-chat-msg.ai {
    background: rgba(6,95,70,0.25);
    border: 1px solid rgba(110,231,183,0.2); color: #f1f0f5;
    border-bottom-left-radius: 3px;
  }
  .lp-typing { display: flex; gap: 3px; padding: 2px 0; }
  .lp-typing span {
    width: 5px; height: 5px; border-radius: 50%; background: #6ee7b7; opacity: .65;
  }
  .lp-chat-input-mock {
    margin-top: 12px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 8px; padding: 8px 12px;
    font-size: 11px; color: rgba(255,255,255,0.28);
  }

  /* ── Section base ── */
  .lp-section { padding: 88px 24px; }
  .lp-inner { max-width: 1120px; margin: 0 auto; }
  .lp-section-head { text-align: center; margin-bottom: 56px; }
  .lp-eyebrow {
    font-size: 10px; font-weight: 700; letter-spacing: .12em;
    text-transform: uppercase; color: #6ee7b7; margin-bottom: 10px;
  }
  .lp-section-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(26px, 3.5vw, 38px); font-weight: 700;
    color: #f1f0f5; line-height: 1.22; letter-spacing: -.01em;
  }
  .lp-section-sub { font-size: 15px; color: rgba(161,168,188,0.68); margin-top: 8px; }
  .lp-bg-alt { background: rgba(255,255,255,0.018); }

  /* ── Feature grid ── */
  .lp-feature-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  .lp-feature-card {
    padding: 28px; border-radius: 20px; transition: background .25s;
  }
  .lp-feature-card:hover { background: rgba(255,255,255,0.055); }
  .lp-feature-icon {
    width: 42px; height: 42px; border-radius: 10px;
    background: rgba(6,95,70,0.15); border: 1px solid rgba(110,231,183,0.2);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 16px; font-size: 19px;
  }
  .lp-feature-card h3 { font-size: 15px; font-weight: 600; color: #f1f0f5; margin-bottom: 8px; }
  .lp-feature-card p  { font-size: 13px; color: rgba(161,168,188,0.72); line-height: 1.6; }

  /* ── Steps grid ── */
  .lp-steps-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
  .lp-step-card { padding: 28px; border-radius: 20px; }
  .lp-step-num {
    width: 36px; height: 36px; border-radius: 50%;
    border: 1px solid rgba(110,231,183,0.4);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: #6ee7b7;
    margin-bottom: 14px; transition: background .2s, color .2s;
    flex-shrink: 0;
  }
  .lp-step-card:hover .lp-step-num { background: #6ee7b7; color: #0a0a0a; }
  .lp-step-tag {
    display: inline-block; font-size: 10px; font-weight: 600;
    color: #6ee7b7; background: rgba(16,185,129,0.1);
    border: 1px solid rgba(110,231,183,0.22);
    border-radius: 999px; padding: 3px 9px; margin-bottom: 12px;
  }
  .lp-step-card h4 { font-size: 14px; font-weight: 600; color: #f1f0f5; margin-bottom: 6px; }
  .lp-step-card p  { font-size: 13px; color: rgba(161,168,188,0.68); line-height: 1.6; }

  /* ── Pricing ── */
  .lp-pricing-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px; align-items: end;
  }
  .lp-plan { padding: 32px; border-radius: 20px; display: flex; flex-direction: column; position: relative; }
  .lp-plan.lp-plan-featured {
    border-color: rgba(110,231,183,0.38) !important;
    background: rgba(255,255,255,0.055) !important;
    transform: scale(1.035);
    box-shadow: 0 0 50px -12px rgba(16,185,129,0.3);
  }
  .lp-plan-badge {
    position: absolute; top: -13px; left: 50%; transform: translateX(-50%);
    background: #6ee7b7; color: #0a0a0a;
    font-size: 10px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase;
    padding: 3px 14px; border-radius: 999px; white-space: nowrap;
  }
  .lp-plan-name { font-size: 12px; font-weight: 600; margin-bottom: 6px; }
  .lp-plan-name.muted { color: rgba(161,168,188,0.6); }
  .lp-plan-name.accent { color: #6ee7b7; }
  .lp-plan-desc { font-size: 12px; color: rgba(161,168,188,0.6); margin-bottom: 16px; }
  .lp-plan-price {
    font-family: 'Playfair Display', serif;
    font-size: 36px; font-weight: 700; color: #f1f0f5; margin-bottom: 4px;
  }
  .lp-plan-price-per { font-family: 'Inter',sans-serif; font-size: 14px; color: rgba(161,168,188,0.5); font-weight: 400; }
  .lp-plan-features { list-style: none; margin: 20px 0 24px; flex: 1; display: flex; flex-direction: column; gap: 10px; }
  .lp-plan-features li { display: flex; align-items: flex-start; gap: 8px; font-size: 13px; color: rgba(161,168,188,0.82); }
  .lp-plan-features li.bright { color: #f1f0f5; }
  .lp-check { color: #6ee7b7; font-size: 14px; margin-top: 1px; flex-shrink: 0; }
  .lp-plan-btn {
    width: 100%; padding: 12px; border-radius: 10px;
    font-size: 13px; font-weight: 600; cursor: pointer; transition: .2s;
  }
  .lp-plan-btn.outline {
    background: transparent; color: #f1f0f5;
    border: 1px solid rgba(255,255,255,0.13);
  }
  .lp-plan-btn.outline:hover { background: rgba(255,255,255,0.07); }
  .lp-plan-btn.solid { background: #065f46; color: #fff; border: none; }
  .lp-plan-btn.solid:hover { background: #047857; }

  /* ── Testimonials ── */
  .lp-testi-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  .lp-testi-card { padding: 24px; border-radius: 20px; }
  .lp-testi-stars { display: flex; gap: 2px; margin-bottom: 14px; }
  .lp-testi-card blockquote {
    font-size: 13px; font-style: italic; color: rgba(241,240,245,0.78);
    line-height: 1.65; margin-bottom: 20px;
  }
  .lp-testi-author { display: flex; align-items: center; gap: 10px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.06); }
  .lp-testi-avatar { width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0; }
  .lp-testi-name { font-size: 13px; font-weight: 700; color: #f1f0f5; }
  .lp-testi-role { font-size: 11px; color: rgba(161,168,188,0.55); }

  /* ── CTA ── */
  .lp-cta-section { padding: 88px 24px; position: relative; overflow: hidden; text-align: center; }
  .lp-cta-glow {
    position: absolute; inset: 0; pointer-events: none;
    background: rgba(6,95,70,0.12); filter: blur(110px);
    border-radius: 50%; transform: translateY(30%);
  }
  .lp-cta-box {
    position: relative; max-width: 860px; margin: 0 auto;
    padding: 72px 40px; border-radius: 40px;
    border: 1px solid rgba(110,231,183,0.22);
    box-shadow: 0 0 70px -6px rgba(16,185,129,0.42);
  }
  .lp-cta-box h2 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(28px, 4.5vw, 50px); font-weight: 700;
    color: #f1f0f5; line-height: 1.12; margin-bottom: 14px;
  }
  .lp-cta-box p { font-size: 16px; color: rgba(161,168,188,0.72); margin-bottom: 36px; }
  .lp-cta-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

  /* ── Footer ── */
  .lp-footer {
    background: #0e0e0e; border-top: 1px solid rgba(255,255,255,0.06);
    padding: 60px 24px 28px;
  }
  .lp-footer-inner { max-width: 1120px; margin: 0 auto; }
  .lp-footer-top { display: flex; flex-wrap: wrap; gap: 40px; justify-content: space-between; margin-bottom: 40px; }
  .lp-footer-brand { max-width: 220px; }
  .lp-footer-logo { font-size: 16px; font-weight: 800; color: #f1f0f5; margin-bottom: 10px; }
  .lp-footer-desc { font-size: 13px; color: rgba(161,168,188,0.55); line-height: 1.6; }
  .lp-footer-cols { display: grid; grid-template-columns: repeat(4,1fr); gap: 28px; }
  .lp-footer-col h4 {
    font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
    color: #f1f0f5; margin-bottom: 14px;
  }
  .lp-footer-col a {
    display: block; font-size: 12px; color: rgba(161,168,188,0.52);
    margin-bottom: 8px; transition: color .2s;
  }
  .lp-footer-col a:hover { color: #6ee7b7; }
  .lp-footer-bottom {
    border-top: 1px solid rgba(255,255,255,0.05);
    padding-top: 20px; font-size: 11px; color: rgba(161,168,188,0.28);
    display: flex; flex-wrap: wrap; gap: 8px; justify-content: space-between;
  }

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    .lp-steps-grid { grid-template-columns: repeat(2, 1fr); }
    .lp-footer-cols { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 768px) {
    .lp-nav { padding: 12px 16px; }
    .lp-nav-links { display: none; }
    .lp-hero { padding: 110px 16px 60px; }
    .lp-hero h1 { font-size: clamp(30px, 8vw, 44px); }
    .lp-hero-sub { font-size: 15px; }
    .lp-demo-floating-badges { top: -30px; }
    .lp-demo-badge-num { font-size: 16px; }
    .lp-feature-grid { grid-template-columns: 1fr; }
    .lp-steps-grid { grid-template-columns: 1fr; }
    .lp-pricing-grid { grid-template-columns: 1fr; }
    .lp-plan.lp-plan-featured { transform: scale(1); }
    .lp-testi-grid { grid-template-columns: 1fr; }
    .lp-section { padding: 64px 16px; }
    .lp-cta-box { padding: 48px 20px; border-radius: 24px; }
    .lp-footer-top { flex-direction: column; }
    .lp-footer-cols { grid-template-columns: repeat(2, 1fr); }
  }
  @media (min-width: 769px) and (max-width: 1023px) {
    .lp-feature-grid { grid-template-columns: repeat(2, 1fr); }
    .lp-testi-grid { grid-template-columns: repeat(2, 1fr); }
    .lp-pricing-grid { grid-template-columns: repeat(3, 1fr); }
  }
`;

if (!document.getElementById("lp-styles")) {
  const el = document.createElement("style");
  el.id = "lp-styles";
  el.textContent = CSS;
  document.head.appendChild(el);
}

// ─── Data (unchanged) ─────────────────────────────────────────────────────
const chatDemoMessages = [
  { from: "user", text: "My order hasn't arrived after 10 days.", delay: 0 },
  { from: "ai",   text: "I'm looking into order #48291 now...", delay: 1200 },
  { from: "ai",   text: "Found it. Your package was delayed at the sorting facility. A replacement has been shipped - tracking: UPS-3849201.", delay: 2600 },
  { from: "user", text: "That's great, thank you!", delay: 4000 },
  { from: "ai",   text: "Resolved in 8 seconds. Anything else I can help with?", delay: 5000 },
];

const landingFeatures = [
  { icon: "⚡", title: "Instant AI responses", desc: "GPT-4o understands customer intent in any language and replies in under a second day or night, no queue." },
  { icon: "🧠", title: "Learns your knowledge base", desc: "Connect your docs, FAQs, and past tickets. Smart Centria builds a semantic index and stays up-to-date automatically." },
  { icon: "🔁", title: "Smart escalation", desc: "When a ticket needs a human, the AI hands off with a full summary so your team never starts from scratch." },
  { icon: "📊", title: "Real-time analytics", desc: "Track CSAT, resolution rates, and deflection by category. Surface patterns before they become problems." },
  { icon: "🔗", title: "Works with your stack", desc: "Native integrations with Intercom, Zendesk, HubSpot, Slack, and 40+ tools. REST API and webhooks included." },
  { icon: "🔒", title: "Enterprise-grade security", desc: "SOC 2 Type II, GDPR-ready, SSO, and role-based permissions. Your data never trains our models." },
];

const steps = [
  { title: "Plug in your knowledge base", desc: "Import from Notion, Confluence, Google Docs, or paste a URL. Smart Centria indexes your content and stays in sync.", tag: "Setup · 5 min" },
  { title: "Review and tune responses", desc: "Use our editor to approve, edit, or block responses. The AI learns your brand voice and escalation rules.", tag: "Customization" },
  { title: "Go live on any channel", desc: "Add a widget to your site, connect your existing helpdesk, or use our API to embed Smart Centria anywhere.", tag: "Launch · Same day" },
  { title: "Watch CSAT climb", desc: "Analytics surface gaps in your docs and opportunities to automate more. Continuous improvement on autopilot.", tag: "Ongoing" },
];

const plans = [
  { name: "Starter", price: "49",  desc: "For small teams just getting started.", features: ["500 AI resolutions/mo", "1 knowledge base", "Email & chat widget", "Basic analytics", "Community support"], cta: "Choose Plan", highlight: false },
  { name: "Growth",  price: "149", desc: "For growing teams that need more power.", features: ["5,000 AI resolutions/mo", "5 knowledge bases", "All channels + Slack", "Advanced analytics", "Smart escalation", "Priority support"], cta: "Choose Plan", highlight: true, badge: "Most popular" },
  { name: "Enterprise", price: "499", desc: "For large teams with advanced needs.", features: ["Unlimited AI resolutions", "Unlimited knowledge bases", "All integrations + API", "Custom AI personas", "SSO + SOC 2", "Dedicated CSM"], cta: "Choose Plan", highlight: false },
];

const testimonials = [
  { quote: "Smart Centria resolved 78% of our tickets in the first week. Our team finally has time to work on product.", name: "Mia Chen", role: "Head of Support · Loopify", color: "#e879a0" },
  { quote: "Setup took 40 minutes. By end of day we had a live AI agent answering questions in English, Spanish, and French.", name: "James Okafor", role: "CTO · Stackbloom", color: "#6ee7b7" },
  { quote: "We cut average resolution time from 4 hours to 12 seconds. CSAT went up 18 points in the first month.", name: "Sofia Martínez", role: "VP Operations · Courier", color: "#a78bfa" },
];

// ─── ChatBubbleDemo ────────────────────────────────────────────────────────
// FIX: useEffect with [] so the loop doesn't restart on every render.
// Uses a ref to schedule the next reset without adding visible to deps.
function ChatBubbleDemo() {
  const [visible, setVisible] = useState(0);
  const visibleRef = useRef(0);

  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  useEffect(() => {
    let timers = [];
    let resetTimer = null;

    function schedule() {
      timers = chatDemoMessages.map((m, i) =>
        setTimeout(() => setVisible(i + 1), m.delay ?? i * 900)
      );
      resetTimer = setTimeout(() => {
        setVisible(0);
        timers = [];
        // restart after a short pause
        resetTimer = setTimeout(schedule, 600);
      }, 9200);
    }

    schedule();
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(resetTimer);
    };
  }, []); // ← empty deps: runs once, self-resetting loop

  const nextIsAi = visible < chatDemoMessages.length && chatDemoMessages[visible]?.from === "ai";

  return (
    <div className="lp-chat-widget">
      <div className="lp-chat-header">
        <span className="lp-pill-dot lp-pulse" />
        Smart Centria · Live
      </div>
      <div className="lp-chat-messages">
        {chatDemoMessages.slice(0, visible).map((m, i) => (
          <div key={i} className={m.from === "user" ? "lp-chat-row-user" : "lp-chat-row-ai"}>
            <div className={`lp-chat-msg ${m.from}`}>{m.text}</div>
          </div>
        ))}
        {visible > 0 && nextIsAi && (
          <div className="lp-chat-row-ai">
            <div className="lp-chat-msg ai">
              <div className="lp-typing">
                {[0,1,2].map(i => (
                  <span key={i} className="lp-bounce" style={{ animationDelay: `${i * 140}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="lp-chat-input-mock">Type a message…</div>
    </div>
  );
}

// ─── LandingPage ──────────────────────────────────────────────────────────
function LandingPage({ onSignIn, onSignUp }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="lp-root">

      {/* ── Nav ── */}
      <nav className={`lp-nav${scrolled ? " lp-nav-solid" : ""}`}>
        <div className="lp-nav-logo">SmartCentria</div>
        
        <div className="lp-nav-links">
          {["Features", "How it Works", "Pricing"].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`}>{item}</a>
          ))}
          <a href="#">Resources</a>
          <a href="#">Contact</a>
        </div>
        <div className="lp-nav-actions">
          <button className="lp-btn-signin" onClick={onSignIn}>Sign in</button>
          <button className="lp-btn-cta" onClick={onSignUp}>Get Started</button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="lp-hero">
        <div className="lp-hero-radial" />
        <div className="lp-hero-inner">

          <div className="lp-pill">
            <span className="lp-pill-dot lp-pulse" />
            Now with GPT-v4.1
          </div>

          <h1>
            Experience the Future<br />of Productivity.
          </h1>

          <p className="lp-hero-sub">
          Smart Centria resolves 80% of tickets instantly without a human.
            Plug in your knowledge base, go live in minutes.
          </p>

          <div className="lp-hero-btns">
            <button className="lp-btn-hero-primary" onClick={onSignUp}>Start for free</button>
            <button className="lp-btn-hero-ghost">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>play_circle</span>
              Watch demo
            </button>
          </div>

          <p className="lp-hero-note">No credit card required · 14-day free trial · Cancel anytime</p>

          {/* Hero demo */}
          <div className="lp-demo-outer">
            <div className="lp-demo-floating-badges">
              <div className="lp-demo-badge lp-emerald-badge lp-glass">
                <span className="lp-demo-badge-num">80%</span>
                <span className="lp-demo-badge-lbl">Auto-<br />resolved</span>
              </div>
              <div className="lp-demo-badge lp-emerald-badge lp-glass">
                <span className="lp-demo-badge-num">8s</span>
                <span className="lp-demo-badge-lbl">Avg<br />resolution</span>
              </div>
            </div>

            <div className="lp-glass lp-demo-card lp-glow-lg">
              <div className="lp-demo-screen">
                <div className="lp-demo-overlay">
                  <div className="lp-demo-bubble user">
                    My order hasn't arrived. Can you help me track it?
                  </div>
                  <div className="lp-demo-bubble ai">
                    <div className="lp-demo-ai-tag">
                      <span className="material-symbols-outlined" style={{ fontSize: 13, color: "#6ee7b7" }}>bolt</span>
                      Smart Centria
                    </div>
                    I'm looking into order #48291. It's at the regional distribution center and scheduled for delivery tomorrow by 5 PM.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="lp-section">
        <div className="lp-inner">
          <div className="lp-section-head">
            <div className="lp-eyebrow">Features</div>
            <h2 className="lp-section-title lp-serif">Engineered for Excellence</h2>
            <p className="lp-section-sub">Powerful capabilities to automate your customer experience.</p>
          </div>
          <div className="lp-feature-grid">
            {landingFeatures.map((f, i) => (
              <div key={i} className="lp-feature-card lp-glass">
                <div className="lp-feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works ── */}
      <section id="how-it-works" className="lp-section lp-bg-alt">
        <div className="lp-inner">
          <div className="lp-section-head">
            <div className="lp-eyebrow">How it Works</div>
            <h2 className="lp-section-title lp-serif">From zero to live in a day</h2>
          </div>
          <div className="lp-steps-grid">
            {steps.map((step, i) => (
              <div key={i} className="lp-step-card lp-glass">
                <div className="lp-step-num">{i + 1}</div>
                <div className="lp-step-tag">{step.tag}</div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="lp-section">
        <div className="lp-inner">
          <div className="lp-section-head">
            <div className="lp-eyebrow">Pricing</div>
            <h2 className="lp-section-title lp-serif">Tailored for your Growth</h2>
            <p className="lp-section-sub">Transparent pricing for support teams of all sizes.</p>
          </div>
          <div className="lp-pricing-grid">
            {plans.map((plan, i) => (
              <div key={i} className={`lp-plan lp-glass${plan.highlight ? " lp-plan-featured" : ""}`}>
                {plan.badge && <div className="lp-plan-badge">{plan.badge}</div>}
                <div className={`lp-plan-name ${plan.highlight ? "accent" : "muted"}`}>{plan.name}</div>
                <div className="lp-plan-desc">{plan.desc}</div>
                <div className="lp-plan-price">
                  ${plan.price}<span className="lp-plan-price-per"> /mo</span>
                </div>
                <ul className="lp-plan-features">
                  {plan.features.map((f, j) => (
                    <li key={j} className={plan.highlight ? "bright" : ""}>
                      <span className="lp-check">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`lp-plan-btn ${plan.highlight ? "solid" : "outline"}`}
                  onClick={onSignUp}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="lp-section lp-bg-alt">
        <div className="lp-inner">
          <div className="lp-section-head">
            <div className="lp-eyebrow">Testimonials</div>
            <h2 className="lp-section-title lp-serif">Teams love Smart Centria</h2>
          </div>
          <div className="lp-testi-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="lp-testi-card lp-glass">
                <div className="lp-testi-stars">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} style={{ color: "#f59e0b", fontSize: 13 }}>★</span>
                  ))}
                </div>
                <blockquote>"{t.quote}"</blockquote>
                <div className="lp-testi-author">
                  <div className="lp-testi-avatar"
                       style={{ background: `radial-gradient(circle at 30% 30%, ${t.color}, #0a0a0a)` }} />
                  <div>
                    <div className="lp-testi-name">{t.name}</div>
                    <div className="lp-testi-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="lp-cta-section">
        <div className="lp-cta-glow" />
        <div className="lp-cta-box lp-glass">
          <h2 className="lp-serif">Ready to transform your support?</h2>
          <p>Join 1,500+ teams delivering world-class customer experiences with Smart Centria.</p>
          <div className="lp-cta-btns">
            <button className="lp-btn-hero-primary" onClick={onSignUp}>Start for free</button>
            <button className="lp-btn-hero-ghost">Talk to sales</button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-top">
            <div className="lp-footer-brand">
              <div className="lp-footer-logo">Smart Centria</div>
              <p className="lp-footer-desc">
                Precision in every interaction. Empowering support teams with intelligent automation.
              </p>
            </div>
            <div className="lp-footer-cols">
              {Object.entries({
                Product:   ["Features", "Integrations", "Changelog", "Status"],
                Resources: ["Docs", "Blog", "Guides", "Community"],
                Company:   ["About", "Careers", "Press", "Contact"],
                Legal:     ["Privacy", "Terms", "Security", "GDPR"],
              }).map(([section, links]) => (
                <div key={section} className="lp-footer-col">
                  <h4>{section}</h4>
                  {links.map(l => <a key={l} href="#">{l}</a>)}
                </div>
              ))}
            </div>
          </div>
          <div className="lp-footer-bottom">
            <span>© 2026 Smart Centria. All rights reserved.</span>
            <span>Made with love for support teams everywhere</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Default export (routing unchanged) ───────────────────────────────────
export default function Landpage() {
  const navigate = useNavigate();
  return (
    <LandingPage
      onSignIn={() => navigate("/login")}
      onSignUp={() => navigate("/signup")}
    />
  );
}