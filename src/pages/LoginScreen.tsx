import { useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/services/api";
import { useGameStore } from "@/store/gameStore";
import { Zap } from "lucide-react";

export function LoginScreen() {
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUid, setScreen } = useGameStore();

  const handleJoin = async () => {
    setLoading(true);
    setError("");
    try {
      const { uid } = await api.login(nickname || "Player");
      localStorage.setItem("uid", uid);
      setUid(uid);
      setScreen("game");
    } catch {
      setError("Could not connect to server. Using offline mode.");
      const offlineUid = `offline-${Date.now()}`;
      localStorage.setItem("uid", offlineUid);
      setUid(offlineUid);
      setScreen("game");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="game-card p-8 w-full max-w-md space-y-6"
    >
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
          <Zap className="w-8 h-8 text-primary" />
        </div>
        <h1 className="font-display text-2xl font-bold text-glow">REACTION</h1>
        <p className="text-muted-foreground text-sm">Test your reflexes against others</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="font-mono-game text-xs text-muted-foreground uppercase tracking-wider block mb-2">
            Nickname
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Enter your name..."
            className="w-full rounded-lg bg-input border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono-game"
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
          />
        </div>

        {error && <p className="text-destructive text-sm font-mono-game">{error}</p>}

        <button
          onClick={handleJoin}
          disabled={loading}
          className="w-full rounded-lg bg-primary py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50 game-glow"
        >
          {loading ? "Connecting..." : "Join Game"}
        </button>
      </div>
    </motion.div>
  );
}
