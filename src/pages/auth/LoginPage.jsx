// src/pages/auth/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "@/features/auth/authApi";
import { supabase } from "@/lib/supabase";
import { Icon } from "@/components/ui/Icon";
import { GoogleIcon } from "@/components/ui/GoogleIcon";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Btn } from "@/components/ui/Btn";

export default function LoginPage() {
  const navigate = useNavigate();
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
      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();
      if (profile?.organization_id) {
        navigate("/dashboard");
      } else {
        navigate("/onboarding");
      }
    } catch (err) {
      const msg = err.message || "";
      if (msg.toLowerCase().includes("invalid login credentials")) {
        setErrors({ password: "Wrong email or password." });
      } else if (msg.toLowerCase().includes("email not confirmed")) {
        setErrors({ email: "Please confirm your email before signing in." });
      } else {
        setErrors({ password: msg || "Something went wrong." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card>
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <Icon name="sparkles" className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
          <p className="text-sm text-slate-500 mt-1.5">Sign in to your SupportAI workspace</p>
        </div>
        <Btn variant="outline" className="mb-6 gap-3"><GoogleIcon />Continue with Google</Btn>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-slate-100" />
          <span className="text-xs text-slate-400 font-medium">or continue with email</span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>
        <div className="space-y-4">
          <Input label="Work email" type="email" placeholder="you@company.com" icon="mail" value={email} onChange={e => setEmail(e.target.value)} error={errors.email} />
          <Input label="Password" type={showPass ? "text" : "password"} placeholder="••••••••" icon="lock" value={password} onChange={e => setPassword(e.target.value)} error={errors.password}
            rightEl={<button type="button" onClick={() => setShowPass(!showPass)} className="text-slate-400 hover:text-slate-600"><Icon name={showPass ? "eyeOff" : "eye"} className="w-4 h-4" /></button>} />
        </div>
        <div className="flex justify-end mt-2 mb-6">
          <button onClick={() => navigate("/forgot-password")} className="text-xs text-blue-500 font-medium hover:text-blue-600">Forgot password?</button>
        </div>
        <Btn onClick={handleLogin} disabled={loading}>
          {loading ? <><Icon name="refresh" className="w-4 h-4 animate-spin" />Signing in…</> : "Sign in →"}
        </Btn>
        <p className="text-center text-sm text-slate-500 mt-6">
          No account? <button onClick={() => navigate("/signup")} className="text-blue-500 font-semibold hover:text-blue-600">Start for free</button>
        </p>
      </Card>
    </AuthLayout>
  );
}