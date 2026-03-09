import { motion } from "framer-motion";
import { Leaderboard } from "@/components/Leaderboard";
import { Trophy } from "lucide-react";
import type { SessionRound, PlayerInfo } from "@/types/game";

interface Props {
  rounds: SessionRound[];
  players: PlayerInfo[];
  uid: string;
  onPlayAgain: () => void;
}

export function CompletedScreen({ rounds, players, uid, onPlayAgain }: Props) {
  const totalTime = rounds.reduce((sum, r) => sum + (r.reactionTimeMs ?? 0), 0);
  const winner = players.length > 0
    ? [...players].sort((a, b) => a.totalReactionTime - b.totalReactionTime)[0]
    : null;
  const isWinner = winner?.uid === uid;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-lg space-y-8 text-center"
    >
      <div className="space-y-3">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 game-glow-intense">
          <Trophy className="w-10 h-10 text-primary" />
        </div>
        <h2 className="font-display text-2xl font-bold text-glow">
          {isWinner ? "YOU WIN!" : "GAME OVER"}
        </h2>
        {winner && (
          <p className="text-muted-foreground">
            Winner: <span className="text-primary font-semibold">{winner.nickname}</span>
          </p>
        )}
      </div>

      {/* Your results */}
      <div className="game-card p-6 space-y-3">
        <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground">
          Your Results
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {rounds.map((r) => (
            <div key={r.roundNumber} className="space-y-1">
              <p className="font-mono-game text-xs text-muted-foreground">R{r.roundNumber}</p>
              <p className="font-mono-game text-sm text-foreground">
                {r.reactionTimeMs ? `${(r.reactionTimeMs / 1000).toFixed(3)}s` : "—"}
              </p>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-3">
          <p className="font-mono-game text-xs text-muted-foreground">Total</p>
          <p className="font-mono-game text-xl font-bold text-primary text-glow">
            {(totalTime / 1000).toFixed(3)}s
          </p>
        </div>
      </div>

      {players.length > 0 && <Leaderboard players={players} currentUid={uid} />}

      <button
        onClick={onPlayAgain}
        className="w-full rounded-lg bg-secondary py-3 font-display text-sm font-bold uppercase tracking-widest text-secondary-foreground transition-all hover:bg-secondary/80"
      >
        Play Again
      </button>
    </motion.div>
  );
}
