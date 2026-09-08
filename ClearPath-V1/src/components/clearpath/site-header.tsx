import type { TextSize } from "@/hooks/use-accessibility-settings";

type Props = {
  textSize: TextSize;
  highContrast: boolean;
  reduceMotion: boolean;
  setTextSize: (size: TextSize) => void;
  toggleContrast: () => void;
  toggleMotion: () => void;
};

const SIZES: { value: TextSize; label: string; className: string }[] = [
  { value: "normal", label: "Normal text size", className: "text-xs" },
  { value: "large", label: "Large text size", className: "text-base" },
  { value: "largest", label: "Largest text size", className: "text-xl" },
];

export function SiteHeader({ textSize, highContrast, reduceMotion, setTextSize, toggleContrast, toggleMotion }: Props) {
  return <header className="cp-card cp-blur rounded-3xl border border-line px-5 py-4 ring-1 ring-ink/5 backdrop-blur-xl"><div className="flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-accent font-display text-lg font-extrabold text-paper" aria-hidden="true">C</div><div className="leading-tight"><p className="font-display text-lg font-extrabold tracking-tight">ClearPath</p><p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink-faint">Adaptive understanding</p></div></div><div className="flex flex-wrap items-center gap-2"><div role="group" aria-label="Text size" className="flex items-center gap-1 rounded-xl bg-ink/5 p-1.5">{SIZES.map((size)=><button key={size.value} type="button" aria-label={size.label} aria-pressed={textSize===size.value} onClick={()=>setTextSize(size.value)} className={`cp-ctrl cp-blur min-h-11 min-w-11 rounded-lg px-3 font-semibold backdrop-blur-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${size.className} ${textSize===size.value?"border-2 border-accent text-ink":"border border-line text-ink-soft hover:bg-accent-soft"}`}>A</button>)}</div><button type="button" aria-pressed={highContrast} onClick={toggleContrast} className={`cp-ctrl cp-blur min-h-11 rounded-xl px-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] backdrop-blur-xl ${highContrast?"border-2 border-accent text-ink":"border border-line text-ink-soft hover:bg-accent-soft"}`}>Contrast{highContrast?": on":": off"}</button><button type="button" aria-pressed={reduceMotion} onClick={toggleMotion} className={`cp-ctrl cp-blur min-h-11 rounded-xl px-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] backdrop-blur-xl ${reduceMotion?"border-2 border-accent text-ink":"border border-line text-ink-soft hover:bg-accent-soft"}`}>Motion{reduceMotion?": reduced":": normal"}</button></div></div></header>;
}
