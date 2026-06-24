// src/pages/auth/OnboardingPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Icon } from "@/components/ui/Icon";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Card } from "@/components/ui/Card";
import { Btn } from "@/components/ui/Btn";

// ── Step indicator ──────────────────────────────────────────────────────────
const STEPS = ["Organization", "Choose Plan", "AI Setup", "All Set!"];

function StepIndicator({ current }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                  ${done ? "bg-emerald-500 text-white" : active ? "bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-md shadow-blue-200" : "bg-slate-100 text-slate-400"}`}
              >
                {done ? <Icon name="check" className="w-4 h-4" /> : i + 1}
              </div>
              <span
                className={`text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap
                  ${active ? "text-blue-600" : done ? "text-emerald-500" : "text-slate-400"}`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-5 transition-colors ${done ? "bg-emerald-300" : "bg-slate-100"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Step 1: Organization ────────────────────────────────────────────────────
function StepOrg({ data, setData, onNext }) {
  const industries = [
    "SaaS / Software", "E-commerce", "Healthcare",
    "Finance", "Education", "Agency / Consulting", "Other",
  ];
  const sizes = ["1–10", "11–50", "51–200", "201–1000", "1000+"];
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleNext = async () => {
    const errs = {};
    if (!data.company?.trim()) errs.company = "Company name is required";
    if (!data.industry) errs.industry = "Select an industry";
    if (!data.size) errs.size = "Select a company size";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated — please sign in again.");

      // Create the organization row
      const { data: org, error: orgErr } = await supabase
        .from("organizations")
        .insert({ name: data.company, industry: data.industry, company_size: data.size })
        .select("id")
        .single();
      if (orgErr) throw orgErr;

      // Link the user's profile to the new org
      const { error: profErr } = await supabase
        .from("profiles")
        .update({ organization_id: org.id })
        .eq("id", user.id);
      if (profErr) throw profErr;

      setData({ ...data, orgId: org.id });
      onNext();
    } catch (err) {
      setErrors({ company: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Set up your organization</h2>
        <p className="text-sm text-slate-500 mt-1.5">Tell us about your company to personalize SupportAI.</p>
      </div>
           {/* lmk if you want to add a logo here */}
      <div className="space-y-5">
        {/* Company name */} 
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Company name</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Icon name="building" className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="MJR Corp"
              value={data.company || ""}
              onChange={e => setData({ ...data, company: e.target.value })}
              className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl outline-none transition-all
                ${errors.company ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100"}
                text-slate-900 placeholder:text-slate-400`}
            />
          </div>
          {errors.company && <p className="text-xs text-rose-500 mt-1">{errors.company}</p>}
        </div>

        {/* Industry */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Industry</label>
          <div className="grid grid-cols-2 gap-2">
            {industries.map(ind => (
              <button key={ind} type="button" onClick={() => setData({ ...data, industry: ind })}
                className={`py-2 px-3 rounded-xl border text-sm font-medium transition-all text-left
                  ${data.industry === ind ? "border-blue-400 bg-blue-50 text-blue-700" : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"}`}>
                {ind}
              </button>
            ))}
          </div>
          {errors.industry && <p className="text-xs text-rose-500 mt-1">{errors.industry}</p>}
        </div>

        {/* Company size */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Company size</label>
          <div className="flex gap-2 flex-wrap">
            {sizes.map(s => (
              <button key={s} type="button" onClick={() => setData({ ...data, size: s })}
                className={`py-2 px-4 rounded-xl border text-sm font-medium transition-all
                  ${data.size === s ? "border-blue-400 bg-blue-50 text-blue-700" : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"}`}>
                {s}
              </button>
            ))}
          </div>
          {errors.size && <p className="text-xs text-rose-500 mt-1">{errors.size}</p>}
        </div>
      </div>

      <div className="mt-8">
        <Btn onClick={handleNext} disabled={saving}>
          {saving
            ? <><Icon name="refresh" className="w-4 h-4 animate-spin" />Saving…</>
            : <>Continue <Icon name="arrowRight" className="w-4 h-4" /></>}
        </Btn>
      </div>
    </div>
  );
}

