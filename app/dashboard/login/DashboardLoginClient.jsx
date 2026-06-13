"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createBrowserClient } from "../../../lib/supabase/browser-ssr";
import { buildAuthCallbackUrl, RESET_PASSWORD_NEXT } from "../../../lib/dashboard/auth-redirect";
import { logAuthClient } from "../../../lib/dashboard/log-auth-client";
import { AuthHeroPanel } from "../../../components/dashboard/AuthHeroPanel";

export default function DashboardLoginPage({ variant = "admin", initialMode = "signin" }) {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const urlError = searchParams.get("error");
  const urlMode = searchParams.get("mode");

  const [mode, setMode] = useState(initialMode === "signup" ? "signup" : "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const isUserFlow = variant === "user";
  const heroVariant = isUserFlow ? "user" : "admin";

  useEffect(() => {
    if (urlMode === "signup") setMode("signup");
    if (urlMode === "signin") setMode("signin");
  }, [urlMode]);

  useEffect(() => {
    if (urlError === "auth_callback_failed") {
      setError("Sign-in link expired or failed. Try again or use forgot password.");
    }
  }, [urlError]);

  async function handleSignIn(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const supabase = createBrowserClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        logAuthClient("login_failed", email.trim());
        if (authError.message === "Invalid login credentials") {
          setError(
            isUserFlow
              ? "Invalid email or password. If you just joined, confirm your email first or ask your admin to enable Social Engine access."
              : "Invalid email or password. Run supabase/scripts/create-dashboard-auth-users.sql in Supabase SQL Editor, or use Forgot password."
          );
        } else {
          setError(authError.message);
        }
        return;
      }

      logAuthClient("login_success", email.trim());
      window.location.assign(next);
      return;
    } catch {
      setError("Could not sign in. Check Supabase env vars and ADMIN_EMAILS in .env.local.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const supabase = createBrowserClient();
      const redirectTo = buildAuthCallbackUrl("/dashboard/login?mode=signin");
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: redirectTo },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      setSuccess(
        `Check ${email.trim()} for a confirmation link. After confirming, sign in — your admin must add you to Social Engine before dashboard access.`
      );
      setMode("signin");
    } catch {
      setError("Could not create account. Confirm email signups are enabled in Supabase Auth settings.");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const supabase = createBrowserClient();
      const redirectTo = buildAuthCallbackUrl(RESET_PASSWORD_NEXT);
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      });

      if (resetError) {
        setError(resetError.message);
        return;
      }

      logAuthClient("password_reset_requested", email.trim());
      setSuccess(
        `If ${email.trim()} is registered, you will receive a password reset email shortly. Check spam and confirm SMTP is configured in Supabase.`
      );
      setMode("signin");
    } catch {
      setError("Could not send reset email. Configure SMTP in Supabase Dashboard → Authentication → Email.");
    } finally {
      setLoading(false);
    }
  }

  const isForgot = mode === "forgot";
  const isSignup = mode === "signup";

  return (
    <div className="dashboard-login dashboard-login--split">
      <AuthHeroPanel variant={heroVariant} />
      <div className="dashboard-login-card">
        <h1>{isUserFlow ? "Zar Labs Social Engine" : "Zar Labs Dashboard"}</h1>
        <p>
          {isForgot
            ? "Enter your email. We will send a password reset link."
            : isSignup
              ? "Create your account — 5 free AI images per month on the Free plan."
              : isUserFlow
                ? "Sign in to your Social Engine workspace."
                : "Sign in with your admin Supabase account."}
        </p>

        {error ? <div className="dashboard-alert dashboard-alert-error">{error}</div> : null}
        {success ? <div className="dashboard-alert dashboard-alert-success">{success}</div> : null}

        {isForgot ? (
          <form className="dashboard-form" onSubmit={handleForgotPassword}>
            <div className="dashboard-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
              />
            </div>
            <button type="submit" className="dashboard-btn dashboard-btn-primary" disabled={loading}>
              {loading ? "Sending…" : "Send reset link"}
            </button>
          </form>
        ) : isSignup ? (
          <form className="dashboard-form" onSubmit={handleSignUp}>
            <div className="dashboard-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@company.com"
              />
            </div>
            <div className="dashboard-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                minLength={8}
              />
            </div>
            <button type="submit" className="dashboard-btn dashboard-btn-primary" disabled={loading}>
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>
        ) : (
          <form className="dashboard-form" onSubmit={handleSignIn}>
            <div className="dashboard-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder={isUserFlow ? "you@company.com" : "sherlockholme898@gmail.com"}
              />
            </div>
            <div className="dashboard-field">
              <div className="dashboard-field-row">
                <label htmlFor="password">Password</label>
                <button
                  type="button"
                  className="dashboard-text-link dashboard-text-link-btn"
                  onClick={() => {
                    setMode("forgot");
                    setError("");
                    setSuccess("");
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className="dashboard-btn dashboard-btn-primary" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        )}

        <p className="dashboard-login-footer">
          {isForgot ? (
            <button
              type="button"
              className="dashboard-text-link dashboard-text-link-btn"
              onClick={() => {
                setMode("signin");
                setError("");
              }}
            >
              Back to sign in
            </button>
          ) : isUserFlow ? (
            <>
              {isSignup ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="dashboard-text-link dashboard-text-link-btn"
                    onClick={() => {
                      setMode("signin");
                      setError("");
                    }}
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  New here?{" "}
                  <Link href="/join" className="dashboard-text-link">
                    Join free
                  </Link>
                  {" · "}
                  <button
                    type="button"
                    className="dashboard-text-link dashboard-text-link-btn"
                    onClick={() => {
                      setMode("signup");
                      setError("");
                    }}
                  >
                    Create account
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              Admin emails must be listed in <code>ADMIN_EMAILS</code> and exist in Supabase Auth.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
