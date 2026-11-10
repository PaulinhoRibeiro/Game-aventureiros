// ============================================
//  CAÇA-PALAVRAS DOS AVENTUREIROS
//  Com cronômetro por rodada
// ============================================

// -------- CONFIGURAÇÃO --------
// tempo: em segundos
const RODADAS = [
  {
    tema: 'Símbolos e Ideais',
    tamanho: 8,
    tempo: 90,
    palavras: ['LEAO', 'HINO', 'LENCO', 'VOTO']
  },
  {
    tema: 'Natureza e Acampamento',
    tamanho: 9,
    tempo: 120,
    palavras: ['BIBLIA', 'ABELHA', 'BARRACA', 'JESUS', 'TRILHA']
  },
  {
    tema: 'Classes e Equipe',
    tamanho: 10,
    tempo: 150,
    palavras: ['FLORESTA', 'AMIZADE', 'AVENTURA', 'LUMINARES', 'MISSAO']
  }
];

const LETRAS_FILL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// -------- ESTADO --------
let teams = [];
let currentTeamIndex = 0;
let currentRound = 0;
let totalRounds = RODADAS.length;
let grid = [];
let gridSize = 0;
let palavrasRodada = [];
let palavrasEncontradas = new Set();
let coordsPorPalavra = {};
let selecaoInicial = null;
let gameActive = false;

// -------- TIMER --------
let timeLeft = 0;
let totalTime = 0;
let timerInterval = null;
let timerPaused = false;
let timerBox = null;

