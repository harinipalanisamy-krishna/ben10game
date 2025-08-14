import { useState, useEffect } from "react";
import { AnimeRunner } from "./AnimeRunner";

interface LevelTransitionProps {
  level: number;
  onComplete: () => void;
  isVisible: boolean;
}

export function LevelTransition({ level, onComplete, isVisible }: LevelTransitionProps) {
  const [stage, setStage] = useState<'button' | 'countdown' | 'loading'>('button');
  const [countdown, setCountdown] = useState(3);
  const [showRunner, setShowRunner] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setStage('button');
      setCountdown(3);
      setShowRunner(false);
    }
  }, [isVisible]);

  const startCountdown = () => {
    setStage('countdown');
    
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setStage('loading');
          setShowRunner(true);
          
          // Voice countdown
          const voices = speechSynthesis.getVoices();
          const femaleVoice = voices.find(voice => 
            voice.name.includes('Female') || 
            voice.name.includes('Samantha') || 
            voice.name.includes('Karen')
          ) || voices.find(voice => voice.lang.includes('en'));
          
          const speak = (text: string) => {
            const utterance = new SpeechSynthesisUtterance(text);
            if (femaleVoice) utterance.voice = femaleVoice;
            utterance.rate = 1.0;
            utterance.pitch = 1.2;
            speechSynthesis.speak(utterance);
          };
          
          speak(`Level ${level} starting in 3`);
          setTimeout(() => speak('2'), 1000);
          setTimeout(() => speak('1'), 2000);
          setTimeout(() => speak('Go!'), 3000);
          
          // Complete after 10 seconds
          setTimeout(() => {
            onComplete();
          }, 10000);
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-lg">
      <div className="text-center space-y-8">
        {stage === 'button' && (
          <div className="animate-fade-in">
            <h2 className="text-4xl font-heading mb-6 text-white">Ready for Level {level}?</h2>
            <button 
              onClick={startCountdown}
              className="btn-neon text-xl px-8 py-4"
            >
              Start Level {level}
            </button>
          </div>
        )}
        
        {stage === 'countdown' && (
          <div className="animate-scale-in">
            <h2 className="text-6xl font-heading text-brand animate-pulse">
              {countdown}
            </h2>
            <p className="text-2xl text-white mt-4">Get Ready!</p>
          </div>
        )}
        
        {stage === 'loading' && (
          <div className="animate-fade-in">
            <div className="spinner-glow mx-auto mb-6"></div>
            <h2 className="text-3xl font-heading text-white mb-4">Level {level} Loading...</h2>
            <p className="text-lg text-muted-foreground">Preparing your questions...</p>
          </div>
        )}
      </div>
      
      <AnimeRunner 
        isVisible={showRunner} 
        onComplete={() => {}} 
      />
    </div>
  );
}