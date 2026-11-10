// ============================================
//  SALA DE ESCAPE — SIMON DAS CORES
//  6 portas, cada uma com uma sequência
//  que fica mais difícil
// ============================================

const TEMPO_TOTAL = 12 * 60; // 12 minutos
const PENALIDADE = 30;
const AVISO_3MIN = 3 * 60;
const AVISO_1MIN = 60;

// -------- AS 6 PORTAS (progressão real) --------
// colors = quantas cores aparecem na tela (4 ou 6)
// length = quantos passos tem a sequência
// onMs   = tempo que a cor fica acesa (menor = mais difícil)
// offMs  = tempo entre as cores (menor = mais difícil)
const PORTAS = [
  { name: 'Aquecimento',        colors: 4, length: 3, onMs: 600, offMs: 300, emoji: '🌱' },
  { name: 'Porta Fácil',        colors: 4, length: 4, onMs: 550, offMs: 270, emoji: '🌿' },
  { name: 'Porta Média',        colors: 4, length: 5, onMs: 500, offMs: 240, emoji: '🌳' },
  { name: 'Porta Difícil',      colors: 6, length: 4, onMs: 480, offMs: 230, emoji: '🔥' },
  { name: 'Porta Muito Difícil', colors: 6, length: 5, onMs: 400, offMs: 190, emoji: '💥' },
  { name: 'Desafio Final',      colors: 6, length: 6, onMs: 340, offMs: 160, emoji: '👑' }
];

const COLOR_CLASSES = ['simon-red', 'simon-blue', 'simon-green', 'simon-yellow', 'simon-purple', 'simon-orange'];
const COLOR_FREQS  = [261.63, 329.63, 392.00, 523.25, 440.00, 587.33];

// -------- ESTADO --------
let currentPortaIndex = 0;
let timeLeft = TEMPO_TOTAL;
let timerInterval = null;
let gameActive = false;
let erros = 0;
let portasAbertas = 0;

let sequence = [];
let playerIndex = 0;
let phase = 'idle';
let colorButtons = [];

// -------- DOM --------
const startScreen      = document.getElementById('start-screen');
const gameScreen       = document.getElementById('game-screen');
const winScreen        = document.getElementById('win-screen');
const loseScreen       = document.getElementById('lose-screen');
const startBtn         = document.getElementById('start-btn');
const playAgainWin     = document.getElementById('play-again-win');
const playAgainLose    = document.getElementById('play-again-lose');
const timerEl          = document.getElementById('timer');
const timerBox         = document.getElementById('timer-box');
const doorsProgressEl  = document.getElementById('doors-progress');
const roomCounterEl    = document.getElementById('room-counter');
const escapeMain       = document.getElementById('escape-main');
const transitionModal  = document.getElementById('transition-modal');
const transitionEmoji  = document.getElementById('transition-emoji');
const transitionTitle  = document.getElementById('transition-title');
const transitionMessage = document.getElementById('transition-message');
const winTimeEl        = document.getElementById('win-time');
const winStats         = document.getElementById('win-stats');
const loseRoomEl       = document.getElementById('lose-room');
const loseStats        = document.getElementById('lose-stats');

// ============================================
//  ÁUDIO (cada cor tem sua nota)
// ============================================
let simonAudioCtx = null;

function playColorTone(colorIndex, durationSec) {
  try {
    if (!simonAudioCtx) simonAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (simonAudioCtx.state === 'suspended') simonAudioCtx.resume();
    const osc = simonAudioCtx.createOscillator();
    const gain = simonAudioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = COLOR_FREQS[colorIndex] || 440;
    const now = simonAudioCtx.currentTime;
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);
    osc.connect(gain);
    gain.connect(simonAudioCtx.destination);
    osc.start(now);
    osc.stop(now + durationSec);
  } catch (e) { /* silencioso */ }
}

// ============================================
//  INICIAR
// ============================================
function initGame() {
  currentPortaIndex = 0;
  timeLeft = TEMPO_TOTAL;
  erros = 0;
  portasAbertas = 0;
  gameActive = true;
  sequence = [];
  playerIndex = 0;
  phase = 'idle';

  startScreen.classList.add('hidden');
  winScreen.classList.add('hidden');
  loseScreen.classList.add('hidden');
  transitionModal.classList.add('hidden');
  gameScreen.classList.remove('hidden');

  timerBox.classList.remove('warning', 'danger', 'penalty');
  updateTimerDisplay();
  buildDoors();
  startTimer();
  startPorta();
}

