import React, { useState } from "react";
import type { CategoryId, CreateQuestRequest, Quest, QuestType } from "@liferpg/contracts";
import { Check, Edit3, Plus, ScrollText, Sparkles, Trash2, X } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

const CATEGORIES: Array<{ id: CategoryId; label: string; icon: string }> = [
  { id: "mind", label: "Mind", icon: "✦" },
  { id: "body", label: "Body", icon: "◈" },
  { id: "career", label: "Career", icon: "⌁" },
  { id: "life", label: "Life", icon: "⌂" },
  { id: "social", label: "Social", icon: "◎" },
  { id: "growth", label: "Growth", icon: "↗" },
];

export interface QuestsScreenProps {
  quests: Quest[];
  isLoading: boolean;
  isSaving: boolean;
  error?: string;
  onCreate: (request: CreateQuestRequest) => Promise<void>;
  onUpdate: (questId: string, title: string) => Promise<void>;
  onDelete: (questId: string) => Promise<void>;
}

export function QuestsScreen({ quests, isLoading, isSaving, error, onCreate, onUpdate, onDelete }: QuestsScreenProps): React.JSX.Element {
  const [categoryId, setCategoryId] = useState<CategoryId>("mind");
  const [text, setText] = useState("");
  const [type, setType] = useState<QuestType>("ONE_TIME");
  const [clarification, setClarification] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const activeQuests = quests.filter((quest) => quest.status === "ACTIVE");
  const completedQuests = quests.filter((quest) => quest.status !== "ACTIVE");

  async function submitQuest(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!text.trim()) return;
    try {
      await onCreate({ categoryId, text: text.trim(), type });
      setText("");
      setClarification(null);
    } catch (caught) {
      setClarification(caught instanceof Error ? caught.message : "The quest needs one more detail.");
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <header className="flex items-start justify-between gap-4">
        <div><p className="text-xs uppercase tracking-[0.2em] text-rpg-amber font-bold">Adventure board</p><h1 className="text-2xl sm:text-3xl font-display font-bold text-rpg-parchment mt-1">Your quests</h1><p className="text-sm text-rpg-parchment-muted mt-2 max-w-xl">Describe the real-world task. The realm will shape it into a quest.</p></div>
        <ScrollText className="w-8 h-8 text-rpg-amber shrink-0" aria-hidden="true" />
      </header>
      <Card variant="panel" className="p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-2 text-rpg-parchment font-bold"><Sparkles className="w-4 h-4 text-rpg-amber" /> Add an activity</div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2" aria-label="Quest category">
          {CATEGORIES.map((category) => <button key={category.id} type="button" aria-pressed={categoryId === category.id} onClick={() => setCategoryId(category.id)} className={`min-h-14 rounded-lg border text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rpg-amber ${categoryId === category.id ? "border-rpg-amber bg-rpg-amber/15 text-rpg-amber" : "border-rpg-border bg-rpg-surface text-rpg-parchment-muted hover:text-rpg-parchment"}`}><span className="block text-base" aria-hidden="true">{category.icon}</span>{category.label}</button>)}
        </div>
        <form onSubmit={submitQuest} className="space-y-4">
          <Input label="What do you want to do?" value={text} onChange={(event) => setText(event.target.value)} placeholder="Study DSA for 2 hours" maxLength={500} />
          <div className="flex flex-col sm:flex-row gap-3 sm:items-end"><label className="space-y-1.5 text-xs font-semibold text-rpg-parchment uppercase tracking-wider sm:w-48">Quest rhythm<select value={type} onChange={(event) => setType(event.target.value as QuestType)} className="w-full h-10 rounded-lg bg-rpg-panel border border-rpg-border px-3 text-sm text-rpg-parchment focus:outline-none focus:ring-2 focus:ring-rpg-amber"><option value="ONE_TIME">One time</option><option value="DAILY">Daily</option></select></label><Button type="submit" isLoading={isSaving} leftIcon={<Plus className="w-4 h-4" />} className="sm:flex-1">Add quest</Button></div>
        </form>
        {(clarification || error) && <p className="text-sm text-rpg-danger" role="alert">{clarification || error}</p>}
      </Card>
      <QuestGroup title="Active quests" quests={activeQuests} isLoading={isLoading} editingId={editingId} editingTitle={editingTitle} onEdit={(quest) => { setEditingId(quest.id); setEditingTitle(quest.title); }} onEditTitle={setEditingTitle} onSaveEdit={async () => { if (editingId && editingTitle.trim()) { await onUpdate(editingId, editingTitle.trim()); setEditingId(null); } }} onCancelEdit={() => setEditingId(null)} onDelete={onDelete} />
      {completedQuests.length > 0 && <QuestGroup title="Completed and archived" quests={completedQuests} isLoading={false} editingId={null} editingTitle="" onEdit={() => undefined} onEditTitle={() => undefined} onSaveEdit={async () => undefined} onCancelEdit={() => undefined} onDelete={onDelete} />}
    </div>
  );
}