// ── Step 2: Choose Plan ─────────────────────────────────────────────────────
function StepPlan({ data, setData, onNext, onBack }) {
  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "Free",
      sub: "14-day trial",
      border: "border-slate-200",
      features: ["500 AI resolutions/mo", "1 knowledge base", "Email & chat widget", "Basic analytics"],
    },
    {
      id: "growth",
      name: "Growth",
      price: "$149",
      sub: "/ month",
      border: "border-blue-400",
      badge: "Most popular",
      features: ["5,000 AI resolutions/mo", "5 knowledge bases", "All channels + Slack", "Advanced analytics", "Smart escalation", "Priority support"],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$499",
      sub: "/ month",
      border: "border-violet-400",
      features: ["Unlimited AI resolutions", "Unlimited knowledge bases", "All integrations + API", "Custom AI personas", "SSO + SOC 2", "Dedicated CSM"],
    },
  ];

  const handleNext = async () => {
    if (!data.plan) return;
    if (data.orgId) {
      await supabase.from("organizations").update({ plan: data.plan }).eq("id", data.orgId);
    }
    onNext();
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Choose your plan</h2>
        <p className="text-sm text-slate-500 mt-1.5">All plans start with a 14-day free trial. Cancel anytime.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {plans.map(plan => (
          <button key={plan.id} type="button" onClick={() => setData({ ...data, plan: plan.id })}
            className={`relative rounded-2xl border-2 p-5 text-left transition-all
              ${data.plan === plan.id ? `${plan.border} bg-blue-50/30 shadow-md` : "border-slate-100 hover:border-slate-200"}`}>
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-violet-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                {plan.badge}
              </div>
            )}
            {data.plan === plan.id && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                <Icon name="check" className="w-3 h-3 text-white" />
              </div>
            )}
            <div className="mb-3">
              <div className="text-sm font-bold text-slate-900">{plan.name}</div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-extrabold text-slate-900">{plan.price}</span>
                <span className="text-xs text-slate-500">{plan.sub}</span>
              </div>
            </div>
            <ul className="space-y-1.5">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                  <Icon name="check" className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <Btn variant="outline" onClick={onBack} className="w-auto px-6">
          <Icon name="arrowLeft" className="w-4 h-4" />Back
        </Btn>
        <Btn onClick={handleNext} disabled={!data.plan}>
          Continue <Icon name="arrowRight" className="w-4 h-4" />
        </Btn>
      </div>
    </div>
  );
}

