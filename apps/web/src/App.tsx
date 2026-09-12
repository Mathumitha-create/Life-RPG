import React from "react";
import { useAuth } from "./features/auth/AuthContext";
import { LoginPage } from "./features/auth/LoginPage";
import { GameShell } from "./components/layout/GameShell";
import { Compass } from "lucide-react";

export function App(): React.JSX.Element {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-rpg-bg flex flex-col items-center justify-center p-4 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rpg-panel border-2 border-rpg-amber flex items-center justify-center shadow-glow-amber animate-bounce">
          <Compass className="w-7 h-7 text-rpg-amber animate-spin" aria-hidden="true" />
        </div>
        <p className="text-sm font-semibold text-rpg-parchment font-display tracking-wider">
          Entering Life RPG Realm...
        </p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return <GameShell />;
}

export default App;
