// ============================================
//  SHOW DO CRISTÃO — Aventureiros
// ============================================

const TEMPO_PERGUNTA = 30;
const TOTAL_NIVEIS = 10;

const VALORES = [1, 2, 3, 5, 8, 12, 20, 30, 50, 100];

// -------- ESTADO --------
let teams = [];
let currentTeamIndex = 0;
let currentLevel = 0;
let currentPrize = 0;
let currentQuestion = null;
let usedQuestions = new Set();
let timeLeft = TEMPO_PERGUNTA;
let timerInterval = null;
let gameActive = false;
let answered = false;

// -------- DOM --------
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const startBtn = document.getElementById('start-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const turnIndicator = document.getElementById('turn-indicator');
const turnEmoji = document.getElementById('turn-emoji');
const turnName = document.getElementById('turn-name');
const roundInfoText = document.getElementById('round-info-text');
const pyramidEl = document.getElementById('pyramid');
const statLevel = document.getElementById('stat-level');
const statValue = document.getElementById('stat-value');
const statTotal = document.getElementById('stat-total');
const timerBox = document.getElementById('timer-box');
const timerFill = document.getElementById('timer-fill');
const timerText = document.getElementById('timer-text');
const questionCard = document.getElementById('question-card');
const questionText = document.getElementById('question-text');
const optionsGrid = document.getElementById('options-grid');
const feedbackPanel = document.getElementById('feedback-panel');
const feedbackIcon = document.getElementById('feedback-icon');
const feedbackTitle = document.getElementById('feedback-title');
const feedbackText = document.getElementById('feedback-text');
const stopBtn = document.getElementById('stop-btn');
const nextBtn = document.getElementById('next-btn');
const scoreboardEl = document.getElementById('scoreboard');
const millionModal = document.getElementById('million-modal');
const millionTeam = document.getElementById('million-team');
const millionPoints = document.getElementById('million-points');
const millionContinueBtn = document.getElementById('million-continue-btn');
const winnerDisplay = document.getElementById('winner-display');
const finalScores = document.getElementById('final-scores');

// ============================================
//  INICIAR JOGO
// ============================================
function initGame() {
  teams = EQUIPES_AVENTUREIROS.map(e => ({ ...e, score: 0 }));
  currentTeamIndex = 0;
  gameActive = true;

  startScreen.classList.add('hidden');
  endScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  millionModal.classList.add('hidden');

  updateScoreboard();
  startTeamRun();
}

// ============================================
//  INICIAR RUN DA EQUIPE
// ============================================
function startTeamRun() {
  currentLevel = 0;
  currentPrize = 0;
  usedQuestions = new Set();

  updateHeader();
  renderPyramid();
  updateStats();
  loadQuestion();
}

// ============================================
//  CARREGAR PERGUNTA
// ============================================
function loadQuestion() {
  if (currentLevel >= TOTAL_NIVEIS) {
    endTeamRun(true);
    return;
  }

  answered = false;
  feedbackPanel.classList.add('hidden');
  stopBtn.classList.add('hidden');
  nextBtn.classList.add('hidden');
  timerBox.style.opacity = '1';

  currentQuestion = pickQuestionForLevel(currentLevel);

  questionText.textContent = currentQuestion.q;
  questionCard.style.animation = 'none';
  void questionCard.offsetWidth;
  questionCard.style.animation = 'cardPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';

  const correct = currentQuestion.options[0];
  const shuffled = shuffle([...currentQuestion.options]);
  const letters = ['A', 'B', 'C', 'D'];

  optionsGrid.innerHTML = '';
  shuffled.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.classList.add('option-btn');
    btn.innerHTML = `<span class="letter">${letters[i]}</span><span>${opt}</span>`;
    btn.dataset.option = opt;
    btn.addEventListener('click', () => handleAnswer(btn, opt, correct));
    optionsGrid.appendChild(btn);
  });

  updateStats();
  renderPyramid();
  startTimer();
}

