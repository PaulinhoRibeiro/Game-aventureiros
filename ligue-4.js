// ============================================
//  LIGUE 4 COM PERGUNTAS — Aventureiros
// ============================================

// -------- CONFIGURAÇÃO --------
const TEAMS = EQUIPES_AVENTUREIROS.slice(0, 2).map((t, i) => ({
  ...t,
  symbol: i === 0 ? 'X' : 'O',
  class: i === 0 ? 'team-x' : 'team-o'
}));

const ROWS = 6;
const COLS = 7;

const COLUMN_NAMES = ['1', '2', '3', '4', '5', '6', '7'];

// -------- ESTADO --------
let board = [];
let currentTeamIndex = 0;
let currentColumn = null;
let currentQuestion = null;
let availableQuestions = [];
let gameActive = false;
let answered = false;

// -------- DOM --------
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const startBtn = document.getElementById('start-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const boardEl = document.getElementById('board');
const turnIndicator = document.getElementById('turn-indicator');
const turnEmoji = document.getElementById('turn-emoji');
const turnName = document.getElementById('turn-name');
const turnSymbol = document.getElementById('turn-symbol');
const scoreboardEl = document.getElementById('scoreboard');

const questionModal = document.getElementById('question-modal');
const questionTeamBadge = document.getElementById('question-team-badge');
const questionColumnBadge = document.getElementById('question-column-badge');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedbackEl = document.getElementById('feedback');

const winModal = document.getElementById('win-modal');
const winEmoji = document.getElementById('win-emoji');
const winTitle = document.getElementById('win-title');
const winMessage = document.getElementById('win-message');

// ============================================
//  POPULAR NOMES NA TELA INICIAL
// ============================================
const teamXLabel = document.getElementById('team-x-label');
const teamOLabel = document.getElementById('team-o-label');
if (teamXLabel) teamXLabel.textContent = `${TEAMS[0].emoji} ${TEAMS[0].name}`;
if (teamOLabel) teamOLabel.textContent = `${TEAMS[1].emoji} ${TEAMS[1].name}`;

// ============================================
//  INICIAR JOGO
// ============================================
function initGame() {
  board = Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
  currentTeamIndex = 0;
  currentColumn = null;
  currentQuestion = null;
  availableQuestions = embaralharPerguntasComRotacao();
  gameActive = true;
  answered = false;

  startScreen.classList.add('hidden');
  winModal.classList.add('hidden');
  questionModal.classList.add('hidden');
  gameScreen.classList.remove('hidden');

  buildBoard();
  updateHeader();
  updateScoreboard();
}

// ============================================
//  CONSTRUIR TABULEIRO
// ============================================
function buildBoard() {
  boardEl.innerHTML = '';

  // Renderiza de cima (row 5) para baixo (row 0)
  for (let r = ROWS - 1; r >= 0; r--) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('button');
      cell.classList.add('cell');
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener('click', () => handleCellClick(c));
      cell.addEventListener('mouseenter', () => highlightColumn(c, true));
      cell.addEventListener('mouseleave', () => highlightColumn(c, false));
      boardEl.appendChild(cell);
    }
  }
}

// ============================================
//  HIGHLIGHT DE COLUNA
// ============================================
function highlightColumn(col, show) {
  if (!gameActive || answered) return;

  boardEl.querySelectorAll(`[data-col="${col}"]`).forEach(cell => {
    if (show) cell.classList.add('col-hover');
    else cell.classList.remove('col-hover');
  });

  // Preview: mostra onde a peça vai cair
  boardEl.querySelectorAll('.preview').forEach(c => {
    c.classList.remove('preview');
    c.style.background = '';
  });

  if (show && canDropInColumn(col)) {
    const targetRow = getLowestEmptyRow(col);
    if (targetRow !== -1) {
      const cell = boardEl.querySelector(`[data-row="${targetRow}"][data-col="${col}"]`);
      if (cell) {
        const team = TEAMS[currentTeamIndex];
        cell.classList.add('preview');
        cell.style.background = team.color + '99';
      }
    }
  }
}

