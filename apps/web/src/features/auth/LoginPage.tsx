import React from "react";
import { useAuth } from "./AuthContext";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Sparkles, Shield, Compass, LogIn } from "lucide-react";

export function LoginPage(): React.JSX.Element {
  const { loginWithGoogle, loginDevUser, isLoading } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-rpg-bg">
      {/* Background ambient stars & dust */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rpg-surface/40 via-rpg-bg to-rpg-bg pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-rpg-amber/10 rounded-full blur-3xl pointer-events-none" />

      <main className="relative z-10 w-full max-w-md space-y-6">
        {/* Game Title & Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rpg-panel border-2 border-rpg-amber shadow-glow-amber mb-2">
            <Compass className="w-8 h-8 text-rpg-amber animate-pulse" aria-hidden="true" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wider text-rpg-parchment uppercase font-display">
            Life <span className="text-rpg-amber">RPG</span>
          </h1>
          <p className="text-sm sm:text-base text-rpg-parchment-muted italic font-medium">
            &ldquo;You tell us what you did. We turn it into progress.&rdquo;
          </p>
        </div>

        {/* Login Card */}
        <Card variant="panel" className="p-6 sm:p-8 space-y-6 border-rpg-border/80">
          <div className="space-y-2 text-center">
            <h2 className="text-lg font-bold text-rpg-parchment">
              Enter the Realm
            </h2>
            <p className="text-xs text-rpg-parchment-muted">
              Turn your real-world routines, workouts, and learning into XP, levels, and epic cosmetics.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              variant="primary"
              size="lg"
              className="w-full text-base"
              onClick={loginWithGoogle}
              isLoading={isLoading}
              leftIcon={<LogIn className="w-5 h-5" aria-hidden="true" />}
            >
              Sign In with Google
            </Button>

            <Button
              variant="secondary"
              size="md"
              className="w-full text-xs text-rpg-parchment-muted hover:text-rpg-parchment"
              onClick={() => loginDevUser("Nova")}
              disabled={isLoading}
              leftIcon={<Sparkles className="w-4 h-4 text-rpg-amber" aria-hidden="true" />}
            >
              Quick Start (Adventurer Mode)
            </Button>
          </div>

          <div className="pt-4 border-t border-rpg-border/60 flex items-center justify-center gap-4 text-xs text-rpg-parchment-muted">
            <span className="inline-flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-rpg-green" aria-hidden="true" /> Server-authoritative
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-rpg-violet" aria-hidden="true" /> No manual XP math
            </span>
          </div>
        </Card>

        {/* Accessibility & Credits Footer */}
        <footer className="text-center text-xs text-rpg-parchment-muted/60">
          <p>Keyboard friendly • Accessible • Built for heroes</p>
        </footer>
      </main>
    </div>
  );
}
