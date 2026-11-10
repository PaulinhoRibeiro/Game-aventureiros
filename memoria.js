// ============================================
//  JOGO DA MEMÓRIA DOS AVENTUREIROS
// ============================================

// -------- CONFIGURAÇÃO --------
const EQUIPES = EQUIPES_AVENTUREIROS;

// Pares de símbolos do Clube de Aventureiros (12 pares = 24 cartas)
const PARES = [
  { icon: '🐝', label: 'Abelhinha' },
  { icon: '💡', label: 'Luminares' },
  { icon: '🏗️', label: 'Edificadores' },
  { icon: '🤝', label: 'Mãos Ajudadoras' },
  { icon: '🧣', label: 'Lenço' },
  { icon: '🚩', label: 'Bandeira' },
  { icon: '📖', label: 'Bíblia' },
  { icon: '⛺', label: 'Acampamento' },
  { icon: '⭐', label: 'Estrela' },
  { icon: '🎵', label: 'Hino' },
  { icon: '🌿', label: 'Natureza' },
  { icon: '🏆', label: 'Vitória' }
];

const TEMPO_VIRAR_CARTAS = 800; // ms antes de virar de volta

// -------- ESTADO --------
let teams = [];
let currentTeamIndex = 0;
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let totalPairs = PARES.length;
let gameActive = false;

// -------- DOM --------
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const startBtn = document.getElementById('start-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const boardEl = document.getElementById('board');
const turnIndicator = document.getElementById('turn-indicator');
const turnEmoji = document.getElementById('turn-emoji');
const turnName = document.getElementById('turn-name');
const pairsFoundEl = document.getElementById('pairs-found');
const pairsTotalEl = document.getElementById('pairs-total');
const scoreboardEl = document.getElementById('scoreboard');
const matchModal = document.getElementById('match-modal');
const matchEmoji = document.getElementById('match-emoji');
const matchInfo = document.getElementById('match-info');
const matchContinueBtn = document.getElementById('match-continue-btn');
const winnerDisplay = document.getElementById('winner-display');
const finalScores = document.getElementById('final-scores');

// ============================================
//  INICIAR JOGO
// ============================================
function initGame() {
  teams = EQUIPES.map(e => ({ ...e, score: 0 }));
  currentTeamIndex = 0;
  matchedPairs = 0;
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  gameActive = true;

  startScreen.classList.add('hidden');
  endScreen.classList.add('hidden');
  matchModal.classList.add('hidden');
  gameScreen.classList.remove('hidden');

  pairsTotalEl.textContent = totalPairs;
  pairsFoundEl.textContent = '0';

  buildBoard();
  updateHeader();
  updateScoreboard();
}

// ============================================
//  MONTAR TABULEIRO
// ============================================
function buildBoard() {
  // Monta array de cartas (cada par = 2 cartas)
  cards = [];
  PARES.forEach((par, idx) => {
    cards.push({ pairId: idx, ...par });
    cards.push({ pairId: idx, ...par });
  });

  // Embaralha
  cards = shuffle(cards);

  // Renderiza
  boardEl.innerHTML = '';
  cards.forEach((card, i) => {
    const cardEl = document.createElement('div');
    cardEl.classList.add('card');
    cardEl.dataset.index = i;
    cardEl.dataset.pairId = card.pairId;

    cardEl.innerHTML = `
      <div class="card-inner">
        <div class="card-back"></div>
        <div class="card-front">
          <span class="card-icon">${card.icon}</span>
          <span class="card-label">${card.label}</span>
        </div>
      </div>
    `;

    cardEl.addEventListener('click', () => flipCard(cardEl, card));
    boardEl.appendChild(cardEl);
  });
}

// ============================================
//  VIRAR CARTA
// ============================================
function flipCard(cardEl, card) {
  if (!gameActive || lockBoard) return;
  if (cardEl.classList.contains('flipped')) return;
  if (cardEl.classList.contains('matched')) return;

  cardEl.classList.add('flipped');
  playSound('tick');

  if (!firstCard) {
    // Primeira carta
    firstCard = { el: cardEl, data: card };
  } else {
    // Segunda carta
    secondCard = { el: cardEl, data: card };
    lockBoard = true;
    checkMatch();
  }
}

// ============================================
//  VERIFICAR PAR
// ============================================
function checkMatch() {
  const isMatch = firstCard.data.pairId === secondCard.data.pairId;

  if (isMatch) {
    // ✅ Acertou!
    matchedPairs++;
    pairsFoundEl.textContent = matchedPairs;

    firstCard.el.classList.add('matched', 'disabled');
    secondCard.el.classList.add('matched', 'disabled');

    playSound('correct');
    launchConfetti({ count: 40, duration: 1200 });

    teams[currentTeamIndex].score++;
    updateScoreboard();

    // Mostra modal de par encontrado
    setTimeout(() => {
      showMatchModal(firstCard.data);
    }, 500);
  } else {
    // ❌ Errou
    playSound('wrong');
    setTimeout(() => {
      firstCard.el.classList.remove('flipped');
      secondCard.el.classList.remove('flipped');
      resetTurn();
      // Passa a vez
      currentTeamIndex = (currentTeamIndex + 1) % teams.length;
      updateHeader();
      updateScoreboard();
    }, TEMPO_VIRAR_CARTAS);
  }
}

// ============================================
//  MODAL DE PAR ENCONTRADO
// ============================================
function showMatchModal(par) {
  matchEmoji.textContent = par.icon;
  const team = teams[currentTeamIndex];
  matchInfo.innerHTML = `${team.emoji} ${team.name} acertou o par!<br><strong>${par.icon} ${par.label}</strong>`;

  matchModal.classList.remove('hidden');

  matchContinueBtn.onclick = () => {
    matchModal.classList.add('hidden');
    resetTurn();

    // Verifica se o jogo acabou
    if (matchedPairs >= totalPairs) {
      endGame();
      return;
    }

    // A equipe continua jogando (não passa a vez)
  };
}

// ============================================
//  RESET TURNO
// ============================================
function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// ============================================
//  FIM DE JOGO
// ============================================
function endGame() {
  gameActive = false;
  gameScreen.classList.add('hidden');
  endScreen.classList.remove('hidden');

  const sorted = [...teams].sort((a, b) => b.score - a.score);
  const winner = sorted[0];

  // Verifica empate
  const tie = sorted.filter(t => t.score === winner.score).length > 1;

  if (tie) {
    winnerDisplay.textContent = `🤝 Empate no topo! ${winner.score} pares cada.`;
  } else {
    winnerDisplay.textContent = `🥇 ${winner.emoji} ${winner.name} venceu com ${winner.score} pares!`;
  }

  finalScores.innerHTML = '';
  sorted.forEach((t, i) => {
    const item = document.createElement('div');
    item.className = 'final-score-item' + (i === 0 && !tie ? ' first' : '');
    const medal = i === 0 ? (tie ? '🤝' : '🥇') : i === 1 ? '🥈' : i === 2 ? '🥉' : '🏅';
    item.innerHTML = `
      <span>${medal} ${t.emoji} ${t.name}</span>
      <span>${t.score} pares</span>
    `;
    finalScores.appendChild(item);
  });

  playSound('win');
  launchConfetti({ count: 300, duration: 6000 });
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