// ============================================
//  CLIQUE NA CÉLULA
// ============================================
function handleCellClick(col) {
  if (!gameActive || answered) return;
  if (!canDropInColumn(col)) {
    playSound('buzz');
    return;
  }

  currentColumn = col;
  answered = true;

  // Limpa preview
  boardEl.querySelectorAll('.preview').forEach(c => {
    c.classList.remove('preview');
    c.style.background = '';
  });
  boardEl.querySelectorAll('.col-hover').forEach(c => c.classList.remove('col-hover'));

  showQuestion();
}

// ============================================
//  LÓGICA DE COLUNAS
// ============================================
function canDropInColumn(col) {
  return board[ROWS - 1][col] === null;
}

function getLowestEmptyRow(col) {
  for (let row = 0; row < ROWS; row++) {
    if (board[row][col] === null) return row;
  }
  return -1;
}

// ============================================
//  MOSTRAR PERGUNTA
// ============================================
function showQuestion() {
  const team = TEAMS[currentTeamIndex];

  if (availableQuestions.length === 0) {
    availableQuestions = embaralharPerguntasComRotacao();
  }
  currentQuestion = availableQuestions.shift(); marcarPerguntaUsada(currentQuestion);

  questionTeamBadge.textContent = `${team.emoji} ${team.name}`;
  questionTeamBadge.style.background = `linear-gradient(135deg, ${team.color}, ${team.color}cc)`;
  questionColumnBadge.textContent = `📍 Coluna ${COLUMN_NAMES[currentColumn]}`;

  questionText.textContent = currentQuestion.q;
  feedbackEl.textContent = '';
  feedbackEl.className = 'feedback';

  const correct = currentQuestion.options[0];
  const shuffled = shuffle([...currentQuestion.options]);
  const letters = ['A', 'B', 'C', 'D'];

  optionsContainer.innerHTML = '';
  shuffled.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.classList.add('option-btn');
    btn.innerHTML = `<span class="letter">${letters[i]}</span><span>${opt}</span>`;
    btn.dataset.option = opt;
    btn.addEventListener('click', () => handleAnswer(btn, opt, correct));
    optionsContainer.appendChild(btn);
  });

  questionModal.classList.remove('hidden');
  playSound('tick');
}

// ============================================
//  RESPOSTA
// ============================================
async function handleAnswer(btn, chosen, correct) {
  document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

  const isCorrect = chosen === correct;
  const team = TEAMS[currentTeamIndex];

  if (isCorrect) {
    btn.classList.add('correct');
    feedbackEl.textContent = `✅ Acertou! Peça na coluna ${COLUMN_NAMES[currentColumn]}!`;
    feedbackEl.className = 'feedback correct';
    playSound('correct');

    await sleep(900);

    questionModal.classList.add('hidden');

    // Drop the piece
    const targetRow = getLowestEmptyRow(currentColumn);
    if (targetRow !== -1) {
      board[targetRow][currentColumn] = team.symbol;
      updateCell(targetRow, currentColumn, team);

      // Anima a peça caindo
      const cell = boardEl.querySelector(`[data-row="${targetRow}"][data-col="${currentColumn}"]`);
      cell.classList.add('just-dropped');
      playSound('move');

      await sleep(600);

      // Verifica vitória
      const winner = getWinner();
      if (winner) {
        endGame(winner);
        return;
      }

      // Verifica empate
      if (isBoardFull()) {
        endGame(null);
        return;
      }
    }

    // Próxima equipe
    currentTeamIndex = 1 - currentTeamIndex;
    answered = false;
    updateHeader();
    updateScoreboard();
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('.option-btn').forEach(b => {
      if (b.dataset.option === correct) b.classList.add('correct');
    });
    feedbackEl.textContent = `❌ Errou! Resposta: "${correct}". A vez passa sem colocar peça.`;
    feedbackEl.className = 'feedback wrong';
    playSound('wrong');

    await sleep(1800);

    questionModal.classList.add('hidden');

    // Próxima equipe (sem peça)
    currentTeamIndex = 1 - currentTeamIndex;
    answered = false;
    updateHeader();
    updateScoreboard();
  }
}

