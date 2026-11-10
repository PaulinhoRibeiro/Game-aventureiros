// ============================================
//  TRINCA AVENTUREIRA — Match 3
// ============================================

const SIZE = 8;
const NUM_SYMBOLS = 6;
const TURN_TIME = 60;
const MAX_CASCADE = 5;

const SYMBOLS = [
  { emoji: '🐝', color: '#FFD700', bg: 'linear-gradient(135deg, #FFD700, #FFA000)' },
  { emoji: '📖', color: '#8B4513', bg: 'linear-gradient(135deg, #D2691E, #8B4513)' },
  { emoji: '⛺', color: '#4CAF50', bg: 'linear-gradient(135deg, #66BB6A, #2E7D32)' },
  { emoji: '⭐', color: '#FFC107', bg: 'linear-gradient(135deg, #FFC107, #FF6F00)' },
  { emoji: '🚩', color: '#E91E63', bg: 'linear-gradient(135deg, #F06292, #C2185B)' },
  { emoji: '💎', color: '#00BCD4', bg: 'linear-gradient(135deg, #4DD0E1, #00838F)' }
];

// -------- ESTADO --------
let grid = [];
let selected = null;
let teams = [];
let currentTeamIndex = 0;
let currentScore = 0;
let timeLeft = 0;
let timerInterval = null;
let busy = false;
let gameActive = false;
let timerPaused = false;

// -------- DOM --------
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const winScreen = document.getElementById('win-screen');
const startBtn = document.getElementById('start-btn');
const playAgainBtn = document.getElementById('play-again-btn');

const readyModal = document.getElementById('ready-modal');
const readyEmoji = document.getElementById('ready-emoji');
const readyTitle = document.getElementById('ready-title');
const readyStartBtn = document.getElementById('ready-start-btn');

const teamEmojiEl = document.getElementById('team-emoji');
const teamNameEl = document.getElementById('team-name');
const timerBox = document.getElementById('timer-box');
const timerFill = document.getElementById('timer-fill');
const timerText = document.getElementById('timer-text');
const scoreValueEl = document.getElementById('score-value');
const gridEl = document.getElementById('grid');

const turnEndModal = document.getElementById('turn-end-modal');
const turnEndEmoji = document.getElementById('turn-end-emoji');
const turnEndScore = document.getElementById('turn-end-score');
const turnEndNext = document.getElementById('turn-end-next');
const nextTeamBtn = document.getElementById('next-team-btn');

const winEmoji = document.getElementById('win-emoji');
const winTitle = document.getElementById('win-title');
const winMessage = document.getElementById('win-message');
const winStats = document.getElementById('win-stats');

// ============================================
//  INICIAR JOGO
// ============================================
function initGame() {
  teams = EQUIPES_AVENTUREIROS.map(e => ({ ...e, score: 0 }));
  currentTeamIndex = 0;
  gameActive = true;

  startScreen.classList.add('hidden');
  winScreen.classList.add('hidden');
  gameScreen.classList.add('hidden');
  turnEndModal.classList.add('hidden');
  readyModal.classList.add('hidden');

  showReadyModal();
}

function showReadyModal() {
  const team = teams[currentTeamIndex];
  readyEmoji.textContent = team.emoji;
  readyTitle.textContent = `Vez da ${team.name}!`;

  if (currentTeamIndex === 0) {
    readyStartBtn.textContent = '▶ Começar Turno';
  } else {
    readyStartBtn.textContent = '▶ Começar Turno';
  }

  readyModal.classList.remove('hidden');

  readyStartBtn.onclick = () => {
    readyModal.classList.add('hidden');
    startTurn();
  };
}

// ============================================
//  INICIAR TURNO
// ============================================
function startTurn() {
  currentScore = 0;
  selected = null;
  busy = false;
  timerPaused = false;

  const team = teams[currentTeamIndex];
  teamEmojiEl.textContent = team.emoji;
  teamNameEl.textContent = team.name;
  scoreValueEl.textContent = '0';

  gameScreen.classList.remove('hidden');

  initGrid();
  renderGrid();
  startTimer();
}

