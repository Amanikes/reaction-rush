import type {
  PlayerInfo,
  LoginResponse,
  SessionRound,
  SessionState,
  SubmitReactionRequest,
  SubmitReactionResponse,
  CreateSessionRequest,
  AdminSessionResults,
} from "@/types/game";

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

type RawStanding = {
  uid: string;
  nickname: string | null;
  totalReactionTimeMs: number | null;
  rounds: Array<{ roundNumber: number; reactionTimeMs: number | null }>;
};

type RawAdminResults = {
  status?: string;
  rounds?: SessionRound[];
  players?: PlayerInfo[];
  standings?: RawStanding[];
};

function toValidMs(value: unknown): number | null {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }
  return parsed;
}

function getAdminHeaders(adminKey: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    "x-admin-key": adminKey,
  };
}

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

  createSession(data: CreateSessionRequest, adminKey: string): Promise<any> {
    return request("/admin/sessions", {
      method: "POST",
      headers: getAdminHeaders(adminKey),
      body: JSON.stringify(data),
    });
  },

  getSessionResults(adminKey: string): Promise<AdminSessionResults> {
    return request<RawAdminResults>("/admin/sessions/results", {
      headers: getAdminHeaders(adminKey),
    }).then((raw) => {
      const players = raw.players
        ? raw.players
            .map((entry) => {
              const totalReactionTime = toValidMs(entry.totalReactionTime);
              if (totalReactionTime === null) {
                return null;
              }

              return {
                uid: entry.uid,
                nickname: entry.nickname ?? entry.uid,
                totalReactionTime,
                rounds: entry.rounds ?? [],
              };
            })
            .filter((entry): entry is PlayerInfo => entry !== null)
        : (raw.standings ?? [])
            .map((entry) => {
              const totalReactionTime = toValidMs(entry.totalReactionTimeMs);
              if (totalReactionTime === null) {
                return null;
              }

              return {
                uid: entry.uid,
                nickname: entry.nickname ?? entry.uid,
                totalReactionTime,
                rounds: entry.rounds.map((round) => ({
                  roundNumber: round.roundNumber,
                  reactionTimeMs: round.reactionTimeMs,
                })),
              };
            })
            .filter((entry): entry is PlayerInfo => entry !== null);

      return {
        status: raw.status ?? "unknown",
        rounds: raw.rounds ?? [],
        players,
      };
    });
  },
};
