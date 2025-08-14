import { useState } from "react";
import { Mic, MicOff } from "lucide-react";

interface VoiceButtonProps {
  onVoiceStart: () => void;
  supported: boolean;
}

export function VoiceButton({ onVoiceStart, supported }: VoiceButtonProps) {
  const [isListening, setIsListening] = useState(false);

  const handleClick = () => {
    setIsListening(true);
    onVoiceStart();
    setTimeout(() => setIsListening(false), 3000); // Reset after 3 seconds
  };

  if (!supported) return null;

  return (
    <button
      onClick={handleClick}
      className="voice-button flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
      disabled={isListening}
    >
      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      {isListening ? "Listening..." : "Answer by Voice"}
    </button>
  );
}