// ── Step 3: AI Setup ────────────────────────────────────────────────────────
function StepAI({ data, setData, onNext, onBack }) {
  const [saving, setSaving] = useState(false);
  const tones = [
    { id: "friendly",     label: "Friendly 😊",     desc: "Warm, casual, and approachable" },
    { id: "professional", label: "Professional 🤝",  desc: "Polished and business-appropriate" },
    { id: "formal",       label: "Formal 🎩",        desc: "Structured, precise, and formal" },
  ];

  const handleFinish = async () => {
    setSaving(true);
    try {
      if (data.orgId) {
        const { error } = await supabase
          .from("organizations")
          .update({
            ai_assistant_name: data.aiName || "Support Assistant",
            ai_tone: data.tone || "professional",
            ai_instructions: data.instructions || "",
          })
          .eq("id", data.orgId);
        if (error) throw error;
      }
      onNext();
    } catch (err) {
      console.error("AI setup save error:", err);
      onNext(); // proceed anyway — non-critical
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Configure your AI assistant</h2>
        <p className="text-sm text-slate-500 mt-1.5">Personalize how your AI agent talks to customers.</p>
      </div>

      <div className="space-y-6">
        {/* AI name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">AI assistant name</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Icon name="sparkles" className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="e.g. Support Assistant"
              value={data.aiName || ""}
              onChange={e => setData({ ...data, aiName: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 bg-slate-50 rounded-xl outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <p className="text-xs text-slate-400 mt-1.5">This is the name customers see in the chat widget.</p>
        </div>

        {/* Tone */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Response tone</label>
          <div className="space-y-2">
            {tones.map(t => (
              <button key={t.id} type="button" onClick={() => setData({ ...data, tone: t.id })}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left
                  ${data.tone === t.id ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-slate-50 hover:border-slate-300"}`}>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${data.tone === t.id ? "border-blue-500" : "border-slate-300"}`}>
                  {data.tone === t.id && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">{t.label}</div>
                  <div className="text-xs text-slate-500">{t.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Special instructions <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Always offer a refund for orders over $100."
            value={data.instructions || ""}
            onChange={e => setData({ ...data, instructions: e.target.value })}
            className="w-full px-4 py-2.5 text-sm border border-slate-200 bg-slate-50 rounded-xl outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-slate-900 placeholder:text-slate-400 resize-none"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <Btn variant="outline" onClick={onBack} className="w-auto px-6">
          <Icon name="arrowLeft" className="w-4 h-4" />Back
        </Btn>
        <Btn onClick={handleFinish} disabled={saving}>
          {saving
            ? <><Icon name="refresh" className="w-4 h-4 animate-spin" />Saving…</>
            : <>Finish setup <Icon name="arrowRight" className="w-4 h-4" /></>}
        </Btn>
      </div>
    </div>
  );
}

// ── Step 4: Success ─────────────────────────────────────────────────────────
function StepSuccess({ data, onDashboard }) {
  const planLabel = { starter: "Free Trial", growth: "Growth", enterprise: "Enterprise" }[data.plan] || "Growth";
  return (
    <div className="text-center py-8">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-200">
        <Icon name="checkCircle" className="w-10 h-10 text-white" />
      </div>
      <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-4 py-2 rounded-full mb-5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        {planLabel} plan activated
      </div>
      <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
        You're all set, {data.company || "there"}! 🎉
      </h2>
      <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">
        Your AI assistant{" "}
        <strong className="text-slate-700">{data.aiName || "Support Assistant"}</strong>{" "}
        is ready to start resolving customer tickets instantly.
      </p>

      <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-8">
        {[
          { icon: "lightning", label: "AI ready",    val: "Instant" },
          { icon: "chat",      label: "Resolutions", val: "80% auto" },
          { icon: "star",      label: "Avg CSAT",    val: "94%" },
        ].map((s, i) => (
          <div key={i} className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center mx-auto mb-2">
              <Icon name={s.icon} className="w-4 h-4 text-white" />
            </div>
            <div className="text-base font-extrabold text-slate-900">{s.val}</div>
            <div className="text-[10px] text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="max-w-xs mx-auto">
        <Btn onClick={onDashboard}>
          Go to Dashboard <Icon name="arrowRight" className="w-4 h-4" />
        </Btn>
      </div>
    </div>
  );
}

// ── Root onboarding wrapper ─────────────────────────────────────────────────
export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ plan: "growth", tone: "professional" });

  // Guard: redirect to login if not authenticated
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) navigate("/login");
    });
  }, [navigate]);

  const next = () => setStep(s => Math.min(s + 1, 3));
  const back = () => setStep(s => Math.max(s - 1, 0));

  return (
    <AuthLayout wide={step === 1}>
      <Card>
        <StepIndicator current={step} />
        {step === 0 && <StepOrg data={data} setData={setData} onNext={next} />}
        {step === 1 && <StepPlan data={data} setData={setData} onNext={next} onBack={back} />}
        {step === 2 && <StepAI data={data} setData={setData} onNext={next} onBack={back} />}
        {step === 3 && <StepSuccess data={data} onDashboard={() => navigate("/dashboard")} />}
      </Card>
    </AuthLayout>
  );
}