// src/pages/auth/SignupPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "@/features/auth/authApi";
import { supabase } from "@/lib/supabase";
import { Icon } from "@/components/ui/Icon";
import { GoogleIcon } from "@/components/ui/GoogleIcon";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Btn } from "@/components/ui/Btn";

// ── Inject styles once ────────────────────────────────────────────────────
const SP_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;700&display=swap');

  .sp-root {
    min-height: 100vh;
    background: #0a0a0a;
    color: #f1f0f5;
    font-family: 'Inter', sans-serif;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
  }

  /* ── Ambient orbs ── */
  .sp-orb {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    filter: blur(90px);
  }
  .sp-orb-tl {
    width: 520px; height: 520px;
    top: -160px; left: -160px;
    background: radial-gradient(circle, rgba(16,185,129,0.09) 0%, transparent 70%);
  }
  .sp-orb-br {
    width: 520px; height: 520px;
    bottom: -160px; right: -160px;
    background: radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%);
  }

  /* ── Nav ── */
  .sp-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 50;
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 32px;
    background: rgba(20,21,24,0.82);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .sp-nav-logo {
    font-size: 13px; font-weight: 700; letter-spacing: .18em; color: #f1f0f5;
  }
  .sp-nav-links { display: flex; gap: 28px; }
  .sp-nav-links a {
    font-size: 13px; font-weight: 500; color: rgba(161,168,188,0.7);
    text-decoration: none; transition: color .2s;
  }
  .sp-nav-links a:hover { color: #f1f0f5; }
  .sp-nav-login {
    font-size: 13px; font-weight: 500; color: #6ee7b7;
    text-decoration: none; transition: opacity .2s;
  }
  .sp-nav-login:hover { opacity: .75; }

  /* ── Main layout ── */
  .sp-main {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 120px 24px 60px; position: relative; z-index: 1;
  }

  /* ── Hero text ── */
  .sp-hero { text-align: center; margin-bottom: 32px; }
  .sp-hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(32px, 5vw, 48px); font-weight: 700; line-height: 1.1;
    letter-spacing: -.02em; color: #f1f0f5; margin-bottom: 10px;
  }
  .sp-hero p { font-size: 15px; color: rgba(161,168,188,0.7); max-width: 300px; margin: 0 auto; line-height: 1.6; }

  /* ── Card ── */
  .sp-card {
    width: 100%; max-width: 420px;
    background: rgba(255,255,255,0.03);
    backdrop-filter: blur(14px);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    padding: 32px 28px;
    box-shadow: 0 0 40px -12px rgba(16,185,129,0.2);
  }

  /* ── Google btn ── */
  .sp-google-btn {
    width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 10px; padding: 11px 16px;
    font-size: 13px; font-weight: 600; color: #f1f0f5;
    cursor: pointer; transition: background .2s;
    margin-bottom: 20px;
  }
  .sp-google-btn:hover { background: rgba(255,255,255,0.08); }

  /* ── Divider ── */
  .sp-divider {
    display: flex; align-items: center; gap: 12px; margin-bottom: 20px;
  }
  .sp-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
  .sp-divider span {
    font-size: 11px; font-weight: 600; letter-spacing: .08em;
    text-transform: uppercase; color: rgba(161,168,188,0.45);
  }

  /* ── Fields ── */
  .sp-fields { display: flex; flex-direction: column; gap: 14px; margin-bottom: 16px; }
  .sp-field { display: flex; flex-direction: column; gap: 5px; }
  .sp-label {
    font-size: 11px; font-weight: 600; letter-spacing: .05em;
    text-transform: uppercase; color: rgba(161,168,188,0.6);
    margin-left: 2px;
  }
  .sp-input-wrap { position: relative; }
  .sp-input-icon {
    position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
    font-size: 17px; color: rgba(161,168,188,0.45);
    pointer-events: none; font-family: 'Material Symbols Outlined'; font-variation-settings: 'FILL' 0,'wght' 300;
  }
  .sp-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 10px;
    padding: 11px 40px 11px 38px;
    font-size: 13px; color: #f1f0f5;
    font-family: 'Inter', sans-serif;
    outline: none; transition: border-color .2s, box-shadow .2s;
  }
  .sp-input::placeholder { color: rgba(161,168,188,0.3); }
  .sp-input:focus {
    border-color: rgba(110,231,183,0.5);
    box-shadow: 0 0 0 3px rgba(16,185,129,0.1);
  }
  .sp-input.sp-input-error { border-color: rgba(239,68,68,0.5); }
  .sp-input-right {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  }
  .sp-input-right button {
    background: none; border: none; color: rgba(161,168,188,0.5);
    cursor: pointer; padding: 2px; display: flex; align-items: center;
    transition: color .2s;
  }
  .sp-input-right button:hover { color: rgba(161,168,188,0.9); }
  .sp-error-msg {
    font-size: 11px; color: #f87171; margin-top: 2px; margin-left: 2px;
  }

  /* ── Password strength ── */
  .sp-strength { display: flex; align-items: center; gap: 8px; margin-top: 6px; }
  .sp-strength-bars { display: flex; gap: 4px; flex: 1; }
  .sp-strength-bar { height: 3px; flex: 1; border-radius: 99px; background: rgba(255,255,255,0.08); transition: background .3s; }
  .sp-strength-bar.weak   { background: #f87171; }
  .sp-strength-bar.fair   { background: #fbbf24; }
  .sp-strength-bar.strong { background: #34d399; }
  .sp-strength-label { font-size: 11px; font-weight: 600; }
  .sp-strength-label.weak   { color: #f87171; }
  .sp-strength-label.fair   { color: #fbbf24; }
  .sp-strength-label.strong { color: #34d399; }

  /* ── Terms ── */
  .sp-terms {
    display: flex; align-items: flex-start; gap: 10px; margin-bottom: 20px;
  }
  .sp-checkbox {
    width: 15px; height: 15px; margin-top: 1px; flex-shrink: 0;
    accent-color: #10b981; cursor: pointer;
  }
  .sp-terms-label { font-size: 12px; color: rgba(161,168,188,0.6); line-height: 1.55; }
  .sp-terms-label a { color: #6ee7b7; text-decoration: none; }
  .sp-terms-label a:hover { text-decoration: underline; }

  /* ── Submit btn ── */
  .sp-submit {
    width: 100%; background: #065f46; color: #fff; border: none;
    border-radius: 10px; padding: 13px 20px;
    font-size: 13px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: background .2s, box-shadow .2s, transform .1s;
    box-shadow: 0 0 20px rgba(16,185,129,0.2);
  }
  .sp-submit:hover { background: #047857; box-shadow: 0 0 32px rgba(16,185,129,0.38); }
  .sp-submit:active { transform: scale(.98); }
  .sp-submit:disabled { opacity: .6; cursor: not-allowed; }

  /* ── Sign in link ── */
  .sp-signin-row {
    text-align: center; margin-top: 20px;
    font-size: 13px; color: rgba(161,168,188,0.55);
  }
  .sp-signin-row button {
    background: none; border: none; color: #6ee7b7;
    font-size: 13px; font-weight: 600; cursor: pointer;
    transition: opacity .2s; padding: 0;
  }
  .sp-signin-row button:hover { opacity: .75; }

  /* ── Success card ── */
  .sp-success-icon {
    width: 52px; height: 52px; border-radius: 16px;
    background: linear-gradient(135deg, #34d399, #0d9488);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 16px;
    box-shadow: 0 0 24px rgba(52,211,153,0.35);
  }
  .sp-success-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 700; color: #f1f0f5;
    margin-bottom: 8px; text-align: center;
  }
  .sp-success-sub { font-size: 13px; color: rgba(161,168,188,0.65); text-align: center; line-height: 1.6; margin-bottom: 20px; }
  .sp-meta-box {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px; padding: 16px; margin-bottom: 20px;
    display: flex; flex-direction: column; gap: 10px;
  }
  .sp-meta-row { display: flex; justify-content: space-between; align-items: center; }
  .sp-meta-label { font-size: 12px; color: rgba(161,168,188,0.5); }
  .sp-meta-value { font-size: 12px; font-weight: 600; color: #f1f0f5; }
  .sp-meta-value.mono { font-family: 'Courier New', monospace; font-size: 11px; }
  .sp-outline-btn {
    width: 100%; background: transparent; color: #f1f0f5;
    border: 1px solid rgba(255,255,255,0.13); border-radius: 10px;
    padding: 12px 20px; font-size: 13px; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: background .2s;
  }
  .sp-outline-btn:hover { background: rgba(255,255,255,0.06); }

  /* ── Quote ── */
  .sp-quote {
    margin-top: 40px; text-align: center;
    font-family: 'Playfair Display', serif;
    font-size: 15px; font-style: italic;
    color: rgba(161,168,188,0.25); max-width: 340px;
    line-height: 1.6;
  }

  /* ── Footer ── */
  .sp-footer {
    position: relative; z-index: 1;
    border-top: 1px solid rgba(255,255,255,0.06);
    padding: 40px 32px 28px;
    display: flex; flex-wrap: wrap; gap: 32px;
    justify-content: space-between; align-items: flex-start;
    background: #0e0e0e;
  }
  .sp-footer-logo { font-size: 15px; font-weight: 800; color: #f1f0f5; margin-bottom: 6px; }
  .sp-footer-copy { font-size: 11px; color: rgba(161,168,188,0.3); }
  .sp-footer-cols { display: flex; gap: 40px; flex-wrap: wrap; }
  .sp-footer-col { display: flex; flex-direction: column; gap: 8px; }
  .sp-footer-col-title { font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #6ee7b7; margin-bottom: 2px; }
  .sp-footer-col a { font-size: 12px; color: rgba(161,168,188,0.5); text-decoration: none; transition: color .2s; }
  .sp-footer-col a:hover { color: #6ee7b7; }

  @media (max-width: 480px) {
    .sp-nav-links { display: none; }
    .sp-card { padding: 24px 18px; }
    .sp-footer { flex-direction: column; padding: 32px 20px 24px; }
  }
`;

if (!document.getElementById("sp-styles")) {
  const el = document.createElement("style");
  el.id = "sp-styles";
  el.textContent = SP_CSS;
  document.head.appendChild(el);
}

// ── Shell wraps the nav + footer consistently ─────────────────────────────
function Shell({ children }) {
  return (
    <div className="sp-root">
      <div className="sp-orb sp-orb-tl" />
      <div className="sp-orb sp-orb-br" />

      {/* Nav */}
      <nav className="sp-nav">
        <div className="sp-nav-logo">SupportAI</div>
        <div className="sp-nav-links">
          <a href="#">Product</a>
          <a href="#">Pricing</a>
        </div>
        <a href="/login" className="sp-nav-login">Login</a>
      </nav>

      {/* Content */}
      <main className="sp-main">
        {children}
      </main>

      {/* Footer */}
      <footer className="sp-footer">
        <div>
          <div className="sp-footer-logo">SupportAI</div>
          <div className="sp-footer-copy">© 2026 SupportAI. All rights reserved.</div>
        </div>
        <div className="sp-footer-cols">
          {Object.entries({
            Company:   ["About", "Careers"],
            Product:   ["Features", "Pricing"],
            Resources: ["Blog", "Guides"],
            Legal:     ["Privacy", "Terms"],
          }).map(([section, links]) => (
            <div key={section} className="sp-footer-col">
              <div className="sp-footer-col-title">{section}</div>
              {links.map(l => <a key={l} href="#">{l}</a>)}
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}

// ── Row helper for success card ───────────────────────────────────────────
function Row({ label, value, mono = false }) {
  return (
    <div className="sp-meta-row">
      <span className="sp-meta-label">{label}</span>
      <span className={`sp-meta-value${mono ? " mono" : ""}`}>{value}</span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────
export default function SignupPage() {
  const navigate = useNavigate();

  // ── All state unchanged ──
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [createdUser, setCreatedUser] = useState(null);

  // ── All handlers unchanged ──
  const handleSignup = async () => {
    const errs = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!email.trim()) errs.email = "Email is required";
    if (!password || password.length < 8) errs.password = "Min. 8 characters";
    if (!agreed) errs.agreed = "You must agree to the terms";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setErrors({});
    try {
      const result = await signUp(email, password, name);
      const user = result?.user ?? result;

      if (user?.id) {
        await supabase
          .from("profiles")
          .upsert(
            { id: user.id, full_name: name, role: "admin" },
            { onConflict: "id", ignoreDuplicates: true }
          );
      }

      setCreatedUser({
        id: user?.id ?? "unknown",
        name,
        email,
        needsConfirmation: !user?.confirmed_at,
      });
    } catch (err) {
      const msg = err.message || "";
      if (msg.toLowerCase().includes("already registered")) {
        setErrors({ email: "An account with this email already exists." });
      } else {
        setErrors({ email: msg || "Something went wrong. Try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/onboarding` },
    });
  };

  const strength =
    password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ["", "weak", "fair", "strong"];
  const strengthLabels = ["", "Weak", "Fair", "Strong"];

  // ── Success screen ────────────────────────────────────────────────────────
  if (createdUser) {
    return (
      <Shell>
        <div className="sp-card" style={{ textAlign: "center" }}>
          <div className="sp-success-icon">
            <Icon name="checkCircle" style={{ width: 26, height: 26, color: "#fff" }} />
          </div>
          <div className="sp-success-title">Account created 🎉</div>
          <p className="sp-success-sub">
            {createdUser.needsConfirmation
              ? "We sent a confirmation link to your email. Click it, then come back to sign in."
              : "You're all set — let's finish setting up your workspace."}
          </p>

          <div className="sp-meta-box">
            <Row label="Name"    value={createdUser.name} />
            <Row label="Email"   value={createdUser.email} />
            <Row label="User ID" value={createdUser.id !== "unknown" ? `${createdUser.id.slice(0, 12)}…` : "—"} mono />
          </div>

          {createdUser.needsConfirmation ? (
            <button className="sp-outline-btn" onClick={() => navigate("/login")}>
              <Icon name="arrowLeft" style={{ width: 16, height: 16 }} /> Back to sign in
            </button>
          ) : (
            <button className="sp-submit" onClick={() => navigate("/onboarding")}>
              Continue to setup <Icon name="arrowRight" style={{ width: 16, height: 16 }} />
            </button>
          )}
        </div>
      </Shell>
    );
  }

  // ── Signup form ───────────────────────────────────────────────────────────
  return (
    <Shell>
      {/* Hero */}
      <div className="sp-hero">
        <h1>Join the Future.</h1>
        <p>Experience precision support powered by SupportAI's advanced intelligence.</p>
      </div>

      {/* Card */}
      <div className="sp-card">

        {/* Google */}
        <button className="sp-google-btn" onClick={handleGoogleSignup}>
          <GoogleIcon />
          Sign up with Google
        </button>

        {/* Divider */}
        <div className="sp-divider">
          <div className="sp-divider-line" />
          <span>or with email</span>
          <div className="sp-divider-line" />
        </div>

        {/* Fields */}
        <div className="sp-fields">

          {/* Name */}
          <div className="sp-field">
            <label className="sp-label" htmlFor="sp-name">Full Name</label>
            <div className="sp-input-wrap">
              <span className="sp-input-icon material-symbols-outlined">person</span>
              <input
                id="sp-name"
                className={`sp-input${errors.name ? " sp-input-error" : ""}`}
                type="text"
                placeholder="Jamie Diaz"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            {errors.name && <span className="sp-error-msg">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="sp-field">
            <label className="sp-label" htmlFor="sp-email">Work Email</label>
            <div className="sp-input-wrap">
              <span className="sp-input-icon material-symbols-outlined">mail</span>
              <input
                id="sp-email"
                className={`sp-input${errors.email ? " sp-input-error" : ""}`}
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            {errors.email && <span className="sp-error-msg">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="sp-field">
            <label className="sp-label" htmlFor="sp-password">Password</label>
            <div className="sp-input-wrap">
              <span className="sp-input-icon material-symbols-outlined">lock</span>
              <input
                id="sp-password"
                className={`sp-input${errors.password ? " sp-input-error" : ""}`}
                type={showPass ? "text" : "password"}
                placeholder="Min. 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ paddingRight: 40 }}
              />
              <div className="sp-input-right">
                <button type="button" onClick={() => setShowPass(!showPass)}>
                  <Icon name={showPass ? "eyeOff" : "eye"} style={{ width: 15, height: 15 }} />
                </button>
              </div>
            </div>
            {errors.password && <span className="sp-error-msg">{errors.password}</span>}

            {/* Strength meter */}
            {password.length > 0 && (
              <div className="sp-strength">
                <div className="sp-strength-bars">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className={`sp-strength-bar${i <= strength ? ` ${strengthColors[strength]}` : ""}`}
                    />
                  ))}
                </div>
                <span className={`sp-strength-label ${strengthColors[strength]}`}>
                  {strengthLabels[strength]}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Terms */}
        <div className="sp-terms">
          <input
            type="checkbox"
            className="sp-checkbox"
            id="sp-agreed"
            checked={agreed}
            onChange={e => setAgreed(e.target.checked)}
          />
          <label className="sp-terms-label" htmlFor="sp-agreed">
            I agree to SupportAI's{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
          </label>
        </div>
        {errors.agreed && <p className="sp-error-msg" style={{ marginTop: -12, marginBottom: 14 }}>{errors.agreed}</p>}

        {/* Submit */}
        <button
          className="sp-submit"
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <>
              <Icon name="refresh" style={{ width: 15, height: 15, animation: "spin 1s linear infinite" }} />
              Creating account…
            </>
          ) : (
            <>Create Account →</>
          )}
        </button>

        {/* Sign in link */}
        <div className="sp-signin-row">
          Have an account?{" "}
          <button onClick={() => navigate("/login")}>Sign in</button>
        </div>
      </div>

      {/* Quote */}
      <p className="sp-quote">"Simplicity is the ultimate sophistication."</p>
    </Shell>
  );
}