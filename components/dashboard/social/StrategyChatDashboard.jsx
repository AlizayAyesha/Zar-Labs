"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AdminCmsEditorShell } from "../AdminCmsEditorShell";
import { PlanUsagePanel } from "./PlanUsagePanel";
import {
  fetchCalendarTaskById,
  readStashedStudioTask,
  resolveStudioTask,
} from "../../../lib/social/calendarTaskNavigation";
import { getBrandStyle } from "../../../constants/social/brandChipStyles";

const QUICK_PROMPTS = [
  "Give me a 7-day LinkedIn + Instagram plan for my niche",
  "Write 5 hook ideas for a B2B SaaS audience",
  "Suggest a carousel outline with an image brief for the cover slide",
  "What should I post this week to get discovery calls?",
];

function taskContextBlock(task) {
  if (!task) return "";
  return `[Calendar post context]
Channel: ${task.channel}
Brand: ${task.brand_shortcut}
Publish: ${task.publishing_date} ${task.scheduled_time || ""}
Title: ${task.what_to_post || task.task_title}
Brief: ${task.what_to_post}
CTA: ${task.cta} → ${task.cta_link}
Topic: ${task.campaign_topic || ""}

Help me plan copy and propose a marketing image brief (do not generate the image until I confirm).`;
}

