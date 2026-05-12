import { Link } from "@tanstack/react-router";
import logo from "@/assets/asist-logo.png";
import { getStudentId } from "@/lib/store";

export function SiteHeader() {
  const id = typeof window !== "undefined" ? getStudentId() : "ASIST-STUDENT-001";
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-background/80 border-b-2 border-foreground/10">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 font-display font-bold">
          <img src={logo} alt="ASIST Foundation" className="h-9 w-9 rounded-md object-contain bg-white ring-1 ring-foreground/10" />
          <span className="hidden sm:inline">ASIST · Young Engineers</span>
          <span className="sm:hidden">ASIST</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium">
          <Link to="/lessons/lego" className="px-2 py-1 rounded-md hover:bg-accent" activeProps={{ className: "px-2 py-1 rounded-md bg-sun text-sun-foreground" }}>LEGO</Link>
          <Link to="/lessons/arduino" className="px-2 py-1 rounded-md hover:bg-accent" activeProps={{ className: "px-2 py-1 rounded-md bg-sun text-sun-foreground" }}>Arduino</Link>
          <Link to="/assessment" className="px-2 py-1 rounded-md hover:bg-accent" activeProps={{ className: "px-2 py-1 rounded-md bg-sun text-sun-foreground" }}>Assess</Link>
          <Link to="/leaderboard" className="px-2 py-1 rounded-md hover:bg-accent" activeProps={{ className: "px-2 py-1 rounded-md bg-sun text-sun-foreground" }}>Board</Link>
        </nav>
        <div className="hidden md:flex items-center gap-2 text-xs font-mono px-2 py-1 rounded-md bg-foreground text-background">
          {id}
        </div>
      </div>
    </header>
  );
}
