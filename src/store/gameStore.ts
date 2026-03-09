import { create } from "zustand";
import type { ButtonState, SessionRound, PlayerInfo, ReactionFeedback, GameScreen } from "@/types/game";

interface GameStore {
  // Auth
  uid: string;
  setUid: (uid: string) => void;

  // Navigation
  screen: GameScreen;
  setScreen: (screen: GameScreen) => void;

  // Game state
  buttons: ButtonState[];
  setButtons: (buttons: ButtonState[]) => void;
  currentRound: number;
  setCurrentRound: (round: number) => void;
  totalRounds: number;
  setTotalRounds: (total: number) => void;
  status: string;
  setStatus: (status: string) => void;
  connected: boolean;
  setConnected: (connected: boolean) => void;
  clickedThisRound: boolean;
  setClickedThisRound: (clicked: boolean) => void;
  feedback: ReactionFeedback | null;
  setFeedback: (feedback: ReactionFeedback | null) => void;
  rounds: SessionRound[];
  addRound: (round: SessionRound) => void;

  // Completed
  completedPlayers: PlayerInfo[];
  setCompletedPlayers: (players: PlayerInfo[]) => void;

  // Reset
  resetGame: () => void;
}

const initialButtons: ButtonState[] = [
  { id: 0, color: "red" },
  { id: 1, color: "red" },
  { id: 2, color: "red" },
];

export const useGameStore = create<GameStore>((set) => ({
  uid: localStorage.getItem("uid") ?? "",
  setUid: (uid) => set({ uid }),

  screen: localStorage.getItem("uid") ? "game" : "login",
  setScreen: (screen) => set({ screen }),

  buttons: [...initialButtons],
  setButtons: (buttons) => set({ buttons }),
  currentRound: 0,
  setCurrentRound: (currentRound) => set({ currentRound }),
  totalRounds: 3,
  setTotalRounds: (totalRounds) => set({ totalRounds }),
  status: "Waiting for game to start...",
  setStatus: (status) => set({ status }),
  connected: false,
  setConnected: (connected) => set({ connected }),
  clickedThisRound: false,
  setClickedThisRound: (clickedThisRound) => set({ clickedThisRound }),
  feedback: null,
  setFeedback: (feedback) => set({ feedback }),
  rounds: [],
  addRound: (round) => set((s) => ({ rounds: [...s.rounds, round] })),

  completedPlayers: [],
  setCompletedPlayers: (completedPlayers) => set({ completedPlayers }),

  resetGame: () =>
    set({
      buttons: [...initialButtons],
      currentRound: 0,
      status: "Waiting for game to start...",
      clickedThisRound: false,
      feedback: null,
      rounds: [],
      completedPlayers: [],
      screen: "game",
    }),
}));
