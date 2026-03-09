import { LoginScreen } from "./LoginScreen";
import { GamePlayScreen } from "./GamePlayScreen";
import { CompletedScreen } from "./CompletedScreen";
import { AdminScreen } from "./AdminScreen";
import { useGameStore } from "@/store/gameStore";
import { Settings } from "lucide-react";

const Index = () => {
  const { screen, setScreen } = useGameStore();

  return (
    <div className="min-h-screen bg-background bg-grid-pattern flex items-center justify-center p-4 relative">
      {/* Admin toggle */}
      {screen !== "admin" && (
        <button
          onClick={() => setScreen("admin")}
          className="absolute top-4 right-4 p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Admin panel"
        >
          <Settings className="w-5 h-5" />
        </button>
      )}

      <div className="flex flex-col items-center w-full animate-fade-in">
        {screen === "login" && <LoginScreen />}
        {screen === "game" && <GamePlayScreen />}
        {screen === "completed" && <CompletedScreen />}
        {screen === "admin" && <AdminScreen />}
      </div>
    </div>
  );
};

export default Index;
