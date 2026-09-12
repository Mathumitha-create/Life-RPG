import React, { useState } from "react";
import { TopHud } from "./TopHud";
import { Nav, type NavTab } from "./Nav";
import { Card } from "../ui/Card";
import { Sparkles, ScrollText, Compass, Shield } from "lucide-react";

export function GameShell(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<NavTab>("home");

  return (
    <div className="min-h-screen bg-rpg-bg flex flex-col justify-between text-rpg-parchment pb-20 sm:pb-4">
      {/* Top HUD */}
      <TopHud totalXp={820} gold={680} gems={24} streak={5} nickname="Nova" />

      {/* Main World Stage */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        {activeTab === "home" && (
          <div className="space-y-6">
            {/* 2D Game World Viewport */}
            <div className="relative w-full aspect-16/9 sm:aspect-21/9 rounded-2xl bg-gradient-to-b from-rpg-surface to-rpg-panel border-2 border-rpg-border flex flex-col items-center justify-center p-6 text-center shadow-pixel overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-rpg-amber/10 via-transparent to-transparent pointer-events-none" />
              
              {/* Character representation preview */}
              <div className="relative z-10 flex flex-col items-center space-y-3">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-rpg-surface border-2 border-rpg-amber shadow-glow-amber flex items-center justify-center text-3xl animate-bounce duration-1000">
                  🧙‍♂️
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold font-display text-rpg-parchment">
                    Nova the Adventurer
                  </h2>
                  <p className="text-xs text-rpg-amber font-semibold">
                    Level 8 Vanguard • 820 / 1000 XP
                  </p>
                </div>
              </div>
            </div>

            {/* Today's Quests Card Stack Preview */}
            <Card variant="panel" className="space-y-4">
              <div className="flex items-center justify-between border-b border-rpg-border pb-3">
                <div className="flex items-center gap-2">
                  <ScrollText className="w-5 h-5 text-rpg-amber" aria-hidden="true" />
                  <h3 className="font-bold text-sm sm:text-base text-rpg-parchment">
                    Today&apos;s Quests
                  </h3>
                </div>
                <span className="text-xs font-semibold text-rpg-green bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                  3 Active
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-3 rounded-lg bg-rpg-surface border border-rpg-border hover:border-rpg-amber/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-lg" aria-hidden="true">📚</span>
                    <div>
                      <p className="text-sm font-semibold text-rpg-parchment">Study DSA for 1 hour</p>
                      <p className="text-xs text-rpg-parchment-muted">Mind • Duration: 60m</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-rpg-amber bg-amber-950/40 px-2 py-1 rounded">
                    +60 XP
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-rpg-surface border border-rpg-border hover:border-rpg-amber/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-lg" aria-hidden="true">🏃</span>
                    <div>
                      <p className="text-sm font-semibold text-rpg-parchment">Walk 5 km</p>
                      <p className="text-xs text-rpg-parchment-muted">Body • Distance: 5km</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-rpg-amber bg-amber-950/40 px-2 py-1 rounded">
                    +70 XP
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-rpg-surface border border-rpg-border hover:border-rpg-amber/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-lg" aria-hidden="true">🧹</span>
                    <div>
                      <p className="text-sm font-semibold text-rpg-parchment">Clean desk</p>
                      <p className="text-xs text-rpg-parchment-muted">Life • Completion</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-rpg-amber bg-amber-950/40 px-2 py-1 rounded">
                    +30 XP
                  </span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab !== "home" && (
          <Card variant="panel" className="p-8 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-xl bg-rpg-surface border border-rpg-border flex items-center justify-center text-rpg-amber">
              {activeTab === "quests" && <ScrollText className="w-6 h-6" />}
              {activeTab === "character" && <Shield className="w-6 h-6" />}
              {activeTab === "bag" && <Compass className="w-6 h-6" />}
              {activeTab === "shop" && <Sparkles className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-lg font-bold capitalize text-rpg-parchment">
                {activeTab} Module
              </h3>
              <p className="text-xs text-rpg-parchment-muted max-w-sm mx-auto mt-1">
                Foundation established. Scheduled for full implementation in Phase {activeTab === "quests" ? "3" : activeTab === "character" ? "2" : "4"}.
              </p>
            </div>
          </Card>
        )}
      </main>

      {/* Navigation */}
      <Nav activeTab={activeTab} onSelectTab={setActiveTab} />
    </div>
  );
}
