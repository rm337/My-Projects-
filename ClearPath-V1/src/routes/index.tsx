import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/clearpath/site-header";
import { useAccessibilitySettings } from "@/hooks/use-accessibility-settings";
import { assist, normalizeAssistPayload, type AssistResult, type FollowUp, type Mode } from "@/lib/clearpath.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ClearPath — Adaptive AI for Everyday Understanding" },
      { name: "description", content: "ClearPath explains letters, forms, tasks and messages in plain language." }
    ]
  }),
  component: ClearPathPage,
});

const ACTIONS: { mode: Mode; label: string; description: string }[] = [
  { mode: "simplify", label: "Make it simpler", description: "Rewrite it in clearer words, keeping the meaning." },
  { mode: "steps", label: "One step at a time", description: "Break it into small steps. Show one at a time." },
  { mode: "show", label: "Show me", description: "Explain it with a real example or analogy." },
  { mode: "read", label: "Read it to me", description: "Get it ready to listen to, out loud." },
  { mode: "respond", label: "Help me respond", description: "Understand what's asked and help you reply. Nothing is sent." },
];

const MODE_LABEL: Record<Mode, string> = {
  simplify: "Make it simpler",
  steps: "One step at a time",
  show: "Show me",
  read: "Read it to me",
  respond: "Help me respond",
};

