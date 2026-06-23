// src/pages/AuthFlow.jsx
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { signIn, signUp } from "@/features/auth/authApi";

// ── Icons ──────────────────────────────────────────────────────────────────
const Icon = ({ name, className = "w-5 h-5" }) => {
  const paths = {
    eye: <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />,
    eyeOff: <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />,
    mail: <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
    lock: <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
    user: <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
    building: <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
    check: <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />,
    checkCircle: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
    sparkles: <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />,
    arrowRight: <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />,
    arrowLeft: <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />,
    lightning: <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />,
    creditCard: <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />,
    star: <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />,
    shield: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    chat: <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
    refresh: <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />,
  };
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      {paths[name]}
    </svg>
  );
};

// Google G logo
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

// ── Shared Layout ──────────────────────────────────────────────────────────
function AuthLayout({ children, wide = false }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-violet-50/20 flex flex-col">
      <nav className="h-16 flex items-center px-8 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-md shadow-blue-200">
            <span className="text-white text-sm font-bold">S</span>
          </div>
          <span className="font-semibold text-slate-900 text-lg tracking-tight">SupportAI</span>
        </div>
      </nav>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className={`w-full ${wide ? "max-w-4xl" : "max-w-md"}`}>{children}</div>
      </div>
    </div>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 ${className}`}>
      {children}
    </div>
  );
}

function Input({ label, type = "text", placeholder, value, onChange, icon, rightEl, error }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon name={icon} className="w-4 h-4" />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full ${icon ? "pl-10" : "pl-4"} ${rightEl ? "pr-10" : "pr-4"} py-2.5 text-sm border rounded-xl outline-none transition-all
            ${error ? "border-rose-300 bg-rose-50 focus:ring-2 focus:ring-rose-200" : "border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100"}
            text-slate-900 placeholder:text-slate-400`}
        />
        {rightEl && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</div>}
      </div>
      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", disabled, className = "", type = "button" }) {
  const base = "w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow-md shadow-blue-200/60 hover:opacity-90 active:scale-[0.98]",
    outline: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98]",
    ghost: "text-slate-600 hover:bg-slate-100 active:scale-[0.98]",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

