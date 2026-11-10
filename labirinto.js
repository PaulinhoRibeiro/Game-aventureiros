// ============================================
//  LABIRINTO AVENTUREIRO — Ursinho Beto
// ============================================

const TOTAL_STAGES = 5;
const MAX_LIVES = 3;

const STAGES = [
  { icon: '🌲', story: 'O Ursinho Beto chegou à entrada da floresta. De repente, o caminho se divide em dois!' },
  { icon: '🏞️', story: 'Um rio agitado bloqueia o caminho. Só há uma ponte segura para atravessar!' },
  { icon: '⛰️', story: 'Uma montanha alta aparece à frente. Só um caminho leva ao topo sem perigo!' },
  { icon: '🌉', story: 'Uma ponte antiga cruza um abismo profundo. Qual caminho é o mais seguro?' },
  { icon: '🏕️', story: 'Quase lá! O acampamento está logo à frente. Só falta um último desafio!' }
];

// -------- ESTADO --------
let lives = MAX_LIVES;
let currentStage = 0;
let currentQuestion = null;
let availableQuestions = [];
let gameActive = false;
let answered = false;

// -------- DOM --------
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const winScreen = document.getElementById('win-screen');
const loseScreen = document.getElementById('lose-screen');
const startBtn = document.getElementById('start-btn');
const playAgainWin = document.getElementById('play-again-win');
const playAgainLose = document.getElementById('play-again-lose');
const heartsEl = document.getElementById('hearts');
const stageNumEl = document.getElementById('stage-num');
const trailContainer = document.getElementById('trail-container');
const trailNodes = document.getElementById('trail-nodes');
const characterFloat = document.getElementById('character');
const stageStoryEl = document.getElementById('stage-story');
const questionCard = document.getElementById('question-card');
const questionTextEl = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedbackPanel = document.getElementById('feedback-panel');
const feedbackTitle = document.getElementById('feedback-title');
const feedbackText = document.getElementById('feedback-text');
const nextBtn = document.getElementById('next-btn');
const winStatsEl = document.getElementById('win-stats');
const loseStageEl = document.getElementById('lose-stage');

// ============================================
//  INICIAR JOGO
// ============================================
function initGame() {
  lives = MAX_LIVES;
  currentStage = 0;
  answered = false;
  gameActive = true;
  availableQuestions = embaralharPerguntasComRotacao();

  startScreen.classList.add('hidden');
  winScreen.classList.add('hidden');
  loseScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');

  buildTrail();
  updateHearts();
  updateTrail();
  updateHeader();
  loadQuestion();
}

// ============================================
//  CONSTRUIR TRILHA
// ============================================
function buildTrail() {
  trailNodes.innerHTML = '';

  STAGES.forEach((stage, i) => {
    const node = document.createElement('div');
    node.classList.add('trail-node');
    node.dataset.stage = i;
    node.innerHTML = `<span class="node-icon">${stage.icon}</span>`;
    trailNodes.appendChild(node);
  });

  const treasure = document.createElement('div');
  treasure.classList.add('trail-node', 'treasure');
  treasure.dataset.stage = TOTAL_STAGES;
  treasure.innerHTML = '<span class="node-icon">🏆</span>';
  trailNodes.appendChild(treasure);

  // Posiciona o personagem após renderizar
  requestAnimationFrame(() => positionCharacter());
}

// ============================================
//  POSICIONAR O PERSONAGEM
// ============================================
function positionCharacter() {
  const nodes = trailNodes.querySelectorAll('.trail-node');
  const node = nodes[currentStage];
  if (!node) return;

  const nodeRect = node.getBoundingClientRect();
  const containerRect = trailContainer.getBoundingClientRect();

  const centerX = nodeRect.left + nodeRect.width / 2 - containerRect.left;
  characterFloat.style.left = `${centerX}px`;
}

// ============================================
//  ATUALIZAR TRILHA
// ============================================
function updateTrail() {
  const nodes = trailNodes.querySelectorAll('.trail-node');
  nodes.forEach((node, i) => {
    node.classList.remove('current', 'passed');
    if (i < currentStage) node.classList.add('passed');
    else if (i === currentStage) node.classList.add('current');
  });
  positionCharacter();
}

// ============================================
//  ATUALIZAR CORAÇÕES
// ============================================
function updateHearts() {
  heartsEl.innerHTML = '';
  for (let i = 0; i < MAX_LIVES; i++) {
    const h = document.createElement('span');
    h.classList.add('heart');
    h.textContent = i < lives ? '❤️' : '🖤';
    if (i >= lives) h.classList.add('lost');
    heartsEl.appendChild(h);
  }
}