// -------- DOM --------
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const startBtn = document.getElementById('start-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const roundInfoText = document.getElementById('round-info-text');
const roundTheme = document.getElementById('round-theme');
const turnIndicator = document.getElementById('turn-indicator');
const turnEmoji = document.getElementById('turn-emoji');
const turnName = document.getElementById('turn-name');
const gridEl = document.getElementById('grid');
const wordListEl = document.getElementById('word-list');
const feedbackBanner = document.getElementById('feedback-banner');
const scoreboardEl = document.getElementById('scoreboard');
const winnerDisplay = document.getElementById('winner-display');
const finalScores = document.getElementById('final-scores');

// Timer DOM
const timerBoxEl = document.getElementById('timer-box');
const timerFillEl = document.getElementById('timer-fill');
const timerTextEl = document.getElementById('timer-text');

// ============================================
//  INICIAR JOGO
// ============================================
function initGame() {
  teams = EQUIPES_AVENTUREIROS.map(e => ({ ...e, score: 0 }));
  currentTeamIndex = 0;
  currentRound = 0;
  gameActive = true;

  startScreen.classList.add('hidden');
  endScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');

  updateHeader();
  updateScoreboard();
  startRound();
}

// ============================================
//  INICIAR RODADA
// ============================================
function startRound() {
  if (currentRound >= totalRounds) {
    endGame();
    return;
  }

  clearInterval(timerInterval);
  timerPaused = false;

  const config = RODADAS[currentRound];
  palavrasRodada = [...config.palavras];
  palavrasEncontradas = new Set();
  coordsPorPalavra = {};
  selecaoInicial = null;
  gridSize = config.tamanho;
  totalTime = config.tempo;

  grid = gerarGrid(gridSize, palavrasRodada);

  if (!grid) {
    const palavrasReduzidas = [...palavrasRodada].sort((a, b) => a.length - b.length).slice(0, -1);
    palavrasRodada = palavrasReduzidas;
    grid = gerarGrid(gridSize, palavrasRodada);
  }

  renderGrid();
  renderWordList();
  updateHeader();
  updateScoreboard();
  hideFeedback();

  roundInfoText.textContent = `Rodada ${currentRound + 1} de ${totalRounds}`;
  roundTheme.textContent = config.tema;

  // Inicia o cronômetro
  startTimer();
}

// ============================================
//  CRONÔMETRO
// ============================================
function startTimer() {
  clearInterval(timerInterval);
  timeLeft = totalTime;
  timerPaused = false;
  updateTimerDisplay();

  timerBoxEl.classList.remove('paused');

  timerInterval = setInterval(() => {
    if (!gameActive) return;
    if (timerPaused) return;

    timeLeft -= 0.1;

    // Bipe nos últimos 10 segundos
    if (timeLeft <= 10 && timeLeft > 0) {
      if (Math.abs(timeLeft - Math.round(timeLeft)) < 0.05) {
        playSound('tick');
      }
    }

    updateTimerDisplay();

    if (timeLeft <= 0) {
      timeLeft = 0;
      updateTimerDisplay();
      clearInterval(timerInterval);
      timeUp();
    }
  }, 100);
}

function updateTimerDisplay() {
  const pct = Math.max(0, (timeLeft / totalTime) * 100);
  timerFillEl.style.width = `${pct}%`;
  timerTextEl.textContent = Math.ceil(Math.max(0, timeLeft));

  timerFillEl.classList.remove('warning', 'danger');
  if (timeLeft <= 10) timerFillEl.classList.add('danger');
  else if (timeLeft <= totalTime * 0.4) timerFillEl.classList.add('warning');
}

function pauseTimer() {
  timerPaused = true;
  timerBoxEl.classList.add('paused');
}

function resumeTimer() {
  timerPaused = false;
  timerBoxEl.classList.remove('paused');
}

function timeUp() {
  if (!gameActive) return;

  playSound('buzz');
  showFeedback('⏱️ Tempo esgotado! Próxima rodada...', 'warning');

  // Desabilita todas as células
  gridEl.querySelectorAll('.cell').forEach(c => c.style.pointerEvents = 'none');

  setTimeout(() => {
    currentRound++;
    startRound();
  }, 2400);
}

// ============================================
//  GERAR GRID COM PALAVRAS
// ============================================
function gerarGrid(tamanho, palavras) {
  for (let tentativa = 0; tentativa < 30; tentativa++) {
    const g = Array.from({ length: tamanho }, () => Array(tamanho).fill(null));
    let sucesso = true;

    for (const palavra of palavras) {
      if (!tentarColocar(g, palavra)) {
        sucesso = false;
        break;
      }
    }

    if (sucesso) {
      for (let r = 0; r < tamanho; r++) {
        for (let c = 0; c < tamanho; c++) {
          if (g[r][c] === null) {
            g[r][c] = LETRAS_FILL[Math.floor(Math.random() * LETRAS_FILL.length)];
          }
        }
      }
      return g;
    }
  }
  return null;
}

function tentarColocar(g, palavra) {
  const n = g.length;
  const letras = palavra.split('');
  const direcoes = [
    [0, 1], [0, -1],
    [1, 0], [-1, 0],
    [1, 1], [-1, -1],
    [1, -1], [-1, 1]
  ];

  const posicoes = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      posicoes.push([r, c]);
    }
  }
  shuffle(posicoes);
  const dirs = shuffle([...direcoes]);

  for (const [r0, c0] of posicoes) {
    for (const [dr, dc] of dirs) {
      if (podeColocar(g, letras, r0, c0, dr, dc)) {
        const coords = [];
        for (let i = 0; i < letras.length; i++) {
          const r = r0 + dr * i;
          const c = c0 + dc * i;
          g[r][c] = letras[i];
          coords.push([r, c]);
        }
        coordsPorPalavra[palavra] = coords;
        return true;
      }
    }
  }
  return false;
}

function podeColocar(g, letras, r0, c0, dr, dc) {
  const n = g.length;
  for (let i = 0; i < letras.length; i++) {
    const r = r0 + dr * i;
    const c = c0 + dc * i;
    if (r < 0 || r >= n || c < 0 || c >= n) return false;
    if (g[r][c] !== null && g[r][c] !== letras[i]) return false;
  }
  return true;
}

// ============================================
//  RENDERIZAR GRID
// ============================================
function renderGrid() {
  gridEl.innerHTML = '';
  gridEl.style.setProperty('--n', gridSize);

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.r = r;
      cell.dataset.c = c;
      cell.textContent = grid[r][c];
      cell.addEventListener('click', () => handleCellClick(r, c));
      gridEl.appendChild(cell);
    }
  }
}

