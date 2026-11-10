// ============================================
//  ROLETA DE DESAFIOS — Lógica do Jogo
// ============================================

const RODADAS_POR_EQUIPE = 2;
const SEGMENT_COUNT = 8;

const SEGMENTS = [
  { type: 'question',  points: 10, icon: '📖', label: '+10' },
  { type: 'challenge', points: 10, icon: '🏃', label: 'Desafio' },
  { type: 'question',  points: 20, icon: '📖', label: '+20' },
  { type: 'bonus',     points: 15, icon: '⭐', label: '+15' },
  { type: 'question',  points: 15, icon: '📖', label: '+15' },
  { type: 'challenge', points: 10, icon: '🏃', label: 'Desafio' },
  { type: 'question',  points: 20, icon: '📖', label: '+20' },
  { type: 'loseTurn',  points: 0,  icon: '😅', label: 'Perde' }
];

const DESAFIOS = [
  'Pule 10 vezes seguidas!',
  'Faça 5 polichinelos!',
  'Equilibre-se em um pé por 15 segundos!',
  'Dê 3 pulos de coelho!',
  'Bata palmas 20 vezes em 10 segundos!',
  'Imite o som de 3 animais!',
  'Faça uma pose de animal e deixe o outro time adivinhar!',
  'Corra até a parede e volte!',
  'Dê um abraço em alguém da sua equipe!',
  'Faça 5 agachamentos!',
  'Estique os braços para o alto e toque o céu 10 vezes!',
  'Faça uma careta e mantenha por 10 segundos!'
];

// -------- ESTADO --------
let teams = [];
let currentTeamIndex = 0;
let roundNumber = 1;
let totalRounds = 0;
let currentRotation = 0;
let isSpinning = false;
let gameOver = false;
let currentSegment = null;
let currentQuestion = null;
let availableQuestions = [];

// -------- DOM --------
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const startBtn = document.getElementById('start-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const spinBtn = document.getElementById('spin-btn');
const wheelEl = document.getElementById('wheel');
const turnIndicator = document.getElementById('turn-indicator');
const turnEmoji = document.getElementById('turn-emoji');
const turnName = document.getElementById('turn-name');
const roundInfoText = document.getElementById('round-info-text');
const scoreboardEl = document.getElementById('scoreboard');

const questionModal = document.getElementById('question-modal');
const questionTeamBadge = document.getElementById('question-team-badge');
const questionPointsBadge = document.getElementById('question-points-badge');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedbackEl = document.getElementById('feedback');
const continueBtn = document.getElementById('continue-btn');

const challengeModal = document.getElementById('challenge-modal');
const challengeTeam = document.getElementById('challenge-team');
const challengeText = document.getElementById('challenge-text');
const challengePoints = document.getElementById('challenge-points');
const challengeDoneBtn = document.getElementById('challenge-done-btn');

const bonusModal = document.getElementById('bonus-modal');
const bonusTeam = document.getElementById('bonus-team');
const bonusPoints = document.getElementById('bonus-points');
const bonusContinueBtn = document.getElementById('bonus-continue-btn');

const loseModal = document.getElementById('lose-modal');
const loseTeam = document.getElementById('lose-team');
const loseContinueBtn = document.getElementById('lose-continue-btn');

const winnerDisplay = document.getElementById('winner-display');
const finalScores = document.getElementById('final-scores');

// ============================================
//  INICIALIZAÇÃO
// ============================================
function initGame() {
  teams = EQUIPES_AVENTUREIROS.map(e => ({ ...e, score: 0 }));
  currentTeamIndex = 0;
  roundNumber = 1;
  totalRounds = teams.length * RODADAS_POR_EQUIPE;
  currentRotation = 0;
  isSpinning = false;
  gameOver = false;
  availableQuestions = embaralharPerguntasComRotacao();

  startScreen.classList.add('hidden');
  endScreen.classList.add('hidden');
  questionModal.classList.add('hidden');
  challengeModal.classList.add('hidden');
  bonusModal.classList.add('hidden');
  loseModal.classList.add('hidden');
  gameScreen.classList.remove('hidden');

  setupWheel();
  updateHeader();
  updateScoreboard();

  spinBtn.disabled = false;
  spinBtn.textContent = '🎡 Girar Roleta';
}

// ============================================
//  CONFIGURAR ROLETA
// ============================================
function setupWheel() {
  wheelEl.innerHTML = '';
  wheelEl.style.transform = 'rotate(0deg)';

  const radiusPercent = 38;

  SEGMENTS.forEach((seg, i) => {
    const angle = (i * (360 / SEGMENT_COUNT) + (360 / SEGMENT_COUNT) / 2) * Math.PI / 180;
    const x = 50 + radiusPercent * Math.sin(angle);
    const y = 50 - radiusPercent * Math.cos(angle);

    const icon = document.createElement('div');
    icon.className = 'wheel-icon';
    icon.style.left = x + '%';
    icon.style.top = y + '%';
    icon.style.transform = 'translate(-50%, -50%) rotate(0deg)';

    icon.innerHTML = `
      <div class="wheel-icon-emoji">${seg.icon}</div>
      <div class="wheel-icon-label">${seg.label}</div>
    `;

    wheelEl.appendChild(icon);
  });
}

// ============================================
//  GIRAR ROLETA
// ============================================
spinBtn.addEventListener('click', spinWheel);

function spinWheel() {
  if (isSpinning || gameOver) return;
  isSpinning = true;
  spinBtn.disabled = true;
  spinBtn.textContent = '🎡 Girando...';

  playSound('dice');

  const segmentIndex = Math.floor(Math.random() * SEGMENT_COUNT);
  currentSegment = SEGMENTS[segmentIndex];

  const segmentCenter = segmentIndex * (360 / SEGMENT_COUNT) + (360 / SEGMENT_COUNT) / 2;
  const baseTarget = 360 - segmentCenter;

  const currentMod = ((currentRotation % 360) + 360) % 360;
  let delta = baseTarget - currentMod;
  if (delta < 0) delta += 360;

  const extraSpins = 5;
  const totalDelta = extraSpins * 360 + delta;
  currentRotation += totalDelta;

  wheelEl.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
  wheelEl.style.transform = `rotate(${currentRotation}deg)`;

  const icons = wheelEl.querySelectorAll('.wheel-icon');
  icons.forEach(icon => {
    icon.style.transform = `translate(-50%, -50%) rotate(${-currentRotation}deg)`;
  });

  setTimeout(() => {
    handleSegment(currentSegment);
  }, 4200);
}

// ============================================
//  HANDLE SEGMENT
// ============================================
function handleSegment(segment) {
  playSound('move');

  if (segment.type === 'question') {
    openQuestionModal(segment.points);
  } else if (segment.type === 'challenge') {
    openChallengeModal(segment.points);
  } else if (segment.type === 'bonus') {
    openBonusModal(segment.points);
  } else if (segment.type === 'loseTurn') {
    openLoseModal();
  }
}

// ============================================
//  PERGUNTA
// ============================================
function openQuestionModal(points) {
  const team = teams[currentTeamIndex];

  if (availableQuestions.length === 0) {
    availableQuestions = embaralharPerguntasComRotacao();
  }
  currentQuestion = availableQuestions.shift();
  marcarPerguntaUsada(currentQuestion);

  questionTeamBadge.textContent = `${team.emoji} ${team.name}`;
  questionPointsBadge.textContent = `+${points} pts`;
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
    btn.addEventListener('click', () => handleAnswer(btn, opt, correct, points));
    optionsContainer.appendChild(btn);
  });

  questionModal.classList.remove('hidden');
  playSound('tick');
}