// ============================================
//  ATUALIZAR CÉLULA
// ============================================
function updateCell(row, col, team) {
  const cell = boardEl.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  if (!cell) return;

  cell.classList.add('filled');
  cell.classList.add(team.symbol === 'X' ? 'x' : 'o');
  cell.style.background = team.color;
  cell.textContent = team.emoji;
  cell.disabled = true;
}

// ============================================
//  VERIFICAR VITÓRIA
// ============================================
function getWinner() {
  // Horizontal
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      const v = board[r][c];
      if (v && board[r][c + 1] === v && board[r][c + 2] === v && board[r][c + 3] === v) {
        return { symbol: v, cells: [[r, c], [r, c + 1], [r, c + 2], [r, c + 3]] };
      }
    }
  }

  // Vertical
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c < COLS; c++) {
      const v = board[r][c];
      if (v && board[r + 1][c] === v && board[r + 2][c] === v && board[r + 3][c] === v) {
        return { symbol: v, cells: [[r, c], [r + 1, c], [r + 2, c], [r + 3, c]] };
      }
    }
  }

  // Diagonal /
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      const v = board[r][c];
      if (v && board[r + 1][c + 1] === v && board[r + 2][c + 2] === v && board[r + 3][c + 3] === v) {
        return { symbol: v, cells: [[r, c], [r + 1, c + 1], [r + 2, c + 2], [r + 3, c + 3]] };
      }
    }
  }

  // Diagonal \
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 3; c < COLS; c++) {
      const v = board[r][c];
      if (v && board[r + 1][c - 1] === v && board[r + 2][c - 2] === v && board[r + 3][c - 3] === v) {
        return { symbol: v, cells: [[r, c], [r + 1, c - 1], [r + 2, c - 2], [r + 3, c - 3]] };
      }
    }
  }

  return null;
}

// ============================================
//  VERIFICAR EMPATE
// ============================================
function isBoardFull() {
  return board[ROWS - 1].every(cell => cell !== null);
}

// ============================================
//  FIM DE JOGO
// ============================================
function endGame(winner) {
  gameActive = false;

  if (winner) {
    // Destaca as células vencedoras
    winner.cells.forEach(([r, c]) => {
      const cell = boardEl.querySelector(`[data-row="${r}"][data-col="${c}"]`);
      if (cell) cell.classList.add('winning');
    });

    const winningTeam = winner.symbol === 'X' ? TEAMS[0] : TEAMS[1];
    winEmoji.textContent = winningTeam.emoji;
    winTitle.textContent = '🏆 Temos um vencedor!';
    winMessage.innerHTML = `${winningTeam.emoji} <strong>${winningTeam.name}</strong> fez 4 em linha e venceu! 🎉`;

    playSound('win');
    launchConfetti({ count: 300, duration: 6000 });
  } else {
    winEmoji.textContent = '🤝';
    winTitle.textContent = 'Empate!';
    winMessage.innerHTML = 'O tabuleiro encheu sem ninguém fazer 4 em linha. Que jogo disputado!';

    playSound('buzz');
  }

  setTimeout(() => {
    winModal.classList.remove('hidden');
  }, 1000);
}

// ============================================
//  UI
// ============================================
function updateHeader() {
  const team = TEAMS[currentTeamIndex];
  turnEmoji.textContent = team.emoji;
  turnName.textContent = `Vez da ${team.name}`;
  turnSymbol.textContent = team.symbol === 'X' ? '🔴' : '🟡';
  turnIndicator.style.borderColor = team.color;
}

function updateScoreboard() {
  scoreboardEl.innerHTML = '';
  TEAMS.forEach((t, i) => {
    const item = document.createElement('div');
    item.classList.add('score-item');
    if (i === currentTeamIndex && gameActive) item.classList.add('active');
    item.innerHTML = `
      <span class="s-emoji">${t.emoji}</span>
      <span>${t.name.replace('Equipe ', '')}</span>
      <span class="s-symbol">${t.symbol}</span>
    `;
    scoreboardEl.appendChild(item);
  });
}

// ============================================
//  UTILITÁRIOS
// ============================================
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

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