import { useEffect, useState } from "react";
import { initBackgroundMusic } from "@/utils/sound";

export function BackgroundMusic() {
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      const audioUrl = URL.createObjectURL(file);
      initBackgroundMusic(audioUrl);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-background/90 backdrop-blur-sm border rounded-lg p-3">
        <label className="block text-sm font-medium text-white mb-2">
          Background Music
        </label>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="text-xs text-white file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
        />
        {audioFile && (
          <p className="text-xs text-muted-foreground mt-1">
            Playing: {audioFile.name}
          </p>
        )}
      </div>
    </div>
  );
}