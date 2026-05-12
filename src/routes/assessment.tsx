import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Camera, Cpu, Car, Play, Check, Loader2, ArrowLeft, Upload, ScanLine } from "lucide-react";
import { SiteHeader } from "@/components/asist/SiteHeader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MissionAccomplished } from "@/components/asist/MissionAccomplished";
import { awardPoints, getStudentId } from "@/lib/store";

export const Route = createFileRoute("/assessment")({
  component: AssessmentHub,
  head: () => ({
    meta: [
      { title: "Assessment Hub · ASIST Verification Engine" },
      { name: "description", content: "Submit Arduino simulations or photos of physical LEGO builds. The Verification Engine grades work and updates the leaderboard live." },
    ],
  }),
});

type Flow = "menu" | "arduino" | "lego";

function AssessmentHub() {
  const [flow, setFlow] = useState<Flow>("menu");
  const [done, setDone] = useState<{ open: boolean; badge?: string; title?: string; subtitle?: string }>({ open: false });

  const id = getStudentId();

  return (
    <div className="min-h-screen pb-16">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-4 pt-6">
        <div className="text-xs text-muted-foreground"><Link to="/" className="hover:underline">Home</Link> · Assessment Hub</div>
        <div className="mt-3 rounded-3xl border-2 border-foreground bg-card shadow-card p-5 flex items-center gap-4">
          <div className="size-14 rounded-2xl bg-hero grid place-items-center text-2xl text-primary-foreground ring-2 ring-foreground">🛠️</div>
          <div className="flex-1">
            <div className="text-xs font-mono text-muted-foreground">Logged in as</div>
            <div className="font-display text-xl font-extrabold">{id}</div>
          </div>
          <div className="hidden sm:block text-right">
            <div className="text-xs text-muted-foreground">Verification Engine</div>
            <div className="text-success font-mono text-sm flex items-center gap-1 justify-end"><span className="size-2 rounded-full bg-success animate-pulse" /> online</div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 mt-6">
        <AnimatePresence mode="wait">
          {flow === "menu" && (
            <motion.div key="menu" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h1 className="font-display text-3xl font-extrabold mb-3">Start Assessment</h1>
              <p className="text-muted-foreground mb-5">Pick how you want to be graded.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <FlowCard
                  title="Arduino Simulation"
                  desc="Submit your Wokwi build. Auto-graded in seconds."
                  icon={<Cpu className="size-6" />}
                  color="bg-sky"
                  onClick={() => setFlow("arduino")}
                />
                <FlowCard
                  title="LEGO Photo Build"
                  desc="Snap front + side photos. Scanning for Logic… in 2s."
                  icon={<Car className="size-6" />}
                  color="bg-sun"
                  onClick={() => setFlow("lego")}
                />
              </div>
            </motion.div>
          )}

          {flow === "arduino" && (
            <ArduinoFlow
              key="ard"
              onBack={() => setFlow("menu")}
              onSuccess={() => {
                awardPoints(75, "🚦");
                setDone({ open: true, badge: "🚦", title: "Mission Accomplished!", subtitle: "Traffic light verified · +75 points" });
              }}
            />
          )}

          {flow === "lego" && (
            <LegoFlow
              key="lego"
              onBack={() => setFlow("menu")}
              onSuccess={() => {
                awardPoints(75, "🚗");
                setDone({ open: true, badge: "🚗", title: "Build received!", subtitle: "Logic detected · queued for tutor review · +75 points" });
              }}
            />
          )}
        </AnimatePresence>
      </div>

      <MissionAccomplished {...done} onClose={() => setDone({ open: false })} />
    </div>
  );
}

function FlowCard({ title, desc, icon, color, onClick }: { title: string; desc: string; icon: React.ReactNode; color: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-left rounded-3xl border-2 border-foreground bg-card shadow-card hover:-translate-y-1 transition overflow-hidden">
      <div className={`${color} p-5 flex items-center justify-between`}>
        <div className="size-12 rounded-2xl bg-foreground text-background grid place-items-center">{icon}</div>
        <Play className="size-6 text-foreground/60" />
      </div>
      <div className="p-4">
        <div className="font-display font-bold text-lg">{title}</div>
        <div className="text-sm text-muted-foreground">{desc}</div>
      </div>
    </button>
  );
}