// ============================================
//  RENDERIZAR LISTA DE PALAVRAS
// ============================================
function renderWordList() {
  wordListEl.innerHTML = '';
  palavrasRodada.forEach(palavra => {
    const item = document.createElement('div');
    item.className = 'word-item';
    item.textContent = palavra;
    item.dataset.word = palavra;
    if (palavrasEncontradas.has(palavra)) item.classList.add('found');
    wordListEl.appendChild(item);
  });
}

function markWordAsFound(word) {
  const el = wordListEl.querySelector(`[data-word="${word}"]`);
  if (el) el.classList.add('found');
}

// ============================================
//  CLIQUE EM CÉLULA
// ============================================
function handleCellClick(r, c) {
  if (!gameActive) return;
  if (timerPaused) return;
  hideFeedback();

  // Primeira letra
  if (!selecaoInicial) {
    selecaoInicial = { r, c };
    getCellEl(r, c).classList.add('selected');
    playSound('tick');
    return;
  }

  // Mesma célula → desmarca
  if (selecaoInicial.r === r && selecaoInicial.c === c) {
    clearSelection();
    return;
  }

  // Não alinhado → reinicia seleção
  if (!isAligned(selecaoInicial.r, selecaoInicial.c, r, c)) {
    clearSelection();
    selecaoInicial = { r, c };
    getCellEl(r, c).classList.add('selected');
    playSound('tick');
    return;
  }

  // Alinhado → verifica palavra
  const coords = getCoordsBetween(selecaoInicial.r, selecaoInicial.c, r, c);
  const word = coords.map(([rr, cc]) => grid[rr][cc]).join('');
  const reversed = word.split('').reverse().join('');

  const matched = palavrasRodada.find(p => p === word || p === reversed);

  if (!matched) {
    // Pausa o timer durante o feedback
    pauseTimer();
    flashCells(coords, 'wrong-flash');
    playSound('wrong');

    setTimeout(() => {
      clearSelection();
      showFeedback('❌ Não é uma palavra da lista!', 'error');

      setTimeout(() => {
        hideFeedback();
        resumeTimer();
        advanceTurn();
      }, 1200);
    }, 500);
    return;
  }

  if (palavrasEncontradas.has(matched)) {
    pauseTimer();
    flashCells(coords, 'already-flash');
    playSound('buzz');

    setTimeout(() => {
      clearSelection();
      showFeedback('⚠️ Essa palavra já foi encontrada!', 'warning');

      setTimeout(() => {
        hideFeedback();
        resumeTimer();
        advanceTurn();
      }, 1200);
    }, 500);
    return;
  }

  // ✅ Nova palavra!
  pauseTimer();
  palavrasEncontradas.add(matched);
  const wordCoords = coordsPorPalavra[matched] || coords;
  wordCoords.forEach(([rr, cc]) => {
    const el = getCellEl(rr, cc);
    if (el) el.classList.add('found');
  });

  teams[currentTeamIndex].score++;
  updateScoreboard();
  markWordAsFound(matched);

  playSound('correct');
  launchConfetti({ count: 80, duration: 2000 });

  showFeedback(`✅ ${matched}! +1 ponto para ${teams[currentTeamIndex].name}`, 'success');

  clearSelection();

  setTimeout(() => {
    hideFeedback();

    if (palavrasEncontradas.size >= palavrasRodada.length) {
      // Rodada completa (todas as palavras)
      clearInterval(timerInterval);
      endRound(false);
    } else {
      resumeTimer();
      advanceTurn();
    }
  }, 1600);
}

// ============================================
//  SELEÇÃO E COORDENADAS
// ============================================
function getCellEl(r, c) {
  return gridEl.querySelector(`[data-r="${r}"][data-c="${c}"]`);
}

function clearSelection() {
  gridEl.querySelectorAll('.cell.selected').forEach(el => el.classList.remove('selected'));
  selecaoInicial = null;
}

function isAligned(r1, c1, r2, c2) {
  if (r1 === r2 && c1 === c2) return false;
  if (r1 === r2) return true;
  if (c1 === c2) return true;
  if (Math.abs(r2 - r1) === Math.abs(c2 - c1)) return true;
  return false;
}

