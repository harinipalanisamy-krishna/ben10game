import { LevelId } from "@/types/quiz";

export interface GenOptions {
  apiKey?: string;
}

export async function generateQuestions(level: LevelId, count: number, usedIds: Set<string>, opts: GenOptions = {}) {
  const fallback = fallbackQuestions(level, count, usedIds);
  if (!opts.apiKey) return fallback;

  try {
    const sys = levelSystemPrompt(level);
    const user = `Generate ${count} multiple-choice questions in JSON with fields: id, prompt, options (array of 4), answerIndex (0-3). Ensure unique ids and no repeats from: ${[...usedIds].join(',') || 'none'}.`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${opts.apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini-2025-04-14",
        messages: [
          { role: "system", content: sys },
          { role: "user", content: user },
        ],
        temperature: 0.7,
      }),
    });
    const data = await res.json();
    const text: string = data.choices?.[0]?.message?.content || "";
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);
    const arr = Array.isArray(parsed) ? parsed : parsed.questions;
    if (Array.isArray(arr) && arr.length) return arr;
    return fallback;
  } catch {
    return fallback;
  }
}

function levelSystemPrompt(level: LevelId) {
  if (level === 1) return "You create inspiring, factual questions about Dr. A.P.J. Abdul Kalam. Keep them crisp for quiz show.";
  if (level === 2) return "You create general science and fun knowledge questions suitable for a fast quiz show.";
  return "You create Tamil/History focused questions (concise) for a quiz show in English prompts.";
}

function fallbackQuestions(level: LevelId, count: number, used: Set<string>) {
  const bank: Record<LevelId, Array<{p: string; o: string[]; a: number}>> = {
    1: [
      { p: "Kalam is popularly known as?", o: ["Missile Man of India","Rocket Man","Nuclear Man","Science Star"], a: 0 },
      { p: "Kalam served as India’s President in?", o: ["1999-2004","2002-2007","2004-2009","2007-2012"], a: 1 },
      { p: "Kalam’s autobiography is?", o: ["Ignited Minds","Wings of Fire","My Experiments","Turning Points"], a: 1 },
      { p: "Kalam was born in which state?", o: ["Kerala","Karnataka","Tamil Nadu","Andhra Pradesh"], a: 2 },
      { p: "Main field of Kalam?", o: ["Biology","Aerospace","Chemistry","Mathematics"], a: 1 },
      { p: "Kalam contributed to which missile?", o: ["Agni","BrahMos","Prithvi","Astra"], a: 0 },
      { p: "Kalam’s famous dream for India year?", o: ["2020","2010","2030","2040"], a: 0 },
    ],
    2: [
      { p: "What planet is known as the Red Planet?", o: ["Mars","Jupiter","Venus","Mercury"], a: 0 },
      { p: "H2O is the chemical formula for?", o: ["Oxygen","Hydrogen","Water","Salt"], a: 2 },
      { p: "Fastest land animal?", o: ["Cheetah","Lion","Horse","Tiger"], a: 0 },
      { p: "Largest mammal?", o: ["Elephant","Blue Whale","Giraffe","Hippo"], a: 1 },
      { p: "What gas do plants absorb?", o: ["Oxygen","Nitrogen","CO2","Helium"], a: 2 },
      { p: "Primary source of Earth’s energy?", o: ["Moon","Sun","Volcanoes","Wind"], a: 1 },
      { p: "Human DNA shaped as?", o: ["Double helix","Circle","Triangle","Square"], a: 0 },
      { p: "Which organ pumps blood?", o: ["Lungs","Brain","Heart","Liver"], a: 2 },
      { p: "Which metal is liquid at room temp?", o: ["Iron","Mercury","Aluminium","Gold"], a: 1 },
      { p: "Earth revolves around?", o: ["Moon","Sun","Mars","Venus"], a: 1 },
    ],
    3: [
      { p: "Tamil language is part of which family?", o: ["Indo-Aryan","Dravidian","Sino-Tibetan","Semitic"], a: 1 },
      { p: "Chola capital at its peak?", o: ["Madurai","Thanjavur","Kanchipuram","Uraiyur"], a: 1 },
      { p: "Who built Brihadeeswara Temple?", o: ["Rajaraja Chola I","Ashoka","Krishnadevaraya","Akbar"], a: 0 },
      { p: "Sangam literature relates to?", o: ["Ancient Tamil","Vedic","Persian","Greek"], a: 0 },
      { p: "Pallava famous site?", o: ["Hampi","Mahabalipuram","Ajanta","Ellora"], a: 1 },
      { p: "Who led the Salt Satyagraha?", o: ["B.R. Ambedkar","Mahatma Gandhi","Subhas Bose","Tilak"], a: 1 },
      { p: "Tamil month after Chithirai?", o: ["Vaikasi","Aadi","Maasi","Thai"], a: 0 },
      { p: "The Cheras ruled present?", o: ["Kerala","Karnataka","Odisha","Bihar"], a: 0 },
      { p: "Capital of Pandya dynasty?", o: ["Madurai","Chennai","Coimbatore","Trichy"], a: 0 },
      { p: "Silappatikaram is an epic of?", o: ["Kannada","Tamil","Telugu","Malayalam"], a: 1 },
    ],
  };
  const out: any[] = [];
  const pool = bank[level];
  const idxs = Array.from({ length: pool.length }, (_, i) => i).filter(i => !used.has(`L${level}-${i}`));
  shuffle(idxs);
  for (let i = 0; i < Math.min(count, idxs.length); i++) {
    const ii = idxs[i];
    const it = pool[ii];
    out.push({ id: `L${level}-${ii}`, level, prompt: it.p, options: it.o, answerIndex: it.a });
  }
  return out;
}

function shuffle<T>(a: T[]) {
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
}
