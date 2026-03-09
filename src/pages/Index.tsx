import { useState, useCallback } from "react";
import { LoginScreen } from "./LoginScreen";
import { JoinSessionScreen } from "./JoinSessionScreen";
import { GamePlayScreen } from "./GamePlayScreen";
import { CompletedScreen } from "./CompletedScreen";
import type { GameScreen, SessionRound, PlayerInfo } from "@/types/game";

const Index = () => {
  const [screen, setScreen] = useState<GameScreen>(() => {
    return localStorage.getItem("uid") ? "join" : "login";
  });
  const [uid, setUid] = useState(() => localStorage.getItem("uid") ?? "");
  const [sessionId, setSessionId] = useState("");
  const [completedRounds, setCompletedRounds] = useState<SessionRound[]>([]);
  const [players, setPlayers] = useState<PlayerInfo[]>([]);

  const handleLogin = useCallback((newUid: string) => {
    setUid(newUid);
    setScreen("join");
  }, []);

  const handleJoinSession = useCallback((id: string) => {
    setSessionId(id);
    setScreen("play");
  }, []);

  const handleComplete = useCallback((rounds: SessionRound[], playerList: PlayerInfo[]) => {
    setCompletedRounds(rounds);
    setPlayers(playerList);
    setScreen("completed");
  }, []);

  const handlePlayAgain = useCallback(() => {
    setSessionId("");
    setCompletedRounds([]);
    setPlayers([]);
    setScreen("join");
  }, []);

  return (
    <div className="min-h-screen bg-background bg-grid-pattern flex items-center justify-center p-4">
      <div className="flex flex-col items-center w-full animate-fade-in">
        {screen === "login" && <LoginScreen onLogin={handleLogin} />}
        {screen === "join" && <JoinSessionScreen onJoin={handleJoinSession} />}
        {screen === "play" && (
          <GamePlayScreen sessionId={sessionId} uid={uid} onComplete={handleComplete} />
        )}
        {screen === "completed" && (
          <CompletedScreen
            rounds={completedRounds}
            players={players}
            uid={uid}
            onPlayAgain={handlePlayAgain}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
