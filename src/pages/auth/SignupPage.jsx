// src/pages/auth/SignupPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "@/features/auth/authApi";
import { Icon } from "@/components/ui/Icon";
import { GoogleIcon } from "@/components/ui/GoogleIcon";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Btn } from "@/components/ui/Btn";

export default function SignupPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [createdUser, setCreatedUser] = useState(null); // <-- holds account info for the success card

  const validate = () => {
    const errs = {};
    if (!name) errs.name = "Name is required";
    if (!email) errs.email = "Email is required";
    if (!password || password.length < 8) errs.password = "Min. 8 characters";
    if (!agreed) errs.agreed = "You must agree to terms";
    return errs;
  };

const handleSignup = async () => {
  const errs = {};
  if (!name) errs.name = "Name is required";
  if (!email) errs.email = "Email is required";
  if (!password || password.length < 8) errs.password = "Min. 8 characters";
  if (!agreed) errs.agreed = "You must agree to terms";
  if (Object.keys(errs).length) { setErrors(errs); return; }

  setLoading(true);
  setErrors({});
  try {
    await signUp(email, password, name, "");
    onSuccess();
  } catch (err) {
    setErrors({ email: err.message || "Something went wrong." });
  } finally {
    setLoading(false);
  }
};

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ["", "bg-rose-400", "bg-amber-400", "bg-emerald-400"];
  const strengthLabels = ["", "Weak", "Fair", "Strong"];

  // ── Success state: show the account that was just created ──────────────
  if (createdUser) {
    return (
      <AuthLayout>
        <Card>
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
              <Icon name="checkCircle" className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account created 🎉</h1>
            <p className="text-sm text-slate-500 mt-1.5">
              {createdUser.needsConfirmation
                ? "Check your inbox to confirm your email before signing in."
                : "You're signed in and ready to go."}
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 mb-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Name</span>
              <span className="font-medium text-slate-900">{createdUser.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Email</span>
              <span className="font-medium text-slate-900">{createdUser.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">User ID</span>
              <span className="font-mono text-xs text-slate-600">{createdUser.id?.slice(0, 12)}…</span>
            </div>
          </div>

          <Btn onClick={() => navigate("/onboarding")}>
            Continue to onboarding <Icon name="arrowRight" className="w-4 h-4" />
          </Btn>
        </Card>
      </AuthLayout>
    );
  }

  // ── Normal signup form ───────────────────────────────────────────────────
  return (
    <AuthLayout>
      <Card>
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
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
          <Input label="Full name" placeholder="Jamie Diaz" icon="user" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
          <Input label="Work email" type="email" placeholder="you@company.com" icon="mail" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
          <div>
            <Input
              label="Password"
              type={showPass ? "text" : "password"}
              placeholder="Min. 8 characters"
              icon="lock"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength ? strengthColors[strength] : "bg-slate-100"}`} />
                  ))}
                </div>
                <span className={`text-xs font-medium ${strength === 1 ? "text-rose-500" : strength === 2 ? "text-amber-500" : "text-emerald-500"}`}>
                  {strengthLabels[strength]}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 rounded border-slate-300 text-blue-500 focus:ring-blue-200" />
            <span className="text-xs text-slate-500 leading-relaxed">
              I agree to SupportAI's <a href="#" className="text-blue-500 hover:underline">Terms of Service</a> and{" "}
              <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>
            </span>
          </label>
          {errors.agreed && <p className="text-xs text-rose-500 mt-1 ml-7">{errors.agreed}</p>}
        </div>

        <Btn onClick={handleSignup} disabled={loading}>
          {loading ? (
            <>
              <Icon name="refresh" className="w-4 h-4 animate-spin" />
              Creating account…
            </>
          ) : (
            "Create account →"
          )}
        </Btn>

        <p className="text-center text-sm text-slate-500 mt-6">
          Have an account?{" "}
          <button onClick={() => navigate("/login")} className="text-blue-500 font-semibold hover:text-blue-600">
            Sign in
          </button>
        </p>
      </Card>
    </AuthLayout>
  );
}