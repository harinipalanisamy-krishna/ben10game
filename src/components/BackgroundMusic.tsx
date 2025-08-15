import { useMusic } from "@/contexts/MusicContext";
import { Music, Play, Pause } from "lucide-react";

export function BackgroundMusic() {
  const { isPlaying, play, pause } = useMusic();

  const togglePlayback = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-background/90 backdrop-blur-sm border rounded-lg p-3 flex items-center gap-3">
        <Music className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-white">Ben 10 Theme</span>
        <button
          onClick={togglePlayback}
          className="p-1 rounded hover:bg-white/10 transition-colors text-white"
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}