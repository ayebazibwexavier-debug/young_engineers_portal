import { createFileRoute, Link } from "@tanstack/react-router";
import { Trophy, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import { SiteHeader } from "@/components/asist/SiteHeader";
import { Button } from "@/components/ui/button";
import { useLeaderboard, getStudentId, resetLeaderboard } from "@/lib/store";

export const Route = createFileRoute("/leaderboard")({
  component: Leaderboard,
  head: () => ({
    meta: [
      { title: "Leaderboard · ASIST Young Engineers" },
      { name: "description", content: "Live rankings of young engineers across Uganda — points and badges from verified builds." },
    ],
  }),
});

function Leaderboard() {
  const board = useLeaderboard();
  const sorted = [...board].sort((a, b) => b.points - a.points);
  const myId = getStudentId();
  const max = Math.max(...sorted.map((s) => s.points), 1);

  return (
    <div className="min-h-screen pb-16">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-4 pt-6">
        <div className="text-xs text-muted-foreground"><Link to="/" className="hover:underline">Home</Link> · Leaderboard</div>
        <div className="flex items-end justify-between mt-2 gap-3">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold">Top Young Engineers</h1>
            <p className="text-muted-foreground">Updates the moment a build is verified.</p>
          </div>
          <Button variant="outline" size="sm" onClick={resetLeaderboard}><RotateCcw className="size-4 mr-1" /> Reset demo</Button>
        </div>

        {/* Podium */}
        <div className="mt-6 grid grid-cols-3 gap-3 items-end">
          {[1, 0, 2].map((idx) => {
            const e = sorted[idx];
            if (!e) return <div key={idx} />;
            const heights = [0, "h-32", "h-24", "h-20"];
            const heightIdx = idx === 0 ? 1 : idx === 1 ? 2 : 3;
            const colors = ["", "bg-sun", "bg-sky", "bg-accent"];
            return (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl">{idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}</div>
                <div className={`mt-2 rounded-t-2xl border-2 border-foreground border-b-0 ${colors[heightIdx]} ${heights[heightIdx]} flex items-center justify-center font-display font-extrabold text-2xl`}>
                  {e.points}
                </div>
                <div className="rounded-b-xl border-2 border-foreground bg-card px-2 py-1 text-xs truncate">{e.name}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Full list */}
        <div className="mt-8 rounded-3xl border-2 border-foreground bg-card shadow-card overflow-hidden">
          <div className="px-4 py-3 bg-foreground text-background flex items-center gap-2 font-display font-bold">
            <Trophy className="size-5 text-sun" /> All rankings
          </div>
          <ul className="divide-y divide-foreground/10">
            {sorted.map((e, i) => (
              <li key={e.id} className={`flex items-center gap-3 px-4 py-3 ${e.id === myId ? "bg-sun/30" : ""}`}>
                <span className="font-mono w-8 text-muted-foreground">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{e.name} {e.id === myId && <span className="text-xs font-mono text-primary ml-1">(you)</span>}</div>
                  <div className="text-xs text-muted-foreground font-mono truncate">{e.id}</div>
                </div>
                <div className="hidden sm:block w-32">
                  <div className="h-2 rounded-full bg-foreground/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(e.points / max) * 100}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-full bg-hero"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1 text-lg w-16 justify-end">{e.badges.join("")}</div>
                <div className="font-display font-extrabold w-14 text-right">{e.points}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 text-center">
          <Button asChild size="lg" className="border-2 border-foreground shadow-pop">
            <Link to="/assessment">Earn more points →</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
