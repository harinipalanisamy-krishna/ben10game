import { useEffect, useMemo, useRef, useState } from "react";
import { Question, LevelId } from "@/types/quiz";
import { generateQuestions } from "@/utils/ai";
import { initAudio, playBgLoop, playBuzzer, playKalamClip, playWin, setMuted, stopBg } from "@/utils/sound";
import { Timer } from "@/components/Timer";
import { Button } from "@/components/ui/button";
import { VoiceButton } from "@/components/VoiceButton";
import { LevelTransition } from "@/components/LevelTransition";
import { toast } from "@/hooks/use-toast";

const ROASTS = [
  "Even the Omnitrix couldn't find that answer!",
  "Close one! Next time, hero mode.",
  "You just unlocked… the wrong dimension.",
  "Kazam! That's a miss. Try again.",
  "Ben would've transformed faster than that!",
  "Alien X is facepalming.",
  "Upgrade your brain firmware soon!",
  "Roasted, but with love.",
  "That buzzer was louder than the truth.",
  "Oops! Plot twist: it wasn't that.",
  "Max Tennyson says: focus, champ!",
  "Almost! Dial the Omnitrix again.",
  "The Multiverse rejects that option.",
  "Hint: reading helps. Sometimes.",
  "The kryptonite of your brain today.",
  "You're on the wrong timeline.",
  "Try again before Vilgax sees this.",
  "Spotted: a learning moment.",
  "That's a no from the Null Void.",
  "Brain buffer overflow. Reboot!",
  "We all start somewhere. Keep going!",
  "Missed by a light-year.",
  "Plot armor can't save that choice.",
  "Zapped! Wrong option.",
  "Swampfire says: not quite hot.",
  "Accelerate next time!",
  "Grey Matter is unimpressed.",
  "Need more XP for that boss fight.",
  "Gwen says: study harder!",
  "Heatblast? More like cold guess.",
  "Echo Echo says: nope nope nope.",
  "Wildvine thinks that was a stretch.",
  "Upgrade denied.",
  "Humungousaur-sized mistake.",
  "Diamondhead can't cut that logic.",
  "Rath angry! Also, wrong.",
  "Cannonbolt rolled past the answer.",
  "Shock Rock: shockingly incorrect.",
  "Stinkfly flew away with that one.",
  "XLR8 to the next question!",
  "Alien antics aside, try again.",
  "Try switching forms—mentally.",
  "Gotta catch the right universe.",
  "Even Four Arms would facepalm.",
  "Upgrade your knowledge module.",
  "That's not canon.",
  "Wrong path in the Multiverse.",
  "Next time, Omnitrix smarter.",
  "You'll get it—hero in training!",
  "Knowledge is evolving. Keep at it!",
];

const END_ROASTS = [
  "Ouch! Even Kevin 11 scored higher!",
  "Vilgax is laughing somewhere...",
  "Time to hit the books, Ben!",
  "Your Omnitrix needs a software update!",
  "Even Upgrade couldn't fix this performance!",
];

const END_COMPLIMENTS = [
  "Hero status achieved! Ben would be proud!",
  "Alien X level intelligence detected!",
  "You're ready to save the universe!",
  "Grandpa Max approves this performance!",
  "Omnitrix Master unlocked!",
];

function useSpeech() {
  const recRef = useRef<any>(null);
  const [supported, setSupported] = useState(false);
  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR) setSupported(true);
    recRef.current = SR ? new SR() : null;
    if (recRef.current) {
      recRef.current.lang = "en-US";
      recRef.current.interimResults = false;
      recRef.current.maxAlternatives = 1;
    }
  }, []);
  const start = () => recRef.current?.start?.();
  const stop = () => recRef.current?.stop?.();
  return { start, stop, rec: recRef.current, supported };
}

function readTTS(text: string) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 1.03;
  utter.pitch = 1.0;
  utter.lang = "en-US";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

