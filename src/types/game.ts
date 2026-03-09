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
  sessionId: string;
  status: "waiting" | "active" | "completed";
  currentRound: number;
  totalRounds: number;
  rounds: SessionRound[];
  players: PlayerInfo[];
}

export interface PlayerInfo {
  uid: string;
  nickname: string;
  totalReactionTime: number;
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

export type GameScreen = "login" | "join" | "play" | "completed";

export interface ReactionFeedback {
  timeMs: number;
  rating: "lightning" | "fast" | "good";
  emoji: string;
  label: string;
}
