import { useEffect, useMemo, useRef, useState } from "react";
import { Question, LevelId } from "@/types/quiz";
import { generateQuestions } from "@/utils/ai";
import { initAudio, playBgLoop, playBuzzer, playKalamClip, playWin, setMuted, stopBg } from "@/utils/sound";
import { Timer } from "@/components/Timer";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const ROASTS = [
  "Even the Omnitrix couldn’t find that answer!",
  "Close one! Next time, hero mode.",
  "You just unlocked… the wrong dimension.",
  "Kazam! That’s a miss. Try again.",
  "Ben would’ve transformed faster than that!",
  "Alien X is facepalming.",
  "Upgrade your brain firmware soon!",
  "Roasted, but with love.",
  "That buzzer was louder than the truth.",
  "Oops! Plot twist: it wasn’t that.",
  "Max Tennyson says: focus, champ!",
  "Almost! Dial the Omnitrix again.",
  "The Multiverse rejects that option.",
  "Hint: reading helps. Sometimes.",
  "The kryptonite of your brain today.",
  "You’re on the wrong timeline.",
  "Try again before Vilgax sees this.",
  "Spotted: a learning moment.",
  "That’s a no from the Null Void.",
  "Brain buffer overflow. Reboot!",
  "We all start somewhere. Keep going!",
  "Missed by a light-year.",
  "Plot armor can’t save that choice.",
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
  "Diamondhead can’t cut that logic.",
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
  "That’s not canon.",
  "Wrong path in the Multiverse.",
  "Next time, Omnitrix smarter.",
  "You’ll get it—hero in training!",
  "Knowledge is evolving. Keep at it!",
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
  const { supported, start, rec } = useSpeech();

  useEffect(() => { initAudio(); }, []);

  function beginLevel(lv: LevelId) {
    setLevel(lv);
    setIntro(false);
    playBgLoop();
    loadQs(lv);
  }

  async function loadQs(lv: LevelId) {
    const apiKey = sessionStorage.getItem("OPENAI_API_KEY") || undefined;
    const batch = await generateQuestions(lv, totalForLevel, used, { apiKey });
    setQuestions(batch);
    setUsed(new Set([...(used || new Set<string>()), ...batch.map(q=>q.id)]));
    setQIndex(0);
    setOptionsVisible(false);
    // TTS intro
    setTimeout(() => readCurrent(batch[0]), 350);
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
      stopBg();
      // Save leaderboard
      const boardRaw = sessionStorage.getItem("leaderboard") || "[]";
      const board = JSON.parse(boardRaw) as Array<{name:string;score:number;date:string}>;
      const newScore = score + (isCorrect ? 1 : 0);
      board.push({ name: player, score: newScore, date: new Date().toISOString() });
      board.sort((a,b)=> b.score - a.score);
      sessionStorage.setItem("leaderboard", JSON.stringify(board.slice(0, 10)));
      playKalamClip();
    }
    setTimeout(() => {
      if (atEnd) {
        window.location.href = "/leaderboard";
      } else {
        setQIndex(next);
        setOptionsVisible(false);
        readCurrent(questions[next]);
      }
    }, 700);
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
      <div className="grid md:grid-cols-2 gap-6">
        <section className="card-omni p-6">
          <h2 className="font-heading text-2xl mb-2">AI Mastermind Challenge</h2>
          <p className="text-muted-foreground mb-4">Ben 10–style voice-enabled quiz. Enter your name and start Level 1.</p>
          <div className="flex flex-col sm:flex-row gap-3 items-start">
            <label htmlFor="playerName" className="sr-only">Player name</label>
            <input
              id="playerName"
              className="input-contrast w-full sm:w-64"
              placeholder="Enter your name"
              defaultValue={player}
              onBlur={(e)=>{ setPlayer(e.target.value); sessionStorage.setItem("player", e.target.value); }}
              aria-label="Player name"
            />
            <button className="btn-neon" onClick={() => beginLevel(1)}>Start Level 1 — Kalam Round</button>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="btn-neon" onClick={() => beginLevel(2)}>Level 2</button>
            <button className="btn-neon" onClick={() => beginLevel(3)}>Level 3</button>
            <button className="btn-neon" onClick={() => { setMutedState(!mutedState); setMuted(!mutedState); }}>{mutedState?"Unmute":"Mute"}</button>
          </div>
          <p className="text-xs text-muted-foreground mt-3">Tip: In Settings, paste your OpenAI API key to enable live AI questions. Otherwise, high-quality fallback is used.</p>
        </section>
        <section className="card-omni p-6">
          <h3 className="font-heading mb-3">Laptop Dashboard</h3>
          <ul className="space-y-2 text-sm">
            <li>Sidebar: navigate to Projects, Tasks, Calendar, Messages, Settings, Leaderboard</li>
            <li>Voice Input: say A, B, C or D</li>
            <li>TTS: questions read out automatically</li>
            <li>Timer: last 5s tick and glow</li>
          </ul>
        </section>
      </div>
    );
  }

  if (!current) return <div className="card-omni p-6">Loading questions…</div>;

  return (
    <div className="grid gap-6">
      <div className="card-omni p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl">Level {level} • Question {qIndex+1} / {totalForLevel}</h2>
          <Timer seconds={20} onExpire={onExpire} onTick={(s)=>{ if (s===19) setOptionsVisible(true); }} />
        </div>
        <p className="mt-4 text-lg">{current.prompt}</p>
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          {current.options.map((opt, i) => (
            <Button key={i} className={`option-card justify-start ${optionsVisible?"":"pointer-events-none opacity-60"}`} variant="outline" onClick={() => selectOption(i)}>
              <span className="font-mono mr-2">{String.fromCharCode(65+i)}.</span> {opt}
            </Button>
          ))}
        </div>
        <div className="mt-4 flex gap-3">
          {supported && <Button onClick={()=> start()} variant="default">Answer by Voice</Button>}
          <Button onClick={()=> readTTS(`${current.prompt}. Options: ${current.options.join(', ')}`)} variant="secondary">Repeat Question</Button>
        </div>
      </div>
      <div className="card-omni p-4 flex items-center justify-between">
        <div>Player: <span className="font-semibold">{player}</span></div>
        <div>Score: <span className="text-primary font-semibold">{score}</span></div>
      </div>
    </div>
  );
}
