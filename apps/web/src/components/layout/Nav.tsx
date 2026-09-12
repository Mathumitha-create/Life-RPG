import React from "react";
import { Home, ScrollText, User, Backpack, Store } from "lucide-react";
import { cn } from "../../lib/utils";

export type NavTab = "home" | "quests" | "character" | "bag" | "shop";

export interface NavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

const NAV_ITEMS: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "quests", label: "Quests", icon: ScrollText },
  { id: "character", label: "Character", icon: User },
  { id: "bag", label: "Bag", icon: Backpack },
  { id: "shop", label: "Shop", icon: Store },
];

export function Nav({ activeTab, onSelectTab }: NavProps): React.JSX.Element {
  return (
    <nav
      role="navigation"
      aria-label="Main game navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-rpg-panel/95 backdrop-blur-md border-t border-rpg-border sm:relative sm:border-t-0 sm:bg-transparent sm:backdrop-blur-none"
    >
      <div className="max-w-md sm:max-w-xl mx-auto flex items-center justify-around sm:justify-center sm:gap-3 p-2 sm:p-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 focus-visible:ring-2 focus-visible:ring-rpg-amber",
                isActive
                  ? "text-rpg-amber bg-rpg-surface border border-rpg-amber/40 shadow-glow-amber sm:scale-105"
                  : "text-rpg-parchment-muted hover:text-rpg-parchment hover:bg-rpg-surface/50 border border-transparent"
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
