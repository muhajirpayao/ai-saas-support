import { useState, useEffect, useRef } from "react";

// ════════════════════════════════════════════════════════════
//  SHARED: inline icons
// ════════════════════════════════════════════════════════════
const Icon = ({ name, className = "w-5 h-5" }) => {
  const icons = {
    dashboard: <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    inbox: <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />,
    customers: <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
    team: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
    knowledge: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />,
    analytics: <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
    settings: <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />,
    search: <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    bell: <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />,
    sun: <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />,
    moon: <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />,
    chevronDown: <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />,
    chevronLeft: <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />,
    chevronRight: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />,
    plus: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />,
    lightning: <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />,
    clock: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    check: <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />,
    chat: <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
    trending: <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
    menu: <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />,
    arrowUp: <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />,
    sparkles: <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />,
    logout: <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />,
  };
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      {icons[name]}
    </svg>
  );
};

// ════════════════════════════════════════════════════════════
//  LANDING PAGE
// ════════════════════════════════════════════════════════════

function ChatBubbleDemo() {
  const messages = [
    { from: "user", text: "My order hasn't arrived after 10 days.", delay: 0 },
    { from: "ai", text: "I'm looking into order #48291 now…", delay: 1200 },
    { from: "ai", text: "Found it. Your package was delayed at the sorting facility. A replacement has been shipped — tracking: UPS-3849201.", delay: 2600 },
    { from: "user", text: "That's great, thank you!", delay: 4000 },
    { from: "ai", text: "Resolved in 8 seconds. Anything else I can help with?", delay: 5000 },
  ];
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    const timers = messages.map((m, i) => setTimeout(() => setVisible((v) => Math.max(v, i + 1)), m.delay || i * 900));
    const reset = setTimeout(() => setVisible(0), 8500);
    return () => [...timers, reset].forEach(clearTimeout);
  }, [visible]);
  return (
    <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200 border border-slate-100 p-5 w-full max-w-sm mx-auto space-y-3">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">SupportAI · Live</span>
      </div>
      {messages.slice(0, visible).map((m, i) => (
        <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
          <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.from === "user" ? "bg-slate-100 text-slate-800 rounded-br-sm" : "bg-gradient-to-br from-blue-500 to-violet-600 text-white rounded-bl-sm"}`}>
            {m.text}
          </div>
        </div>
      ))}
      {visible < messages.length && visible > 0 && messages[visible]?.from === "ai" && (
        <div className="flex justify-start">
          <div className="bg-gradient-to-br from-blue-500 to-violet-600 px-4 py-3 rounded-2xl rounded-bl-sm">
            <div className="flex gap-1">{[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce" style={{animationDelay:`${i*150}ms`}} />)}</div>
          </div>
        </div>
      )}
      <div className="pt-2 border-t border-slate-100">
        <div className="bg-slate-50 rounded-xl px-4 py-2.5 text-sm text-slate-400">Type a message…</div>
      </div>
    </div>
  );
}

const landingFeatures = [
  { icon: "⚡", title: "Instant AI responses", desc: "GPT-4o understands customer intent in any language and replies in under a second — day or night, no queue." },
  { icon: "🧠", title: "Learns your knowledge base", desc: "Connect your docs, FAQs, and past tickets. SupportAI builds a semantic index and stays up-to-date automatically." },
  { icon: "🔁", title: "Smart escalation", desc: "When a ticket needs a human, the AI hands off with a full summary so your team never starts from scratch." },
  { icon: "📊", title: "Real-time analytics", desc: "Track CSAT, resolution rates, and deflection by category. Surface patterns before they become problems." },
  { icon: "🔌", title: "Works with your stack", desc: "Native integrations with Intercom, Zendesk, HubSpot, Slack, and 40+ tools. REST API and webhooks included." },
  { icon: "🔒", title: "Enterprise-grade security", desc: "SOC 2 Type II, GDPR-ready, SSO, and role-based permissions. Your data never trains our models." },
];

const steps = [
  { label: "Connect", title: "Plug in your knowledge base", desc: "Import from Notion, Confluence, Google Docs, or paste a URL. SupportAI indexes your content and stays in sync.", tag: "Setup · 5 min" },
  { label: "Train", title: "Review and tune responses", desc: "Use our editor to approve, edit, or block responses. The AI learns your brand voice and escalation rules.", tag: "Customization" },
  { label: "Deploy", title: "Go live on any channel", desc: "Add a widget to your site, connect your existing helpdesk, or use our API to embed SupportAI anywhere.", tag: "Launch · Same day" },
  { label: "Improve", title: "Watch CSAT climb", desc: "Analytics surface gaps in your docs and opportunities to automate more. Continuous improvement on autopilot.", tag: "Ongoing" },
];

const plans = [
  { name: "Starter", price: "49", desc: "For small teams just getting started.", features: ["500 AI resolutions/mo", "1 knowledge base", "Email & chat widget", "Basic analytics", "Community support"], cta: "Start free trial", highlight: false },
  { name: "Growth", price: "149", desc: "For growing teams that need more power.", features: ["5,000 AI resolutions/mo", "5 knowledge bases", "All channels + Slack", "Advanced analytics", "Smart escalation", "Priority support"], cta: "Start free trial", highlight: true, badge: "Most popular" },
  { name: "Enterprise", price: "499", desc: "For large teams with advanced needs.", features: ["Unlimited AI resolutions", "Unlimited knowledge bases", "All integrations + API", "Custom AI personas", "SSO + SOC 2", "Dedicated CSM"], cta: "Talk to sales", highlight: false },
];

const testimonials = [
  { quote: "SupportAI resolved 78% of our tickets in the first week. Our team finally has time to work on product.", name: "Mia Chen", role: "Head of Support · Loopify", avatar: "MC", color: "from-pink-400 to-rose-500" },
  { quote: "Setup took 40 minutes. By end of day we had a live AI agent answering questions in English, Spanish, and French.", name: "James Okafor", role: "CTO · Stackbloom", avatar: "JO", color: "from-emerald-400 to-teal-500" },
  { quote: "We cut average resolution time from 4 hours to 12 seconds. CSAT went up 18 points in the first month.", name: "Sofia Martínez", role: "VP Operations · Courier", avatar: "SM", color: "from-violet-400 to-purple-600" },
];

function LandingPage({ onSignIn }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="font-sans antialiased">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100" : "bg-transparent"}`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <span className="font-semibold text-slate-900 text-lg tracking-tight">SupportAI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["Features", "How it Works", "Pricing"].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g,"-")}`} className="text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium">{item}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onSignIn} className="hidden md:block text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors px-4 py-2 rounded-lg hover:bg-slate-100">
              Sign in
            </button>
            <button onClick={onSignIn} className="text-sm font-semibold bg-gradient-to-r from-blue-500 to-violet-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-md shadow-blue-200">
              Start free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/30 to-white pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-100/60 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-violet-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto relative">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white border border-blue-100 text-blue-600 text-xs font-semibold px-4 py-2 rounded-full shadow-sm mb-6">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                Now with GPT-4o · 8-second avg resolution
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.08] tracking-tight mb-6">
                Customer support<br />that{" "}
                <span className="bg-gradient-to-r from-blue-500 to-violet-600 bg-clip-text text-transparent">never sleeps.</span>
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
                SupportAI resolves 80% of tickets instantly — without a human. Plug in your knowledge base, go live in minutes, and let your team focus on work that actually needs them.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <button onClick={onSignIn} className="bg-gradient-to-r from-blue-500 to-violet-600 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-200/60 hover:opacity-90 transition-all text-sm">
                  Start for free →
                </button>
                <button className="bg-white border border-slate-200 text-slate-700 font-semibold px-8 py-3.5 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all text-sm shadow-sm">
                  Watch demo
                </button>
              </div>
              <p className="mt-5 text-xs text-slate-400 font-medium">No credit card required · 14-day free trial · Cancel anytime</p>
              <div className="mt-12 pt-8 border-t border-slate-100">
                <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-4">Trusted by teams at</p>
                <div className="flex flex-wrap items-center gap-6 justify-center lg:justify-start opacity-50">
                  {["Acme Co","Veritas","Beacon","Orion Labs","Drift"].map(n => <span key={n} className="text-sm font-bold text-slate-600 tracking-tight">{n}</span>)}
                </div>
              </div>
            </div>
            <div className="flex-1 flex justify-center lg:justify-end w-full">
              <div className="relative w-full max-w-sm">
                <div className="absolute -inset-4 bg-gradient-to-br from-blue-100 to-violet-100 rounded-3xl blur-2xl opacity-60" />
                <div className="relative">
                  <ChatBubbleDemo />
                  <div className="absolute -top-4 -right-6 bg-white rounded-2xl shadow-lg shadow-slate-200 border border-slate-100 px-4 py-3 text-center">
                    <div className="text-2xl font-extrabold text-slate-900 leading-none">80%</div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">Auto-resolved</div>
                  </div>
                  <div className="absolute -bottom-4 -left-6 bg-white rounded-2xl shadow-lg shadow-slate-200 border border-slate-100 px-4 py-3 text-center">
                    <div className="text-2xl font-extrabold text-slate-900 leading-none">8s</div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">Avg resolution</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Features</span>
            <h2 className="text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">Everything your support team needs</h2>
            <p className="text-slate-500 mt-4 text-lg max-w-xl mx-auto leading-relaxed">Built for modern SaaS teams who want fewer tickets, happier customers, and more time to build.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {landingFeatures.map((f, i) => (
              <div key={i} className="group bg-white border border-slate-100 rounded-2xl p-7 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-50 transition-all duration-200">
                <div className="w-11 h-11 bg-gradient-to-br from-blue-50 to-violet-50 rounded-xl flex items-center justify-center text-xl mb-5 group-hover:scale-110 transition-transform">{f.icon}</div>
                <h3 className="font-bold text-slate-900 text-base mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-28 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-violet-600 uppercase tracking-widest">How it works</span>
            <h2 className="text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">From zero to live in a day</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="relative z-10 bg-white border border-slate-100 rounded-2xl p-7 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-blue-200">{i+1}</div>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">{step.tag}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Pricing</span>
            <h2 className="text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">Simple, transparent pricing</h2>
            <p className="text-slate-500 mt-4 text-lg max-w-xl mx-auto">Every plan includes a 14-day free trial. No credit card required.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {plans.map((plan, i) => (
              <div key={i} className={`relative rounded-2xl p-8 flex flex-col ${plan.highlight ? "bg-gradient-to-b from-blue-600 to-violet-700 text-white shadow-2xl shadow-blue-300/40 scale-[1.03]" : "bg-white border border-slate-100 shadow-sm"}`}>
                {plan.badge && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white text-blue-600 text-xs font-bold px-4 py-1.5 rounded-full shadow-md border border-blue-100">{plan.badge}</div>}
                <h3 className={`font-bold text-lg mb-1.5 ${plan.highlight ? "text-white/90" : "text-slate-900"}`}>{plan.name}</h3>
                <p className={`text-sm mb-6 ${plan.highlight ? "text-blue-100" : "text-slate-500"}`}>{plan.desc}</p>
                <div className="flex items-end gap-1 mb-8">
                  <span className={`text-4xl font-extrabold ${plan.highlight ? "text-white" : "text-slate-900"}`}>${plan.price}</span>
                  <span className={`text-sm mb-1.5 ${plan.highlight ? "text-blue-200" : "text-slate-400"}`}>/ mo</span>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm">
                      <svg className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlight ? "text-blue-200" : "text-blue-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      <span className={plan.highlight ? "text-blue-50" : "text-slate-600"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={onSignIn} className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all ${plan.highlight ? "bg-white text-violet-700 hover:bg-blue-50" : "bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:opacity-90 shadow-md"}`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-28 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-violet-600 uppercase tracking-widest">Testimonials</span>
            <h2 className="text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">Teams love SupportAI</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex gap-1 mb-5">{[...Array(5)].map((_,j) => <svg key={j} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}</div>
                <blockquote className="text-slate-700 text-sm leading-relaxed mb-6">"{t.quote}"</blockquote>
                <div className="flex items-center gap-3 pt-5 border-t border-slate-100">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>{t.avatar}</div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-600 via-blue-700 to-violet-700 relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-4xl font-extrabold text-white leading-tight tracking-tight mb-5">Ready to transform your support?</h2>
          <p className="text-blue-200 text-lg mb-10 leading-relaxed">Start your free 14-day trial. No credit card, no commitment.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={onSignIn} className="bg-white text-violet-700 font-bold px-9 py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-2xl text-sm">Start for free →</button>
            <button className="border border-white/30 text-white font-semibold px-9 py-4 rounded-xl hover:bg-white/10 transition-colors text-sm">Talk to sales</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 pt-16 pb-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-12">
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center"><span className="text-white text-sm font-bold">S</span></div>
                <span className="font-semibold text-white text-lg">SupportAI</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">AI-powered customer support for modern businesses. Resolve tickets in seconds, not hours.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              {Object.entries({ Product: ["Features","Integrations","Changelog","Status"], Resources: ["Docs","Blog","Guides","Community"], Company: ["About","Careers","Press","Contact"], Legal: ["Privacy","Terms","Security","GDPR"] }).map(([s, links]) => (
                <div key={s}>
                  <h4 className="text-white text-sm font-semibold mb-4">{s}</h4>
                  <ul className="space-y-2.5">{links.map(l => <li key={l}><a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">{l}</a></li>)}</ul>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-600">© 2026 SupportAI, Inc. All rights reserved.</p>
            <p className="text-xs text-slate-600">Made with ♥ for support teams everywhere</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  DASHBOARD
// ════════════════════════════════════════════════════════════
const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "inbox", label: "Inbox", icon: "inbox", badge: 12 },
  { id: "customers", label: "Customers", icon: "customers" },
  { id: "team", label: "Team", icon: "team" },
  { id: "knowledge", label: "Knowledge Base", icon: "knowledge" },
  { id: "analytics", label: "Analytics", icon: "analytics" },
  { id: "settings", label: "Settings", icon: "settings" },
];

const conversations = [
  { id: 1, name: "Sarah Chen", avatar: "SC", color: "from-pink-400 to-rose-500", subject: "Can't access my account after password reset", time: "2m ago", status: "open", priority: "high", tag: "Auth" },
  { id: 2, name: "Marcus Webb", avatar: "MW", color: "from-blue-400 to-indigo-500", subject: "Billing shows double charge for November", time: "14m ago", status: "waiting", priority: "high", tag: "Billing" },
  { id: 3, name: "Yuna Park", avatar: "YP", color: "from-violet-400 to-purple-500", subject: "How do I export my data as CSV?", time: "1h ago", status: "ai-resolved", priority: "low", tag: "Feature" },
  { id: 4, name: "Tom Gallagher", avatar: "TG", color: "from-emerald-400 to-teal-500", subject: "Integration with Zapier keeps failing", time: "2h ago", status: "open", priority: "medium", tag: "Integration" },
  { id: 5, name: "Priya Nair", avatar: "PN", color: "from-amber-400 to-orange-500", subject: "Request for enterprise pricing details", time: "3h ago", status: "waiting", priority: "medium", tag: "Sales" },
];

const teamActivity = [
  { agent: "Alex Kim", action: "resolved 3 tickets", time: "5m ago", avatar: "AK", color: "from-blue-400 to-indigo-500" },
  { agent: "SupportAI", action: "auto-resolved 8 tickets", time: "12m ago", avatar: "AI", color: "from-violet-500 to-purple-600", isAI: true },
  { agent: "Mia Torres", action: "escalated 1 ticket to engineering", time: "28m ago", avatar: "MT", color: "from-pink-400 to-rose-500" },
  { agent: "SupportAI", action: "drafted reply for Marcus Webb", time: "31m ago", avatar: "AI", color: "from-violet-500 to-purple-600", isAI: true },
  { agent: "James Obi", action: "updated 2 knowledge base articles", time: "1h ago", avatar: "JO", color: "from-emerald-400 to-teal-500" },
];

const notificationsData = [
  { text: "Marcus Webb replied to billing ticket", time: "2m ago", unread: true },
  { text: "AI resolved 8 tickets without escalation", time: "15m ago", unread: true },
  { text: "CSAT score reached 94% this week", time: "1h ago", unread: false },
];

function AnimatedNumber({ target, duration = 1200 }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <>{value.toLocaleString()}</>;
}

function Sparkline({ data, color = "#6366f1", fill = "#6366f115" }) {
  const max = Math.max(...data), min = Math.min(...data);
  const w = 80, h = 32;
  const pts = data.map((v, i) => `${(i/(data.length-1))*w},${h-((v-min)/(max-min||1))*h}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={fill} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatCard({ label, value, change, icon, color, sparkData, dark }) {
  const isPositive = change >= 0;
  return (
    <div className={`rounded-2xl p-5 border transition-shadow hover:shadow-md ${dark ? "bg-slate-800/60 border-slate-700/60" : "bg-white border-slate-100"}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
          <Icon name={icon} className="w-[18px] h-[18px] text-white" />
        </div>
        <Sparkline data={sparkData} color={isPositive ? "#6366f1" : "#f43f5e"} fill={isPositive ? "#6366f115" : "#f43f5e15"} />
      </div>
      <div className={`text-2xl font-extrabold tracking-tight mb-0.5 ${dark ? "text-white" : "text-slate-900"}`}>
        {label === "Avg Response Time" ? <><AnimatedNumber target={value} />s</> : <AnimatedNumber target={value} />}
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium ${dark ? "text-slate-400" : "text-slate-500"}`}>{label}</span>
        <span className={`text-xs font-semibold flex items-center gap-0.5 ${isPositive ? "text-emerald-500" : "text-rose-500"}`}>
          <Icon name="arrowUp" className={`w-2.5 h-2.5 ${!isPositive ? "rotate-180" : ""}`} />
          {Math.abs(change)}%
        </span>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = { open: { label:"Open", cls:"bg-blue-100 text-blue-700" }, waiting: { label:"Waiting", cls:"bg-amber-100 text-amber-700" }, "ai-resolved": { label:"AI Resolved", cls:"bg-emerald-100 text-emerald-700" } };
  const s = map[status] || map.open;
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${s.cls}`}>{s.label}</span>;
}

function AIPerformance({ dark }) {
  const metrics = [
    { label: "Auto-resolved", value: 80, color: "from-blue-500 to-violet-600" },
    { label: "Accuracy", value: 97, color: "from-emerald-400 to-teal-500" },
    { label: "CSAT from AI", value: 91, color: "from-amber-400 to-orange-500" },
  ];
  return (
    <div className={`rounded-2xl p-5 border ${dark ? "bg-slate-800/60 border-slate-700/60" : "bg-white border-slate-100"}`}>
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center"><Icon name="sparkles" className="w-3.5 h-3.5 text-white" /></div>
        <div>
          <h3 className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-900"}`}>AI Performance</h3>
          <p className="text-[10px] text-slate-400">Last 7 days</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-emerald-500 font-semibold">Live</span>
        </div>
      </div>
      <div className="space-y-4">
        {metrics.map((m, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-xs font-medium ${dark ? "text-slate-400" : "text-slate-500"}`}>{m.label}</span>
              <span className={`text-xs font-bold ${dark ? "text-white" : "text-slate-900"}`}>{m.value}%</span>
            </div>
            <div className={`h-1.5 rounded-full ${dark ? "bg-slate-700" : "bg-slate-100"}`}>
              <div className={`h-full rounded-full bg-gradient-to-r ${m.color} transition-all duration-1000`} style={{width:`${m.value}%`}} />
            </div>
          </div>
        ))}
      </div>
      <div className={`mt-5 pt-4 border-t flex items-center justify-between ${dark ? "border-slate-700" : "border-slate-100"}`}>
        <div className="text-center"><div className={`text-lg font-extrabold ${dark?"text-white":"text-slate-900"}`}>1,284</div><div className="text-[10px] text-slate-400">Tickets handled</div></div>
        <div className="text-center"><div className={`text-lg font-extrabold ${dark?"text-white":"text-slate-900"}`}>8s</div><div className="text-[10px] text-slate-400">Avg resolution</div></div>
        <div className="text-center"><div className="text-lg font-extrabold text-emerald-500">$0.12</div><div className="text-[10px] text-slate-400">Cost per ticket</div></div>
      </div>
    </div>
  );
}

function QuickActions({ dark }) {
  const actions = [
    { label: "New ticket", icon: "plus", color: "from-blue-500 to-violet-600" },
    { label: "AI draft reply", icon: "sparkles", color: "from-violet-500 to-purple-600" },
    { label: "View inbox", icon: "inbox", color: "from-slate-600 to-slate-700" },
    { label: "Analytics", icon: "trending", color: "from-emerald-500 to-teal-600" },
  ];
  return (
    <div className={`rounded-2xl p-5 border ${dark ? "bg-slate-800/60 border-slate-700/60" : "bg-white border-slate-100"}`}>
      <h3 className={`text-sm font-semibold mb-4 ${dark ? "text-white" : "text-slate-900"}`}>Quick actions</h3>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((a, i) => (
          <button key={i} className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border transition-all hover:scale-[1.02] ${dark ? "bg-slate-700/40 border-slate-600/40 hover:bg-slate-700/60" : "bg-slate-50 border-slate-100 hover:bg-slate-100"}`}>
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${a.color} flex items-center justify-center shadow-md`}><Icon name={a.icon} className="w-4 h-4 text-white" /></div>
            <span className={`text-xs font-medium ${dark ? "text-slate-300" : "text-slate-600"}`}>{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function DashboardPage({ dark }) {
  const stats = [
    { label: "Open Tickets", value: 47, change: -12, icon: "chat", color: "from-blue-500 to-blue-600", sparkData: [30,45,38,52,48,41,47] },
    { label: "Waiting Response", value: 13, change: 8, icon: "clock", color: "from-amber-400 to-orange-500", sparkData: [8,12,10,15,11,14,13] },
    { label: "Resolved Today", value: 128, change: 23, icon: "check", color: "from-emerald-400 to-teal-500", sparkData: [80,95,88,110,105,118,128] },
    { label: "Avg Response Time", value: 8, change: -34, icon: "lightning", color: "from-violet-500 to-purple-600", sparkData: [25,20,18,14,12,10,8] },
  ];
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className={`text-xl font-bold tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>Good morning, Jamie 👋</h1>
          <p className={`text-sm mt-0.5 ${dark ? "text-slate-400" : "text-slate-500"}`}>Here's what's happening with your support queue today.</p>
        </div>
        <button className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-200/50 hover:opacity-90 transition-opacity">
          <Icon name="plus" className="w-4 h-4" />New ticket
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => <StatCard key={i} {...s} dark={dark} />)}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className={`xl:col-span-2 rounded-2xl border overflow-hidden ${dark ? "bg-slate-800/60 border-slate-700/60" : "bg-white border-slate-100"}`}>
          <div className={`px-5 py-4 border-b flex items-center justify-between ${dark ? "border-slate-700/60" : "border-slate-100"}`}>
            <div>
              <h2 className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-900"}`}>Recent conversations</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">5 conversations needing attention</p>
            </div>
            <button className="text-xs text-blue-500 font-semibold">View all →</button>
          </div>
          {conversations.map((c) => (
            <div key={c.id} className={`flex items-start gap-3.5 px-5 py-4 border-b last:border-0 cursor-pointer transition-colors ${dark ? "border-slate-700/40 hover:bg-slate-700/30" : "border-slate-50 hover:bg-slate-50/80"}`}>
              <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${c.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>{c.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-sm font-semibold truncate ${dark ? "text-white" : "text-slate-900"}`}>{c.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium border ${dark ? "border-slate-600 text-slate-400 bg-slate-700/40" : "border-slate-200 text-slate-500 bg-slate-50"}`}>{c.tag}</span>
                  {c.priority === "high" && <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wide">Urgent</span>}
                </div>
                <p className={`text-xs truncate ${dark ? "text-slate-400" : "text-slate-500"}`}>{c.subject}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="text-[10px] text-slate-400">{c.time}</span>
                <StatusBadge status={c.status} />
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-5">
          <AIPerformance dark={dark} />
          <QuickActions dark={dark} />
        </div>
      </div>
      <div className={`rounded-2xl border ${dark ? "bg-slate-800/60 border-slate-700/60" : "bg-white border-slate-100"}`}>
        <div className={`px-5 py-4 border-b ${dark ? "border-slate-700/60" : "border-slate-100"}`}>
          <h2 className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-900"}`}>Team activity</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Real-time feed</p>
        </div>
        <div className="px-5 py-2">
          {teamActivity.map((item, i) => (
            <div key={i} className={`flex items-center gap-3 py-3 border-b last:border-0 ${dark ? "border-slate-700/40" : "border-slate-50"}`}>
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-xs font-bold shrink-0 ${item.isAI ? "ring-2 ring-violet-300/40" : ""}`}>{item.avatar}</div>
              <div className="flex-1">
                <span className={`text-xs font-semibold ${dark ? "text-slate-300" : "text-slate-700"}`}>{item.agent}</span>
                <span className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}> {item.action}</span>
              </div>
              <span className="text-[11px] text-slate-400 shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Sidebar({ active, onNav, collapsed, onSignOut }) {
  return (
    <aside className={`flex flex-col h-full bg-slate-950 border-r border-slate-800/80 transition-all duration-300 ${collapsed ? "w-16" : "w-60"}`}>
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-slate-800/60 ${collapsed ? "justify-center px-2" : ""}`}>
        <div className="relative shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-900/40">
            <span className="text-white text-sm font-bold">S</span>
          </div>
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
        </div>
        {!collapsed && <div><div className="text-white font-semibold text-sm tracking-tight leading-none">SupportAI</div><div className="text-slate-500 text-[10px] font-medium mt-0.5 uppercase tracking-widest">Workspace</div></div>}
      </div>
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className={`px-3 ${collapsed ? "px-2" : ""}`}>
          {!collapsed && <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-2 mb-2">Menu</p>}
          {navItems.map(item => {
            const isActive = active === item.id;
            return (
              <button key={item.id} onClick={() => onNav(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-left transition-all group relative ${collapsed ? "justify-center px-2" : ""} ${isActive ? "bg-gradient-to-r from-blue-600/20 to-violet-600/10 text-white" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"}`}>
                {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gradient-to-b from-blue-400 to-violet-500 rounded-full" />}
                <Icon name={item.icon} className={`w-[18px] h-[18px] shrink-0 ${isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"}`} />
                {!collapsed && <><span className="text-sm font-medium flex-1">{item.label}</span>{item.badge && <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full">{item.badge}</span>}</>}
                {collapsed && item.badge && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />}
              </button>
            );
          })}
        </div>
      </nav>
      <div className={`border-t border-slate-800/60 p-3 ${collapsed ? "flex justify-center" : ""}`}>
        <div className={`flex items-center gap-2.5 w-full ${collapsed ? "justify-center" : "px-1"}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">JD</div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0"><div className="text-white text-xs font-semibold truncate">Jamie Diaz</div><div className="text-slate-500 text-[10px]">Admin</div></div>
              <button onClick={onSignOut} title="Sign out" className="p-1 text-slate-600 hover:text-slate-300 transition-colors"><Icon name="logout" className="w-4 h-4" /></button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

function Topbar({ dark, onToggleDark, onToggleSidebar, collapsed, onMobileMenu }) {
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef();
  const profileRef = useRef();
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className={`h-14 flex items-center justify-between px-4 border-b shrink-0 z-20 ${dark ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-100 text-slate-900"}`}>
      <div className="flex items-center gap-3">
        <button onClick={onMobileMenu} className={`lg:hidden p-2 rounded-lg ${dark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"} transition-colors`}><Icon name="menu" className="w-5 h-5" /></button>
        <button onClick={onToggleSidebar} className={`hidden lg:flex p-2 rounded-lg ${dark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"} transition-colors`}><Icon name={collapsed ? "chevronRight" : "chevronLeft"} className="w-4 h-4" /></button>
        <button className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium ${dark ? "border-slate-700 bg-slate-800/60 text-slate-300" : "border-slate-200 bg-slate-50 text-slate-700"}`}>
          <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-500 to-violet-600" />Acme Corp<Icon name="chevronDown" className="w-3.5 h-3.5 opacity-60" />
        </button>
        <div className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border text-sm w-64 ${dark ? "bg-slate-800/60 border-slate-700 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
          <Icon name="search" className="w-4 h-4 shrink-0" />
          <span className="flex-1 text-sm">Search conversations…</span>
          <kbd className={`text-[10px] px-1.5 py-0.5 rounded border font-mono ${dark ? "border-slate-600 bg-slate-700 text-slate-400" : "border-slate-200 bg-white text-slate-400"}`}>⌘K</kbd>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <button onClick={onToggleDark} className={`p-2 rounded-lg transition-colors ${dark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}><Icon name={dark ? "sun" : "moon"} className="w-[18px] h-[18px]" /></button>
        <div className="relative" ref={notifRef}>
          <button onClick={() => setShowNotifs(!showNotifs)} className={`relative p-2 rounded-lg transition-colors ${dark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}>
            <Icon name="bell" className="w-[18px] h-[18px]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-white" />
          </button>
          {showNotifs && (
            <div className={`absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-2xl border z-50 overflow-hidden ${dark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-100"}`}>
              <div className={`px-4 py-3 border-b flex items-center justify-between ${dark ? "border-slate-800" : "border-slate-100"}`}>
                <span className={`text-sm font-semibold ${dark?"text-white":"text-slate-900"}`}>Notifications</span>
                <span className="text-xs font-medium text-blue-500 cursor-pointer">Mark all read</span>
              </div>
              {notificationsData.map((n,i) => (
                <div key={i} className={`px-4 py-3.5 flex items-start gap-3 border-b last:border-0 cursor-pointer transition-colors ${dark ? "border-slate-800 hover:bg-slate-800/60" : "border-slate-50 hover:bg-slate-50"} ${n.unread ? dark?"bg-blue-900/10":"bg-blue-50/50" : ""}`}>
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.unread ? "bg-blue-500" : dark?"bg-slate-700":"bg-slate-200"}`} />
                  <div><p className={`text-sm ${dark?"text-slate-300":"text-slate-700"}`}>{n.text}</p><p className="text-xs text-slate-400 mt-0.5">{n.time}</p></div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="relative" ref={profileRef}>
          <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-100 transition-colors">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">JD</div>
            <Icon name="chevronDown" className="w-3.5 h-3.5 text-slate-400" />
          </button>
          {showProfile && (
            <div className={`absolute right-0 top-full mt-2 w-52 rounded-2xl shadow-2xl border z-50 overflow-hidden ${dark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-100"}`}>
              <div className={`px-4 py-3.5 border-b ${dark?"border-slate-800":"border-slate-100"}`}>
                <p className={`text-sm font-semibold ${dark?"text-white":"text-slate-900"}`}>Jamie Diaz</p>
                <p className="text-xs text-slate-400">jamie@acmecorp.com</p>
              </div>
              {["Profile","Preferences","Billing"].map(item => (
                <button key={item} className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${dark?"text-slate-300 hover:bg-slate-800":"text-slate-700 hover:bg-slate-50"}`}>{item}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function PlaceholderPage({ name, dark }) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-200/40"><Icon name="lightning" className="w-8 h-8 text-white" /></div>
        <h2 className={`text-xl font-bold mb-2 ${dark ? "text-white" : "text-slate-900"}`}>{name}</h2>
        <p className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>This section is coming soon.</p>
      </div>
    </div>
  );
}

function Dashboard({ onSignOut }) {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pageNames = { dashboard:"Dashboard", inbox:"Inbox", customers:"Customers", team:"Team", knowledge:"Knowledge Base", analytics:"Analytics", settings:"Settings" };

  return (
    <div className={`flex h-screen overflow-hidden font-sans antialiased ${dark ? "bg-slate-950" : "bg-slate-50"}`}>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="absolute left-0 top-0 h-full w-60">
            <Sidebar active={activeNav} onNav={id => { setActiveNav(id); setMobileOpen(false); }} collapsed={false} onSignOut={onSignOut} />
          </div>
        </div>
      )}
      <div className={`hidden lg:flex shrink-0 transition-all duration-300 ${collapsed ? "w-16" : "w-60"}`}>
        <Sidebar active={activeNav} onNav={setActiveNav} collapsed={collapsed} onSignOut={onSignOut} />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar dark={dark} onToggleDark={() => setDark(!dark)} onToggleSidebar={() => setCollapsed(!collapsed)} collapsed={collapsed} onMobileMenu={() => setMobileOpen(true)} />
        <div className={`px-6 py-2.5 border-b flex items-center gap-2 shrink-0 ${dark ? "border-slate-800 bg-slate-900/60" : "border-slate-100 bg-white"}`}>
          <span className="text-xs text-slate-400 font-medium">SupportAI</span>
          <Icon name="chevronRight" className="w-3 h-3 text-slate-300" />
          <span className={`text-xs font-semibold ${dark ? "text-slate-200" : "text-slate-700"}`}>{pageNames[activeNav]}</span>
        </div>
        {activeNav === "dashboard" ? <DashboardPage dark={dark} /> : <PlaceholderPage name={pageNames[activeNav]} dark={dark} />}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  ROOT — router between landing & dashboard
// ════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("landing"); // "landing" | "dashboard"
  if (page === "dashboard") return <Dashboard onSignOut={() => setPage("landing")} />;
  return <LandingPage onSignIn={() => setPage("dashboard")} />;
}