import { SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";

export function TopNav() {
  const [time, setTime] = useState<string>("");
  useEffect(() => {
    const id = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="h-14 border-b flex items-center justify-between px-3">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h1 className="font-heading text-lg tracking-wide">Voice of Knowledge</h1>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-muted-foreground hidden sm:inline">{time}</span>
        <div className="size-8 rounded-full bg-gradient-to-br from-primary to-primary/60 ring-2 ring-primary/40" aria-label="Profile avatar" />
      </div>
    </header>
  );
}
