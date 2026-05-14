import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Target, ArrowRight, Download, ExternalLink } from "lucide-react";
import { SiteHeader } from "@/components/asist/SiteHeader";
import { SlideDeck, type Slide } from "@/components/asist/SlideDeck";
import { Quiz } from "@/components/asist/Quiz";
import { MissionAccomplished } from "@/components/asist/MissionAccomplished";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/lessons/lego")({
  component: LegoLesson,
  head: () => ({
    meta: [
      { title: "LEGO Power Car · ASIST Young Engineers" },
      { name: "description", content: "Build a battery-powered LEGO car in 8 sideways slides. Mobile-first lesson with quiz and photo verification." },
    ],
  }),
});

const slides: Slide[] = [
  { title: "Mission", caption: "Build a 4-wheel LEGO car that rolls 1 metre.", emoji: "🚗", bg: "bg-warm" },
  { title: "Parts", caption: "Grab a baseplate, 4 wheels, 2 axles, and a battery box.", emoji: "🧱" },
  { title: "Chassis", caption: "Snap a 6×10 plate as your chassis foundation.", emoji: "🟨" },
  { title: "Axles", caption: "Push axles through wheel holders, front and back.", emoji: "⚙️" },
  { title: "Wheels", caption: "Pop wheels onto each axle. Spin them — they should turn freely.", emoji: "🛞" },
  { title: "Motor", caption: "Clip the motor on top and connect it to the rear axle.", emoji: "🔌" },
  { title: "Battery", caption: "Slide in 2× AA batteries and snap the cover.", emoji: "🔋" },
  { title: "Test drive", caption: "Switch on. Race it across the desk. Mission ready!", emoji: "🏁", bg: "bg-sun" },
];

const quiz = [
  { q: "Which part gives the car energy to move?", choices: ["Wheels", "Battery box", "Baseplate", "Axle"], answer: 1 },
  { q: "If a wheel doesn't spin freely, what should you check first?", choices: ["The colour", "The axle alignment", "The battery", "The plate"], answer: 1 },
  { q: "How many wheels does our car need?", choices: ["2", "3", "4", "6"], answer: 2 },
  { q: "Where does the motor connect?", choices: ["Front axle", "Rear axle", "The roof", "Battery box"], answer: 1 },
];

function LegoLesson() {
  const [done, setDone] = useState(false);
  return (
    <div className="min-h-screen pb-16">
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-4 pt-6">
        <div className="text-xs text-muted-foreground"><Link to="/" className="hover:underline">Home</Link> · LEGO Power Car</div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold mt-2">LEGO Power Car</h1>
        <p className="text-muted-foreground mt-1">Your first physical build. Swipe through the slides and assemble step by step.</p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-accent border border-foreground/10 px-2 py-1"><Target className="size-3" /> Roll 1 metre</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-accent border border-foreground/10 px-2 py-1"><Clock className="size-3" /> ~25 min</span>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 mt-6">
        <SlideDeck slides={slides} accent="bg-primary" />
      </div>

      <div className="mx-auto max-w-4xl px-4 mt-8">
        <div className="rounded-3xl border-2 border-foreground bg-card p-3 shadow-card">
          <div className="flex items-center justify-between px-2 py-2">
            <div className="font-display font-bold">🛠️ Tinkercad Simulation</div>
            <a href="https://www.tinkercad.com/embed/0cl8dPuvIbf?editbtn=1&simlab=1" target="_blank" rel="noreferrer" className="text-xs inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
              Open in new tab <ExternalLink className="size-3" />
            </a>
          </div>
          <iframe
            src="https://www.tinkercad.com/embed/0cl8dPuvIbf?editbtn=1&simlab=1"
            title="Tinkercad LEGO car simulation"
            className="aspect-video w-full rounded-2xl border border-foreground/10 bg-foreground/5"
            allow="fullscreen"
          />
        </div>

        <div className="mt-6 rounded-3xl border-2 border-foreground bg-card p-3 shadow-card">
          <div className="px-2 py-2 font-display font-bold">🎬 See the build in motion</div>
          <video
            src="https://static.vecteezy.com/system/resources/previews/052/912/299/watermarked/animation-of-car-vehicle-for-transportation-needs-showcasing-comfort-safety-and-efficiency-perfect-for-modern-travel-free-video.mp4"
            controls
            playsInline
            className="aspect-video w-full rounded-2xl border border-foreground/10 bg-black"
          />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 mt-8 grid lg:grid-cols-[2fr_1fr] gap-5">
        <Quiz questions={quiz} onPass={() => setDone(true)} />
        <div className="rounded-3xl border-2 border-foreground bg-sun p-5 shadow-card flex flex-col">
          <div className="font-display text-xl font-bold">Built it for real?</div>
          <p className="text-sm mt-1 opacity-80">Open the Assessment Hub and submit a front + side photo to earn the 🚗 badge.</p>
          <Button asChild className="mt-4 self-start border-2 border-foreground shadow-pop">
            <Link to="/assessment">Go to Assessment <ArrowRight className="ml-1 size-4" /></Link>
          </Button>
          <a
            href="https://assets.education.lego.com/v3/assets/blt293eea581807678a/blt98b1580d961580ce/5f88040e1e95ad78fa1e8bec/9686-power-car.pdf"
            target="_blank"
            rel="noreferrer"
            download
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground self-start"
          >
            <Download className="size-4" /> Download offline worksheet (PDF)
          </a>
        </div>
      </div>

      <MissionAccomplished open={done} onClose={() => setDone(false)} badge="🎓" title="Quiz cleared!" subtitle="+25 points · keep going to earn the build badge." />
    </div>
  );
}
