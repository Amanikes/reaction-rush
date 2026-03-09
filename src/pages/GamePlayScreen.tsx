import { useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { GameButton } from "@/components/GameButton";
import { ReactionFeedbackDisplay, getReactionRating } from "@/components/ReactionFeedback";
import { RoundIndicator } from "@/components/RoundIndicator";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { api } from "@/services/api";
import { connectSocket, joinSession, disconnectSocket } from "@/services/socket";
import { useGameStore } from "@/store/gameStore";
import type { SessionRound } from "@/types/game";

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

export function GamePlayScreen() {
  const {
    uid, buttons, setButtons, currentRound, setCurrentRound,
    totalRounds, setTotalRounds, feedback, setFeedback,
    connected, setConnected, status, setStatus,
    clickedThisRound, setClickedThisRound, rounds, addRound,
    setCompletedPlayers, setScreen,
  } = useGameStore();

  const greenTimestamp = useRef<number>(0);
  const roundRef = useRef(0);

  useEffect(() => {
    // Fetch initial session state
    api.getSessionState(uid).then((state) => {
      if (state.totalRounds) setTotalRounds(state.totalRounds);
      if (state.currentRound) setCurrentRound(state.currentRound);
      if (state.buttons) {
        setButtons(state.buttons);
      }
      if (state.status === "completed") {
        setCompletedPlayers(state.players ?? []);
        setScreen("completed");
      }
    }).catch(() => {});

    const socket = connectSocket();

    socket.on("connect", () => {
      setConnected(true);
      joinSession();
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
      setButtons(
        buttons.map((b) => ({ ...b, color: b.id === data.buttonId ? "green" as const : "red" as const }))
      );
      playGreenSound();
    });

    socket.on("button.red", () => {
      setButtons(buttons.map((b) => ({ ...b, color: "red" as const })));
      setStatus("Wait for green...");
    });

    socket.on("session.completed", (data: any) => {
      setButtons(buttons.map((b) => ({ ...b, color: "red" as const })));
      setCompletedPlayers(data?.players ?? []);
      setScreen("completed");
    });

    socket.on("error", (data: any) => {
      setStatus(`Error: ${data?.message ?? "Unknown error"}`);
    });

    socket.on("reconnect", () => {
      setConnected(true);
      joinSession();
      api.getSessionState(uid).catch(() => {});
    });

    return () => {
      disconnectSocket();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  const handleButtonClick = useCallback(
    async (buttonId: number) => {
      if (clickedThisRound) return;
      setClickedThisRound(true);

      const clickedAt = new Date().toISOString();
      const reactionMs = Date.now() - greenTimestamp.current;
      const rating = getReactionRating(reactionMs);
      setFeedback(rating);

      const newRound: SessionRound = { roundNumber: roundRef.current, reactionTimeMs: reactionMs };
      addRound(newRound);

      try {
        await api.submitReaction({
          uid,
          roundNumber: roundRef.current,
          clickedAt,
        });
      } catch {
        // Offline — reaction already recorded locally
      }
    },
    [clickedThisRound, uid, setClickedThisRound, setFeedback, addRound]
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
            Reaction Game
          </p>
          <p className="font-mono-game text-sm text-foreground">UID: {uid.slice(0, 8)}…</p>
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
