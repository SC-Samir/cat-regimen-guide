import { useState } from "react";
import catHero from "@/assets/cat-hero.png";
import CatForm from "@/components/CatForm";
import RegimenResults from "@/components/RegimenResults";
import { generateRegimen, type CatProfile, type CatRegimen } from "@/lib/catRegimen";

export default function Index() {
  const [regimen, setRegimen] = useState<CatRegimen | null>(null);
  const [profile, setProfile] = useState<CatProfile | null>(null);

  const handleSubmit = (p: CatProfile) => {
    const result = generateRegimen(p);
    setProfile(p);
    setRegimen(result);
    // Scroll to results
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
  };

  const handleReset = () => {
    setRegimen(null);
    setProfile(null);
  };

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center gap-3">
          <span className="text-2xl">🐾</span>
          <span className="font-display font-bold text-foreground text-lg">PurrFeed</span>
          <span className="text-xs text-muted-foreground ml-auto">Cat Nutrition Advisor</span>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 pb-16">
        {!regimen ? (
          <>
            {/* Hero Section */}
            <div className="flex flex-col items-center text-center pt-10 pb-8 gap-4">
              <div className="animate-float">
                <img
                  src={catHero}
                  alt="Cat with food bowl"
                  className="w-40 h-40 object-contain drop-shadow-lg"
                />
              </div>
              <div className="space-y-2">
                <h1 className="font-display text-4xl font-bold text-foreground leading-tight">
                  The Perfect Regimen
                  <br />
                  <span className="text-primary">for Your Cat</span>
                </h1>
                <p className="text-muted-foreground text-base max-w-sm mx-auto leading-relaxed">
                  Enter your cat's details and get a science-backed daily feeding plan — tailored to their breed, age & food preferences.
                </p>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 justify-center">
                {["🫙 Dry Food", "🥫 Wet Food", "🍳 Home Recipes"].map((badge) => (
                  <span
                    key={badge}
                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-secondary border text-foreground/70"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-card rounded-2xl border border-border shadow-card p-6">
              <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                Tell us about your cat 🐱
              </h2>
              <CatForm onSubmit={handleSubmit} />
            </div>
          </>
        ) : (
          <>
            {/* Results Card */}
            <div className="pt-8">
              <div className="bg-card rounded-2xl border border-border shadow-card p-6">
                <RegimenResults
                  regimen={regimen}
                  profile={profile!}
                  onReset={handleReset}
                />
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center">
        <p className="text-xs text-muted-foreground">
          PurrFeed · Nutrition guides based on veterinary dietary guidelines
        </p>
      </footer>
    </div>
  );
}
