import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import benTenTheme from "@/assets/ben-10-theme.mp3";

interface MusicContextType {
  isPlaying: boolean;
  isMuted: boolean;
  play: () => void;
  pause: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

let audioInstance: HTMLAudioElement | null = null;

export function MusicProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!audioInstance) {
      audioInstance = new Audio(benTenTheme);
      audioInstance.loop = true;
      audioInstance.volume = 0.3;
      
      audioInstance.addEventListener('play', () => setIsPlaying(true));
      audioInstance.addEventListener('pause', () => setIsPlaying(false));
    }

    // Auto-play from home screen
    const playMusic = () => {
      audioInstance?.play().catch(console.warn);
    };

    // Start playing after user interaction
    document.addEventListener('click', playMusic, { once: true });
    document.addEventListener('keydown', playMusic, { once: true });

    return () => {
      document.removeEventListener('click', playMusic);
      document.removeEventListener('keydown', playMusic);
    };
  }, []);

  const play = () => {
    audioInstance?.play().catch(console.warn);
  };

  const pause = () => {
    audioInstance?.pause();
  };

  const toggleMute = () => {
    if (audioInstance) {
      const newMutedState = !isMuted;
      audioInstance.volume = newMutedState ? 0 : 0.3;
      setIsMuted(newMutedState);
    }
  };

  const setVolume = (volume: number) => {
    if (audioInstance && !isMuted) {
      audioInstance.volume = Math.max(0, Math.min(1, volume));
    }
  };

  return (
    <MusicContext.Provider value={{
      isPlaying,
      isMuted,
      play,
      pause,
      toggleMute,
      setVolume
    }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}