import { createServerClient } from "../supabase/server";

export async function listChatSessions(memberId) {
  const db = createServerClient();
  const { data, error } = await db
    .from("social_engine_chat_sessions")
    .select("id, title, updated_at, created_at")
    .eq("member_id", memberId)
    .order("updated_at", { ascending: false })
    .limit(20);
  if (error) throw error;
  return data || [];
}

export async function getChatSession(sessionId, memberId) {
  const db = createServerClient();
  const { data, error } = await db
    .from("social_engine_chat_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("member_id", memberId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createChatSession(memberId, title = "Strategy chat") {
  const db = createServerClient();
  const { data, error } = await db
    .from("social_engine_chat_sessions")
    .insert({ member_id: memberId, title, messages: [] })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function appendChatMessages(sessionId, memberId, newMessages) {
  const session = await getChatSession(sessionId, memberId);
  if (!session) return null;

  const messages = [...(session.messages || []), ...newMessages];
  const db = createServerClient();
  const { data, error } = await db
    .from("social_engine_chat_sessions")
    .update({ messages, updated_at: new Date().toISOString() })
    .eq("id", sessionId)
    .eq("member_id", memberId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