function QuestGroup({ title, quests, isLoading, editingId, editingTitle, onEdit, onEditTitle, onSaveEdit, onCancelEdit, onDelete }: { title: string; quests: Quest[]; isLoading: boolean; editingId: string | null; editingTitle: string; onEdit: (quest: Quest) => void; onEditTitle: (title: string) => void; onSaveEdit: () => Promise<void>; onCancelEdit: () => void; onDelete: (questId: string) => Promise<void> }): React.JSX.Element {
  return <section className="space-y-3" aria-labelledby={`${title}-heading`}><h2 id={`${title}-heading`} className="text-sm font-display font-bold text-rpg-parchment uppercase tracking-wider">{title} <span className="text-rpg-parchment-muted">({quests.length})</span></h2>{isLoading ? <Card variant="panel" className="p-5 text-sm text-rpg-parchment-muted">Loading your quests...</Card> : quests.length === 0 ? <Card variant="panel" className="p-5 text-sm text-rpg-parchment-muted">No quests here yet. Your next small step can start the board.</Card> : <div className="space-y-2">{quests.map((quest) => <Card key={quest.id} variant="panel" className="p-4"><div className="flex items-start gap-3"><div className="mt-0.5 rounded-full bg-rpg-amber/15 p-2 text-rpg-amber" aria-hidden="true">{quest.status === "ACTIVE" ? <ScrollText className="w-4 h-4" /> : <Check className="w-4 h-4" />}</div><div className="min-w-0 flex-1">{editingId === quest.id ? <div className="flex gap-2"><Input aria-label="Quest title" value={editingTitle} onChange={(event) => onEditTitle(event.target.value)} autoFocus /><Button size="sm" onClick={onSaveEdit} aria-label="Save quest title"><Check className="w-4 h-4" /></Button><Button size="sm" variant="ghost" onClick={onCancelEdit} aria-label="Cancel editing"><X className="w-4 h-4" /></Button></div> : <><h3 className="font-bold text-rpg-parchment break-words">{quest.title}</h3><p className="text-xs text-rpg-parchment-muted mt-1">{quest.categoryId} · {quest.type === "DAILY" ? "Daily" : "One time"} · <span className="text-rpg-amber">+{quest.rewardPreview.xp} XP</span></p></>}</div>{quest.status === "ACTIVE" && editingId !== quest.id && <div className="flex gap-1"><Button size="sm" variant="ghost" onClick={() => onEdit(quest)} aria-label={`Edit ${quest.title}`}><Edit3 className="w-4 h-4" /></Button><Button size="sm" variant="ghost" onClick={() => void onDelete(quest.id)} aria-label={`Delete ${quest.title}`}><Trash2 className="w-4 h-4 text-rpg-danger" /></Button></div>}</div></Card>)}</div>}</section>;
}