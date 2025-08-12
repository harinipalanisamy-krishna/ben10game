import confetti from "canvas-confetti";

let ctx: AudioContext | null = null;
let bgNode: AudioNode | null = null;
let masterGain: GainNode | null = null;
let muted = false;

export function initAudio() {
  if (!ctx) {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    ctx = new AudioCtx();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.8;
    masterGain.connect(ctx.destination);
  }
}

export function setMuted(v: boolean) {
  muted = v;
  if (masterGain) masterGain.gain.value = v ? 0 : 0.8;
}

function playTone(freq: number, duration = 0.15, type: OscillatorType = "sine") {
  if (!ctx || muted) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = 0.0001;
  osc.connect(gain);
  gain.connect(masterGain!);
  const now = ctx.currentTime;
  gain.gain.exponentialRampToValueAtTime(0.4, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.start();
  osc.stop(now + duration + 0.01);
}

export function playTick() {
  playTone(1200, 0.06, "square");
}

export function playWin() {
  for (let i = 0; i < 6; i++) setTimeout(() => playTone(600 + i * 120, 0.1, "sawtooth"), i * 60);
  confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
}

export function playBuzzer() {
  playTone(120, 0.5, "sawtooth");
  playTone(90, 0.5, "square");
}

export function playBgLoop() {
  if (!ctx || muted) return;
  stopBg();
  const o1 = ctx.createOscillator();
  const o2 = ctx.createOscillator();
  const g = ctx.createGain();
  g.gain.value = 0.05;
  o1.type = "sawtooth"; o2.type = "sine";
  o1.frequency.value = 220; o2.frequency.value = 440;
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.2; lfoGain.gain.value = 40;
  lfo.connect(lfoGain); lfoGain.connect(o2.frequency as any);
  o1.connect(g); o2.connect(g); g.connect(masterGain!);
  o1.start(); o2.start(); lfo.start();
  bgNode = g;
}

export function stopBg() {
  if (!ctx || !bgNode) return;
  try { (bgNode as any).disconnect(); } catch {}
  bgNode = null;
}

export function playKalamClip() {
  // Simple chime placeholder
  for (let i = 0; i < 4; i++) setTimeout(() => playTone(500 + i * 150, 0.2, "triangle"), i * 220);
}
