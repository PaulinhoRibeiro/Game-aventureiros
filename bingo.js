// ============================================
//  BINGO DOS AVENTUREIROS
// ============================================

// -------- POOL DE PALAVRAS (40) --------
const WORD_POOL = [
  'JESUS', 'DEUS', 'AMOR', 'BIBLIA', 'LENCO',
  'HINO', 'VOTO', 'LEMA', 'SERVIR', 'ALERTA',
  'FLORESTA', 'ABELHA', 'LEAO', 'ESTRELA', 'BARRACA',
  'TRILHA', 'AMIZADE', 'EQUIPE', 'AVENTURA', 'TESOURO',
  'VITORIA', 'FAMILIA', 'ORACAO', 'BONDADE', 'LUMINAR',
  'SABEDORIA', 'CORAGEM', 'UNIAO', 'CRIACAO', 'NATUREZA',
  'MONTANHA', 'FOGUEIRA', 'LANTERNA', 'MOCHILA', 'MISSAO',
  'PAZ', 'FE', 'ALEGRIA', 'LUZ', 'JUSTICA'
];

// -------- ESTADO --------
let teams = [];
let cards = [];
let drawnWords = [];
let availableWords = [];
let gameActive = false;

// -------- DOM --------
const startScreen = document.getElementById('start-screen');
const printScreen = document.getElementById('print-screen');
const gameScreen = document.getElementById('game-screen');
const winScreen = document.getElementById('win-screen');

const printCardsBtn = document.getElementById('print-cards-btn');
const startBtn = document.getElementById('start-btn');
const backBtn = document.getElementById('back-btn');
const doPrintBtn = document.getElementById('do-print-btn');
const playAgainBtn = document.getElementById('play-again-btn');

const wordDisplay = document.getElementById('word-display');
const drawBtn = document.getElementById('draw-btn');
const drawnCountEl = document.getElementById('drawn-count');
const historyList = document.getElementById('history-list');
const verifyButtons = document.getElementById('verify-buttons');

const verifyModal = document.getElementById('verify-modal');
const verifyEmoji = document.getElementById('verify-emoji');
const verifyName = document.getElementById('verify-name');
const verifyResult = document.getElementById('verify-result');
const verifyCard = document.getElementById('verify-card');
const verifyContinueBtn = document.getElementById('verify-continue-btn');

const winEmoji = document.getElementById('win-emoji');
const winTitle = document.getElementById('win-title');
const winMessage = document.getElementById('win-message');

// ============================================
//  GERAÇÃO DE CARTELAS
// ============================================
function generateCard(teamId) {
  const words = shuffle([...WORD_POOL]).slice(0, 24);
  let wordIdx = 0;
  const grid = [];

  for (let r = 0; r < 5; r++) {
    const row = [];
    for (let c = 0; c < 5; c++) {
      if (r === 2 && c === 2) {
        row.push('FREE');
      } else {
        row.push(words[wordIdx++]);
      }
    }
    grid.push(row);
  }

  return { teamId, grid };
}

function generateAllCards() {
  cards = teams.map(t => generateCard(t.id));
}

// ============================================
//  IMPRIMIR CARTELAS
// ============================================
printCardsBtn.addEventListener('click', () => {
  if (cards.length === 0) {
    teams = EQUIPES_AVENTUREIROS.map((t, i) => ({ ...t, id: i }));
    generateAllCards();
  }
  renderPrintCards();
  startScreen.classList.add('hidden');
  printScreen.classList.remove('hidden');
});

backBtn.addEventListener('click', () => {
  printScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
});

doPrintBtn.addEventListener('click', () => {
  window.print();
});

function renderPrintCards() {
  const container = document.getElementById('print-cards');
  container.innerHTML = '';

  cards.forEach((card, i) => {
    const team = teams[i];
    const cardEl = document.createElement('div');
    cardEl.className = 'print-card';

    const header = document.createElement('div');
    header.className = 'print-card-header';
    header.innerHTML = `
      <span class="print-team-emoji">${team.emoji}</span>
      <span class="print-team-name">${team.name}</span>
    `;
    cardEl.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'print-card-grid';

    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        const word = card.grid[r][c];
        const cell = document.createElement('div');
        cell.className = 'print-cell';
        if (word === 'FREE') {
          cell.classList.add('free');
          cell.textContent = '⭐ LIVRE';
        } else {
          cell.textContent = word;
        }
        grid.appendChild(cell);
      }
    }

    cardEl.appendChild(grid);
    container.appendChild(cardEl);
  });
}