export default function Game() {
  const [level, setLevel] = useState<LevelId | null>(null);
  const [intro, setIntro] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [used, setUsed] = useState<Set<string>>(new Set());
  const [player, setPlayer] = useState<string>(sessionStorage.getItem("player") || "Player One");
  const [mutedState, setMutedState] = useState(false);
  const totalForLevel = level === 1 ? 7 : 10;
  const [showLevelTransition, setShowLevelTransition] = useState(false);
  const [pendingLevel, setPendingLevel] = useState<LevelId | null>(null);
  const [timerStarted, setTimerStarted] = useState(false);
  const { supported, start, rec } = useSpeech();

  useEffect(() => { initAudio(); }, []);

  function beginLevel(lv: LevelId) {
    setLevel(lv);
    setIntro(false);
    playBgLoop();
    loadQs(lv);
  }

  function startLevelTransition(lv: LevelId) {
    setPendingLevel(lv);
    setShowLevelTransition(true);
  }

  function completeLevelTransition() {
    if (pendingLevel) {
      setLevel(pendingLevel);
      loadQs(pendingLevel);
      setPendingLevel(null);
    }
    setShowLevelTransition(false);
  }

  async function loadQs(lv: LevelId) {
    const apiKey = sessionStorage.getItem("OPENAI_API_KEY") || undefined;
    const count = lv === 1 ? 7 : 10;
    const batch = await generateQuestions(lv, count, used, { apiKey });
    setQuestions(batch);
    setUsed(new Set([...(used || new Set<string>()), ...batch.map(q=>q.id)]));
    setQIndex(0);
    setOptionsVisible(false);
    setTimerStarted(false);
    // TTS intro then start timer
    setTimeout(() => {
      readCurrent(batch[0]);
      setTimeout(() => setTimerStarted(true), 2000); // Start timer 2s after TTS
    }, 350);
  }

  function readCurrent(q: Question) {
    const text = `${q.prompt}. Options: A: ${q.options[0]}, B: ${q.options[1]}, C: ${q.options[2]}, D: ${q.options[3]}.`;
    readTTS(text);
  }

  const current = questions[qIndex];

  function onExpire() {
    if (!current) return;
    reveal(false, current.answerIndex);
  }

  function reveal(isCorrect: boolean, answerIndex?: number) {
    if (isCorrect) {
      playWin();
      setScore((s) => s + 1);
      toast({ title: "Correct!", description: "Nicely done." });
    } else {
      playBuzzer();
      toast({ title: "Wrong!", description: ROASTS[Math.floor(Math.random()*ROASTS.length)] });
    }
    // Next question or end
    const next = qIndex + 1;
    const atEnd = next >= totalForLevel;
    if (atEnd) {
      // Level transition or final end
      if ((level ?? 1) < 3) {
        const nextLevel = ((level ?? 1) + 1) as LevelId;
        startLevelTransition(nextLevel);
      } else {
        stopBg();
        // Save leaderboard (final)
        const boardRaw = sessionStorage.getItem("leaderboard") || "[]";
        const board = JSON.parse(boardRaw) as Array<{name:string;score:number;date:string}>;
        const finalScore = score + (isCorrect ? 1 : 0);
        
        // Show end message based on score
        const maxPossible = 27; // 7 + 10 + 10
        const percentage = (finalScore / maxPossible) * 100;
        const endMessage = percentage >= 70 
          ? END_COMPLIMENTS[Math.floor(Math.random() * END_COMPLIMENTS.length)]
          : END_ROASTS[Math.floor(Math.random() * END_ROASTS.length)];
        
        toast({ 
          title: percentage >= 70 ? "Amazing!" : "Game Over!", 
          description: endMessage 
        });
        
        board.push({ name: player, score: finalScore, date: new Date().toISOString() });
        board.sort((a,b)=> b.score - a.score);
        sessionStorage.setItem("leaderboard", JSON.stringify(board.slice(0, 10)));
        playKalamClip();
        // Navigate to end screen after showing message
        setTimeout(() => {
          window.location.href = "/leaderboard";
        }, 3000);
      }
      return;
    }
    // Advance immediately on answer/timeout
    setQIndex(next);
    setOptionsVisible(false);
    setTimerStarted(false);
    setTimeout(() => {
      readCurrent(questions[next]);
      setTimeout(() => setTimerStarted(true), 2000);
    }, 500);
  }

  function selectOption(i: number) {
    if (!current) return;
    const isCorrect = i === current.answerIndex;
    reveal(isCorrect, i);
  }

  useEffect(() => {
    if (!rec) return;
    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript.trim().toLowerCase();
      if (["a","b","c","d"].includes(text)) {
        const idx = { a:0, b:1, c:2, d:3 } as any;
        selectOption(idx[text as 'a']);
      }
    };
  }, [rec, current]);

  useEffect(() => {
    document.title = "Voice of Knowledge — Game";
  }, []);

  if (intro || level === null) {
    return (
      <div className="max-w-2xl mx-auto">
        <section className="card-omni p-8 text-center">
          <h1 className="font-heading text-4xl mb-4 text-white">Ben 10 AI Quiz Challenge</h1>
          <p className="text-white/80 mb-6 text-lg">Test your knowledge with voice-enabled gameplay!</p>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="playerName" className="sr-only">Player name</label>
              <input
                id="playerName"
                className="input-contrast w-full max-w-sm mx-auto text-center"
                placeholder="Enter your hero name"
                defaultValue={player}
                onBlur={(e)=>{ setPlayer(e.target.value); sessionStorage.setItem("player", e.target.value); }}
                aria-label="Player name"
              />
            </div>
            
            <div className="flex justify-center gap-4">
              <button className="btn-neon text-lg px-6 py-3" onClick={() => beginLevel(1)}>
                Start Adventure
              </button>
              <button className="btn-neon" onClick={() => { setMutedState(!mutedState); setMuted(!mutedState); }}>
                {mutedState?"🔊":"🔇"}
              </button>
            </div>
            
            <div className="flex justify-center gap-2 mt-4">
              <button className="btn-neon text-sm" onClick={() => beginLevel(2)}>Skip to Level 2</button>
              <button className="btn-neon text-sm" onClick={() => beginLevel(3)}>Skip to Level 3</button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!current) return <div className="card-omni p-6">Loading questions…</div>;

  return (
    <>
      <div className="grid gap-6">
        <div className="card-omni p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl text-white">Level {level} • Question {qIndex+1} / {totalForLevel}</h2>
            {timerStarted && <Timer key={qIndex} seconds={20} onExpire={onExpire} onTick={(s)=>{ if (s===19) setOptionsVisible(true); }} />}
          </div>
          <p className="mt-4 text-lg text-white">{current.prompt}</p>
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            {current.options.map((opt, i) => (
              <Button key={i} className={`option-card justify-start ${optionsVisible && timerStarted?"":"pointer-events-none opacity-60"}`} variant="outline" onClick={() => selectOption(i)}>
                <span className="font-mono mr-2">{String.fromCharCode(65+i)}.</span> {opt}
              </Button>
            ))}
          </div>
          
          <div className="mt-6 flex flex-col items-center gap-4">
            <VoiceButton onVoiceStart={start} supported={supported} />
            <Button 
              onClick={()=> readTTS(`${current.prompt}. Options: ${current.options.join(', ')}`)} 
              variant="secondary"
              className="text-sm"
            >
              🔊 Repeat Question
            </Button>
          </div>
        </div>
        
        <div className="card-omni p-4 flex items-center justify-between">
          <div className="text-white">Player: <span className="font-semibold text-brand">{player}</span></div>
          <div className="text-white">Score: <span className="text-brand font-semibold">{score}</span></div>
        </div>
      </div>

      <LevelTransition 
        level={pendingLevel || 1}
        isVisible={showLevelTransition}
        onComplete={completeLevelTransition}
      />
    </>
  );
}
