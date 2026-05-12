import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { awardPoints } from "@/lib/store";

export type QuizQ = { q: string; choices: string[]; answer: number };

export function Quiz({ questions, onPass }: { questions: QuizQ[]; onPass?: () => void }) {
  const [picked, setPicked] = useState<(number | null)[]>(questions.map(() => null));
  const [submitted, setSubmitted] = useState(false);

  const correct = picked.filter((p, i) => p === questions[i].answer).length;
  const passed = correct >= Math.ceil(questions.length * 0.6);

  return (
    <div className="rounded-3xl border-2 border-foreground bg-card p-5 shadow-card">
      <h3 className="font-display text-xl font-bold mb-4">Quick Check</h3>
      <ol className="space-y-5">
        {questions.map((q, qi) => (
          <li key={qi}>
            <div className="font-medium mb-2">{qi + 1}. {q.q}</div>
            <div className="grid sm:grid-cols-2 gap-2">
              {q.choices.map((c, ci) => {
                const isPicked = picked[qi] === ci;
                const isCorrect = ci === q.answer;
                let cls = "border-foreground/15 hover:border-foreground/40";
                if (submitted && isCorrect) cls = "border-success bg-success/10";
                else if (submitted && isPicked && !isCorrect) cls = "border-destructive bg-destructive/10";
                else if (isPicked) cls = "border-foreground bg-accent";
                return (
                  <button
                    key={ci}
                    disabled={submitted}
                    onClick={() => setPicked((p) => p.map((v, idx) => (idx === qi ? ci : v)))}
                    className={`text-left rounded-xl border-2 px-3 py-2 text-sm transition ${cls}`}
                  >
                    <div className="flex items-center gap-2">
                      {submitted && isCorrect && <Check className="size-4 text-success" />}
                      {submitted && isPicked && !isCorrect && <X className="size-4 text-destructive" />}
                      <span>{c}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-5 flex items-center justify-between gap-3">
        {submitted ? (
          <div className="text-sm font-medium">
            Score: <span className="font-bold">{correct}/{questions.length}</span>{" "}
            {passed ? <span className="text-success">— Nice!</span> : <span className="text-destructive">— Try again.</span>}
          </div>
        ) : <span className="text-xs text-muted-foreground">Answer all questions to submit.</span>}
        {!submitted ? (
          <Button
            disabled={picked.some((p) => p === null)}
            onClick={() => {
              setSubmitted(true);
              const c = picked.filter((p, i) => p === questions[i].answer).length;
              if (c >= Math.ceil(questions.length * 0.6)) {
                awardPoints(25, "🎓");
                onPass?.();
              }
            }}
          >
            Submit
          </Button>
        ) : (
          <Button variant="outline" onClick={() => { setSubmitted(false); setPicked(questions.map(() => null)); }}>
            Try again
          </Button>
        )}
      </div>
    </div>
  );
}
