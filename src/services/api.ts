import type {
  LoginResponse,
  SessionState,
  SubmitReactionRequest,
  SubmitReactionResponse,
  CreateSessionRequest,
  AdminSessionResults,
} from "@/types/game";

const API_BASE = "http://localhost:3000";
const ADMIN_KEY = "dev-admin-key";

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

  getSessionState(uid: string): Promise<SessionState> {
    return request(`/sessions/current/state?uid=${uid}`);
  },

  submitReaction(data: SubmitReactionRequest): Promise<SubmitReactionResponse> {
    return request("/sessions/current/reactions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  createSession(data: CreateSessionRequest): Promise<any> {
    return request("/admin/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": ADMIN_KEY,
      },
      body: JSON.stringify(data),
    });
  },

  getSessionResults(): Promise<AdminSessionResults> {
    return request("/admin/sessions/results", {
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": ADMIN_KEY,
      },
    });
  },
};
