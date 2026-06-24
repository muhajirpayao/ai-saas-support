import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const chatDemoMessages = [
  { from:"user", text:"My order hasn't arrived after 10 days.", delay:0 },
  { from:"ai", text:"I'm looking into order #48291 now...", delay:1200 },
  { from:"ai", text:"Found it. Your package was delayed at the sorting facility. A replacement has been shipped - tracking: UPS-3849201.", delay:2600 },
  { from:"user", text:"That's great, thank you!", delay:4000 },
  { from:"ai", text:"Resolved in 8 seconds. Anything else I can help with?", delay:5000 },
];

function ChatBubbleDemo() {
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    const timers = chatDemoMessages.map((m,i) => setTimeout(()=>setVisible(v=>Math.max(v,i+1)), m.delay||i*900));
    const reset = setTimeout(()=>setVisible(0), 8500);
    return ()=>[...timers,reset].forEach(clearTimeout);
  }, [visible]);
  return (
    <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200 border border-slate-100 p-5 w-full max-w-sm mx-auto space-y-3">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">SupportAI · Live</span>
      </div>
      {chatDemoMessages.slice(0,visible).map((m,i)=>(
        <div key={i} className={`flex ${m.from==="user"?"justify-end":"justify-start"}`}>
          <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.from==="user"?"bg-slate-100 text-slate-800 rounded-br-sm":"bg-gradient-to-br from-blue-500 to-violet-600 text-white rounded-bl-sm"}`}>{m.text}</div>
        </div>
      ))}
      {visible<chatDemoMessages.length && visible>0 && chatDemoMessages[visible]?.from==="ai" && (
        <div className="flex justify-start">
          <div className="bg-gradient-to-br from-blue-500 to-violet-600 px-4 py-3 rounded-2xl rounded-bl-sm">
            <div className="flex gap-1">{[0,1,2].map(i=><div key={i} className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce" style={{animationDelay:`${i*150}ms`}} />)}</div>
          </div>
        </div>
      )}
      <div className="pt-2 border-t border-slate-100">
        <div className="bg-slate-50 rounded-xl px-4 py-2.5 text-sm text-slate-400">Type a message...</div>
      </div>
    </div>
  );
}

const landingFeatures = [
  { icon:"⚡", title:"Instant AI responses", desc:"GPT-4o understands customer intent in any language and replies in under a second day or night, no queue." },
  { icon:"🧠", title:"Learns your knowledge base", desc:"Connect your docs, FAQs, and past tickets. SupportAI builds a semantic index and stays up-to-date automatically." },
  { icon:"🔁", title:"Smart escalation", desc:"When a ticket needs a human, the AI hands off with a full summary so your team never starts from scratch." },
  { icon:"📊", title:"Real-time analytics", desc:"Track CSAT, resolution rates, and deflection by category. Surface patterns before they become problems." },
  { icon:"🔗", title:"Works with your stack", desc:"Native integrations with Intercom, Zendesk, HubSpot, Slack, and 40+ tools. REST API and webhooks included." },
  { icon:"🔒", title:"Enterprise-grade security", desc:"SOC 2 Type II, GDPR-ready, SSO, and role-based permissions. Your data never trains our models." },
];

const steps = [
  { title:"Plug in your knowledge base", desc:"Import from Notion, Confluence, Google Docs, or paste a URL. SupportAI indexes your content and stays in sync.", tag:"Setup· 5 min" },
  { title:"Review and tune responses", desc:"Use our editor to approve, edit, or block responses. The AI learns your brand voice and escalation rules.", tag:"Customization" },
  { title:"Go live on any channel", desc:"Add a widget to your site, connect your existing helpdesk, or use our API to embed SupportAI anywhere.", tag:"Launch· Same day" },
  { title:"Watch CSAT climb", desc:"Analytics surface gaps in your docs and opportunities to automate more. Continuous improvement on autopilot.", tag:"Ongoing" },
];

const plans = [
  { name:"Starter", price:"49", desc:"For small teams just getting started.", features:["500 AI resolutions/mo","1 knowledge base","Email & chat widget","Basic analytics","Community support"], cta:"Start free trial", highlight:false },
  { name:"Growth", price:"149", desc:"For growing teams that need more power.", features:["5,000 AI resolutions/mo","5 knowledge bases","All channels + Slack","Advanced analytics","Smart escalation","Priority support"], cta:"Start free trial", highlight:true, badge:"Most popular" },
  { name:"Enterprise", price:"499", desc:"For large teams with advanced needs.", features:["Unlimited AI resolutions","Unlimited knowledge bases","All integrations + API","Custom AI personas","SSO + SOC 2","Dedicated CSM"], cta:"Talk to sales", highlight:false },
];

const testimonials = [
  { quote:"SupportAI resolved 78% of our tickets in the first week. Our team finally has time to work on product.", name:"Mia Chen", role:"Head of Support · Loopify", avatar:"MC", color:"from-pink-400 to-rose-500" },
  { quote:"Setup took 40 minutes. By end of day we had a live AI agent answering questions in English, Spanish, and French.", name:"James Okafor", role:"CTO · Stackbloom", avatar:"JO", color:"from-emerald-400 to-teal-500" },
  { quote:"We cut average resolution time from 4 hours to 12 seconds. CSAT went up 18 points in the first month.", name:"Sofia Martínez", role:"VP Operations · Courier", avatar:"SM", color:"from-violet-400 to-purple-600" },
];

function LandingPage({ onSignIn, onSignUp }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="font-sans antialiased">
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled?"bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100":"bg-transparent"}`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center"><span className="text-white text-sm font-bold">S</span></div>
            <span className="font-semibold text-slate-900 text-lg tracking-tight">SupportAI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["Features","How it Works","Pricing"].map(item=>(
              <a key={item} href={`#${item.toLowerCase().replace(/ /g,"-")}`} className="text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium">{item}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onSignIn} className="hidden md:block text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors px-4 py-2 rounded-lg hover:bg-slate-100">Sign in</button>
            <button onClick={onSignUp} className="text-sm font-semibold bg-gradient-to-r from-blue-500 to-violet-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-md shadow-blue-200">Start free</button>
          </div>
        </div>
      </nav>
      <section className="min-h-screen bg-linear-to-b from-slate-50 via-blue-50/30 to-white pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-100/60 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto relative">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white border border-blue-100 text-blue-600 text-xs font-semibold px-4 py-2 rounded-full shadow-sm mb-6">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />Now with GPT-v4.1
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.08] tracking-tight mb-6">
                Experience the<br />future{" "}<span className="bg-linear-to-r from-blue-500 to-violet-600 bg-clip-text text-transparent">of Productivity.</span>
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">SupportAI resolves 80% of tickets instantly without a human. Plug in your knowledge base, go live in minutes.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <button onClick={onSignUp} className="bg-gradient-to-r from-blue-500 to-violet-600 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-200/60 hover:opacity-90 transition-all text-sm">Start for free</button>
                <button className="bg-white border border-slate-200 text-slate-700 font-semibold px-8 py-3.5 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all text-sm shadow-sm">Watch demo</button>
              </div>
              <p className="mt-5 text-xs text-slate-400 font-medium">No credit card required · 14-day free trial · Cancel anytime</p>
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
      <section id="features" className="py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Features</span>
            <h2 className="text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">Everything your support team needs</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {landingFeatures.map((f,i)=>(
              <div key={i} className="group bg-white border border-slate-100 rounded-2xl p-7 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-50 transition-all duration-200">
                <div className="w-11 h-11 bg-gradient-to-br from-blue-50 to-violet-50 rounded-xl flex items-center justify-center text-xl mb-5 group-hover:scale-110 transition-transform">{f.icon}</div>
                <h3 className="font-bold text-slate-900 text-base mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="how-it-works" className="py-28 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-violet-600 uppercase tracking-widest">How it works</span>
            <h2 className="text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">From zero to live in a day</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step,i)=>(
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-7 shadow-sm">
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
      <section id="pricing" className="py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Pricing</span>
            <h2 className="text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">Simple, transparent pricing</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {plans.map((plan,i)=>(
              <div key={i} className={`relative rounded-2xl p-8 flex flex-col ${plan.highlight?"bg-gradient-to-b from-blue-600 to-violet-700 text-white shadow-2xl shadow-blue-300/40 scale-[1.03]":"bg-white border border-slate-100 shadow-sm"}`}>
                {plan.badge && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white text-blue-600 text-xs font-bold px-4 py-1.5 rounded-full shadow-md border border-blue-100">{plan.badge}</div>}
                <h3 className={`font-bold text-lg mb-1.5 ${plan.highlight?"text-white/90":"text-slate-900"}`}>{plan.name}</h3>
                <p className={`text-sm mb-6 ${plan.highlight?"text-blue-100":"text-slate-500"}`}>{plan.desc}</p>
                <div className="flex items-end gap-1 mb-8">
                  <span className={`text-4xl font-extrabold ${plan.highlight?"text-white":"text-slate-900"}`}>${plan.price}</span>
                  <span className={`text-sm mb-1.5 ${plan.highlight?"text-blue-200":"text-slate-400"}`}>/ mo</span>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((f,j)=>(
                    <li key={j} className="flex items-start gap-2.5 text-sm">
                      <svg className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlight?"text-blue-200":"text-blue-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      <span className={plan.highlight?"text-blue-50":"text-slate-600"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={onSignUp} className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all ${plan.highlight?"bg-white text-violet-700 hover:bg-blue-50":"bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:opacity-90 shadow-md"}`}>{plan.cta}</button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-28 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-violet-600 uppercase tracking-widest">Testimonials</span>
            <h2 className="text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">Teams love SupportAI</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t,i)=>(
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex gap-1 mb-5">{[...Array(5)].map((_,j)=><svg key={j} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}</div>
                <blockquote className="text-slate-700 text-sm leading-relaxed mb-6">"{t.quote}"</blockquote>
                <div className="flex items-center gap-3 pt-5 border-t border-slate-100">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>{t.avatar}</div>
                  <div><div className="font-semibold text-slate-900 text-sm">{t.name}</div><div className="text-xs text-slate-500">{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 px-6 bg-gradient-to-br from-blue-600 via-blue-700 to-violet-700">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-white leading-tight tracking-tight mb-5">Ready to transform your support?</h2>
          <p className="text-blue-200 text-lg mb-10 leading-relaxed">Start your free 14-day trial. No credit card, no commitment.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={onSignUp} className="bg-white text-violet-700 font-bold px-9 py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-2xl text-sm">Start for free</button>
            <button className="border border-white/30 text-white font-semibold px-9 py-4 rounded-xl hover:bg-white/10 transition-colors text-sm">Talk to sales</button>
          </div>
        </div>
      </section>
      <footer className="bg-slate-900 text-slate-400 pt-16 pb-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-12">
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center"><span className="text-white text-sm font-bold">S</span></div>
                <span className="font-semibold text-white text-lg">SupportAI</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">AI-powered customer support for modern businesses.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              {Object.entries({Product:["Features","Integrations","Changelog","Status"],Resources:["Docs","Blog","Guides","Community"],Company:["About","Careers","Press","Contact"],Legal:["Privacy","Terms","Security","GDPR"]}).map(([s,links])=>(
                <div key={s}>
                  <h4 className="text-white text-sm font-semibold mb-4">{s}</h4>
                  <ul className="space-y-2.5">{links.map(l=><li key={l}><a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">{l}</a></li>)}</ul>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-600">© 2026 SupportAI, Inc. All rights reserved.</p>
            <p className="text-xs text-slate-600">Made with love for support teams everywhere</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Landpage() {
  const navigate = useNavigate();
  return (
    <LandingPage
      onSignIn={() => navigate("/login")}
      onSignUp={() => navigate("/signup")}
    />
  );
}
