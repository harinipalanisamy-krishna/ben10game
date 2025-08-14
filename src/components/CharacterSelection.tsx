import { useState } from "react";
import boy1 from "@/assets/character-boy1.png";
import boy2 from "@/assets/character-boy2.png";
import girl1 from "@/assets/character-girl1.png";
import girl2 from "@/assets/character-girl2.png";

interface Character {
  id: string;
  name: string;
  image: string;
  description: string;
}

const characters: Character[] = [
  {
    id: "hero-kai",
    name: "Kai",
    image: boy1,
    description: "The Brave Hero"
  },
  {
    id: "tech-zain",
    name: "Zain",
    image: boy2,
    description: "Tech Genius"
  },
  {
    id: "adventure-nova",
    name: "Nova",
    image: girl1,
    description: "Adventure Seeker"
  },
  {
    id: "scientist-luna",
    name: "Luna",
    image: girl2,
    description: "Smart Scientist"
  }
];

interface CharacterSelectionProps {
  onCharacterSelect: (character: Character) => void;
  playerName: string;
}

export function CharacterSelection({ onCharacterSelect, playerName }: CharacterSelectionProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const handleSelect = (character: Character) => {
    setSelectedCharacter(character);
  };

  const handleConfirm = () => {
    if (selectedCharacter) {
      onCharacterSelect(selectedCharacter);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <section className="card-omni p-8 text-center">
        <h1 className="font-heading text-4xl mb-2 text-white">Choose Your Hero, {playerName}!</h1>
        <p className="text-white/80 mb-8 text-lg">Select your character for the Ben 10 Quiz Adventure</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {characters.map((character) => (
            <div
              key={character.id}
              className={`character-card cursor-pointer transition-all duration-300 ${
                selectedCharacter?.id === character.id
                  ? 'ring-4 ring-brand shadow-character-selected scale-105'
                  : 'hover:scale-105 hover:shadow-character-hover'
              }`}
              onClick={() => handleSelect(character)}
            >
              <div className="character-image-container">
                <img 
                  src={character.image} 
                  alt={character.name}
                  className="character-image"
                />
              </div>
              <div className="p-4">
                <h3 className="font-heading text-xl text-white mb-1">{character.name}</h3>
                <p className="text-brand text-sm">{character.description}</p>
              </div>
            </div>
          ))}
        </div>

        {selectedCharacter && (
          <div className="animate-fade-in">
            <div className="bg-brand/20 border border-brand rounded-lg p-4 mb-6">
              <p className="text-white text-lg">
                Great choice! You selected <span className="text-brand font-semibold">{selectedCharacter.name}</span>
              </p>
            </div>
            <button 
              onClick={handleConfirm}
              className="btn-neon text-xl px-8 py-4 animate-scale-in"
            >
              Start Adventure with {selectedCharacter.name}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}