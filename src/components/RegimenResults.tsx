import { useState } from "react";
import { type CatRegimen, type CatProfile } from "@/lib/catRegimen";
import { AlertTriangle, Droplets, Utensils, Clock, Zap, ChevronRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface RegimenResultsProps {
  regimen: CatRegimen;
  profile: CatProfile;
  onReset: () => void;
}

const lifeStageClasses: Record<string, string> = {
  kitten: "bg-sky-100 text-sky-700 border-sky-200",
  junior: "bg-emerald-100 text-emerald-700 border-emerald-200",
  adult: "bg-orange-100 text-orange-700 border-orange-200",
  mature: "bg-amber-100 text-amber-700 border-amber-200",
  senior: "bg-purple-100 text-purple-700 border-purple-200",
};

export default function RegimenResults({ regimen, profile, onReset }: RegimenResultsProps) {
  const [_ready] = useState(true);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <h2 className="font-display text-2xl font-bold text-foreground">
            {profile.name}'s Daily Regimen
          </h2>
          <span
            className={cn(
              "text-xs font-semibold px-3 py-1 rounded-full border",
              lifeStageClasses[regimen.lifeStage]
            )}
          >
            {regimen.lifeStageLabel}
          </span>
        </div>
        <p className="text-muted-foreground text-sm">
          {profile.breed} · {profile.weightKg} kg · {profile.isNeutered ? "Neutered" : "Intact"}
        </p>
      </div>

      {/* Warnings */}
      {regimen.warnings.length > 0 && (
        <div className="space-y-2">
          {regimen.warnings.map((w, i) => (
            <div
              key={i}
              className="flex gap-3 p-4 rounded-xl border border-destructive/30 bg-destructive/5 text-sm text-destructive animate-slide-in"
            >
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <p>{w}</p>
            </div>
          ))}
        </div>
      )}

      {/* Calories + Macros */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          icon={<Zap className="w-4 h-4" />}
          label="Daily Calories"
          value={`${regimen.dailyCalories}`}
          unit="kcal"
          colorClass="bg-amber-50 border-amber-200 text-amber-700"
        />
        <StatCard
          icon={<span className="text-xs font-bold">P</span>}
          label="Protein"
          value={`${regimen.proteinPercent}%`}
          unit="of diet"
          colorClass="bg-orange-50 border-orange-200 text-orange-700"
        />
        <StatCard
          icon={<span className="text-xs font-bold">F</span>}
          label="Fat"
          value={`${regimen.fatPercent}%`}
          unit="of diet"
          colorClass="bg-yellow-50 border-yellow-200 text-yellow-700"
        />
      </div>

      {/* Daily Portions */}
      <Section title="Daily Portions" icon={<Utensils className="w-4 h-4" />}>
        <div className="space-y-3">
          {regimen.portions.map((p, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-xl border bg-card shadow-sm animate-scale-in"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="text-3xl">{p.icon}</div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{p.type}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-display font-bold text-primary">{p.amount}</span>
                <span className="text-xs text-muted-foreground ml-1">{p.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Meal Schedule */}
      <Section title={`Meal Schedule (${regimen.mealsPerDay}× per day)`} icon={<Clock className="w-4 h-4" />}>
        <div className="space-y-2">
          {regimen.mealSchedule.map((m, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-3 rounded-xl border bg-secondary/50 animate-slide-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="font-display font-semibold text-primary min-w-[70px]">{m.time}</span>
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
              <span className="text-sm text-foreground/80">{m.description}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Hydration */}
      <Section title="Hydration Tip" icon={<Droplets className="w-4 h-4" />}>
        <p className="text-sm leading-relaxed p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-800">
          💧 {regimen.hydrationTip}
        </p>
      </Section>

      {/* Key Nutrients */}
      <Section title="Key Nutrients to Prioritize" icon={<span className="text-sm">🧪</span>}>
        <div className="flex flex-wrap gap-2">
          {regimen.keyNutrients.map((n, i) => (
            <span
              key={i}
              className="text-xs font-medium px-3 py-1.5 rounded-full bg-secondary border text-foreground/80"
            >
              {n}
            </span>
          ))}
        </div>
      </Section>

      {/* Breed-Specific Tips */}
      <Section title={`${profile.breed} Breed Tips`} icon={<span className="text-sm">🐱</span>}>
        <ul className="space-y-2">
          {regimen.breedSpecificTips.map((t, i) => (
            <li key={i} className="flex gap-2 text-sm text-foreground/80 leading-relaxed">
              <span className="text-primary mt-0.5">•</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* General Tips */}
      <Section title="General Feeding Guidelines" icon={<span className="text-sm">📋</span>}>
        <ul className="space-y-2">
          {regimen.generalTips.map((t, i) => (
            <li key={i} className="flex gap-2 text-sm text-foreground/80 leading-relaxed">
              <span className="text-primary mt-0.5">•</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Home Recipes */}
      {regimen.homeRecipes && regimen.homeRecipes.length > 0 && (
        <Section title="Recommended Home Recipes" icon={<span className="text-sm">🍳</span>}>
          <div className="space-y-4">
            {regimen.homeRecipes.map((r, i) => (
              <div key={i} className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 space-y-2">
                <h4 className="font-semibold text-emerald-800">🥣 {r.name}</h4>
                <ul className="space-y-1">
                  {r.ingredients.map((ing, j) => (
                    <li key={j} className="text-sm text-emerald-700 flex gap-2">
                      <span>—</span>
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-emerald-600 italic border-t border-emerald-200 pt-2">{r.note}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center leading-relaxed px-2">
        ⚠️ This regimen is a general guide. Always consult your veterinarian before making significant changes to your cat's diet.
      </p>

      {/* Reset button */}
      <button
        onClick={onReset}
        className="w-full py-3 rounded-xl border border-border bg-card text-foreground/70 font-medium text-sm flex items-center justify-center gap-2 hover:bg-secondary transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
        Start over with a different cat
      </button>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-primary">{icon}</span>
        <h3 className="font-display font-semibold text-foreground text-base">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  unit,
  colorClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  colorClass: string;
}) {
  return (
    <div className={cn("rounded-xl border p-3 flex flex-col gap-1 items-center text-center", colorClass)}>
      <div className="opacity-70">{icon}</div>
      <div className="font-display font-bold text-xl leading-none">{value}</div>
      <div className="text-xs opacity-70">{unit}</div>
      <div className="text-xs font-medium opacity-80 leading-tight">{label}</div>
    </div>
  );
}
