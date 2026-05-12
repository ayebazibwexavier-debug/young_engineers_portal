import { useEffect } from "react";
import confetti from "canvas-confetti";
import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { useLeaderboard, getStudentId } from "@/lib/store";

export function MissionAccomplished({
  open,
  onClose,
  badge,
  title = "Mission Accomplished!",
  subtitle = "Well done, Engineer.",
}: {
  open: boolean;
  onClose: () => void;
  badge?: string;
  title?: string;
  subtitle?: string;
}) {
  const board = useLeaderboard();
  const sorted = [...board].sort((a, b) => b.points - a.points);
  const myId = getStudentId();
  const myRank = sorted.findIndex((e) => e.id === myId) + 1;
  const me = sorted.find((e) => e.id === myId);

  useEffect(() => {
    if (!open) return;
    const fire = (opts: confetti.Options) => confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, ...opts });
    fire({});
    setTimeout(() => fire({ angle: 60, origin: { x: 0 } }), 250);
    setTimeout(() => fire({ angle: 120, origin: { x: 1 } }), 500);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 16 }}
        className="w-full max-w-md rounded-3xl bg-card border-2 border-foreground shadow-card overflow-hidden"
      >
        <div className="bg-hero p-6 text-center text-primary-foreground">
          <div className="mx-auto size-20 rounded-full bg-background/95 grid place-items-center text-5xl mb-3 ring-4 ring-foreground">
            {badge ?? "🏆"}
          </div>
          <h2 className="font-display text-3xl font-extrabold">{title}</h2>
          <p className="opacity-90 mt-1">{subtitle}</p>
        </div>
        <div className="p-5 space-y-4">
          <div className="rounded-2xl bg-accent border-2 border-foreground/10 p-4 flex items-center gap-3">
            <Trophy className="size-6 text-primary" />
            <div className="flex-1">
              <div className="text-xs text-muted-foreground font-mono">{myId}</div>
              <div className="font-display font-bold">Rank #{myRank} · {me?.points ?? 0} pts</div>
            </div>
            <div className="text-2xl">{(me?.badges ?? []).join(" ")}</div>
          </div>
          <ul className="text-sm divide-y divide-foreground/10 rounded-xl border border-foreground/10">
            {sorted.slice(0, 5).map((e, i) => (
              <li key={e.id} className={`flex items-center gap-3 px-3 py-2 ${e.id === myId ? "bg-sun/30" : ""}`}>
                <span className="font-mono w-6 text-muted-foreground">#{i + 1}</span>
                <span className="flex-1 truncate">{e.name}</span>
                <span className="font-bold">{e.points}</span>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">Keep building</Button>
            <Button asChild className="flex-1"><Link to="/leaderboard" onClick={onClose}>Full board</Link></Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
