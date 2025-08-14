import { useEffect, useState } from "react";

interface AnimeRunnerProps {
  isVisible: boolean;
  onComplete?: () => void;
}

export function AnimeRunner({ isVisible, onComplete }: AnimeRunnerProps) {
  const [position, setPosition] = useState(-100);

  useEffect(() => {
    if (isVisible) {
      setPosition(-100);
      const interval = setInterval(() => {
        setPosition(prev => {
          if (prev >= window.innerWidth + 100) {
            clearInterval(interval);
            setTimeout(() => onComplete?.(), 500);
            return prev;
          }
          return prev + 8;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 z-50 pointer-events-none">
      <div 
        className="anime-runner text-6xl transition-transform duration-100"
        style={{ transform: `translateX(${position}px)` }}
      >
        🏃‍♀️
      </div>
    </div>
  );
}