// ============================================
//  INICIAR JOGO
// ============================================
startBtn.addEventListener('click', initGame);

function initGame() {
  teams = EQUIPES_AVENTUREIROS.map((t, i) => ({ ...t, id: i }));
  generateAllCards();

  drawnWords = [];
  availableWords = [...WORD_POOL];
  gameActive = true;

  startScreen.classList.add('hidden');
  printScreen.classList.add('hidden');
  winScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  verifyModal.classList.add('hidden');

  wordDisplay.innerHTML = '<span class="word-placeholder">?</span>';
  drawnCountEl.textContent = '0';
  historyList.innerHTML = '<div class="history-empty">Nenhuma palavra sorteada ainda</div>';

  renderVerifyButtons();

  drawBtn.disabled = false;
  drawBtn.textContent = '🎲 Sortear Palavra';
}

// ============================================
//  SORTEAR PALAVRA
// ============================================
drawBtn.addEventListener('click', drawWord);

async function drawWord() {
  if (!gameActive) return;
  if (availableWords.length === 0) return;
  if (drawBtn.disabled) return;

  drawBtn.disabled = true;
  drawBtn.textContent = '🎲 Sorteando...';

  playSound('dice');

  // Animação de "sorteio" - embaralha visualmente
  for (let i = 0; i < 10; i++) {
    await sleep(80);
    const randomWord = WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)];
    wordDisplay.innerHTML = `<span class="word-text" style="animation: none; opacity: 0.5">${randomWord}</span>`;
  }

  // Sorteia a palavra real
  const idx = Math.floor(Math.random() * availableWords.length);
  const word = availableWords.splice(idx, 1)[0];
  drawnWords.push(word);

  // Mostra a palavra sorteada
  wordDisplay.innerHTML = `<span class="word-text">${word}</span>`;

  playSound('correct');
  launchConfetti({ count: 60, duration: 1500 });

  drawnCountEl.textContent = drawnWords.length;
  renderHistory();

  // Se acabou as palavras
  if (availableWords.length === 0) {
    drawBtn.disabled = true;
    drawBtn.textContent = '✅ Todas sorteadas';
  } else {
    drawBtn.disabled = false;
    drawBtn.textContent = '🎲 Sortear Palavra';
  }
}

// ============================================
//  HISTÓRICO
// ============================================
function renderHistory() {
  historyList.innerHTML = '';

  if (drawnWords.length === 0) {
    historyList.innerHTML = '<div class="history-empty">Nenhuma palavra sorteada ainda</div>';
    return;
  }

  // Mais recentes primeiro
  const reversed = [...drawnWords].reverse();
  reversed.forEach((word, i) => {
    const chip = document.createElement('div');
    chip.className = 'history-chip';
    if (i === 0) chip.classList.add('latest');
    chip.textContent = word;
    historyList.appendChild(chip);
  });
}

// ============================================
//  BOTÕES DE VERIFICAÇÃO
// ============================================
function renderVerifyButtons() {
  verifyButtons.innerHTML = '';

  teams.forEach(team => {
    const btn = document.createElement('button');
    btn.className = 'verify-btn';
    btn.innerHTML = `
      <span class="v-emoji">${team.emoji}</span>
      <span class="v-name">${team.name}</span>
      <span class="v-action">BINGO! →</span>
    `;
    btn.onclick = () => verifyTeamBingo(team.id);
    verifyButtons.appendChild(btn);
  });
}

// ============================================
//  VERIFICAR BINGO
// ============================================
function verifyTeamBingo(teamId) {
  if (!gameActive) return;

  const card = cards.find(c => c.teamId === teamId);
  const team = teams.find(t => t.id === teamId);
  if (!card || !team) return;

  const winningLine = checkBingo(card);

  verifyEmoji.textContent = team.emoji;
  verifyName.textContent = team.name;

  if (winningLine) {
    verifyResult.className = 'verify-result win';
    verifyResult.innerHTML = '🎉 BINGO CONFIRMADO! 🎉';
    playSound('win');
    launchConfetti({ count: 300, duration: 6000 });
  } else {
    verifyResult.className = 'verify-result lose';
    const missing = countMissingForLine(card);
    verifyResult.innerHTML = `❌ Ainda não!<br><small>Faltam ${missing} palavras para completar alguma linha</small>`;
    playSound('wrong');
  }

  renderVerifyCard(card, winningLine);
  verifyModal.classList.remove('hidden');

  verifyContinueBtn.onclick = () => {
    verifyModal.classList.add('hidden');
    if (winningLine) {
      winGame(team, winningLine);
    }
  };
}