function ClearPathPage() {
  const settings = useAccessibilitySettings();
  const run = useServerFn(assist);
  const [text, setText] = useState("");
  const [mode, setMode] = useState<Mode | null>(null);
  const [result, setResult] = useState<AssistResult | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const stopSpeech = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  useEffect(() => stopSpeech, [stopSpeech]);

  const ask = useCallback(async (nextMode: Mode, followUp?: FollowUp) => {
    if (!text.trim()) { setError("Please type or paste something first."); return; }
    stopSpeech(); setLoading(true); setError(""); setAcknowledged(false); setMode(nextMode);
    try {
      const data = await run({ data: {
        mode: nextMode,
        text: text.trim(),
        ...(followUp ? { followUp } : {}),
        ...(followUp && result ? { previous: result.body } : {}),
      }});
      const clean = normalizeAssistPayload(data);
      setResult(clean);
      setStepIndex(0);
      window.setTimeout(() => resultRef.current?.focus(), 50);
    } catch {
      setError("Something went wrong while preparing your answer. Please try again in a moment.");
    } finally { setLoading(false); }
  }, [result, run, stopSpeech, text]);

  const startOver = useCallback(() => {
    stopSpeech(); setText(""); setMode(null); setResult(null); setStepIndex(0); setError(""); setAcknowledged(false);
  }, [stopSpeech]);

  const speak = useCallback((content: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setError("Your browser cannot read text aloud. You can still read the text below."); return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(content);
    utterance.rate = 0.95;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true); window.speechSynthesis.speak(utterance);
  }, []);

  const steps = result?.steps ?? [];
  const hasSteps = mode === "steps" && steps.length > 0;
  const spokenContent = hasSteps ? steps.join(". ") : (result?.body ?? "");

  return (
    <div className="cp-blur relative min-h-dvh bg-paper text-ink">
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <div className="absolute -top-40 left-1/2 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[360px] w-[520px] rounded-full bg-line/60 blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-2xl px-5 pb-16 pt-5 sm:px-6">
        <SiteHeader {...settings} />
        <main className="mt-8 space-y-8">
          <section className="cp-rise">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Start here</p>
            <h1 className="mt-2 text-balance font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">What do you need help understanding?</h1>
            <p className="mt-3 max-w-[46ch] text-pretty text-lg text-ink-soft">Paste or type anything — a letter, a form, an instruction, a note. We'll help you make sense of it.</p>
            <div className="mt-5">
              <label htmlFor="cp-input" className="mb-2 block font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">Your text</label>
              <textarea id="cp-input" rows={5} value={text} onChange={(e) => setText(e.target.value)} placeholder="Type or paste here…" className="cp-blur w-full rounded-2xl border border-line bg-paper/70 px-4 py-3.5 text-lg text-ink backdrop-blur-xl placeholder:text-ink-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" />
            </div>
          </section>

          <section className="cp-rise">
            <h2 className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">Choose how to help</h2>
            <div className="grid gap-3">
              {ACTIONS.map((action, index) => (
                <button key={action.mode} type="button" disabled={loading} onClick={() => ask(action.mode)} className="cp-card cp-btn cp-blur w-full rounded-2xl border border-line px-5 py-4 text-left backdrop-blur-xl hover:-translate-y-0.5 hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-60">
                  <span className="flex items-center gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-accent/20 bg-accent-soft font-display text-xl font-extrabold text-accent" aria-hidden="true">{index + 1}</span>
                    <span className="min-w-0"><span className="block font-display text-lg font-bold tracking-tight">{action.label}</span><span className="mt-0.5 block text-ink-soft">{action.description}</span></span>
                  </span>
                </button>
              ))}
            </div>
          </section>

          <div aria-live="polite" className="space-y-8">
            {loading && <p className="cp-card cp-blur rounded-2xl border border-line p-5 text-lg text-ink-soft backdrop-blur-xl">Working on it. This takes a few seconds.</p>}
            {error && !loading && <p className="rounded-2xl border-2 border-accent bg-accent-soft p-5 text-lg text-ink"><span className="font-display font-bold">Something needs your attention. </span>{error}</p>}
            {result && !loading && (
              <section className="cp-rise">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{mode ? MODE_LABEL[mode] : "Answer"}</p>
                <div ref={resultRef} tabIndex={-1} className="cp-card cp-blur mt-3 rounded-2xl border border-line p-5 backdrop-blur-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                  {result.title && <h2 className="font-display text-xl font-bold tracking-tight">{result.title}</h2>}
                  {hasSteps ? (
                    <div className="mt-3">
                      <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">Step {stepIndex + 1} of {steps.length}</p>
                      <p className="mt-3 text-pretty font-display text-2xl font-bold tracking-tight">{steps[stepIndex]}</p>
                      <div className="mt-3 h-1.5 rounded-full bg-ink/10" aria-hidden="true"><div className="h-full rounded-full bg-accent" style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }} /></div>
                      {stepIndex + 1 < steps.length ? <button type="button" onClick={() => setStepIndex(i => i + 1)} className="mt-5 min-h-14 w-full rounded-xl bg-accent px-4 py-4 text-lg font-bold tracking-tight text-paper hover:bg-accent-hover">Next</button> : <p className="mt-5 text-lg text-ink-soft">That was the last step.</p>}
                    </div>
                  ) : result.body.split("\n").filter(line => line.trim()).map((line, i) => <p key={i} className="mt-3 text-pretty text-lg text-ink-soft">{line}</p>)}

                  {mode === "read" && <div className="mt-5 flex flex-wrap gap-2.5"><button type="button" onClick={() => speak(spokenContent)} className="min-h-14 flex-1 rounded-xl bg-accent px-4 text-lg font-bold tracking-tight text-paper">{speaking ? "Read again" : "Play out loud"}</button><button type="button" onClick={stopSpeech} className="cp-btn min-h-14 flex-1 rounded-xl border border-line px-4 text-lg font-semibold text-ink-soft">Stop</button></div>}
                  {result.question && <p className="mt-4 rounded-xl border-2 border-accent/40 bg-accent-soft p-4 text-lg text-ink"><span className="font-display font-bold">One question: </span>{result.question}</p>}
                  {result.caution && <p className="mt-4 rounded-xl border-2 border-ink/30 p-4 text-base text-ink-soft"><span className="font-display font-bold text-ink">Please note: </span>{result.caution}</p>}

                  <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                    {mode && <><button type="button" onClick={() => ask(mode, "another_way")} className="cp-btn min-h-14 rounded-xl border border-line px-4 text-base font-semibold text-ink-soft">Explain it another way</button><button type="button" onClick={() => ask(mode, "example")} className="cp-btn min-h-14 rounded-xl border border-line px-4 text-base font-semibold text-ink-soft">Give me an example</button><button type="button" onClick={() => ask(mode, "simpler")} className="cp-btn min-h-14 rounded-xl border border-line px-4 text-base font-semibold text-ink-soft">Make it even simpler</button><button type="button" onClick={() => ask(mode, "more_detail")} className="cp-btn min-h-14 rounded-xl border border-line px-4 text-base font-semibold text-ink-soft">More detail</button></>}
                    <button type="button" onClick={startOver} className="cp-btn min-h-14 rounded-xl border border-line px-4 text-base font-semibold text-ink-soft sm:col-span-2">Start over</button>
                  </div>
                  <button type="button" onClick={() => { stopSpeech(); setAcknowledged(true); }} className="mt-2.5 min-h-14 w-full rounded-xl bg-accent px-4 py-4 text-lg font-bold tracking-tight text-paper">I understand</button>
                  {acknowledged && <p className="mt-4 text-lg text-ink-soft">Good. You can start over above, or ask about something else whenever you want.</p>}
                </div>
              </section>
            )}
          </div>
        </main>
        <footer className="cp-rise mt-10"><div className="cp-card cp-blur rounded-2xl border border-line px-5 py-4 backdrop-blur-xl"><p className="text-pretty text-base text-ink-soft">ClearPath helps you understand everyday language. It is not a doctor, therapist, lawyer, or any licensed professional, and it never gives medical, legal, or financial advice.</p><p className="mt-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ink-faint">Your words stay private. Nothing you enter is shared or saved publicly.</p></div></footer>
      </div>
    </div>
  );
}