// ============================================
//  TIMER
// ============================================
function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!gameActive) return;
    timeLeft--;
    if (timeLeft <= 10 && timeLeft > 0) playSound('tick');
    updateTimerDisplay();

    if (timeLeft <= AVISO_1MIN && timeLeft > 0) {
      timerBox.classList.add('danger');
      timerBox.classList.remove('warning');
    } else if (timeLeft <= AVISO_3MIN && timeLeft > 0) {
      timerBox.classList.add('warning');
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      gameActive = false;
      gameOver(false);
    }
  }, 1000);
}

function updateTimerDisplay() {
  const m = Math.floor(Math.max(timeLeft, 0) / 60);
  const s = Math.max(timeLeft, 0) % 60;
  timerEl.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function aplicarPenalidade() {
  timeLeft = Math.max(0, timeLeft - PENALIDADE);
  updateTimerDisplay();
  timerBox.classList.add('penalty');
  setTimeout(() => timerBox.classList.remove('penalty'), 800);
}

// ============================================
//  PORTAS DE PROGRESSO
// ============================================
function buildDoors() {
  doorsProgressEl.innerHTML = '';
  PORTAS.forEach((_, i) => {
    const door = document.createElement('div');
    door.classList.add('door');
    door.textContent = '🚪';
    if (i === 0) door.classList.add('current');
    doorsProgressEl.appendChild(door);
  });
  const tesouro = document.createElement('div');
  tesouro.classList.add('door', 'treasure');
  tesouro.textContent = '🏆';
  tesouro.style.opacity = '0.4';
  doorsProgressEl.appendChild(tesouro);
}

function updateDoors() {
  const doors = doorsProgressEl.querySelectorAll('.door');
  doors.forEach((door, i) => {
    if (door.classList.contains('treasure')) return;
    door.classList.remove('current', 'opened');
    if (i < currentPortaIndex) {
      door.classList.add('opened');
      door.textContent = '✅';
    } else if (i === currentPortaIndex) {
      door.classList.add('current');
      door.textContent = '🚪';
    }
  });
  if (currentPortaIndex >= PORTAS.length) {
    const tesouro = doorsProgressEl.querySelector('.door.treasure');
    if (tesouro) {
      tesouro.style.opacity = '1';
      tesouro.style.animation = 'doorGlow 1s infinite';
    }
  }
}

// ============================================
//  INICIAR PORTA
// ============================================
function startPorta() {
  if (currentPortaIndex >= PORTAS.length) {
    gameOver(true);
    return;
  }
  roomCounterEl.textContent = `Porta ${currentPortaIndex + 1} de ${PORTAS.length}`;
  updateDoors();
  renderPorta();
}

function renderPorta() {
  const porta = PORTAS[currentPortaIndex];

  escapeMain.innerHTML = '';
  const card = document.createElement('div');
  card.classList.add('room-card');

  card.innerHTML = `
    <div class="room-header">
      <div class="room-emoji">${porta.emoji}</div>
      <div class="room-title-group">
        <h2>Porta ${currentPortaIndex + 1} — ${porta.name}</h2>
        <p>${porta.colors} cores · ${porta.length} passos</p>
      </div>
    </div>
    <div class="simon-wrapper">
      <div class="simon-status watch" id="simon-status">Preparem-se...</div>
      <div class="simon-grid ${porta.colors === 4 ? 'grid-4' : 'grid-6'}" id="simon-grid"></div>
      <div class="feedback" id="feedback"></div>
    </div>
  `;
  escapeMain.appendChild(card);

  const grid = document.getElementById('simon-grid');
  colorButtons = [];

  for (let i = 0; i < porta.colors; i++) {
    const btn = document.createElement('button');
    btn.className = `simon-btn ${COLOR_CLASSES[i]}`;
    btn.dataset.index = i;
    btn.disabled = true;
    btn.addEventListener('click', () => handleColorClick(i));
    grid.appendChild(btn);
    colorButtons.push(btn);
  }

  setTimeout(() => {
    if (gameActive) startSequence();
  }, 1200);
}

// ============================================
//  SEQUÊNCIA
// ============================================
function startSequence() {
  const porta = PORTAS[currentPortaIndex];
  sequence = [];
  for (let i = 0; i < porta.length; i++) {
    sequence.push(Math.floor(Math.random() * porta.colors));
  }
  playerIndex = 0;
  playSequence();
}

async function playSequence() {
  const porta = PORTAS[currentPortaIndex];
  phase = 'watch';
  disableGrid(true);
  setStatus(`👀 Observem... (${sequence.length} passos)`, 'watch');

  await sleep(700);

  for (let i = 0; i < sequence.length; i++) {
    const idx = sequence[i];
    flashButton(idx, porta.onMs);
    playColorTone(idx, porta.onMs / 1000);
    await sleep(porta.onMs + porta.offMs);
  }

  await sleep(400);
  phase = 'repeat';
  disableGrid(false);
  setStatus('👆 Agora repitam!', 'repeat');
}

// ============================================
//  CLIQUE DO JOGADOR
// ============================================
function handleColorClick(idx) {
  if (phase !== 'repeat' || !gameActive) return;

  flashButton(idx, 250);
  playColorTone(idx, 0.25);

  if (idx === sequence[playerIndex]) {
    playerIndex++;

    if (playerIndex >= sequence.length) {
      phase = 'success';
      disableGrid(true);
      setStatus('🎉 Acertaram! Abrindo a porta...', 'success');
      playSound('correct');
      launchConfetti({ count: 80, duration: 1500 });
      setTimeout(() => openDoor(), 1800);
    }
  } else {
    phase = 'error';
    disableGrid(true);
    colorButtons[idx].classList.add('wrong');
    setStatus('❌ Erraram! Observem de novo...', 'error');
    playSound('wrong');
    aplicarPenalidade();
    erros++;

    setTimeout(() => {
      colorButtons[idx].classList.remove('wrong');
      playerIndex = 0;
      setTimeout(() => playSequence(), 600);
    }, 1800);
  }
}

// ============================================
//  UI HELPERS
// ============================================
function setStatus(text, type) {
  const el = document.getElementById('simon-status');
  if (!el) return;
  el.textContent = text;
  el.className = `simon-status ${type || ''}`;
}

function disableGrid(disable) {
  colorButtons.forEach(b => b.disabled = disable);
}

function flashButton(idx, durationMs) {
  const btn = colorButtons[idx];
  if (!btn) return;
  btn.classList.add('active');
  setTimeout(() => btn.classList.remove('active'), durationMs);
}

// ============================================
//  ABRIR PORTA
// ============================================
function openDoor() {
  portasAbertas++;
  showTransition();
}

function showTransition() {
  gameActive = false;

  transitionEmoji.textContent = '🚪';
  transitionTitle.textContent = `Porta ${currentPortaIndex + 1} aberta!`;
  transitionMessage.textContent = 'Preparando a próxima...';
  transitionModal.classList.remove('hidden');

  setTimeout(() => {
    transitionEmoji.textContent = '✨';
    transitionTitle.textContent = 'Muito bem!';
    const next = PORTAS[currentPortaIndex + 1];
    transitionMessage.textContent = next
      ? `Próxima: ${next.emoji} ${next.name}`
      : '🏆 O tesouro está logo ali!';
    playSound('move');
  }, 1000);

  setTimeout(() => {
    transitionModal.classList.add('hidden');
    currentPortaIndex++;
    gameActive = true;
    if (currentPortaIndex >= PORTAS.length) {
      gameOver(true);
    } else {
      startPorta();
    }
  }, 2400);
}

// ============================================
//  FIM DE JOGO
// ============================================
function gameOver(escapou) {
  gameActive = false;
  clearInterval(timerInterval);
  gameScreen.classList.add('hidden');

  if (escapou) {
    const tempoUsado = TEMPO_TOTAL - timeLeft;
    const min = Math.floor(tempoUsado / 60);
    const seg = tempoUsado % 60;
    winTimeEl.textContent = `⏱️ Vocês escaparam em ${min}m ${String(seg).padStart(2, '0')}s!`;
    winStats.innerHTML = `
      <div class="stat-item"><strong>${portasAbertas}</strong>Portas abertas</div>
      <div class="stat-item"><strong>${erros}</strong>Erros</div>
      <div class="stat-item"><strong>${Math.max(0, timeLeft)}s</strong>Tempo restante</div>
    `;
    winScreen.classList.remove('hidden');
    playSound('win');
    launchConfetti({ count: 350, duration: 6000 });
  } else {
    loseRoomEl.textContent = `Porta ${Math.min(currentPortaIndex + 1, PORTAS.length)}`;
    loseStats.innerHTML = `
      <div class="stat-item"><strong>${portasAbertas}</strong>Portas abertas</div>
      <div class="stat-item"><strong>${erros}</strong>Erros</div>
    `;
    loseScreen.classList.remove('hidden');
    playSound('buzz');
  }
}

// ============================================
//  UTILITÁRIOS
// ============================================
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ============================================
//  EVENTOS
// ============================================
startBtn.addEventListener('click', initGame);
playAgainWin.addEventListener('click', initGame);
playAgainLose.addEventListener('click', initGame);