// ============================================
//  CHECAR BINGO
// ============================================
function checkBingo(card) {
  const g = card.grid;
  const isMarked = (r, c) => {
    const w = g[r][c];
    return w === 'FREE' || drawnWords.includes(w);
  };

  // Linhas
  for (let r = 0; r < 5; r++) {
    if ([0,1,2,3,4].every(c => isMarked(r, c))) {
      return { type: 'row', cells: [[r,0],[r,1],[r,2],[r,3],[r,4]] };
    }
  }

  // Colunas
  for (let c = 0; c < 5; c++) {
    if ([0,1,2,3,4].every(r => isMarked(r, c))) {
      return { type: 'column', cells: [[0,c],[1,c],[2,c],[3,c],[4,c]] };
    }
  }

  // Diagonal principal
  if ([0,1,2,3,4].every(i => isMarked(i, i))) {
    return { type: 'diag1', cells: [[0,0],[1,1],[2,2],[3,3],[4,4]] };
  }

  // Diagonal secundária
  if ([0,1,2,3,4].every(i => isMarked(i, 4 - i))) {
    return { type: 'diag2', cells: [[0,4],[1,3],[2,2],[3,1],[4,0]] };
  }

  return null;
}

function countMissingForLine(card) {
  const g = card.grid;
  const isMarked = (r, c) => {
    const w = g[r][c];
    return w === 'FREE' || drawnWords.includes(w);
  };

  let minMissing = 5;

  // Linhas
  for (let r = 0; r < 5; r++) {
    const missing = [0,1,2,3,4].filter(c => !isMarked(r, c)).length;
    if (missing < minMissing) minMissing = missing;
  }
  // Colunas
  for (let c = 0; c < 5; c++) {
    const missing = [0,1,2,3,4].filter(r => !isMarked(r, c)).length;
    if (missing < minMissing) minMissing = missing;
  }
  // Diagonal 1
  const d1Missing = [0,1,2,3,4].filter(i => !isMarked(i, i)).length;
  if (d1Missing < minMissing) minMissing = d1Missing;
  // Diagonal 2
  const d2Missing = [0,1,2,3,4].filter(i => !isMarked(i, 4 - i)).length;
  if (d2Missing < minMissing) minMissing = d2Missing;

  return minMissing;
}

// ============================================
//  RENDERIZAR CARTELA NO MODAL
// ============================================
function renderVerifyCard(card, winningLine) {
  verifyCard.innerHTML = '';
  const winningCells = winningLine ? winningLine.cells.map(([r,c]) => `${r}-${c}`) : [];

  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const word = card.grid[r][c];
      const cell = document.createElement('div');
      cell.className = 'verify-cell';

      if (word === 'FREE') {
        cell.classList.add('free');
        cell.textContent = '⭐';
      } else {
        cell.textContent = word;
        if (drawnWords.includes(word)) {
          cell.classList.add('marked');
        }
      }

      if (winningCells.includes(`${r}-${c}`)) {
        cell.classList.add('winning');
      }

      verifyCard.appendChild(cell);
    }
  }
}

// ============================================
//  VITÓRIA
// ============================================
function winGame(team, winningLine) {
  gameActive = false;
  gameScreen.classList.add('hidden');
  winScreen.classList.remove('hidden');

  winEmoji.textContent = team.emoji;
  winTitle.textContent = 'BINGO!';
  winMessage.innerHTML = `
    <strong>${team.name}</strong> completou o Bingo em <strong>${drawnWords.length} palavras</strong>!
    <br><br>
    🏆 Parabéns, ${team.emoji} ${team.name}!
  `;

  playSound('win');
  launchConfetti({ count: 400, duration: 8000 });
  setTimeout(() => launchConfetti({ count: 250, duration: 5000 }), 800);
}

// ============================================
//  JOGAR NOVAMENTE
// ============================================
playAgainBtn.addEventListener('click', () => {
  winScreen.classList.add('hidden');
  initGame();
});

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

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ============================================
//  INICIALIZAÇÃO
// ============================================
teams = EQUIPES_AVENTUREIROS.map((t, i) => ({ ...t, id: i }));
generateAllCards();