// ============================================
//  ESCOLHER PERGUNTA POR DIFICULDADE
// ============================================
function pickQuestionForLevel(level) {
  // Níveis 1-3: dificuldade 1
  // Níveis 4-6: dificuldade 1 ou 2
  // Níveis 7-8: dificuldade 2
  // Níveis 9-10: dificuldade 2 ou 3
  let difficulties;
  if (level < 3) difficulties = [1];
  else if (level < 6) difficulties = [1, 2];
  else if (level < 8) difficulties = [2];
  else difficulties = [2, 3];

  let priorizadas = getPerguntasPrioritarias(q =>
    difficulties.includes(q.dificuldade) && !usedQuestions.has(q.q)
  );

  if (priorizadas.length === 0) {
    priorizadas = getPerguntasPrioritarias(q => !usedQuestions.has(q.q));
  }
  if (priorizadas.length === 0) {
    usedQuestions.clear();
    priorizadas = getPerguntasPrioritarias(q => difficulties.includes(q.dificuldade));
  }

  const q = priorizadas[0];
  usedQuestions.add(q.q);
  marcarPerguntaUsada(q);
  return q;
}

// ============================================
//  TIMER
// ============================================
function startTimer() {
  clearInterval(timerInterval);
  timeLeft = TEMPO_PERGUNTA;
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    if (!gameActive || answered) return;
    timeLeft -= 0.1;

    if (timeLeft <= 5 && timeLeft > 0) {
      playSound('tick');
    }

    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timeUp();
    }
  }, 100);
}

function updateTimerDisplay() {
  const pct = Math.max(0, (timeLeft / TEMPO_PERGUNTA) * 100);
  timerFill.style.width = `${pct}%`;
  timerText.textContent = Math.ceil(Math.max(0, timeLeft));

  timerFill.classList.remove('warning', 'danger');
  if (timeLeft <= 5) timerFill.classList.add('danger');
  else if (timeLeft <= 15) timerFill.classList.add('warning');
}

function timeUp() {
  if (answered) return;
  answered = true;
  lockOptions();

  playSound('buzz');

  const correct = currentQuestion.options[0];
  const correctBtn = Array.from(optionsGrid.querySelectorAll('.option-btn'))
    .find(b => b.dataset.option === correct);
  if (correctBtn) correctBtn.classList.add('correct');

  feedbackPanel.className = 'feedback-panel timeout';
  feedbackIcon.textContent = '⏱️';
  feedbackTitle.textContent = 'Tempo esgotado!';
  feedbackText.innerHTML = `A resposta era: <strong>${correct}</strong>.<br>A equipe fica com o prêmio anterior: <strong>${currentPrize} pts</strong>.`;

  stopBtn.classList.add('hidden');
  nextBtn.classList.remove('hidden');
  nextBtn.textContent = 'Próxima Equipe →';
  nextBtn.onclick = endTeamRunWithPrize;
}

// ============================================
//  RESPOSTA
// ============================================
function handleAnswer(btn, chosen, correct) {
  if (answered || !gameActive) return;
  answered = true;
  clearInterval(timerInterval);
  lockOptions();

  const isCorrect = chosen === correct;

  if (isCorrect) {
    btn.classList.add('correct');
    currentPrize = VALORES[currentLevel];
    playSound('correct');
    launchConfetti({ count: 60, duration: 1500 });

    if (currentLevel === TOTAL_NIVEIS - 1) {
      showMillionMoment();
      return;
    }

    feedbackPanel.className = 'feedback-panel correct';
    feedbackIcon.textContent = '✅';
    feedbackTitle.textContent = 'Acertou!';
    feedbackText.innerHTML = `Você garantiu <strong>${currentPrize} pts</strong>.<br>Continuar para a próxima pergunta ou parar?`;

    stopBtn.classList.remove('hidden');
    nextBtn.classList.remove('hidden');
    nextBtn.textContent = `Continuar (pergunta ${currentLevel + 2}) →`;
    nextBtn.onclick = continueRun;
    stopBtn.onclick = endTeamRunWithPrize;
  } else {
    btn.classList.add('wrong');
    const correctBtn = Array.from(optionsGrid.querySelectorAll('.option-btn'))
      .find(b => b.dataset.option === correct);
    if (correctBtn) correctBtn.classList.add('correct');

    playSound('wrong');

    feedbackPanel.className = 'feedback-panel wrong';
    feedbackIcon.textContent = '❌';
    feedbackTitle.textContent = 'Errou!';
    feedbackText.innerHTML = `A resposta era: <strong>${correct}</strong>.<br>A equipe fica com o prêmio anterior: <strong>${currentPrize} pts</strong>.`;

    stopBtn.classList.add('hidden');
    nextBtn.classList.remove('hidden');
    nextBtn.textContent = 'Próxima Equipe →';
    nextBtn.onclick = endTeamRunWithPrize;
  }
}

