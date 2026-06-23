// src/pages/auth/ForgotPasswordPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "@/features/auth/authApi";
import { Icon } from "@/components/ui/Icon";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Btn } from "@/components/ui/Btn";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!email.trim()) { setError("Email is required"); return; }
    setLoading(true);
    setError("");
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout>
        <Card>
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
              <Icon name="checkCircle" className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Check your inbox</h2>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              We sent a reset link to{" "}
              <strong className="text-slate-700">{email}</strong>.
              It expires in 15 minutes.
            </p>
            <Btn variant="outline" onClick={() => navigate("/login")}>
              <Icon name="arrowLeft" className="w-4 h-4" />
              Back to sign in
            </Btn>
          </div>
        </Card>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <Card>
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-200">
            <Icon name="lock" className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Forgot your password?</h1>
          <p className="text-sm text-slate-500 mt-1.5">
            Enter your email and we'll send a reset link.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <Input
            label="Work email"
            type="email"
            placeholder="you@company.com"
            icon="mail"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(""); }}
            error={error}
          />
        </div>

        <Btn onClick={handleSend} disabled={loading}>
          {loading
            ? <><Icon name="refresh" className="w-4 h-4 animate-spin" />Sending…</>
            : "Send reset link →"}
        </Btn>

        <div className="mt-4">
          <Btn variant="ghost" onClick={() => navigate("/login")}>
            <Icon name="arrowLeft" className="w-4 h-4" />
            Back to sign in
          </Btn>
        </div>
      </Card>
    </AuthLayout>
  );
}