// ============================================
//  GRADE
// ============================================
function initGrid() {
  let attempts = 0;
  do {
    attempts++;
    grid = [];
    for (let r = 0; r < SIZE; r++) {
      grid[r] = [];
      for (let c = 0; c < SIZE; c++) {
        grid[r][c] = Math.floor(Math.random() * NUM_SYMBOLS);
      }
    }
    eliminateInitialMatches();
  } while ((findAllMatches().length > 0 || !hasPossibleMove()) && attempts < 50);
}

function eliminateInitialMatches() {
  let iterations = 0;
  while (findAllMatches().length > 0 && iterations < 100) {
    iterations++;
    const matches = findAllMatches();
    matches.forEach(([r, c]) => {
      grid[r][c] = Math.floor(Math.random() * NUM_SYMBOLS);
    });
  }
}

// ============================================
//  DETECÇÃO DE MATCHES
// ============================================
function findAllMatches() {
  const matched = new Set();

  // Horizontal
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE - 2; c++) {
      const s = grid[r][c];
      if (s === null) continue;
      if (grid[r][c + 1] === s && grid[r][c + 2] === s) {
        let k = c;
        while (k < SIZE && grid[r][k] === s) {
          matched.add(`${r},${k}`);
          k++;
        }
      }
    }
  }

  // Vertical
  for (let c = 0; c < SIZE; c++) {
    for (let r = 0; r < SIZE - 2; r++) {
      const s = grid[r][c];
      if (s === null) continue;
      if (grid[r + 1][c] === s && grid[r + 2][c] === s) {
        let k = r;
        while (k < SIZE && grid[k][c] === s) {
          matched.add(`${k},${c}`);
          k++;
        }
      }
    }
  }

  return Array.from(matched).map(k => k.split(',').map(Number));
}

function hasPossibleMove() {
  // Tenta todos os swaps possíveis
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      // Direita
      if (c < SIZE - 1) {
        [grid[r][c], grid[r][c + 1]] = [grid[r][c + 1], grid[r][c]];
        const hasMatch = findAllMatches().length > 0;
        [grid[r][c], grid[r][c + 1]] = [grid[r][c + 1], grid[r][c]];
        if (hasMatch) return true;
      }
      // Baixo
      if (r < SIZE - 1) {
        [grid[r][c], grid[r + 1][c]] = [grid[r + 1][c], grid[r][c]];
        const hasMatch = findAllMatches().length > 0;
        [grid[r][c], grid[r + 1][c]] = [grid[r + 1][c], grid[r][c]];
        if (hasMatch) return true;
      }
    }
  }
  return false;
}

// ============================================
//  RENDERIZAR GRADE
// ============================================
function renderGrid(animateFall = false) {
  gridEl.innerHTML = '';
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const symbolIdx = grid[r][c];
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.r = r;
      cell.dataset.c = c;
      cell.textContent = SYMBOLS[symbolIdx].emoji;
      cell.style.background = SYMBOLS[symbolIdx].bg;
      cell.addEventListener('click', () => handleCellClick(r, c));
      if (animateFall) cell.classList.add('falling');
      gridEl.appendChild(cell);
    }
  }
}

function getCellEl(r, c) {
  return gridEl.querySelector(`[data-r="${r}"][data-c="${c}"]`);
}

// ============================================
//  CLIQUE EM CÉLULA
// ============================================
function handleCellClick(r, c) {
  if (busy || !gameActive || timerPaused) return;

  const cell = getCellEl(r, c);

  // Primeira seleção
  if (!selected) {
    selected = { r, c };
    cell.classList.add('selected');
    playSound('tick');
    return;
  }

  // Clicou na mesma célula → desmarca
  if (selected.r === r && selected.c === c) {
    cell.classList.remove('selected');
    selected = null;
    return;
  }

  // Clicou em célula não adjacente → nova seleção
  if (!isAdjacent(selected.r, selected.c, r, c)) {
    const prev = getCellEl(selected.r, selected.c);
    if (prev) prev.classList.remove('selected');
    selected = { r, c };
    cell.classList.add('selected');
    playSound('tick');
    return;
  }

  // Célula adjacente → tenta swap
  const a = selected;
  const b = { r, c };
  getCellEl(a.r, a.c)?.classList.remove('selected');
  selected = null;

  trySwap(a, b);
}

