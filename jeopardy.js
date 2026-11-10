// ============================================
//  JEOPARDY DOS AVENTUREIROS
// ============================================

const CATEGORY_NAMES = {
  classes: 'Classes',
  ideais: 'Ideais',
  simbolos: 'Símbolos',
  especialidades: 'Especialidades',
  biblia: 'Bíblia',
  natureza: 'Natureza',
  saude: 'Saúde',
  acampamento: 'Acampamento',
  equipe: 'Equipe',
  historia: 'História'
};

const NUM_CATEGORIAS = 5;
const NUM_VALORES = 4;
const PISO_ZERO = true;

// -------- ESTADO --------
let teams = [];
let currentTeamIndex = 0;
let board = [];
let usedCells = new Set();
let currentCell = null;
let currentQuestion = null;
let answering = false;
let gameOver = false;

// -------- DOM --------
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const startBtn = document.getElementById('start-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const teamEmojiEl = document.getElementById('team-emoji');
const teamNameEl = document.getElementById('team-name');
const scoreSummaryEl = document.getElementById('score-summary');
const boardEl = document.getElementById('board');
const questionModal = document.getElementById('question-modal');
const questionCategoryEl = document.getElementById('question-category');
const questionValueEl = document.getElementById('question-value');
const questionTeamEl = document.getElementById('question-team');
const questionTextEl = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedbackEl = document.getElementById('feedback');
const continueBtn = document.getElementById('continue-btn');
const winnerDisplay = document.getElementById('winner-display');
const finalScores = document.getElementById('final-scores');

// ============================================
//  INICIAR JOGO
// ============================================
function initGame() {
  teams = EQUIPES_AVENTUREIROS.map(e => ({ ...e, score: 0 }));
  currentTeamIndex = 0;
  usedCells = new Set();
  currentCell = null;
  currentQuestion = null;
  answering = false;
  gameOver = false;

  board = buildBoard();

  startScreen.classList.add('hidden');
  endScreen.classList.add('hidden');
  questionModal.classList.add('hidden');
  gameScreen.classList.remove('hidden');

  renderBoard();
  updateHeader();
}

// ============================================
//  MONTAGEM DO TABULEIRO
// ============================================
function buildBoard() {
  // 1. Pega todas as categorias existentes no banco
  const todasCategorias = [...new Set(PERGUNTAS_AVENTUREIROS.map(p => p.categoria))];

  // 2. Sorteia 5 categorias
  const categoriasSorteadas = shuffle([...todasCategorias]).slice(0, NUM_CATEGORIAS);

  // 3. Para cada categoria, escolhe 4 perguntas priorizando as menos usadas
  return categoriasSorteadas.map(cat => {
    const priorizadas = getPerguntasPrioritarias(p => p.categoria === cat);
    const escolhidas = priorizadas.slice(0, NUM_VALORES);
    escolhidas.forEach(q => marcarPerguntaUsada(q));
    return {
      category: cat,
      questions: shuffle([...escolhidas])
    };
  });
}

// ============================================
//  RENDERIZAÇÃO DO TABULEIRO
// ============================================
function renderBoard() {
  boardEl.innerHTML = '';

  board.forEach((cat, catIdx) => {
    const header = document.createElement('div');
    header.classList.add('category-header');
    header.textContent = CATEGORY_NAMES[cat.category] || cat.category;
    header.style.gridRow = 1;
    header.style.gridColumn = catIdx + 1;
    boardEl.appendChild(header);
  });

  for (let valIdx = 0; valIdx < NUM_VALORES; valIdx++) {
    board.forEach((cat, catIdx) => {
      const value = (valIdx + 1) * 100;
      const cell = document.createElement('button');
      cell.classList.add('value-cell');
      cell.textContent = value;
      cell.dataset.cat = catIdx;
      cell.dataset.val = valIdx;
      cell.style.gridRow = valIdx + 2;
      cell.style.gridColumn = catIdx + 1;
      cell.addEventListener('click', () => openQuestion(catIdx, valIdx));
      boardEl.appendChild(cell);
    });
  }
}

// ============================================
//  CABEÇALHO E PLACAR
// ============================================
function updateHeader() {
  const team = teams[currentTeamIndex];
  teamEmojiEl.textContent = team.emoji;
  teamNameEl.textContent = team.name;
  document.getElementById('team-badge').style.borderLeft = `6px solid ${team.color}`;

  scoreSummaryEl.innerHTML = '';
  teams.forEach((t, i) => {
    const item = document.createElement('div');
    item.classList.add('score-item');
    if (i === currentTeamIndex && !gameOver) item.classList.add('active');
    item.innerHTML = `
      <span class="s-emoji">${t.emoji}</span>
      <span class="s-name">${t.name.replace('Equipe ', '')}</span>
      <span class="s-score">${t.score}</span>
    `;
    scoreSummaryEl.appendChild(item);
  });
}

// ============================================
//  ABRIR PERGUNTA
// ============================================
function openQuestion(catIdx, valIdx) {
  if (gameOver) return;
  const key = `${catIdx}-${valIdx}`;
  if (usedCells.has(key)) return;

  const question = board[catIdx].questions[valIdx];
  const value = (valIdx + 1) * 100;
  const team = teams[currentTeamIndex];

  currentCell = { catIdx, valIdx, value };
  currentQuestion = question;
  answering = false;

  questionCategoryEl.textContent = CATEGORY_NAMES[board[catIdx].category] || board[catIdx].category;
  questionValueEl.textContent = `${value} pts`;
  questionTeamEl.textContent = `${team.emoji} ${team.name} escolheu!`;

  questionTextEl.textContent = question.q;

  const correct = question.options[0];
  const shuffled = shuffle([...question.options]);
  const letters = ['A', 'B', 'C', 'D'];

  optionsContainer.innerHTML = '';
  feedbackEl.textContent = '';
  feedbackEl.className = 'feedback';
  continueBtn.classList.add('hidden');

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
function handleAnswer(btn, chosen, correct) {
  if (answering) return;
  answering = true;

  const isCorrect = chosen === correct;
  const team = teams[currentTeamIndex];
  const value = currentCell.value;

  document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

  if (isCorrect) {
    btn.classList.add('correct');
    team.score += value;
    playSound('correct');
    launchConfetti({ count: 80, duration: 2000 });
    feedbackEl.textContent = `✅ Acertou! +${value} pontos para ${team.name}`;
    feedbackEl.className = 'feedback correct';
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('.option-btn').forEach(b => {
      if (b.dataset.option === correct) b.classList.add('correct');
    });
    team.score = PISO_ZERO ? Math.max(0, team.score - value) : team.score - value;
    playSound('wrong');
    feedbackEl.textContent = `❌ Errou! -${value} pontos. Resposta: "${correct}"`;
    feedbackEl.className = 'feedback wrong';
  }

  updateHeader();

  continueBtn.classList.remove('hidden');
  continueBtn.onclick = () => {
    questionModal.classList.add('hidden');
    markCellUsed(currentCell.catIdx, currentCell.valIdx);

    if (usedCells.size >= NUM_CATEGORIAS * NUM_VALORES) {
      endGame();
      return;
    }

    currentTeamIndex = (currentTeamIndex + 1) % teams.length;
    updateHeader();
    answering = false;
  };
}

// ============================================
//  MARCAR CASA COMO USADA
// ============================================
function markCellUsed(catIdx, valIdx) {
  const key = `${catIdx}-${valIdx}`;
  usedCells.add(key);
  const cell = boardEl.querySelector(`[data-cat="${catIdx}"][data-val="${valIdx}"]`);
  if (cell) {
    cell.classList.add('used');
    cell.disabled = true;
    cell.textContent = '';
  }
}

// ============================================
//  FIM DE JOGO
// ============================================
function endGame() {
  gameOver = true;
  gameScreen.classList.add('hidden');
  endScreen.classList.remove('hidden');

  const sorted = [...teams].sort((a, b) => b.score - a.score);
  const winner = sorted[0];

  winnerDisplay.textContent = `🥇 ${winner.emoji} ${winner.name} venceu com ${winner.score} pontos!`;

  finalScores.innerHTML = '';
  sorted.forEach((t, i) => {
    const item = document.createElement('div');
    item.className = 'final-score-item' + (i === 0 ? ' first' : '');
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🏅';
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