function lockOptions() {
  optionsGrid.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
}

// ============================================
//  CONTINUAR RUN
// ============================================
function continueRun() {
  currentLevel++;
  loadQuestion();
}

// ============================================
//  MOMENTO MILHÃO
// ============================================
function showMillionMoment() {
  clearInterval(timerInterval);
  const team = teams[currentTeamIndex];
  team.score += VALORES[TOTAL_NIVEIS - 1];
  updateScoreboard();

  playSound('win');
  launchConfetti({ count: 400, duration: 8000 });
  setTimeout(() => launchConfetti({ count: 250, duration: 5000 }), 500);

  millionTeam.textContent = `${team.emoji} ${team.name} acertou a última pergunta!`;
  millionPoints.textContent = `+${VALORES[TOTAL_NIVEIS - 1]} pontos!`;
  millionModal.classList.remove('hidden');

  millionContinueBtn.onclick = () => {
    millionModal.classList.add('hidden');
    nextTeamOrEnd();
  };
}

// ============================================
//  FIM DE UMA RUN
// ============================================
function endTeamRunWithPrize() {
  const team = teams[currentTeamIndex];
  team.score += currentPrize;
  updateScoreboard();

  feedbackPanel.classList.add('hidden');
  stopBtn.classList.add('hidden');
  nextBtn.classList.add('hidden');
  timerBox.style.opacity = '0.3';

  setTimeout(() => {
    nextTeamOrEnd();
  }, 800);
}

// ============================================
//  PRÓXIMA EQUIPE OU FIM
// ============================================
function nextTeamOrEnd() {
  currentTeamIndex++;

  if (currentTeamIndex >= teams.length) {
    endGame();
    return;
  }

  startTeamRun();
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
//  UI
// ============================================
function updateHeader() {
  const team = teams[currentTeamIndex];
  turnEmoji.textContent = team.emoji;
  turnName.textContent = `Vez da ${team.name}`;
  turnIndicator.style.borderColor = team.color;
  roundInfoText.textContent = `Equipe ${currentTeamIndex + 1} de ${teams.length}`;
}

function updateStats() {
  statLevel.textContent = currentLevel + 1;
  statValue.textContent = VALORES[currentLevel];
  statTotal.textContent = currentPrize;
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
      <span class="s-score">${t.score} pt${t.score !== 1 ? 's' : ''}</span>
    `;
    scoreboardEl.appendChild(item);
  });
}

function renderPyramid() {
  pyramidEl.innerHTML = '';
  for (let i = TOTAL_NIVEIS - 1; i >= 0; i--) {
    const level = i + 1;
    const value = VALORES[i];
    const isMillion = i === TOTAL_NIVEIS - 1;

    const el = document.createElement('div');
    el.classList.add('pyramid-level');
    if (isMillion) el.classList.add('million');
    if (i < currentLevel) el.classList.add('passed');
    else if (i === currentLevel) el.classList.add('current');

    el.innerHTML = `
      <span class="level-num">${level}</span>
      <span class="level-value">${value} pt${value !== 1 ? 's' : ''}</span>
    `;
    pyramidEl.appendChild(el);
  }
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