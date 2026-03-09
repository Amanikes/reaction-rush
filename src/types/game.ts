export type ButtonColor = "red" | "green";

export interface ButtonState {
  id: number;
  color: ButtonColor;
}

export interface SessionRound {
  roundNumber: number;
  reactionTimeMs: number | null;
}

export interface SessionState {
  status: "waiting" | "active" | "completed";
  currentRound: number;
  totalRounds: number;
  rounds: SessionRound[];
  players: PlayerInfo[];
  buttons?: ButtonState[];
}

export interface PlayerInfo {
  uid: string;
  nickname: string;
  totalReactionTime: number | null;
  rounds: SessionRound[];
}

export interface SubmitReactionRequest {
  uid: string;
  roundNumber: number;
  clickedAt: string;
}

export interface SubmitReactionResponse {
  reactionTimeMs: number;
  roundNumber: number;
}

export interface LoginResponse {
  uid: string;
}

export interface CreateSessionRequest {
  startAt: string;
  durationSeconds: number;
}

export interface AdminSessionResults {
  players: PlayerInfo[];
  rounds: SessionRound[];
  status: string;
}

export type GameScreen = "login" | "game" | "completed" | "admin";

export interface ReactionFeedback {
  timeMs: number;
  rating: "lightning" | "fast" | "good";
  emoji: string;
  label: string;
}
