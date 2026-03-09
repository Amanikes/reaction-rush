import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { GameButton } from "@/components/GameButton";
import { ReactionFeedbackDisplay, getReactionRating } from "@/components/ReactionFeedback";
import { RoundIndicator } from "@/components/RoundIndicator";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { api } from "@/services/api";
import { connectSocket, joinSession, disconnectSocket } from "@/services/socket";
import type { ButtonState, ReactionFeedback, SessionRound } from "@/types/game";

interface Props {
  sessionId: string;
  uid: string;
  onComplete: (rounds: SessionRound[], players: any[]) => void;
}

// Green beep sound
function playGreenSound() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = "sine";
    gain.gain.value = 0.15;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.stop(ctx.currentTime + 0.15);
  } catch {
    // Audio not available
  }
}

export function GamePlayScreen({ sessionId, uid, onComplete }: Props) {
  const [buttons, setButtons] = useState<ButtonState[]>([
    { id: 0, color: "red" },
    { id: 1, color: "red" },
    { id: 2, color: "red" },
  ]);
  const [currentRound, setCurrentRound] = useState(0);
  const [totalRounds, setTotalRounds] = useState(3);
  const [feedback, setFeedback] = useState<ReactionFeedback | null>(null);
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState<string>("Waiting for game to start...");
  const [clickedThisRound, setClickedThisRound] = useState(false);
  const [rounds, setRounds] = useState<SessionRound[]>([]);
  const greenTimestamp = useRef<number>(0);
  const roundRef = useRef(0);

  useEffect(() => {
    const socket = connectSocket();

    socket.on("connect", () => {
      setConnected(true);
      joinSession(sessionId);
    });

    socket.on("disconnect", () => setConnected(false));

    socket.on("session.joined", (data: any) => {
      setStatus("Session joined — waiting to start...");
      if (data?.totalRounds) setTotalRounds(data.totalRounds);
    });

    socket.on("session.started", () => {
      setStatus("Get ready!");
      setCurrentRound(0);
    });

    socket.on("button.green", (data: { buttonId: number; roundNumber: number }) => {
      greenTimestamp.current = Date.now();
      roundRef.current = data.roundNumber;
      setCurrentRound(data.roundNumber);
      setClickedThisRound(false);
      setFeedback(null);
      setStatus("GO!");
      setButtons((prev) =>
        prev.map((b) => ({ ...b, color: b.id === data.buttonId ? "green" : "red" }))
      );
      playGreenSound();
    });

    socket.on("button.red", () => {
      setButtons((prev) => prev.map((b) => ({ ...b, color: "red" })));
      setStatus("Wait for green...");
    });

    socket.on("session.completed", (data: any) => {
      setButtons((prev) => prev.map((b) => ({ ...b, color: "red" })));
      onComplete(data?.rounds ?? rounds, data?.players ?? []);
    });

    socket.on("error", (data: any) => {
      setStatus(`Error: ${data?.message ?? "Unknown error"}`);
    });

    // Reconnect logic
    socket.on("reconnect", () => {
      setConnected(true);
      joinSession(sessionId);
      api.getSessionState(sessionId, uid).catch(() => {});
    });

    return () => {
      disconnectSocket();
    };
  }, [sessionId, uid, onComplete, rounds]);

  const handleButtonClick = useCallback(
    async (buttonId: number) => {
      if (clickedThisRound) return;
      setClickedThisRound(true);

      const clickedAt = new Date().toISOString();
      const reactionMs = Date.now() - greenTimestamp.current;
      const rating = getReactionRating(reactionMs);
      setFeedback(rating);

      const newRound: SessionRound = { roundNumber: roundRef.current, reactionTimeMs: reactionMs };
      setRounds((prev) => [...prev, newRound]);

      try {
        await api.submitReaction(sessionId, {
          uid,
          roundNumber: roundRef.current,
          clickedAt,
        });
      } catch {
        // Offline — reaction already recorded locally
      }
    },
    [clickedThisRound, sessionId, uid]
  );

  const totalTime = rounds.reduce((sum, r) => sum + (r.reactionTimeMs ?? 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-2xl space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display text-xs uppercase tracking-widest text-muted-foreground">
            Session
          </p>
          <p className="font-mono-game text-sm text-foreground">{sessionId}</p>
        </div>
        <ConnectionStatus connected={connected} />
      </div>

      {/* Round progress */}
      <div className="flex flex-col items-center gap-2">
        <RoundIndicator current={currentRound} total={totalRounds} />
        <p className="font-display text-sm text-muted-foreground">{status}</p>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-center gap-4 sm:gap-8">
        {buttons.map((btn) => (
          <GameButton
            key={btn.id}
            id={btn.id}
            color={btn.color}
            disabled={clickedThisRound || btn.color === "red"}
            onClick={handleButtonClick}
          />
        ))}
      </div>

      {/* Feedback */}
      <div className="min-h-[80px] flex items-center justify-center">
        <ReactionFeedbackDisplay feedback={feedback} />
      </div>

      {/* Total time */}
      {rounds.length > 0 && (
        <div className="text-center">
          <p className="font-mono-game text-xs text-muted-foreground uppercase tracking-wider">
            Total time
          </p>
          <p className="font-mono-game text-lg text-foreground">
            {(totalTime / 1000).toFixed(3)}s
          </p>
        </div>
      )}
    </motion.div>
  );
}
