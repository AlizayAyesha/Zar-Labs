"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "../../../../lib/supabase/browser-ssr";
import { logAuthClient } from "../../../../lib/dashboard/log-auth-client";

export default function ResetPasswordClient() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(null);

  useEffect(() => {
    const supabase = createBrowserClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessionReady(!!session);
    });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createBrowserClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      logAuthClient("password_reset_completed");
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Could not update password. Request a new reset link.");
    } finally {
      setLoading(false);
    }
  }

  if (sessionReady === null) {
    return (
      <div className="dashboard-login">
        <div className="dashboard-login-card">
          <p>Verifying reset link…</p>
        </div>
      </div>
    );
  }

  if (!sessionReady) {
    return (
      <div className="dashboard-login">
        <div className="dashboard-login-card">
          <h1>Reset link expired</h1>
          <p>This password reset link is invalid or has expired.</p>
          <Link href="/dashboard/login" className="dashboard-text-link">
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-login">
      <div className="dashboard-login-card">
        <h1>Set a new password</h1>
        <p>Choose a new password for your Zar Labs dashboard account.</p>

        {error ? <div className="dashboard-alert dashboard-alert-error">{error}</div> : null}

        <form className="dashboard-form" onSubmit={handleSubmit}>
          <div className="dashboard-field">
            <label htmlFor="password">New password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          <div className="dashboard-field">
            <label htmlFor="confirm">Confirm password</label>
            <input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          <button type="submit" className="dashboard-btn dashboard-btn-primary" disabled={loading}>
            {loading ? "Saving…" : "Update password"}
          </button>
        </form>

        <p className="dashboard-login-footer">
          <Link href="/dashboard/login" className="dashboard-text-link">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
