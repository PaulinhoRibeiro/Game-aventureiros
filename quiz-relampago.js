// ============================================
//  QUIZ RELÂMPAGO — Lógica do Jogo
// ============================================

const TEMPO_INICIAL = 15;
const MAX_MULTIPLICADOR = 5;
const TOTAL_RODADAS = 20;

// -------- ESTADO --------
let teams = [];
let currentTeamIndex = 0;
let multiplier = 1;
let currentQuestion = null;
let timeLeft = TEMPO_INICIAL;
let timerId = null;
let rodada = 0;
let answering = false;
let availableQuestions = [];

// -------- DOM --------
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const startBtn = document.getElementById('start-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const teamEmojiEl = document.getElementById('team-emoji');
const teamNameEl = document.getElementById('team-name');
const multiplierEl = document.getElementById('multiplier');
const timerEl = document.getElementById('timer');
const questionTextEl = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedbackEl = document.getElementById('feedback');
const scoreboardEl = document.getElementById('scoreboard');
const winnerDisplay = document.getElementById('winner-display');
const finalScores = document.getElementById('final-scores');

// ============================================
//  INICIAR JOGO
// ============================================
function initGame() {
  teams = EQUIPES_AVENTUREIROS.map(e => ({ ...e, score: 0 }));
  currentTeamIndex = 0;
  multiplier = 1;
  rodada = 0;
  answering = false;
  availableQuestions = embaralharPerguntasComRotacao();

  startScreen.classList.add('hidden');
  endScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');

  updateUI();
  nextQuestion();
}

// ============================================
//  PRÓXIMA PERGUNTA
// ============================================
function nextQuestion() {
  if (rodada >= TOTAL_RODADAS) {
    endGame();
    return;
  }

  rodada++;
  answering = false;

  if (availableQuestions.length === 0) {
    availableQuestions = embaralharPerguntasComRotacao();
  }
  const raw = availableQuestions.shift();
  marcarPerguntaUsada(raw);

  const correct = raw.options[0];
  const shuffled = shuffle([...raw.options]);
  currentQuestion = { text: raw.q, options: shuffled, correct };

  renderQuestion();
  updateUI();
  startTimer();
}

function renderQuestion() {
  questionTextEl.textContent = currentQuestion.text;
  optionsContainer.innerHTML = '';
  feedbackEl.textContent = '';
  feedbackEl.className = 'feedback';

  const letters = ['A', 'B', 'C', 'D'];

  currentQuestion.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.classList.add('option-btn');
    btn.innerHTML = `<span class="letter">${letters[i]}</span><span>${opt}</span>`;
    btn.dataset.option = opt;
    btn.addEventListener('click', () => handleAnswer(btn, opt));
    optionsContainer.appendChild(btn);
  });
}

// ============================================
//  TIMER
// ============================================
function startTimer() {
  clearInterval(timerId);
  timeLeft = TEMPO_INICIAL;
  timerEl.textContent = timeLeft;
  timerEl.classList.remove('warning');

  timerId = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;

    if (timeLeft <= 5 && timeLeft > 0) {
      timerEl.classList.add('warning');
      playSound('tick');
    }

    if (timeLeft <= 0) {
      clearInterval(timerId);
      timeUp();
    }
  }, 1000);
}

function timeUp() {
  if (answering) return;
  answering = true;

  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.disabled = true;
    if (btn.dataset.option === currentQuestion.correct) btn.classList.add('correct');
  });

  playSound('buzz');
  feedbackEl.textContent = `⏱️ Tempo esgotado! Resposta: "${currentQuestion.correct}"`;
  feedbackEl.className = 'feedback wrong';

  setTimeout(() => passTurn(false), 2200);
}

// ============================================
//  RESPOSTA
// ============================================
function handleAnswer(btn, chosen) {
  if (answering) return;
  answering = true;
  clearInterval(timerId);

  const isCorrect = chosen === currentQuestion.correct;

  document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

  if (isCorrect) {
    btn.classList.add('correct');
    const points = multiplier;
    teams[currentTeamIndex].score += points;

    playSound('correct');
    launchConfetti({ count: 40, duration: 1500 });

    feedbackEl.textContent = `✅ Acertou! +${points} ponto${points > 1 ? 's' : ''}`;
    feedbackEl.className = 'feedback correct';

    multiplier = Math.min(multiplier + 1, MAX_MULTIPLICADOR);

    updateUI();
    setTimeout(() => passTurn(true), 1600);
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('.option-btn').forEach(b => {
      if (b.dataset.option === currentQuestion.correct) b.classList.add('correct');
    });

    playSound('wrong');
    feedbackEl.textContent = `❌ Errou! Resposta: "${currentQuestion.correct}"`;
    feedbackEl.className = 'feedback wrong';

    setTimeout(() => passTurn(false), 2200);
  }
}

// ============================================
//  TROCA DE TURNO
// ============================================
function passTurn(acertou) {
  if (!acertou) {
    multiplier = 1;
    currentTeamIndex = (currentTeamIndex + 1) % teams.length;
  }
  updateUI();
  nextQuestion();
}

// ============================================
//  UI
// ============================================
function updateUI() {
  const team = teams[currentTeamIndex];
  teamEmojiEl.textContent = team.emoji;
  teamNameEl.textContent = team.name;
  multiplierEl.textContent = `⚡ ${multiplier}x`;

  scoreboardEl.innerHTML = '';
  teams.forEach((t, i) => {
    const item = document.createElement('div');
    item.className = 'score-item';
    if (i === currentTeamIndex) item.classList.add('active');
    item.innerHTML = `
      <span class="s-emoji">${t.emoji}</span>
      <span>${t.name.replace('Equipe ', '')}</span>
      <span class="s-points">${t.score}</span>
    `;
    scoreboardEl.appendChild(item);
  });
}

// ============================================
//  FIM DE JOGO
// ============================================
function endGame() {
  clearInterval(timerId);
  gameScreen.classList.add('hidden');
  endScreen.classList.remove('hidden');

  const sorted = [...teams].sort((a, b) => b.score - a.score);
  const winner = sorted[0];

  winnerDisplay.textContent = `🥇 ${winner.emoji} ${winner.name} venceu com ${winner.score} pontos!`;

  finalScores.innerHTML = '';
  sorted.forEach((t, i) => {
    const item = document.createElement('div');
    item.className = 'final-score-item' + (i === 0 ? ' first' : '');
    item.innerHTML = `
      <span>${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🏅'} ${t.emoji} ${t.name}</span>
      <span>${t.score} pts</span>
    `;
    finalScores.appendChild(item);
  });

  playSound('win');
  launchConfetti({ count: 250, duration: 5000 });
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

document.addEventListener('keydown', (e) => {
  if (gameScreen.classList.contains('hidden')) return;
  if (answering) return;

  const btns = document.querySelectorAll('.option-btn');
  if (e.key >= '1' && e.key <= '4') {
    const idx = parseInt(e.key) - 1;
    if (btns[idx]) btns[idx].click();
  }
});