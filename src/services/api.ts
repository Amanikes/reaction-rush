import type { LoginResponse, SessionState, SubmitReactionRequest, SubmitReactionResponse } from "@/types/game";

const API_BASE = "http://localhost:3000";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  login(nickname: string): Promise<LoginResponse> {
    return request("/users/login", {
      method: "POST",
      body: JSON.stringify({ nickname }),
    });
  },

  getSessionState(sessionId: string, uid: string): Promise<SessionState> {
    return request(`/sessions/${sessionId}/state?uid=${uid}`);
  },

  submitReaction(sessionId: string, data: SubmitReactionRequest): Promise<SubmitReactionResponse> {
    return request(`/sessions/${sessionId}/reactions`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