function isAdjacent(r1, c1, r2, c2) {
  return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
}

// ============================================
//  TROCA
// ============================================
async function trySwap(a, b) {
  busy = true;
  timerPaused = true;

  // Swap em memória
  [grid[a.r][a.c], grid[b.r][b.c]] = [grid[b.r][b.c], grid[a.r][a.c]];

  renderGrid();
  getCellEl(a.r, a.c)?.classList.add('swap-flash');
  getCellEl(b.r, b.c)?.classList.add('swap-flash');
  playSound('move');

  await sleep(250);

  if (findAllMatches().length > 0) {
    // Swap válido → processa
    await processMatches();
    busy = false;
    timerPaused = false;
  } else {
    // Swap inválido → desfaz
    [grid[a.r][a.c], grid[b.r][b.c]] = [grid[b.r][b.c], grid[a.r][a.c]];
    renderGrid();
    getCellEl(a.r, a.c)?.classList.add('invalid-shake');
    getCellEl(b.r, b.c)?.classList.add('invalid-shake');
    playSound('wrong');
    await sleep(350);
    busy = false;
    timerPaused = false;
  }
}

// ============================================
//  PROCESSAR MATCHES (com cascata)
// ============================================
async function processMatches(cascadeLevel = 1) {
  const matches = findAllMatches();
  if (matches.length === 0) return;

  const cappedLevel = Math.min(cascadeLevel, MAX_CASCADE);
  const points = matches.length * 5 * cappedLevel;

  // Efeitos visuais
  if (cascadeLevel >= 2) {
    showCombo(cappedLevel);
  }

  // Spawn partículas e floats
  matches.forEach(([r, c]) => {
    const cell = getCellEl(r, c);
    if (cell) {
      cell.classList.add('popping');
      const symbolIdx = grid[r][c];
      spawnParticles(r, c, SYMBOLS[symbolIdx]?.emoji || '✨');
    }
  });

  // Float de pontos no primeiro match
  if (matches.length > 0) {
    const [fr, fc] = matches[Math.floor(matches.length / 2)];
    showScoreFloat(fr, fc, points);
  }

  playSound('correct');
  await sleep(300);

  // Remove matched
  matches.forEach(([r, c]) => {
    grid[r][c] = null;
  });

  // Aplica gravidade
  for (let c = 0; c < SIZE; c++) {
    let writeRow = SIZE - 1;
    for (let r = SIZE - 1; r >= 0; r--) {
      if (grid[r][c] !== null) {
        if (r !== writeRow) {
          grid[writeRow][c] = grid[r][c];
          grid[r][c] = null;
        }
        writeRow--;
      }
    }
    // Preenche topo
    for (let r = writeRow; r >= 0; r--) {
      grid[r][c] = Math.floor(Math.random() * NUM_SYMBOLS);
    }
  }

  // Adiciona pontos
  currentScore += points;
  scoreValueEl.textContent = currentScore;

  renderGrid(true);
  await sleep(350);

  // Cascata
  await processMatches(cascadeLevel + 1);
}

// ============================================
//  EFEITOS VISUAIS
// ============================================
function spawnParticles(r, c, emoji) {
  const cell = getCellEl(r, c);
  if (!cell) return;
  const rect = cell.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  for (let i = 0; i < 5; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.textContent = emoji;
    p.style.left = cx + 'px';
    p.style.top = cy + 'px';
    p.style.setProperty('--dx', (Math.random() - 0.5) * 150 + 'px');
    p.style.setProperty('--dy', (Math.random() - 0.5) * 150 - 30 + 'px');
    p.style.animationDelay = (Math.random() * 0.1) + 's';
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 900);
  }
}

function showScoreFloat(r, c, points) {
  const cell = getCellEl(r, c);
  if (!cell) return;
  const rect = cell.getBoundingClientRect();
  const el = document.createElement('div');
  el.className = 'score-float';
  el.textContent = `+${points}`;
  el.style.left = (rect.left + rect.width / 2) + 'px';
  el.style.top = (rect.top + rect.height / 2) + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1100);
}

