import { motion } from "framer-motion";
import type { PlayerInfo } from "@/types/game";

interface Props {
  players: PlayerInfo[];
  currentUid: string;
}

const medals = ["🥇", "🥈", "🥉"];
const rowColors = [
  "border-game-gold/30 bg-game-gold/5",
  "border-game-silver/30 bg-game-silver/5",
  "border-game-bronze/30 bg-game-bronze/5",
];

function sortableTotal(totalReactionTime: number | null): number {
  return totalReactionTime !== null && Number.isFinite(totalReactionTime) && totalReactionTime >= 0
    ? totalReactionTime
    : Number.POSITIVE_INFINITY;
}

function formatTotal(totalReactionTime: number | null): string {
  if (totalReactionTime === null || !Number.isFinite(totalReactionTime)) {
    return "Incomplete";
  }
  return `${(totalReactionTime / 1000).toFixed(3)}s`;
}

export function Leaderboard({ players, currentUid }: Props) {
  const sorted = [...players].sort(
    (a, b) => sortableTotal(a.totalReactionTime) - sortableTotal(b.totalReactionTime)
  );

  return (
    <div className="w-full max-w-lg space-y-2">
      <h3 className="font-display text-sm uppercase tracking-widest text-muted-foreground mb-4">
        Leaderboard
      </h3>
      {sorted.map((player, i) => (
        <motion.div
          key={player.uid}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`flex items-center justify-between rounded-lg border p-3 ${
            i < 3 ? rowColors[i] : "border-border bg-card"
          } ${player.uid === currentUid ? "ring-1 ring-primary/50" : ""}`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl w-8 text-center">{medals[i] ?? `#${i + 1}`}</span>
            <span className="font-medium text-foreground">
              {player.nickname}
              {player.uid === currentUid && (
                <span className="ml-2 text-xs text-primary">(you)</span>
              )}
            </span>
          </div>
          <span className="font-mono-game text-sm text-muted-foreground">
            {formatTotal(player.totalReactionTime)}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