// ── LOGIN PAGE ─────────────────────────────────────────────────────────────
function LoginPage({ onSignup, onForgot, onSuccess, onNeedsOnboarding }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleLogin = async () => {
    const errs = {};
    if (!email) errs.email = "Email is required";
    if (!password) errs.password = "Password is required";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setErrors({});
    try {
      const { user } = await signIn(email, password);

      // Check if this user has already completed onboarding (has an organization)
      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();

      if (profile?.organization_id) {
        // Has an org → go straight to dashboard
        onSuccess();
      } else {
        // No org yet → send to onboarding
        onNeedsOnboarding();
      }
    } catch (err) {
      const msg = err.message || "";
      if (msg.toLowerCase().includes("invalid login credentials")) {
        setErrors({ password: "Wrong email or password. Please try again." });
      } else if (msg.toLowerCase().includes("email not confirmed")) {
        setErrors({ email: "Please confirm your email address before signing in." });
      } else {
        setErrors({ password: msg || "Something went wrong. Try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card>
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <Icon name="sparkles" className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
          <p className="text-sm text-slate-500 mt-1.5">Sign in to your SupportAI workspace</p>
        </div>

        <Btn variant="outline" className="mb-6 gap-3">
          <GoogleIcon />
          Continue with Google
        </Btn>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-slate-100" />
          <span className="text-xs text-slate-400 font-medium">or continue with email</span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>

        <div className="space-y-4">
          <Input label="Work email" type="email" placeholder="you@company.com" icon="mail" value={email} onChange={e => setEmail(e.target.value)} error={errors.email} />
          <Input
            label="Password"
            type={showPass ? "text" : "password"}
            placeholder="••••••••"
            icon="lock"
            value={password}
            onChange={e => setPassword(e.target.value)}
            error={errors.password}
            rightEl={
              <button type="button" onClick={() => setShowPass(!showPass)} className="text-slate-400 hover:text-slate-600">
                <Icon name={showPass ? "eyeOff" : "eye"} className="w-4 h-4" />
              </button>
            }
          />
        </div>

        <div className="flex justify-end mt-2 mb-6">
          <button onClick={onForgot} className="text-xs text-blue-500 font-medium hover:text-blue-600">Forgot password?</button>
        </div>

        <Btn onClick={handleLogin} disabled={loading}>
          {loading ? <><Icon name="refresh" className="w-4 h-4 animate-spin" />Signing in…</> : "Sign in →"}
        </Btn>

        <p className="text-center text-sm text-slate-500 mt-6">
          No account?{" "}
          <button onClick={onSignup} className="text-blue-500 font-semibold hover:text-blue-600">Start for free</button>
        </p>
      </Card>
    </AuthLayout>
  );
}

// ── SIGNUP PAGE ────────────────────────────────────────────────────────────
function SignupPage({ onLogin, onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!name) errs.name = "Name is required";
    if (!email) errs.email = "Email is required";
    if (!password || password.length < 8) errs.password = "Min. 8 characters";
    if (!agreed) errs.agreed = "You must agree to the terms";
    return errs;
  };

  const handleSignup = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setErrors({});
    try {
      await signUp(email, password, name, ""); // company collected in onboarding
      onSuccess(); // → go to onboarding
    } catch (err) {
      console.error("Signup error:", err);
      setErrors({ email: err.message || "Something went wrong. Try again." });
    } finally {
      setLoading(false);
    }
  };

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ["", "bg-rose-400", "bg-amber-400", "bg-emerald-400"];
  const strengthLabels = ["", "Weak", "Fair", "Strong"];

  return (
    <AuthLayout>
      <Card>
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <Icon name="sparkles" className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create your account</h1>
          <p className="text-sm text-slate-500 mt-1.5">14-day free trial · No credit card required</p>
        </div>

        <Btn variant="outline" className="mb-6 gap-3">
          <GoogleIcon />
          Sign up with Google
        </Btn>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-slate-100" />
          <span className="text-xs text-slate-400 font-medium">or with email</span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>

        <div className="space-y-4">
          <Input label="Full name" placeholder="Jamie Diaz" icon="user" value={name} onChange={e => setName(e.target.value)} error={errors.name} />
          <Input label="Work email" type="email" placeholder="you@company.com" icon="mail" value={email} onChange={e => setEmail(e.target.value)} error={errors.email} />
          <div>
            <Input
              label="Password"
              type={showPass ? "text" : "password"}
              placeholder="Min. 8 characters"
              icon="lock"
              value={password}
              onChange={e => setPassword(e.target.value)}
              error={errors.password}
              rightEl={
                <button type="button" onClick={() => setShowPass(!showPass)} className="text-slate-400 hover:text-slate-600">
                  <Icon name={showPass ? "eyeOff" : "eye"} className="w-4 h-4" />
                </button>
              }
            />
            {password.length > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex gap-1 flex-1">
                  {[1,2,3].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength ? strengthColors[strength] : "bg-slate-100"}`} />
                  ))}
                </div>
                <span className={`text-xs font-medium ${strength === 1 ? "text-rose-500" : strength === 2 ? "text-amber-500" : "text-emerald-500"}`}>{strengthLabels[strength]}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-0.5 rounded border-slate-300 text-blue-500 focus:ring-blue-200" />
            <span className="text-xs text-slate-500 leading-relaxed">
              I agree to SupportAI's{" "}
              <a href="#" className="text-blue-500 hover:underline">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>
            </span>
          </label>
          {errors.agreed && <p className="text-xs text-rose-500 mt-1 ml-7">{errors.agreed}</p>}
        </div>

        <Btn onClick={handleSignup} disabled={loading}>
          {loading ? <><Icon name="refresh" className="w-4 h-4 animate-spin" />Creating account…</> : "Create account →"}
        </Btn>

        <p className="text-center text-sm text-slate-500 mt-6">
          Have an account?{" "}
          <button onClick={onLogin} className="text-blue-500 font-semibold hover:text-blue-600">Sign in</button>
        </p>
      </Card>
    </AuthLayout>
  );
}

// ── FORGOT PASSWORD ────────────────────────────────────────────────────────
function ForgotPage({ onBack }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!email) return;
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);
    setSent(true);
  };

  return (
    <AuthLayout>
      <Card>
        {!sent ? (
          <>
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-200">
                <Icon name="lock" className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Forgot your password?</h1>
              <p className="text-sm text-slate-500 mt-1.5">Enter your email and we'll send a reset link.</p>
            </div>
            <div className="space-y-4 mb-6">
              <Input label="Work email" type="email" placeholder="you@company.com" icon="mail" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <Btn onClick={handleSend} disabled={loading}>
              {loading ? <><Icon name="refresh" className="w-4 h-4 animate-spin" />Sending…</> : "Send reset link →"}
            </Btn>
            <div className="mt-4">
              <Btn variant="ghost" onClick={onBack}><Icon name="arrowLeft" className="w-4 h-4" />Back to sign in</Btn>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
              <Icon name="checkCircle" className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Check your inbox</h2>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">We sent a reset link to <strong className="text-slate-700">{email}</strong>. It expires in 15 minutes.</p>
            <Btn variant="outline" onClick={onBack}><Icon name="arrowLeft" className="w-4 h-4" />Back to sign in</Btn>
          </div>
        )}
      </Card>
    </AuthLayout>
  );
}

// ── ONBOARDING ─────────────────────────────────────────────────────────────
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
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${done ? "bg-emerald-500 text-white" : active ? "bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-md shadow-blue-200" : "bg-slate-100 text-slate-400"}`}>
                {done ? <Icon name="check" className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap ${active ? "text-blue-600" : done ? "text-emerald-500" : "text-slate-400"}`}>{label}</span>
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

// Step 1: Organization
function StepOrg({ data, setData, onNext }) {
  const industries = ["SaaS / Software", "E-commerce", "Healthcare", "Finance", "Education", "Agency / Consulting", "Other"];
  const sizes = ["1–10", "11–50", "51–200", "201–1000", "1000+"];
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const errs = {};
    if (!data.company) errs.company = "Company name is required";
    if (!data.industry) errs.industry = "Select an industry";
    if (!data.size) errs.size = "Select a company size";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create org row
      const { data: org, error: orgErr } = await supabase
        .from("organizations")
        .insert({
          name: data.company,
          industry: data.industry,
          company_size: data.size,
        })
        .select("id")
        .single();
      if (orgErr) throw orgErr;

      // Link profile to org
      const { error: profErr } = await supabase
        .from("profiles")
        .update({ organization_id: org.id })
        .eq("id", user.id);
      if (profErr) throw profErr;

      // Store org id in local state for subsequent steps
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
        <p className="text-sm text-slate-500 mt-1.5">Tell us a bit about your company to personalize SupportAI for you.</p>
      </div>
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Company name</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Icon name="building" className="w-4 h-4" /></div>
            <input
              type="text"
              placeholder="Acme Corp"
              value={data.company || ""}
              onChange={e => setData({ ...data, company: e.target.value })}
              className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl outline-none transition-all ${errors.company ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100"} text-slate-900 placeholder:text-slate-400`}
            />
          </div>
          {errors.company && <p className="text-xs text-rose-500 mt-1">{errors.company}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Industry</label>
          <div className="grid grid-cols-2 gap-2">
            {industries.map(ind => (
              <button key={ind} type="button" onClick={() => setData({ ...data, industry: ind })}
                className={`py-2 px-3 rounded-xl border text-sm font-medium transition-all text-left ${data.industry === ind ? "border-blue-400 bg-blue-50 text-blue-700" : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"}`}>
                {ind}
              </button>
            ))}
          </div>
          {errors.industry && <p className="text-xs text-rose-500 mt-1">{errors.industry}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Company size</label>
          <div className="flex gap-2 flex-wrap">
            {sizes.map(s => (
              <button key={s} type="button" onClick={() => setData({ ...data, size: s })}
                className={`py-2 px-4 rounded-xl border text-sm font-medium transition-all ${data.size === s ? "border-blue-400 bg-blue-50 text-blue-700" : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"}`}>
                {s}
              </button>
            ))}
          </div>
          {errors.size && <p className="text-xs text-rose-500 mt-1">{errors.size}</p>}
        </div>
      </div>

      <div className="mt-8">
        <Btn onClick={handleNext} disabled={saving}>
          {saving ? <><Icon name="refresh" className="w-4 h-4 animate-spin" />Saving…</> : <>Continue <Icon name="arrowRight" className="w-4 h-4" /></>}
        </Btn>
      </div>
    </div>
  );
}

// Step 2: Choose Plan
function StepPlan({ data, setData, onNext, onBack }) {
  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "Free",
      sub: "14-day trial",
      color: "border-slate-200",
      badge: null,
      features: ["500 AI resolutions/mo", "1 knowledge base", "Email & chat widget", "Basic analytics"],
    },
    {
      id: "growth",
      name: "Growth",
      price: "$149",
      sub: "/ month",
      color: "border-blue-400",
      badge: "Most popular",
      features: ["5,000 AI resolutions/mo", "5 knowledge bases", "All channels + Slack", "Advanced analytics", "Smart escalation", "Priority support"],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$499",
      sub: "/ month",
      color: "border-violet-400",
      badge: null,
      features: ["Unlimited AI resolutions", "Unlimited knowledge bases", "All integrations + API", "Custom AI personas", "SSO + SOC 2", "Dedicated CSM"],
    },
  ];

  const handleNext = async () => {
    if (!data.plan) return;
    // Save plan to org row
    if (data.orgId) {
      await supabase.from("organizations").update({ plan: data.plan }).eq("id", data.orgId);
    }
    onNext();
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Choose your plan</h2>
        <p className="text-sm text-slate-500 mt-1.5">All plans start with a 14-day free trial. Upgrade or cancel anytime.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {plans.map(plan => (
          <button key={plan.id} type="button" onClick={() => setData({ ...data, plan: plan.id })}
            className={`relative rounded-2xl border-2 p-5 text-left transition-all ${data.plan === plan.id ? `${plan.color} bg-blue-50/30 shadow-md` : "border-slate-100 hover:border-slate-200"}`}>
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-violet-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">{plan.badge}</div>
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
                  <Icon name="check" className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />{f}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <Btn variant="outline" onClick={onBack} className="w-auto px-6"><Icon name="arrowLeft" className="w-4 h-4" />Back</Btn>
        <Btn onClick={handleNext} disabled={!data.plan}>Continue <Icon name="arrowRight" className="w-4 h-4" /></Btn>
      </div>
    </div>
  );
}

// Step 3: AI Setup
function StepAI({ data, setData, onNext, onBack }) {
  const [saving, setSaving] = useState(false);
  const tones = [
    { id: "friendly", label: "Friendly 😊", desc: "Warm, casual, and approachable" },
    { id: "professional", label: "Professional 🤝", desc: "Polished and business-appropriate" },
    { id: "formal", label: "Formal 🎩", desc: "Structured, precise, and formal" },
  ];

  const handleFinish = async () => {
    setSaving(true);
    try {
      if (data.orgId) {
        await supabase.from("organizations").update({
          ai_assistant_name: data.aiName || "Support Assistant",
          ai_tone: data.tone || "professional",
          ai_instructions: data.instructions || "",
        }).eq("id", data.orgId);
      }
      onNext();
    } catch (err) {
      console.error("AI setup save error:", err);
      onNext(); // proceed anyway
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Configure your AI assistant</h2>
        <p className="text-sm text-slate-500 mt-1.5">Personalize how your AI agent communicates with your customers.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">AI assistant name</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Icon name="sparkles" className="w-4 h-4" /></div>
            <input
              type="text"
              placeholder="e.g. Support Assistant"
              value={data.aiName || ""}
              onChange={e => setData({ ...data, aiName: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 bg-slate-50 rounded-xl outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <p className="text-xs text-slate-400 mt-1.5">This is the name customers will see in the chat widget.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Response tone</label>
          <div className="space-y-2">
            {tones.map(t => (
              <button key={t.id} type="button" onClick={() => setData({ ...data, tone: t.id })}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left ${data.tone === t.id ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-slate-50 hover:border-slate-300"}`}>
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

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Special instructions <span className="text-slate-400 font-normal">(optional)</span></label>
          <textarea
            rows={3}
            placeholder="e.g. Always offer a refund option for orders over $100. Never promise delivery dates."
            value={data.instructions || ""}
            onChange={e => setData({ ...data, instructions: e.target.value })}
            className="w-full px-4 py-2.5 text-sm border border-slate-200 bg-slate-50 rounded-xl outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-slate-900 placeholder:text-slate-400 resize-none"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <Btn variant="outline" onClick={onBack} className="w-auto px-6"><Icon name="arrowLeft" className="w-4 h-4" />Back</Btn>
        <Btn onClick={handleFinish} disabled={saving}>
          {saving ? <><Icon name="refresh" className="w-4 h-4 animate-spin" />Saving…</> : <>Finish setup <Icon name="arrowRight" className="w-4 h-4" /></>}
        </Btn>
      </div>
    </div>
  );
}

// Step 4: Success
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
      <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">You're all set, {data.company || "there"}! 🎉</h2>
      <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">
        Your AI assistant <strong className="text-slate-700">{data.aiName || "Support Assistant"}</strong> is ready to start resolving customer tickets instantly.
      </p>

      <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-8">
        {[
          { icon: "lightning", label: "AI ready", val: "Instant" },
          { icon: "chat", label: "Resolutions", val: "80% auto" },
          { icon: "star", label: "Avg CSAT", val: "94%" },
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
        <Btn onClick={onDashboard}>Go to Dashboard <Icon name="arrowRight" className="w-4 h-4" /></Btn>
      </div>
    </div>
  );
}

// ── ONBOARDING WRAPPER ─────────────────────────────────────────────────────
function Onboarding({ onDashboard }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ plan: "growth", tone: "professional" });

  const next = () => setStep(s => Math.min(s + 1, 3));
  const back = () => setStep(s => Math.max(s - 1, 0));

  return (
    <AuthLayout wide={step === 1}>
      <Card className={step === 1 ? "max-w-4xl mx-auto" : ""}>
        <StepIndicator current={step} />
        {step === 0 && <StepOrg data={data} setData={setData} onNext={next} />}
        {step === 1 && <StepPlan data={data} setData={setData} onNext={next} onBack={back} />}
        {step === 2 && <StepAI data={data} setData={setData} onNext={next} onBack={back} />}
        {step === 3 && <StepSuccess data={data} onDashboard={onDashboard} />}
      </Card>
    </AuthLayout>
  );
}

// ── ROOT ROUTER ─────────────────────────────────────────────────────────────
export default function AuthFlow() {
  const [page, setPage] = useState("login");

  if (page === "login") return (
    <LoginPage
      onSignup={() => setPage("signup")}
      onForgot={() => setPage("forgot")}
      onSuccess={() => setPage("dashboard")}
      onNeedsOnboarding={() => setPage("onboarding")}
    />
  );
  if (page === "signup") return <SignupPage onLogin={() => setPage("login")} onSuccess={() => setPage("onboarding")} />;
  if (page === "forgot") return <ForgotPage onBack={() => setPage("login")} />;
  if (page === "onboarding") return <Onboarding onDashboard={() => setPage("dashboard")} />;
  if (page === "dashboard") return <div className="p-8 text-center text-slate-600">Redirecting to dashboard…</div>;
  return null;
}