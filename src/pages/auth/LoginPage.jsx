// src/pages/auth/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "@/features/auth/authApi";
import { supabase } from "@/lib/supabase";

// ─── STYLES ───────────────────────────────────────────────────────────────────
// Matches the Landpage + SignupPage obsidian + emerald palette exactly
const LP_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .lp-login-root {
    min-height: 100vh;
    background: #0a0a0a;
    color: #f1f0f5;
    font-family: 'Inter', sans-serif;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    position: relative;
  }

  /* Ambient orbs — same as SignupPage */
  .lp-login-orb {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    filter: blur(90px);
  }
  .lp-login-orb-tr {
    width: 520px; height: 520px;
    top: -160px; right: -160px;
    background: radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%);
  }
  .lp-login-orb-bl {
    width: 520px; height: 520px;
    bottom: -160px; left: -160px;
    background: radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%);
  }

  /* Nav — identical to Landpage */
  .lp-login-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 50;
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 32px;
    background: rgba(20,21,24,0.82);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .lp-login-logo {
    font-size: 13px; font-weight: 700; letter-spacing: 0.18em;
    color: #f1f0f5; white-space: nowrap;
  }
  .lp-login-nav-links {
    display: flex; gap: 28px;
  }
  .lp-login-nav-links a {
    font-size: 13px; font-weight: 500; color: rgba(161,168,188,0.8);
    text-decoration: none; transition: color 0.2s;
  }
  .lp-login-nav-links a:hover { color: #f1f0f5; }
  .lp-login-nav-cta {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.10);
    color: #f1f0f5; border-radius: 999px;
    padding: 6px 18px; font-size: 12px; font-weight: 600;
    letter-spacing: 0.05em; cursor: pointer; transition: background 0.2s;
    font-family: 'Inter', sans-serif;
  }
  .lp-login-nav-cta:hover { background: rgba(255,255,255,0.10); }

  /* Main */
  .lp-login-main {
    flex: 1; display: flex; align-items: center; justify-content: center;
    padding: 110px 16px 60px;
    position: relative; z-index: 1;
  }

  /* Card */
  .lp-login-card {
    width: 100%; max-width: 420px;
    background: rgba(255,255,255,0.03);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    padding: 36px 32px;
    box-shadow: 0 0 40px -12px rgba(16,185,129,0.2);
    position: relative;
  }

  /* Heading */
  .lp-login-heading {
    font-family: 'Playfair Display', serif;
    font-size: clamp(30px, 5vw, 42px);
    font-weight: 700; line-height: 1.1; letter-spacing: -0.02em;
    color: #f1f0f5; text-align: center; margin-bottom: 6px;
  }
  .lp-login-sub {
    font-size: 14px; color: rgba(161,168,188,0.65);
    text-align: center; margin-bottom: 28px; line-height: 1.6;
  }

  /* Google btn */
  .lp-login-google {
    width: 100%; display: flex; align-items: center; justify-content: center;
    gap: 10px; padding: 12px 16px; border-radius: 10px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    font-size: 13px; font-weight: 600; color: #f1f0f5;
    cursor: pointer; transition: background 0.2s; margin-bottom: 20px;
    font-family: 'Inter', sans-serif;
  }
  .lp-login-google:hover { background: rgba(255,255,255,0.08); }

  /* Divider */
  .lp-login-divider {
    display: flex; align-items: center; gap: 12px; margin-bottom: 20px;
  }
  .lp-login-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
  .lp-login-divider span {
    font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase; color: rgba(161,168,188,0.45);
  }

  /* Fields */
  .lp-login-field { margin-bottom: 16px; }
  .lp-login-label-row {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 6px;
  }
  .lp-login-label {
    font-size: 11px; font-weight: 600; letter-spacing: 0.05em;
    text-transform: uppercase; color: rgba(161,168,188,0.6);
  }
  .lp-login-forgot {
    font-size: 12px; color: #6ee7b7; font-weight: 600;
    background: none; border: none; cursor: pointer; font-family: 'Inter', sans-serif;
    transition: opacity 0.2s;
  }
  .lp-login-forgot:hover { opacity: 0.75; }
  .lp-login-input-wrap { position: relative; }
  .lp-login-input-icon {
    position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
    font-size: 17px; color: rgba(161,168,188,0.45);
    pointer-events: none;
    font-family: 'Material Symbols Outlined';
    font-variation-settings: 'FILL' 0, 'wght' 300;
    line-height: 1;
  }
  .lp-login-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 10px;
    padding: 11px 40px 11px 38px;
    font-size: 13px; color: #f1f0f5;
    font-family: 'Inter', sans-serif;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .lp-login-input::placeholder { color: rgba(161,168,188,0.3); }
  .lp-login-input:focus {
    border-color: rgba(110,231,183,0.5);
    box-shadow: 0 0 0 3px rgba(16,185,129,0.1);
  }
  .lp-login-input.error { border-color: rgba(239,68,68,0.5); }
  .lp-login-input-right {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  }
  .lp-login-input-right button {
    background: none; border: none; color: rgba(161,168,188,0.5);
    cursor: pointer; padding: 2px; display: flex; align-items: center;
    transition: color 0.2s;
  }
  .lp-login-input-right button:hover { color: rgba(161,168,188,0.9); }
  .lp-login-error { font-size: 11px; color: #f87171; margin-top: 4px; margin-left: 2px; }

  /* Submit */
  .lp-login-submit {
    width: 100%; background: #065f46; color: #fff; border: none;
    border-radius: 10px; padding: 13px 20px;
    font-size: 13px; font-weight: 700; letter-spacing: 0.04em;
    text-transform: uppercase; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
    box-shadow: 0 0 20px rgba(16,185,129,0.2);
    margin-top: 8px; font-family: 'Inter', sans-serif;
  }
  .lp-login-submit:hover { background: #047857; box-shadow: 0 0 32px rgba(16,185,129,0.38); }
  .lp-login-submit:active { transform: scale(0.98); }
  .lp-login-submit:disabled { opacity: 0.6; cursor: not-allowed; }

  /* Sign-up row */
  .lp-login-signup-row {
    text-align: center; margin-top: 20px;
    font-size: 13px; color: rgba(161,168,188,0.55);
  }
  .lp-login-signup-row button {
    background: none; border: none; color: #6ee7b7;
    font-size: 13px; font-weight: 600; cursor: pointer;
    transition: opacity 0.2s; padding: 0;
    font-family: 'Inter', sans-serif;
  }
  .lp-login-signup-row button:hover { opacity: 0.75; }

  /* Footer links */
  .lp-login-footer {
    display: flex; justify-content: center; gap: 24px; margin-top: 24px;
  }
  .lp-login-footer a {
    font-size: 11px; color: rgba(161,168,188,0.25); text-decoration: none;
    font-weight: 600; letter-spacing: 0.04em; transition: color 0.2s;
  }
  .lp-login-footer a:hover { color: #6ee7b7; }

  /* Responsive */
  @media (max-width: 640px) {
    .lp-login-nav { padding: 12px 16px; }
    .lp-login-nav-links { display: none; }
    .lp-login-card { padding: 28px 20px; }
  }
`;

if (!document.getElementById("lp-login-styles")) {
  const el = document.createElement("style");
  el.id = "lp-login-styles";
  el.textContent = LP_CSS;
  document.head.appendChild(el);
}

// Inject Material Symbols font for icons (same icons as SignupPage)
if (!document.getElementById("lp-login-ms-font")) {
  const el = document.createElement("link");
  el.id = "lp-login-ms-font";
  el.rel = "stylesheet";
  el.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap";
  document.head.appendChild(el);
}

// ─── FIELD COMPONENT ─────────────────────────────────────────────────────────
function Field({ label, type, placeholder, icon, value, onChange, error, rightEl, forgotLink, onForgot }) {
  return (
    <div className="lp-login-field">
      <div className="lp-login-label-row">
        <label className="lp-login-label">{label}</label>
        {forgotLink && (
          <button className="lp-login-forgot" type="button" onClick={onForgot}>Forgot?</button>
        )}
      </div>
      <div className="lp-login-input-wrap">
        <span className="lp-login-input-icon material-symbols-outlined">{icon}</span>
        <input
          className={`lp-login-input${error ? " error" : ""}`}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {rightEl && <div className="lp-login-input-right">{rightEl}</div>}
      </div>
      {error && <div className="lp-login-error">{error}</div>}
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
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
      if (profile?.organization_id) navigate("/dashboard");
      else navigate("/onboarding");
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

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  };

  return (
    <div className="lp-login-root">
      {/* Ambient orbs */}
      <div className="lp-login-orb lp-login-orb-tr" />
      <div className="lp-login-orb lp-login-orb-bl" />

      {/* Nav */}
      <nav className="lp-login-nav">
        <div className="lp-login-logo">SupportAI</div>
        <div className="lp-login-nav-links">
          {["Product", "Features", "Pricing", "Resources"].map(item => (
            <a key={item} href="#">{item}</a>
          ))}
        </div>
        <button className="lp-login-nav-cta" onClick={() => navigate("/signup")}>
          Sign Up
        </button>
      </nav>

      {/* Main */}
      <main className="lp-login-main">
        <div style={{ width: "100%", maxWidth: 420 }}>
          <div className="lp-login-card">
            <h1 className="lp-login-heading">Welcome Back</h1>
            <p className="lp-login-sub">Enter your credentials to access your intelligence dashboard.</p>

            {/* Google */}
            <button className="lp-login-google" onClick={handleGoogleLogin}>
              <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="lp-login-divider">
              <div className="lp-login-divider-line" />
              <span>or email</span>
              <div className="lp-login-divider-line" />
            </div>

            {/* Fields */}
            <Field
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              icon="mail"
              value={email}
              onChange={e => setEmail(e.target.value)}
              error={errors.email}
            />
            <Field
              label="Password"
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              icon="lock"
              value={password}
              onChange={e => setPassword(e.target.value)}
              error={errors.password}
              forgotLink
              onForgot={() => navigate("/forgot-password")}
              rightEl={
                <button type="button" onClick={() => setShowPass(!showPass)}>
                  <span style={{ fontFamily: "'Material Symbols Outlined'", fontVariationSettings: "'FILL' 0, 'wght' 300", fontSize: 17, color: "rgba(161,168,188,0.5)" }}>
                    {showPass ? "visibility_off" : "visibility"}
                  </span>
                </button>
              }
            />

            <button
              className="lp-login-submit"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign In →"}
            </button>

            <div className="lp-login-signup-row">
              New to the ecosystem?{" "}
              <button onClick={() => navigate("/signup")}>Create account</button>
            </div>
          </div>

          {/* Footer links */}
          <div className="lp-login-footer">
            {["Privacy", "Terms", "System Status"].map(item => (
              <a key={item} href="#">{item}</a>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}