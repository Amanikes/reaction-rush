import { useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/services/api";
import { useGameStore } from "@/store/gameStore";
import { Settings, Trophy, ArrowLeft } from "lucide-react";
import type { AdminSessionResults } from "@/types/game";

function sortableTotal(totalReactionTime: number): number {
  return Number.isFinite(totalReactionTime) && totalReactionTime >= 0
    ? totalReactionTime
    : Number.POSITIVE_INFINITY;
}

export function AdminScreen() {
  const { setScreen } = useGameStore();
  const [adminKey, setAdminKey] = useState(
    () => localStorage.getItem("admin_api_key") ?? "",
  );
  const [durationSeconds, setDurationSeconds] = useState(30);
  const [startDelay, setStartDelay] = useState(5);
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState("");
  const [resultsMsg, setResultsMsg] = useState("");
  const [results, setResults] = useState<AdminSessionResults | null>(null);
  const [loadingResults, setLoadingResults] = useState(false);

  const updateAdminKey = (value: string) => {
    setAdminKey(value);
    localStorage.setItem("admin_api_key", value);
  };

  const handleCreate = async () => {
    const trimmedKey = adminKey.trim();
    if (!trimmedKey) {
      setCreateMsg("Enter an admin key first.");
      return;
    }

    setCreating(true);
    setCreateMsg("");
    try {
      const startAt = new Date(Date.now() + startDelay * 1000).toISOString();
      await api.createSession({ startAt, durationSeconds }, trimmedKey);
      setCreateMsg("Session created successfully!");
    } catch {
      setCreateMsg("Failed to create session. Check your admin key.");
    } finally {
      setCreating(false);
    }
  };

  const handleFetchResults = async () => {
    const trimmedKey = adminKey.trim();
    if (!trimmedKey) {
      setResults(null);
      setResultsMsg("Enter an admin key first.");
      return;
    }

    setLoadingResults(true);
    setResultsMsg("");
    try {
      const data = await api.getSessionResults(trimmedKey);
      setResults(data);
      if (!data.players || data.players.length === 0) {
        setResultsMsg("No completed player results yet.");
      }
    } catch {
      setResults(null);
      setResultsMsg("Failed to fetch results. Check your admin key.");
    } finally {
      setLoadingResults(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-lg space-y-6"
    >
      <button
        onClick={() => setScreen("game")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-mono-game text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Game
      </button>

      {/* Create Session */}
      <div className="game-card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10">
            <Settings className="w-5 h-5 text-accent" />
          </div>
          <h2 className="font-display text-lg font-bold">Create Session</h2>
        </div>

        <div>
          <label className="font-mono-game text-xs text-muted-foreground uppercase tracking-wider block mb-2">
            Admin Key
          </label>
          <input
            type="password"
            value={adminKey}
            onChange={(e) => updateAdminKey(e.target.value)}
            placeholder="Enter x-admin-key value"
            className="w-full rounded-lg bg-input border border-border px-4 py-3 text-foreground font-mono-game focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-mono-game text-xs text-muted-foreground uppercase tracking-wider block mb-2">
              Start Delay (s)
            </label>
            <input
              type="number"
              value={startDelay}
              onChange={(e) => setStartDelay(Number(e.target.value))}
              min={1}
              className="w-full rounded-lg bg-input border border-border px-4 py-3 text-foreground font-mono-game focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="font-mono-game text-xs text-muted-foreground uppercase tracking-wider block mb-2">
              Duration (s)
            </label>
            <input
              type="number"
              value={durationSeconds}
              onChange={(e) => setDurationSeconds(Number(e.target.value))}
              min={5}
              className="w-full rounded-lg bg-input border border-border px-4 py-3 text-foreground font-mono-game focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {createMsg && (
          <p className={`font-mono-game text-sm ${createMsg.includes("success") ? "text-primary" : "text-destructive"}`}>
            {createMsg}
          </p>
        )}

        <button
          onClick={handleCreate}
          disabled={creating}
          className="w-full rounded-lg bg-primary py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50 game-glow"
        >
          {creating ? "Creating..." : "Create Session"}
        </button>
      </div>

      {/* View Results */}
      <div className="game-card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <Trophy className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-display text-lg font-bold">Session Results</h2>
        </div>

        <button
          onClick={handleFetchResults}
          disabled={loadingResults}
          className="w-full rounded-lg bg-secondary py-3 font-display text-sm font-bold uppercase tracking-widest text-secondary-foreground transition-all hover:bg-secondary/80 disabled:opacity-50"
        >
          {loadingResults ? "Loading..." : "Fetch Results"}
        </button>

        {resultsMsg && (
          <p className="font-mono-game text-sm text-muted-foreground">{resultsMsg}</p>
        )}

        {results && results.players && (
          <div className="space-y-2">
            {[...results.players]
              .sort(
                (a, b) =>
                  sortableTotal(a.totalReactionTime) -
                  sortableTotal(b.totalReactionTime)
              )
              .map((player, i) => (
                <div
                  key={player.uid}
                  className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg w-8 text-center">
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                    </span>
                    <span className="font-medium text-foreground">{player.nickname}</span>
                  </div>
                  <span className="font-mono-game text-sm text-muted-foreground">
                    {(player.totalReactionTime / 1000).toFixed(3)}s
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