/* ---------- Arduino flow ---------- */
function ArduinoFlow({ onBack, onSuccess }: { onBack: () => void; onSuccess: () => void }) {
  type Stage = "ready" | "running" | "verifying" | "result";
  const [stage, setStage] = useState<Stage>("ready");
  const [log, setLog] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const runSim = () => {
    setStage("running");
    setLog([]);
    const lines = [
      "[00:00] Booting Arduino Uno…",
      "[00:01] pinMode(8, OUTPUT) ✓",
      "[00:01] pinMode(9, OUTPUT) ✓",
      "[00:01] pinMode(10, OUTPUT) ✓",
      "[00:02] GREEN ON · 3000ms",
      "[00:05] YELLOW ON · 1000ms",
      "[00:06] RED ON · 3000ms",
      "[00:09] cycle complete · sending submit…",
    ];
    lines.forEach((l, i) => setTimeout(() => setLog((p) => [...p, l]), 350 * (i + 1)));
    setTimeout(() => setStage("verifying"), 350 * lines.length + 200);
  };

  // verifying stage: animate progress
  const verifyStarted = useRef(false);
  if (stage === "verifying" && !verifyStarted.current) {
    verifyStarted.current = true;
    setProgress(0);
    let v = 0;
    const t = setInterval(() => {
      v += 12;
      setProgress(Math.min(100, v));
      if (v >= 100) {
        clearInterval(t);
        setTimeout(() => setStage("result"), 250);
      }
    }, 140);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <button onClick={onBack} className="text-sm text-muted-foreground inline-flex items-center gap-1 hover:text-foreground mb-3"><ArrowLeft className="size-4" /> Back</button>
      <h1 className="font-display text-3xl font-extrabold">Arduino Simulation</h1>
      <p className="text-muted-foreground mb-4">Run the embedded Wokwi project. When it cycles correctly, hit <strong>Submit</strong> — our engine verifies in real time.</p>

      <div className="rounded-3xl border-2 border-foreground bg-card shadow-card overflow-hidden">
        {/* Mock Wokwi panel */}
        <div className="bg-foreground text-background px-4 py-2 flex items-center gap-2 text-xs font-mono">
          <span className="size-2 rounded-full bg-destructive" />
          <span className="size-2 rounded-full bg-sun" />
          <span className="size-2 rounded-full bg-success" />
          <span className="ml-2 opacity-70">wokwi · arduino-traffic-001</span>
        </div>
        <div className="grid md:grid-cols-2 gap-0">
          <div className="p-6 bg-muted aspect-square md:aspect-auto flex flex-col items-center justify-center gap-3 border-b-2 md:border-b-0 md:border-r-2 border-foreground/10">
            <div className="text-xs uppercase font-mono text-muted-foreground">Live LEDs</div>
            <TrafficLight active={stage === "running" || stage === "verifying" || stage === "result"} log={log} />
            <Button onClick={runSim} disabled={stage !== "ready" && stage !== "result"} className="border-2 border-foreground shadow-pop">
              {stage === "ready" || stage === "result" ? <><Play className="size-4 mr-1" /> Run & Submit</> : <><Loader2 className="size-4 mr-1 animate-spin" /> Running…</>}
            </Button>
          </div>
          <div className="p-4">
            <div className="text-xs uppercase font-mono text-muted-foreground mb-2">Simulation log</div>
            <div className="h-56 overflow-auto rounded-xl bg-foreground text-background p-3 text-xs font-mono space-y-1">
              {log.length === 0 ? <span className="opacity-50">Idle. Press Run & Submit.</span> : log.map((l, i) => <div key={i}>{l}</div>)}
            </div>
          </div>
        </div>

        {(stage === "verifying" || stage === "result") && (
          <div className="p-5 border-t-2 border-foreground/10 bg-warm">
            {stage === "verifying" ? (
              <div>
                <div className="flex items-center gap-2 font-medium"><Loader2 className="size-4 animate-spin" /> Verification Engine running…</div>
                <Progress value={progress} className="mt-3" />
                <ul className="mt-3 grid sm:grid-cols-3 gap-2 text-xs">
                  <li className="rounded-lg bg-card border border-foreground/10 px-2 py-1.5">✓ Behavioral check</li>
                  <li className="rounded-lg bg-card border border-foreground/10 px-2 py-1.5">✓ Static code analysis</li>
                  <li className="rounded-lg bg-card border border-foreground/10 px-2 py-1.5">✓ Plagiarism heuristics</li>
                </ul>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-success grid place-items-center text-background"><Check className="size-5" /></div>
                <div className="flex-1">
                  <div className="font-display font-bold">Verified · score 92/100</div>
                  <div className="text-xs text-muted-foreground">job_id: a1b2c3 · result_tag: success</div>
                </div>
                <Button onClick={onSuccess} className="border-2 border-foreground shadow-pop">Claim 75 pts</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function TrafficLight({ active, log }: { active: boolean; log: string[] }) {
  const last = [...log].reverse().find((l) => /GREEN|YELLOW|RED/.test(l)) ?? "";
  const on = active ? (last.includes("GREEN") ? "g" : last.includes("YELLOW") ? "y" : last.includes("RED") ? "r" : "g") : "";
  return (
    <div className="rounded-2xl bg-foreground p-3 flex flex-col items-center gap-2 ring-2 ring-foreground">
      {(["r", "y", "g"] as const).map((c) => {
        const onColor = c === "r" ? "bg-destructive shadow-[0_0_30px] shadow-destructive" : c === "y" ? "bg-sun shadow-[0_0_30px] shadow-sun" : "bg-success shadow-[0_0_30px] shadow-success";
        const offColor = c === "r" ? "bg-destructive/20" : c === "y" ? "bg-sun/20" : "bg-success/20";
        return <div key={c} className={`size-10 rounded-full transition-all ${on === c ? onColor : offColor}`} />;
      })}
    </div>
  );
}

/* ---------- LEGO flow ---------- */
function LegoFlow({ onBack, onSuccess }: { onBack: () => void; onSuccess: () => void }) {
  const [front, setFront] = useState<string | null>(null);
  const [side, setSide] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [verified, setVerified] = useState(false);

  const submit = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setVerified(true);
    }, 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <button onClick={onBack} className="text-sm text-muted-foreground inline-flex items-center gap-1 hover:text-foreground mb-3"><ArrowLeft className="size-4" /> Back</button>
      <h1 className="font-display text-3xl font-extrabold">LEGO Photo Build</h1>
      <p className="text-muted-foreground mb-4">Take a <strong>front</strong> and <strong>side</strong> photo of your finished car. We scan it, then queue it for tutor review.</p>

      <div className="rounded-3xl border-2 border-foreground bg-card shadow-card p-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <PhotoSlot label="Front view" value={front} onChange={setFront} />
          <PhotoSlot label="Side view" value={side} onChange={setSide} />
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">{front && side ? "Both photos ready ✓" : "Capture both photos to submit."}</div>
          <Button disabled={!front || !side || scanning || verified} onClick={submit} className="border-2 border-foreground shadow-pop">
            <Upload className="size-4 mr-1" /> Submit build
          </Button>
        </div>

        <AnimatePresence>
          {scanning && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-5 rounded-2xl border-2 border-foreground bg-foreground text-background overflow-hidden"
            >
              <div className="px-4 py-3 flex items-center gap-2 font-mono text-sm">
                <ScanLine className="size-4 animate-pulse" /> Scanning for Logic…
              </div>
              <div className="relative h-2 bg-background/10 overflow-hidden">
                <motion.div initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ duration: 2, ease: "linear" }} className="absolute inset-y-0 w-1/3 bg-sun" />
              </div>
            </motion.div>
          )}
          {verified && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 rounded-2xl bg-warm border-2 border-foreground/10 p-4 flex items-center gap-3"
            >
              <div className="size-10 rounded-full bg-success grid place-items-center text-background"><Check className="size-5" /></div>
              <div className="flex-1">
                <div className="font-display font-bold">Build received · queued for tutor review</div>
                <div className="text-xs text-muted-foreground">Participation points awarded now. Full credit after tutor verification.</div>
              </div>
              <Button onClick={onSuccess} className="border-2 border-foreground shadow-pop">Claim 75 pts</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function PhotoSlot({ label, value, onChange }: { label: string; value: string | null; onChange: (v: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div>
      <div className="text-xs uppercase font-mono text-muted-foreground mb-1">{label}</div>
      <button
        onClick={() => inputRef.current?.click()}
        className="relative aspect-square w-full rounded-2xl border-2 border-dashed border-foreground/30 bg-muted overflow-hidden grid place-items-center hover:border-foreground transition"
      >
        {value ? (
          <img src={value} alt={label} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="text-center text-muted-foreground">
            <Camera className="size-8 mx-auto mb-1" />
            <div className="text-sm font-medium">Tap to open camera</div>
          </div>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          const reader = new FileReader();
          reader.onload = () => onChange(reader.result as string);
          reader.readAsDataURL(f);
        }}
      />
    </div>
  );
}