// ============================================
//  ATUALIZAR CABEÇALHO
// ============================================
function updateHeader() {
  if (currentStage >= TOTAL_STAGES) {
    stageNumEl.textContent = '🏆';
  } else {
    stageNumEl.textContent = currentStage + 1;
  }
}

// ============================================
//  CARREGAR PERGUNTA
// ============================================
function loadQuestion() {
  if (currentStage >= TOTAL_STAGES) return;

  answered = false;
  nextBtn.classList.add('hidden');
  feedbackPanel.classList.add('hidden');

  if (availableQuestions.length === 0) {
    availableQuestions = embaralharPerguntasComRotacao();
  }
  currentQuestion = availableQuestions.shift();
  marcarPerguntaUsada(currentQuestion);

  stageStoryEl.textContent = STAGES[currentStage].story;

  questionTextEl.textContent = currentQuestion.q;
  questionCard.style.animation = 'none';
  void questionCard.offsetWidth;
  questionCard.style.animation = 'cardPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';

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
}

// ============================================
//  RESPOSTA
// ============================================
function handleAnswer(btn, chosen, correct) {
  if (answered || !gameActive) return;
  answered = true;
  lockOptions();

  const isCorrect = chosen === correct;

  if (isCorrect) {
    btn.classList.add('correct');
    playSound('correct');
    launchConfetti({ count: 60, duration: 1500 });

    feedbackPanel.className = 'feedback-panel correct';
    feedbackTitle.textContent = '✅ Acertou!';

    if (currentStage === TOTAL_STAGES - 1) {
      feedbackText.textContent = 'O Ursinho chegou ao acampamento! 🏕️';
    } else {
      feedbackText.textContent = 'O Ursinho seguiu o caminho certo!';
    }

    currentStage++;
    updateTrail();
    updateHeader();
    playSound('move');

    setTimeout(() => {
      nextBtn.classList.remove('hidden');
      nextBtn.textContent = currentStage >= TOTAL_STAGES ? 'Ver Tesouro 🏆' : 'Continuar →';
      nextBtn.onclick = () => {
        if (currentStage >= TOTAL_STAGES) {
          winGame();
        } else {
          loadQuestion();
        }
      };
    }, 700);
  } else {
    btn.classList.add('wrong');
    const correctBtn = Array.from(optionsContainer.querySelectorAll('.option-btn'))
      .find(b => b.dataset.option === correct);
    if (correctBtn) correctBtn.classList.add('correct');

    playSound('wrong');
    characterFloat.classList.add('shake');
    setTimeout(() => characterFloat.classList.remove('shake'), 500);

    lives--;
    updateHearts();

    feedbackPanel.className = 'feedback-panel wrong';
    feedbackTitle.textContent = '❌ Errou!';
    feedbackText.innerHTML = `A resposta era: <strong>${correct}</strong>.<br>O Ursinho perdeu uma vida.`;

    nextBtn.classList.remove('hidden');
    nextBtn.textContent = lives > 0 ? 'Tentar Novamente →' : 'Ver Resultado →';
    nextBtn.onclick = () => {
      if (lives <= 0) {
        loseGame();
      } else {
        loadQuestion();
      }
    };
  }
}

function lockOptions() {
  optionsContainer.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
}

// ============================================
//  VITÓRIA
// ============================================
function winGame() {
  gameActive = false;
  gameScreen.classList.add('hidden');
  winScreen.classList.remove('hidden');

  winStatsEl.innerHTML = `
    <div class="stat-item"><strong>${MAX_LIVES - lives}</strong>Vidas perdidas</div>
    <div class="stat-item"><strong>${TOTAL_STAGES}</strong>Estágios completos</div>
    <div class="stat-item"><strong>${lives}</strong>Vidas restantes</div>
  `;

  playSound('win');
  launchConfetti({ count: 300, duration: 6000 });
  setTimeout(() => launchConfetti({ count: 200, duration: 4000 }), 800);
}

// ============================================
//  DERROTA
// ============================================
function loseGame() {
  gameActive = false;
  gameScreen.classList.add('hidden');
  loseScreen.classList.remove('hidden');

  loseStageEl.textContent = `Estágio ${currentStage + 1}`;

  playSound('buzz');
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
playAgainWin.addEventListener('click', initGame);
playAgainLose.addEventListener('click', initGame);

window.addEventListener('resize', positionCharacter);