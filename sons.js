// ============================================
//  SONS — compartilhado (Web Audio API)
//  Uso: playSound('dice' | 'move' | 'correct' | 'wrong' | 'win' | 'tick' | 'buzz')
// ============================================
let audioCtx = null;

function ensureAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playSound(type) {
  try {
    ensureAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = audioCtx.currentTime;

    function tone(freq, start, duration, wave = 'sine', vol = 0.15) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = wave;
      osc.frequency.setValueAtTime(freq, now + start);
      gain.gain.setValueAtTime(vol, now + start);
      gain.gain.exponentialRampToValueAtTime(0.001, now + start + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + start);
      osc.stop(now + start + duration);
    }

    if (type === 'dice') {
      tone(400, 0, 0.08, 'square');
      tone(600, 0.08, 0.08, 'square');
      tone(800, 0.16, 0.1, 'square');
    } else if (type === 'move') {
      tone(500, 0, 0.1, 'triangle');
      tone(700, 0.1, 0.1, 'triangle');
    } else if (type === 'correct') {
      tone(523, 0, 0.15);
      tone(659, 0.12, 0.15);
      tone(784, 0.24, 0.25);
    } else if (type === 'wrong') {
      tone(400, 0, 0.2, 'sawtooth');
      tone(300, 0.15, 0.3, 'sawtooth');
    } else if (type === 'win') {
      tone(523, 0, 0.15);
      tone(659, 0.15, 0.15);
      tone(784, 0.30, 0.15);
      tone(1047, 0.45, 0.4);
      tone(784, 0.65, 0.2);
      tone(1047, 0.85, 0.5);
    } else if (type === 'tick') {
      tone(1200, 0, 0.05, 'square', 0.08);
    } else if (type === 'buzz') {
      tone(200, 0, 0.3, 'sawtooth', 0.12);
    }
  } catch (e) { /* silencioso */ }
}