function showCombo(level) {
  const el = document.createElement('div');
  el.className = 'combo-display';
  el.textContent = `COMBO ×${level}!`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1300);
}

// ============================================
//  TIMER
// ============================================
function startTimer() {
  clearInterval(timerInterval);
  timeLeft = TURN_TIME;
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    if (!gameActive) return;
    if (timerPaused) return;

    timeLeft -= 0.1;

    if (timeLeft <= 5 && timeLeft > 0) {
      if (Math.abs(timeLeft - Math.round(timeLeft)) < 0.05) {
        playSound('tick');
      }
    }

    updateTimerDisplay();

    if (timeLeft <= 0) {
      timeLeft = 0;
      updateTimerDisplay();
      clearInterval(timerInterval);
      endTurn();
    }
  }, 100);
}

function updateTimerDisplay() {
  const pct = Math.max(0, (timeLeft / TURN_TIME) * 100);
  timerFill.style.width = `${pct}%`;
  timerText.textContent = Math.ceil(Math.max(0, timeLeft));

  timerFill.classList.remove('warning', 'danger');
  if (timeLeft <= 5) timerFill.classList.add('danger');
  else if (timeLeft <= 15) timerFill.classList.add('warning');
}

// ============================================
//  FIM DE TURNO
// ============================================
function endTurn() {
  clearInterval(timerInterval);
  timerPaused = true;
  busy = true;

  const team = teams[currentTeamIndex];
  team.score = currentScore;

  gameScreen.classList.add('hidden');

  turnEndEmoji.textContent = team.emoji;
  turnEndScore.innerHTML = `${team.name} fez<br><strong>${currentScore} pontos</strong>`;

  const isLast = currentTeamIndex >= teams.length - 1;
  if (isLast) {
    turnEndNext.textContent = '🏆 Ver resultado final...';
    nextTeamBtn.textContent = '🏆 Ver Resultado';
  } else {
    const next = teams[currentTeamIndex + 1];
    turnEndNext.textContent = `Próxima: ${next.emoji} ${next.name}`;
    nextTeamBtn.textContent = '▶ Próxima Equipe';
  }

  turnEndModal.classList.remove('hidden');

  playSound('win');

  nextTeamBtn.onclick = () => {
    turnEndModal.classList.add('hidden');
    currentTeamIndex++;

    if (currentTeamIndex >= teams.length) {
      endGame();
    } else {
      showReadyModal();
    }
  };
}

// ============================================
//  FIM DE JOGO
// ============================================
function endGame() {
  gameActive = false;
  gameScreen.classList.add('hidden');
  winScreen.classList.remove('hidden');

  const sorted = [...teams].sort((a, b) => b.score - a.score);
  const winner = sorted[0];
  const tie = sorted.filter(t => t.score === winner.score).length > 1;

  if (tie) {
    winEmoji.textContent = '🤝';
    winTitle.textContent = 'Empate!';
    winMessage.textContent = `${winner.score} pontos para várias equipes!`;
  } else {
    winEmoji.textContent = winner.emoji;
    winTitle.textContent = `${winner.name} venceu!`;
    winMessage.innerHTML = `Fez <strong>${winner.score} pontos</strong> em 60 segundos! 💎`;
  }

  winStats.innerHTML = '';
  sorted.forEach((t, i) => {
    const row = document.createElement('div');
    row.className = 'stat-row' + (i === 0 && !tie ? ' first' : '');
    const medal = i === 0 ? (tie ? '🤝' : '🥇') : i === 1 ? '🥈' : i === 2 ? '🥉' : '🏅';
    row.innerHTML = `
      <span>${medal} ${t.emoji} ${t.name}</span>
      <span>${t.score} pts</span>
    `;
    winStats.appendChild(row);
  });

  playSound('win');
  launchConfetti({ count: 400, duration: 8000 });
  setTimeout(() => launchConfetti({ count: 250, duration: 5000 }), 600);
}

// ============================================
//  UTILITÁRIOS
// ============================================
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ============================================
//  EVENTOS
// ============================================
startBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);