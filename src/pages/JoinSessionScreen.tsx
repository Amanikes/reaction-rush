import { useState } from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";

interface Props {
  onJoin: (sessionId: string) => void;
}

export function JoinSessionScreen({ onJoin }: Props) {
  const [sessionId, setSessionId] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="game-card p-8 w-full max-w-md space-y-6"
    >
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-4">
          <Users className="w-8 h-8 text-accent" />
        </div>
        <h2 className="font-display text-xl font-bold">Join Session</h2>
        <p className="text-muted-foreground text-sm">Enter the session code to join</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="font-mono-game text-xs text-muted-foreground uppercase tracking-wider block mb-2">
            Session ID
          </label>
          <input
            type="text"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value.toUpperCase())}
            placeholder="ABCD-1234"
            className="w-full rounded-lg bg-input border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono-game text-center text-lg tracking-widest"
            onKeyDown={(e) => e.key === "Enter" && sessionId && onJoin(sessionId)}
          />
        </div>

        <button
          onClick={() => onJoin(sessionId)}
          disabled={!sessionId}
          className="w-full rounded-lg bg-primary py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50 game-glow"
        >
          Join Session
        </button>
      </div>
    </motion.div>
  );
}