function handleAnswer(btn, chosen, correct, points) {
  const team = teams[currentTeamIndex];
  const isCorrect = chosen === correct;

  document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

  if (isCorrect) {
    btn.classList.add('correct');
    team.score += points;
    playSound('correct');
    launchConfetti({ count: 60, duration: 1800 });
    feedbackEl.textContent = `✅ Acertou! +${points} pontos!`;
    feedbackEl.className = 'feedback correct';
    updateScoreboard();
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('.option-btn').forEach(b => {
      if (b.dataset.option === correct) b.classList.add('correct');
    });
    playSound('wrong');
    feedbackEl.textContent = `❌ Errou! Resposta: "${correct}"`;
    feedbackEl.className = 'feedback wrong';
  }

  continueBtn.classList.remove('hidden');
  continueBtn.onclick = () => {
    questionModal.classList.add('hidden');
    endTurn();
  };
}

// ============================================
//  DESAFIO FÍSICO
// ============================================
function openChallengeModal(points) {
  const team = teams[currentTeamIndex];
  const desafio = DESAFIOS[Math.floor(Math.random() * DESAFIOS.length)];

  challengeTeam.textContent = `${team.emoji} ${team.name}`;
  challengeText.textContent = desafio;
  challengePoints.textContent = `Vale +${points} pontos!`;

  challengeModal.classList.remove('hidden');
  playSound('tick');

  challengeDoneBtn.onclick = () => {
    team.score += points;
    updateScoreboard();
    playSound('correct');
    launchConfetti({ count: 60, duration: 1500 });
    challengeModal.classList.add('hidden');
    endTurn();
  };
}

// ============================================
//  BÔNUS
// ============================================
function openBonusModal(points) {
  const team = teams[currentTeamIndex];

  bonusTeam.textContent = `${team.emoji} ${team.name}`;
  bonusPoints.textContent = `+${points} pontos!`;

  bonusModal.classList.remove('hidden');
  playSound('win');

  team.score += points;
  updateScoreboard();

  bonusContinueBtn.onclick = () => {
    bonusModal.classList.add('hidden');
    endTurn();
  };
}

// ============================================
//  PERDEU A VEZ
// ============================================
function openLoseModal() {
  const team = teams[currentTeamIndex];
  loseTeam.textContent = `${team.emoji} ${team.name}`;

  loseModal.classList.remove('hidden');
  playSound('buzz');

  loseContinueBtn.onclick = () => {
    loseModal.classList.add('hidden');
    endTurn();
  };
}

// ============================================
//  FIM DE TURNO
// ============================================
function endTurn() {
  roundNumber++;
  isSpinning = false;

  if (roundNumber > totalRounds) {
    endGame();
    return;
  }

  currentTeamIndex = (currentTeamIndex + 1) % teams.length;
  updateHeader();
  updateScoreboard();

  spinBtn.disabled = false;
  spinBtn.textContent = '🎡 Girar Roleta';
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

  if (winner.score === sorted[1]?.score) {
    winnerDisplay.textContent = `🤝 Empate no topo! ${sorted[0].score} pontos.`;
  } else {
    winnerDisplay.textContent = `🥇 ${winner.emoji} ${winner.name} venceu com ${winner.score} pontos!`;
  }

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
//  UI
// ============================================
function updateHeader() {
  const team = teams[currentTeamIndex];
  turnEmoji.textContent = team.emoji;
  turnName.textContent = `Vez da ${team.name}`;
  turnIndicator.style.borderColor = team.color;

  roundInfoText.textContent = `Rodada ${roundNumber} de ${totalRounds}`;
}

function updateScoreboard() {
  scoreboardEl.innerHTML = '';
  teams.forEach((t, i) => {
    const item = document.createElement('div');
    item.className = 'score-item';
    if (i === currentTeamIndex && !gameOver) item.classList.add('active');
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