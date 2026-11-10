// ============================================
//  JOGO DA VELHA DOS AVENTUREIROS
// ============================================

const TEAMS = EQUIPES_AVENTUREIROS.slice(0, 2).map((t, i) => ({
  ...t,
  symbol: i === 0 ? 'X' : 'O',
  class: i === 0 ? 'team-x' : 'team-o'
}));

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

const CELL_NAMES = [
  'canto superior esquerdo', 'centro superior', 'canto superior direito',
  'meio esquerdo', 'centro', 'meio direito',
  'canto inferior esquerdo', 'centro inferior', 'canto inferior direito'
];

const RODADAS_PARA_VENCER = 3;
const RODADAS_MAXIMAS = 5;

// -------- ESTADO --------
let board = Array(9).fill(null);
let currentTeamIndex = 0;
let roundNumber = 1;
let seriesWins = [0, 0];
let roundActive = true;
let currentCellIndex = null;
let currentQuestion = null;
let availableQuestions = [];

// -------- DOM --------
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const startBtn = document.getElementById('start-btn');
const boardEl = document.getElementById('board');
const turnIndicator = document.getElementById('turn-indicator');
const turnEmoji = document.getElementById('turn-emoji');
const turnName = document.getElementById('turn-name');
const roundNumberEl = document.getElementById('round-number');
const seriesScoreEl = document.getElementById('series-score');
const seriesFooter = document.getElementById('series-footer');

const questionModal = document.getElementById('question-modal');
const questionTeamBadge = document.getElementById('question-team-badge');
const questionCellBadge = document.getElementById('question-cell-badge');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedbackEl = document.getElementById('feedback');
const continueBtn = document.getElementById('continue-btn');

const roundEndModal = document.getElementById('round-end-modal');
const roundEndTitle = document.getElementById('round-end-title');
const roundEndWinner = document.getElementById('round-end-winner');
const roundEndScore = document.getElementById('round-end-score');
const nextRoundBtn = document.getElementById('next-round-btn');

const gameEndModal = document.getElementById('game-end-modal');
const gameEndWinner = document.getElementById('game-end-winner');
const gameEndScore = document.getElementById('game-end-score');
const playAgainBtn = document.getElementById('play-again-btn');

// ============================================
//  POPULAR NOMES NA TELA INICIAL
// ============================================
const teamXLabel = document.getElementById('team-x-label');
const teamOLabel = document.getElementById('team-o-label');
if (teamXLabel) teamXLabel.textContent = `${TEAMS[0].emoji} ${TEAMS[0].name} (X)`;
if (teamOLabel) teamOLabel.textContent = `${TEAMS[1].emoji} ${TEAMS[1].name} (O)`;

// ============================================
//  INICIAR SÉRIE
// ============================================
function initGame() {
  seriesWins = [0, 0];
  roundNumber = 1;

  startScreen.classList.add('hidden');
  gameEndModal.classList.add('hidden');
  roundEndModal.classList.add('hidden');
  questionModal.classList.add('hidden');
  gameScreen.classList.remove('hidden');

  startRound();
}

// ============================================
//  INICIAR RODADA
// ============================================
function startRound() {
  board = Array(9).fill(null);
  roundActive = true;
  availableQuestions = embaralharPerguntasComRotacao();

  currentTeamIndex = (roundNumber - 1) % 2;

  renderBoard();
  updateHeader();
  updateSeriesFooter();
}

// ============================================
//  RENDERIZAR TABULEIRO
// ============================================
function renderBoard() {
  boardEl.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('button');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', () => handleCellClick(i));
    boardEl.appendChild(cell);
  }
}

// ============================================
//  CLIQUE NA CASA
// ============================================
function handleCellClick(index) {
  if (!roundActive) return;
  if (board[index] !== null) return;

  currentCellIndex = index;

  if (availableQuestions.length === 0) {
    availableQuestions = embaralharPerguntasComRotacao();
  }
  currentQuestion = availableQuestions.shift();
  marcarPerguntaUsada(currentQuestion);

  openQuestionModal();
}

