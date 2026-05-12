import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, Cpu, Car, Trophy, Wifi, Camera, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/asist/SiteHeader";
import hero from "@/assets/landing-hero.jpg";
import lego from "@/assets/lego-hero.jpg";
import arduino from "@/assets/arduino-hero.jpg";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "ASIST Young Engineers — Digitising STEM Education in Uganda" },
      { name: "description", content: "Mobile-first, low-bandwidth STEM lessons and an automated Assessment Hub for LEGO and Arduino projects across Uganda." },
    ],
  }),
});

function Landing() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-4 pt-8 pb-12 grid lg:grid-cols-2 gap-8 items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-foreground bg-sun text-sun-foreground px-3 py-1 text-xs font-mono shadow-pop">
            <Sparkles className="size-3.5" /> Pitch prototype · v0.1
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold leading-[1.05] mt-4">
            Every kid in Uganda<br />
            <span className="text-primary">deserves to be</span><br />
            an Engineer.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-prose">
            ASIST Young Engineers turns a smartphone into a full STEM lab. Sideways lessons, embedded simulators, and a verification engine that grades work in real time — built for low-bandwidth classrooms.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" className="shadow-pop border-2 border-foreground">
              <Link to="/lessons/lego">Start a Lesson <ArrowRight className="ml-1 size-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-2 border-foreground shadow-pop bg-card">
              <Link to="/assessment">Open Assessment Hub</Link>
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Wifi className="size-3.5" /> Works on 2G</span>
            <span className="flex items-center gap-1"><Camera className="size-3.5" /> Photo-verified builds</span>
            <span className="flex items-center gap-1"><Trophy className="size-3.5" /> Live leaderboard</span>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-hero rounded-[2rem] blur-2xl opacity-50" />
          <img
            src={hero}
            alt="Ugandan students learning STEM with smartphones and a robot car"
            width={1280}
            height={896}
            className="relative rounded-[2rem] border-2 border-foreground shadow-card object-cover w-full"
          />
          <div className="absolute -bottom-4 -left-4 bg-card border-2 border-foreground rounded-2xl shadow-pop px-4 py-3 flex items-center gap-3">
            <div className="size-10 rounded-full bg-success grid place-items-center text-background">✓</div>
            <div>
              <div className="text-xs text-muted-foreground">ASIST-STUDENT-001</div>
              <div className="font-display font-bold text-sm">+150 pts · Rank #1</div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-display text-3xl font-extrabold">Pick a Mission</h2>
          <Link to="/leaderboard" className="text-sm font-medium underline-offset-4 hover:underline">View leaderboard →</Link>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <MissionCard
            to="/lessons/lego"
            title="Build a LEGO Power Car"
            subtitle="8 sideways slides · Mobile-first · Photo verification"
            img={lego}
            icon={<Car className="size-5" />}
            color="bg-sun"
          />
          <MissionCard
            to="/lessons/arduino"
            title="Code an Arduino Traffic Light"
            subtitle="Wokwi simulator · Auto-graded · Earn the 🚦 badge"
            img={arduino}
            icon={<Cpu className="size-5" />}
            color="bg-sky"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="font-display text-3xl font-extrabold text-center">How the Verification Engine works</h2>
        <p className="text-center text-muted-foreground mt-2 max-w-2xl mx-auto">
          Two paths, one outcome: students learn, the system verifies, the leaderboard updates — automatically.
        </p>
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {[
            { n: "01", t: "Submit", d: "From Wokwi simulator OR a phone camera (front + side photo)." },
            { n: "02", t: "Verify", d: "Behavioral simulation + static code check, or tutor-queued image scan." },
            { n: "03", t: "Reward", d: "Points, badges, confetti and an instantly updated public leaderboard." },
          ].map((s) => (
            <div key={s.n} className="rounded-3xl border-2 border-foreground bg-card p-5 shadow-card">
              <div className="font-mono text-xs text-muted-foreground">{s.n}</div>
              <div className="font-display text-xl font-bold mt-1">{s.t}</div>
              <p className="text-sm text-muted-foreground mt-1">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t-2 border-foreground/10 py-8 text-center text-xs text-muted-foreground">
        ASIST Foundation · Digitising STEM Education in Uganda
      </footer>
    </div>
  );
}

function MissionCard({ to, title, subtitle, img, icon, color }: { to: string; title: string; subtitle: string; img: string; icon: React.ReactNode; color: string }) {
  return (
    <Link to={to} className="group block rounded-3xl overflow-hidden border-2 border-foreground bg-card shadow-card hover:-translate-y-1 transition">
      <div className={`relative aspect-[16/10] ${color}`}>
        <img src={img} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply" />
      </div>
      <div className="p-4 flex items-center gap-3">
        <div className="size-10 rounded-xl bg-foreground text-background grid place-items-center">{icon}</div>
        <div className="flex-1">
          <div className="font-display font-bold">{title}</div>
          <div className="text-xs text-muted-foreground">{subtitle}</div>
        </div>
        <ArrowRight className="size-5 group-hover:translate-x-1 transition" />
      </div>
    </Link>
  );
}
