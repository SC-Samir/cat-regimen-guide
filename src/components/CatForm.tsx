import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronDown } from "lucide-react";
import { BREEDS, type CatProfile } from "@/lib/catRegimen";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your cat's name").max(50, "Name too long"),
  ageYears: z.number().min(0).max(25),
  ageMonths: z.number().min(0).max(11),
  breed: z.string().min(1, "Please select a breed"),
  weightKg: z.number().min(0.1, "Weight must be > 0").max(20, "Weight seems too high"),
  foodType: z.enum(["dry", "wet", "home", "mixed-dry-wet", "mixed-dry-home", "mixed-wet-home"]),
  isNeutered: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface CatFormProps {
  onSubmit: (profile: CatProfile) => void;
}

const FOOD_OPTIONS = [
  { value: "dry", label: "Dry Food", emoji: "🫙", desc: "Kibble only" },
  { value: "wet", label: "Wet Food", emoji: "🥫", desc: "Pâté or chunks" },
  { value: "home", label: "Home Recipes", emoji: "🍳", desc: "Cooked at home" },
  { value: "mixed-dry-wet", label: "Dry + Wet", emoji: "🫙🥫", desc: "50/50 mix" },
  { value: "mixed-dry-home", label: "Dry + Home", emoji: "🫙🍳", desc: "Dry & homemade" },
  { value: "mixed-wet-home", label: "Wet + Home", emoji: "🥫🍳", desc: "Wet & homemade" },
];

export default function CatForm({ onSubmit }: CatFormProps) {
  const [selectedFood, setSelectedFood] = useState<string>("dry");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      ageYears: 0,
      ageMonths: 6,
      breed: "Domestic Shorthair",
      weightKg: 4,
      foodType: "dry",
      isNeutered: false,
    },
  });

  const isNeutered = watch("isNeutered");

  const onFormSubmit = (data: FormValues) => {
    onSubmit(data as CatProfile);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      {/* Cat Name */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground/80 tracking-wide uppercase">
          Cat's Name
        </label>
        <input
          {...register("name")}
          placeholder="e.g. Mochi"
          className={cn(
            "w-full px-4 py-3 rounded-xl border bg-card text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all",
            errors.name && "border-destructive"
          )}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      {/* Age */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground/80 tracking-wide uppercase">Age</label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="relative">
              <input
                type="number"
                {...register("ageYears", { valueAsNumber: true })}
                min={0}
                max={25}
                className="w-full px-4 py-3 pr-14 rounded-xl border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">years</span>
            </div>
          </div>
          <div>
            <div className="relative">
              <input
                type="number"
                {...register("ageMonths", { valueAsNumber: true })}
                min={0}
                max={11}
                className="w-full px-4 py-3 pr-16 rounded-xl border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">months</span>
            </div>
          </div>
        </div>
      </div>

      {/* Breed */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground/80 tracking-wide uppercase">Breed</label>
        <div className="relative">
          <select
            {...register("breed")}
            className={cn(
              "w-full px-4 py-3 pr-10 rounded-xl border bg-card text-foreground appearance-none",
              "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer"
            )}
          >
            {BREEDS.map((b) => (
              <option key={b.name} value={b.name}>
                {b.name} ({b.size})
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
        {errors.breed && <p className="text-sm text-destructive">{errors.breed.message}</p>}
      </div>

      {/* Weight */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground/80 tracking-wide uppercase">
          Current Weight
        </label>
        <div className="relative">
          <input
            type="number"
            step="0.1"
            {...register("weightKg", { valueAsNumber: true })}
            className={cn(
              "w-full px-4 py-3 pr-10 rounded-xl border bg-card text-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all",
              errors.weightKg && "border-destructive"
            )}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">kg</span>
        </div>
        {errors.weightKg && <p className="text-sm text-destructive">{errors.weightKg.message}</p>}
      </div>

      {/* Neutered toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl border bg-card">
        <div>
          <p className="font-semibold text-foreground">Neutered / Spayed</p>
          <p className="text-sm text-muted-foreground">Affects calorie requirements</p>
        </div>
        <button
          type="button"
          onClick={() => setValue("isNeutered", !isNeutered)}
          className={cn(
            "relative w-12 h-6 rounded-full transition-colors duration-200",
            isNeutered ? "bg-primary" : "bg-muted"
          )}
        >
          <span
            className={cn(
              "absolute top-1 w-4 h-4 rounded-full bg-card shadow transition-all duration-200",
              isNeutered ? "left-7" : "left-1"
            )}
          />
        </button>
      </div>

      {/* Food Type */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-foreground/80 tracking-wide uppercase">
          Food Type
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {FOOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                setSelectedFood(opt.value);
                setValue("foodType", opt.value as FormValues["foodType"]);
              }}
              className={cn(
                "flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all text-center",
                selectedFood === opt.value
                  ? "border-primary bg-primary/10 shadow-sm"
                  : "border-border bg-card hover:border-primary/40 hover:bg-secondary"
              )}
            >
              <span className="text-2xl">{opt.emoji}</span>
              <span className={cn(
                "text-sm font-semibold",
                selectedFood === opt.value ? "text-primary" : "text-foreground"
              )}>{opt.label}</span>
              <span className="text-xs text-muted-foreground">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-4 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-base tracking-wide transition-all hover:opacity-90 hover:shadow-lg active:scale-[0.99] shadow-card"
      >
        Generate My Cat's Regimen 🐾
      </button>
    </form>
  );
}
