import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Target, ArrowRight, ExternalLink } from "lucide-react";
import { SiteHeader } from "@/components/asist/SiteHeader";
import { SlideDeck, type Slide } from "@/components/asist/SlideDeck";
import { Quiz } from "@/components/asist/Quiz";
import { MissionAccomplished } from "@/components/asist/MissionAccomplished";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/lessons/arduino")({
  component: ArduinoLesson,
  head: () => ({
    meta: [
      { title: "Arduino Traffic Light · ASIST Young Engineers" },
      { name: "description", content: "Wire and code an Arduino traffic light. Test it inside an embedded Wokwi simulator and submit for auto-grading." },
    ],
  }),
});

const code = `void setup() {
  pinMode(8, OUTPUT); // RED
  pinMode(9, OUTPUT); // YELLOW
  pinMode(10, OUTPUT); // GREEN
}
void loop() {
  digitalWrite(10, HIGH); delay(3000); digitalWrite(10, LOW);
  digitalWrite(9, HIGH);  delay(1000); digitalWrite(9, LOW);
  digitalWrite(8, HIGH);  delay(3000); digitalWrite(8, LOW);
}`;

const slides: Slide[] = [
  { title: "Mission", caption: "Code a traffic light: green → yellow → red, on repeat.", emoji: "🚦", bg: "bg-warm" },
  { title: "Parts", caption: "Arduino Uno, breadboard, 3 LEDs, 3 resistors, jumper wires.", emoji: "🧰" },
  { title: "Power rails", caption: "Connect Arduino 5V to + rail and GND to – rail.", emoji: "⚡" },
  { title: "Wire RED", caption: "Pin 8 → 220Ω resistor → red LED → GND.", emoji: "🔴" },
  { title: "Wire YELLOW", caption: "Pin 9 → 220Ω resistor → yellow LED → GND.", emoji: "🟡" },
  { title: "Wire GREEN", caption: "Pin 10 → 220Ω resistor → green LED → GND.", emoji: "🟢" },
  { title: "Code it", caption: "Cycle through pins 10 → 9 → 8 with delays.", emoji: "💻", code },
  { title: "Run it", caption: "Hit ▶ in Wokwi. See the lights cycle, then Submit!", emoji: "🚦", bg: "bg-sun" },
];

const quiz = [
  { q: "Which Arduino pin lights the GREEN LED in our circuit?", choices: ["8", "9", "10", "13"], answer: 2 },
  { q: "Why do we put a resistor in series with each LED?", choices: ["For colour", "To limit current", "To slow Arduino", "For looks"], answer: 1 },
  { q: "What does delay(1000) do?", choices: ["Waits 1 sec", "Waits 1 ms", "Restarts Arduino", "Turns off LED"], answer: 0 },
  { q: "In what order do real lights cycle?", choices: ["R→Y→G", "G→Y→R", "Y→R→G", "G→R→Y"], answer: 1 },
];

function ArduinoLesson() {
  const [done, setDone] = useState(false);
  return (
    <div className="min-h-screen pb-16">
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-4 pt-6">
        <div className="text-xs text-muted-foreground"><Link to="/" className="hover:underline">Home</Link> · Arduino Traffic Light</div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold mt-2">Arduino Traffic Light</h1>
        <p className="text-muted-foreground mt-1">Wire it on the breadboard, code it in C, and prove it works inside Wokwi.</p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-accent border border-foreground/10 px-2 py-1"><Target className="size-3" /> Cycle G→Y→R</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-accent border border-foreground/10 px-2 py-1"><Clock className="size-3" /> ~30 min</span>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 mt-6">
        <SlideDeck slides={slides} accent="bg-secondary" />
      </div>

      <div className="mx-auto max-w-4xl px-4 mt-8">
        <div className="rounded-3xl border-2 border-foreground bg-card p-3 shadow-card">
          <div className="flex items-center justify-between px-2 py-2">
            <div className="font-display font-bold">🧪 Wokwi Simulator</div>
            <a href="https://wokwi.com/projects/new/arduino-uno" target="_blank" rel="noreferrer" className="text-xs inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
              Open in new tab <ExternalLink className="size-3" />
            </a>
          </div>
          <div className="aspect-video w-full overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/5 grid place-items-center text-center p-6">
            <div>
              <div className="text-5xl mb-3">🚦</div>
              <div className="font-display font-bold">Wokwi template loads here</div>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">In production this iframe embeds the teacher's pre-wired Wokwi project. Submit triggers our verification webhook.</p>
              <Button asChild className="mt-4 border-2 border-foreground shadow-pop">
                <Link to="/assessment">Open Assessment Hub <ArrowRight className="ml-1 size-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 mt-8">
        <Quiz questions={quiz} onPass={() => setDone(true)} />
      </div>

      <MissionAccomplished open={done} onClose={() => setDone(false)} badge="🎓" title="Quiz cleared!" subtitle="+25 points · now run the simulator to earn 🚦." />
    </div>
  );
}
