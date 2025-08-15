import { SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useMusic } from "@/contexts/MusicContext";

export function TopNav() {
  const [time, setTime] = useState<string>("");
  const { isMuted, toggleMute } = useMusic();
  
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
        <button 
          onClick={toggleMute}
          className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <div className="size-8 rounded-full bg-gradient-to-br from-primary to-primary/60 ring-2 ring-primary/40" aria-label="Profile avatar" />
      </div>
    </header>
  );
}
