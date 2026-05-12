import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export type Slide = {
  title: string;
  caption: string;
  image?: string;
  emoji?: string;
  code?: string;
  bg?: string;
};

export function SlideDeck({ slides, accent = "bg-sun" }: { slides: Slide[]; accent?: string }) {
  const [i, setI] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const next = () => setI((p) => Math.min(slides.length - 1, p + 1));
  const prev = () => setI((p) => Math.max(0, p - 1));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // swipe
  const startX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => (startX.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (dx < -40) next();
    if (dx > 40) prev();
    startX.current = null;
  };

  const slide = slides[i];

  return (
    <div className="w-full">
      <div
        ref={ref}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="relative aspect-[4/5] sm:aspect-video w-full overflow-hidden rounded-3xl border-2 border-foreground bg-card shadow-card"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
            className={`absolute inset-0 flex flex-col ${slide.bg ?? "bg-warm"}`}
          >
            <div className="flex-1 flex items-center justify-center p-6">
              {slide.image ? (
                <img src={slide.image} alt={slide.title} className="max-h-full max-w-full object-contain drop-shadow-xl" />
              ) : (
                <div className="text-[8rem] sm:text-[12rem] leading-none select-none">{slide.emoji}</div>
              )}
            </div>
            {slide.code && (
              <pre className="mx-4 mb-3 max-h-36 overflow-auto rounded-xl bg-foreground text-background p-3 text-xs font-mono">
                <code>{slide.code}</code>
              </pre>
            )}
            <div className="bg-background/95 border-t-2 border-foreground/10 p-4">
              <div className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
                Step {i + 1} / {slides.length} · {slide.title}
              </div>
              <div className="font-display text-lg sm:text-xl font-semibold mt-1">{slide.caption}</div>
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={prev}
          disabled={i === 0}
          aria-label="Previous"
          className="absolute left-2 top-1/2 -translate-y-1/2 size-11 rounded-full bg-background border-2 border-foreground shadow-pop disabled:opacity-30 grid place-items-center"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          onClick={next}
          disabled={i === slides.length - 1}
          aria-label="Next"
          className="absolute right-2 top-1/2 -translate-y-1/2 size-11 rounded-full bg-background border-2 border-foreground shadow-pop disabled:opacity-30 grid place-items-center"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all ${idx === i ? `${accent} w-8` : "bg-foreground/15 w-2"}`}
          />
        ))}
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" onClick={prev} disabled={i === 0}>Back</Button>
          <Button size="sm" onClick={next} disabled={i === slides.length - 1}>Next</Button>
        </div>
      </div>
    </div>
  );
}