function openQuestionModal() {
  const team = TEAMS[currentTeamIndex];

  questionTeamBadge.textContent = `${team.emoji} ${team.name}`;
  questionTeamBadge.style.background = `linear-gradient(135deg, ${team.color}, ${team.color}cc)`;
  questionCellBadge.textContent = `📍 ${CELL_NAMES[currentCellIndex]}`;

  questionText.textContent = currentQuestion.q;
  feedbackEl.textContent = '';
  feedbackEl.className = 'feedback';
  continueBtn.classList.add('hidden');

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
function handleAnswer(btn, chosen, correct) {
  const isCorrect = chosen === correct;
  const team = TEAMS[currentTeamIndex];

  document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

  if (isCorrect) {
    btn.classList.add('correct');
    feedbackEl.textContent = `✅ Acertou! ${team.emoji} ${team.name} marca a casa!`;
    feedbackEl.className = 'feedback correct';
    playSound('correct');
    launchConfetti({ count: 50, duration: 1500 });

    continueBtn.onclick = () => {
      questionModal.classList.add('hidden');
      markCell(currentCellIndex, team.symbol);
      checkGameState(true);
    };
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('.option-btn').forEach(b => {
      if (b.dataset.option === correct) b.classList.add('correct');
    });
    feedbackEl.textContent = `❌ Errou! Resposta: "${correct}". A vez passa para o outro time.`;
    feedbackEl.className = 'feedback wrong';
    playSound('wrong');

    continueBtn.onclick = () => {
      questionModal.classList.add('hidden');
      checkGameState(false);
    };
  }

  continueBtn.classList.remove('hidden');
}

// ============================================
//  MARCAR CASA
// ============================================
function markCell(index, symbol) {
  board[index] = symbol;
  const cell = boardEl.querySelector(`[data-index="${index}"]`);
  cell.classList.add('marked');
  cell.classList.add(symbol === 'X' ? 'x' : 'o');
  cell.textContent = symbol;
  cell.disabled = true;
  playSound('move');
}

// ============================================
//  VERIFICAR ESTADO DO JOGO
// ============================================
function checkGameState(acertou) {
  const winner = getWinner();

  if (winner) {
    endRound(winner);
    return;
  }

  if (board.every(c => c !== null)) {
    endRound(null);
    return;
  }

  currentTeamIndex = 1 - currentTeamIndex;
  updateHeader();
}

function getWinner() {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { symbol: board[a], line };
    }
  }
  return null;
}

// ============================================
//  FIM DE RODADA
// ============================================
function endRound(winner) {
  roundActive = false;

  document.querySelectorAll('.cell').forEach(c => c.disabled = true);

  if (winner) {
    winner.line.forEach(idx => {
      const cell = boardEl.querySelector(`[data-index="${idx}"]`);
      cell.classList.add('winning');
    });

    const winningTeamIndex = winner.symbol === 'X' ? 0 : 1;
    seriesWins[winningTeamIndex]++;
    const team = TEAMS[winningTeamIndex];

    playSound('win');
    launchConfetti({ count: 200, duration: 3500 });

    setTimeout(() => {
      if (seriesWins[0] >= RODADAS_PARA_VENCER || seriesWins[1] >= RODADAS_PARA_VENCER || (seriesWins[0] + seriesWins[1]) >= RODADAS_MAXIMAS) {
        endGameSeries();
      } else {
        showRoundEndModal(team);
      }
    }, 1200);
  } else {
    setTimeout(() => {
      if ((seriesWins[0] + seriesWins[1]) >= RODADAS_MAXIMAS) {
        endGameSeries();
      } else {
        showRoundEndModal(null);
      }
    }, 800);
  }
}

function showRoundEndModal(winner) {
  if (winner) {
    roundEndTitle.textContent = '🎉 Rodada vencida!';
    roundEndWinner.textContent = `${winner.emoji} ${winner.name} marcou 3 em linha!`;
  } else {
    roundEndTitle.textContent = '🤝 Empate!';
    roundEndWinner.textContent = 'Ninguém marcou 3 em linha nesta rodada.';
  }
  roundEndScore.textContent = `${seriesWins[0]} × ${seriesWins[1]}`;

  nextRoundBtn.textContent = (seriesWins[0] + seriesWins[1] >= RODADAS_MAXIMAS)
    ? '▶ Ver Resultado Final'
    : '▶ Próxima Rodada';

  nextRoundBtn.onclick = () => {
    roundEndModal.classList.add('hidden');
    roundNumber++;
    startRound();
  };

  roundEndModal.classList.remove('hidden');
}

// ============================================
//  FIM DA SÉRIE
// ============================================
function endGameSeries() {
  gameScreen.classList.add('hidden');
  gameEndModal.classList.remove('hidden');

  const teamX = TEAMS[0];
  const teamO = TEAMS[1];

  if (seriesWins[0] > seriesWins[1]) {
    gameEndWinner.textContent = `🥇 ${teamX.emoji} ${teamX.name} é a grande vencedora!`;
  } else if (seriesWins[1] > seriesWins[0]) {
    gameEndWinner.textContent = `🥇 ${teamO.emoji} ${teamO.name} é a grande vencedora!`;
  } else {
    gameEndWinner.textContent = `🤝 Empate na série! ${seriesWins[0]} × ${seriesWins[1]}`;
  }

  gameEndScore.textContent = `${seriesWins[0]} × ${seriesWins[1]}`;

  playSound('win');
  launchConfetti({ count: 300, duration: 6000 });
}

// ============================================
//  UI
// ============================================
function updateHeader() {
  const team = TEAMS[currentTeamIndex];
  turnEmoji.textContent = team.emoji;
  turnName.textContent = `Vez da ${team.name}`;
  turnIndicator.className = `turn-indicator ${team.class}`;

  roundNumberEl.textContent = `Rodada ${roundNumber}`;
  seriesScoreEl.textContent = `${seriesWins[0]} × ${seriesWins[1]}`;
}

function updateSeriesFooter() {
  seriesFooter.innerHTML = '';
  TEAMS.forEach((team, i) => {
    const item = document.createElement('div');
    item.className = `series-score-item ${team.class}`;
    item.innerHTML = `
      <span class="s-emoji">${team.emoji}</span>
      <span>${team.name.replace('Equipe ', '')}</span>
      <span class="s-count">${seriesWins[i]}</span>
    `;
    seriesFooter.appendChild(item);
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