function ChatBubble({ message, onGenerateImage, generating, imagesDisabled, usage, limits, showGenerateButton }) {
  const imagesUsed = usage?.imagesGenerated || 0;
  const imagesCap = limits?.images || 5;
  const canGenerate =
    showGenerateButton &&
    !imagesDisabled &&
    message.imageBrief &&
    !message.imageUrl &&
    imagesUsed < imagesCap;

  return (
    <div className={`se-chat-bubble se-chat-bubble-${message.role}`}>
      <div className="se-chat-bubble-meta">{message.role === "user" ? "You" : "Social Engine"}</div>
      <div className="se-chat-bubble-body">{message.content}</div>

      {message.imageBrief && !message.imageUrl ? (
        <div className="se-chat-image-brief-card">
          <p className="se-chat-image-brief-label">Proposed image brief (not rendered yet)</p>
          <dl className="se-chat-image-brief-dl">
            <dt>Headline</dt>
            <dd>{message.imageBrief.headline}</dd>
            {message.imageBrief.subline ? (
              <>
                <dt>Subline</dt>
                <dd>{message.imageBrief.subline}</dd>
              </>
            ) : null}
            <dt>Layout</dt>
            <dd>{message.imageBrief.layout}</dd>
          </dl>
          {canGenerate ? (
            <button
              type="button"
              className="dashboard-btn dashboard-btn-primary"
              disabled={generating}
              onClick={() => onGenerateImage(message.imageBrief)}
            >
              {generating ? "Generating…" : `Generate image (${imagesUsed}/${imagesCap} used)`}
            </button>
          ) : null}
          {imagesDisabled ? (
            <p className="admin-cms-placeholder">Chat images disabled — use Image Studio or Trending Looks.</p>
          ) : null}
        </div>
      ) : null}

      {message.imageUrl ? (
        <figure className={`se-chat-inline-image${message.watermark ? " is-watermarked" : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={message.imageUrl} alt={message.imageBrief?.headline || "Generated"} loading="lazy" />
          {message.watermark ? <span className="se-watermark-badge">Zar Labs Free</span> : null}
          <figcaption>
            <a href={message.imageUrl} target="_blank" rel="noopener noreferrer">
              Open full size ↗
            </a>
            {message.imagePrompt ? (
              <button
                type="button"
                className="dashboard-text-link dashboard-text-link-btn"
                onClick={() => navigator.clipboard.writeText(message.imagePrompt)}
              >
                Copy prompt
              </button>
            ) : null}
          </figcaption>
        </figure>
      ) : null}
    </div>
  );
}

function StrategyChatInner() {
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState("free");
  const [usage, setUsage] = useState(null);
  const [limits, setLimits] = useState(null);
  const [engineSettings, setEngineSettings] = useState(null);
  const [task, setTask] = useState(null);
  const [taskLoaded, setTaskLoaded] = useState(false);
  const bottomRef = useRef(null);

  const imagesDisabled = engineSettings?.strategyChatImages === "disabled";

  const refreshSession = useCallback(async (id) => {
    if (!id) return;
    const res = await fetch(`/api/social-engine/chat?sessionId=${encodeURIComponent(id)}`);
    if (!res.ok) return;
    const json = await res.json();
    if (json.session?.messages) setMessages(json.session.messages);
    if (json.engineSettings) setEngineSettings(json.engineSettings);
  }, []);

  const loadAccount = useCallback(async () => {
    const [meRes, chatRes] = await Promise.all([
      fetch("/api/social-engine/me"),
      fetch("/api/social-engine/chat"),
    ]);
    if (meRes.ok) {
      const me = await meRes.json();
      setPlan(me.subscriptionPlan || "free");
      setUsage(me.usage);
      setLimits(me.limits);
    }
    if (chatRes.ok) {
      const chat = await chatRes.json();
      setEngineSettings(chat.engineSettings);
    }
  }, []);

  useEffect(() => {
    loadAccount();
  }, [loadAccount]);

  useEffect(() => {
    async function loadTask() {
      let calendarTask = resolveStudioTask(taskId);
      if (!calendarTask && taskId) {
        calendarTask = await fetchCalendarTaskById(taskId);
      }
      if (!calendarTask && taskId) {
        calendarTask = readStashedStudioTask();
      }
      setTask(calendarTask || null);
      setTaskLoaded(true);
    }
    loadTask();
  }, [taskId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, generating]);

  async function sendMessage(text) {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput("");
    setError("");
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setLoading(true);
    try {
      const res = await fetch("/api/social-engine/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          sessionId,
          taskContext: task && messages.length === 0 ? taskContextBlock(task) : undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      if (json.sessionId) setSessionId(json.sessionId);

      if (json.generatedImage) {
        await refreshSession(json.sessionId);
        loadAccount();
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: json.reply,
            imageBrief: json.imageBrief || null,
          },
        ]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function generateImage(brief) {
    if (!sessionId || generating || imagesDisabled) return;
    setError("");
    setGenerating(true);
    try {
      const res = await fetch("/api/social-engine/chat/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, brief }),
      });
      const json = await res.json();
      if (!res.ok) {
        if (json.prompt) {
          await navigator.clipboard.writeText(json.prompt);
          throw new Error(`${json.error} Prompt copied — paste into another tool if needed.`);
        }
        throw new Error(json.error || "Generation failed");
      }
      if (json.prompt && engineSettings?.showCopyPromptOnFail) {
        /* available on fail path */
      }
      await refreshSession(sessionId);
      loadAccount();
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  const brandStyle = task ? getBrandStyle(task.brand_id) : null;

  return (
    <AdminCmsEditorShell
      title={task ? "Strategy & production" : "Strategy Chat"}
      description="Plan content here. Images render only when you confirm — they appear inline in this thread."
    >
      {limits ? (
        <div className="dashboard-card">
          <PlanUsagePanel usage={usage || {}} limits={limits} subscriptionPlan={plan} />
        </div>
      ) : null}

      {task ? (
        <div className="se-studio-task-banner dashboard-card">
          <div className="se-studio-task-meta">
            {brandStyle ? (
              <span className="social-task-chip-brand" style={brandStyle.badge}>
                {task.brand_shortcut}
              </span>
            ) : null}
            <span>{task.channel}</span>
            <span>Publish {task.publishing_date}</span>
          </div>
          <h2 className="se-studio-task-title">{task.what_to_post || task.task_title}</h2>
          <div className="dashboard-actions">
            <Link href="/dashboard/social-media-management/schedule-calendar" className="dashboard-btn">
              ← Back to Schedule
            </Link>
            {taskLoaded && !messages.length ? (
              <button
                type="button"
                className="dashboard-btn dashboard-btn-primary"
                disabled={loading}
                onClick={() => sendMessage(taskContextBlock(task))}
              >
                Plan this post
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="se-chat-layout">
        <aside className="se-chat-sidebar dashboard-card">
          <h2>Quick prompts</h2>
          <div className="se-chat-chips">
            {QUICK_PROMPTS.map((p) => (
              <button key={p} type="button" className="dashboard-btn se-chat-chip" onClick={() => sendMessage(p)}>
                {p}
              </button>
            ))}
          </div>
          <p className="admin-cms-placeholder">
            Plan: <strong>{plan}</strong>
            {engineSettings?.strategyChatImages === "confirm"
              ? " · Confirm before images render"
              : engineSettings?.strategyChatImages === "command_only"
                ? " · Say “generate the image” to render"
                : imagesDisabled
                  ? " · Chat images off"
                  : null}
          </p>
          <p className="admin-cms-placeholder">
            Standalone image tools:{" "}
            <Link href="/dashboard/site-system/social-engine/image-studio" className="dashboard-text-link">
              Image Studio
            </Link>
            {" · "}
            <Link href="/dashboard/site-system/social-engine/trending-looks" className="dashboard-text-link">
              Trending Looks
            </Link>
          </p>
        </aside>

        <div className="se-chat-main dashboard-card">
          <div className="se-chat-thread">
            {!messages.length ? (
              <p className="admin-cms-placeholder">
                Ask about strategy, weekly plans, hooks, or request an image brief. Nothing renders until you confirm
                generation — images show up right here in the chat.
              </p>
            ) : null}
            {messages.map((m, i) => (
              <ChatBubble
                key={i}
                message={m}
                onGenerateImage={generateImage}
                generating={generating}
                imagesDisabled={imagesDisabled}
                usage={usage}
                limits={limits}
                showGenerateButton={engineSettings?.strategyChatImages === "confirm"}
              />
            ))}
            {loading ? <p className="admin-cms-placeholder">Thinking…</p> : null}
            <div ref={bottomRef} />
          </div>

          {error ? <p className="dashboard-alert dashboard-alert-error">{error}</p> : null}

          <form
            className="se-chat-composer"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <textarea
              rows={3}
              value={input}
              placeholder={
                imagesDisabled
                  ? "Ask about LinkedIn strategy, weekly plans, hooks…"
                  : "Ask for strategy, or say “generate the image” after a brief…"
              }
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button type="submit" className="dashboard-btn dashboard-btn-primary" disabled={loading || !input.trim()}>
              Send
            </button>
          </form>
        </div>
      </div>
    </AdminCmsEditorShell>
  );
}

export function StrategyChatDashboard() {
  return (
    <Suspense fallback={<p className="admin-cms-placeholder">Loading strategy chat…</p>}>
      <StrategyChatInner />
    </Suspense>
  );
}