function getCoordsBetween(r1, c1, r2, c2) {
  const dr = Math.sign(r2 - r1);
  const dc = Math.sign(c2 - c1);
  const steps = Math.max(Math.abs(r2 - r1), Math.abs(c2 - c1));
  const coords = [];
  for (let i = 0; i <= steps; i++) {
    coords.push([r1 + dr * i, c1 + dc * i]);
  }
  return coords;
}

function flashCells(coords, className) {
  coords.forEach(([r, c]) => {
    const el = getCellEl(r, c);
    if (el) el.classList.add(className);
  });
  setTimeout(() => {
    coords.forEach(([r, c]) => {
      const el = getCellEl(r, c);
      if (el) el.classList.remove(className);
    });
  }, 700);
}

// ============================================
//  AVANÇAR TURNO
// ============================================
function advanceTurn() {
  currentTeamIndex = (currentTeamIndex + 1) % teams.length;
  updateHeader();
  updateScoreboard();
}

// ============================================
//  FIM DE RODADA
// ============================================
function endRound(tempoEsgotado) {
  clearInterval(timerInterval);
  pauseTimer();

  if (tempoEsgotado) {
    showFeedback('⏱️ Tempo esgotado! Próxima rodada...', 'warning');
  } else {
    showFeedback('🎉 Rodada completa! Próxima rodada...', 'success');
    playSound('win');
    launchConfetti({ count: 150, duration: 3000 });
  }

  setTimeout(() => {
    currentRound++;
    startRound();
  }, 2400);
}

// ============================================
//  FIM DE JOGO
// ============================================
function endGame() {
  gameActive = false;
  clearInterval(timerInterval);
  gameScreen.classList.add('hidden');
  endScreen.classList.remove('hidden');

  const sorted = [...teams].sort((a, b) => b.score - a.score);
  const winner = sorted[0];
  const tie = sorted.filter(t => t.score === winner.score).length > 1;

  if (tie) {
    winnerDisplay.textContent = `🤝 Empate no topo! ${winner.score} pontos cada.`;
  } else {
    winnerDisplay.textContent = `🥇 ${winner.emoji} ${winner.name} venceu com ${winner.score} pontos!`;
  }

  finalScores.innerHTML = '';
  sorted.forEach((t, i) => {
    const item = document.createElement('div');
    item.className = 'final-score-item' + (i === 0 && !tie ? ' first' : '');
    const medal = i === 0 ? (tie ? '🤝' : '🥇') : i === 1 ? '🥈' : i === 2 ? '🥉' : '🏅';
    item.innerHTML = `
      <span>${medal} ${t.emoji} ${t.name}</span>
      <span>${t.score} pts</span>
    `;
    finalScores.appendChild(item);
  });

  playSound('win');
  launchConfetti({ count: 300, duration: 6000 });
}

// ============================================
//  FEEDBACK
// ============================================
function showFeedback(text, type) {
  feedbackBanner.className = `feedback-banner ${type}`;
  feedbackBanner.textContent = text;
  feedbackBanner.classList.remove('hidden');
}

function hideFeedback() {
  feedbackBanner.classList.add('hidden');
}

// ============================================
//  UI
// ============================================
function updateHeader() {
  const team = teams[currentTeamIndex];
  turnEmoji.textContent = team.emoji;
  turnName.textContent = `Vez da ${team.name}`;
  turnIndicator.style.borderColor = team.color;
}

function updateScoreboard() {
  scoreboardEl.innerHTML = '';
  teams.forEach((t, i) => {
    const item = document.createElement('div');
    item.classList.add('score-item');
    if (i === currentTeamIndex && gameActive) item.classList.add('active');
    item.innerHTML = `
      <span class="s-emoji">${t.emoji}</span>
      <span>${t.name.replace('Equipe ', '')}</span>
      <span class="s-score">${t.score}</span>
    `;
    scoreboardEl.appendChild(item);
  });
}

// ============================================
//  UTILITÁRIOS
// ============================================
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ============================================
//  EVENTOS
// ============================================
startBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);