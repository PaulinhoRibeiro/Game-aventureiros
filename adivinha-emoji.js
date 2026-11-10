// ============================================
//  ADIVINHA O EMOJI — Aventureiros
// ============================================

const TEMPO_PERGUNTA = 20;
const RODADAS_POR_EQUIPE = 3;

// -------- BANCO DE DESAFIOS --------
// emojis: array de strings
// resposta: resposta correta
// erradas: 3 alternativas erradas
// explicacao: mostrada após a resposta
const DESAFIOS = [
  // ===== CLASSES =====
  {
    emojis: ['🐝', '💪'],
    resposta: 'Abelhinhas Laboriosas',
    erradas: ['Edificadores', 'Luminares', 'Mãos Ajudadoras'],
    explicacao: 'Abelhinhas Laboriosas é a classe das crianças de 6 anos.'
  },
  {
    emojis: ['💡', '✨'],
    resposta: 'Luminares',
    erradas: ['Abelhinhas Laboriosas', 'Edificadores', 'Mãos Ajudadoras'],
    explicacao: 'Luminares é a classe das crianças de 7 anos.'
  },
  {
    emojis: ['🏗️', '👷'],
    resposta: 'Edificadores',
    erradas: ['Luminares', 'Abelhinhas Laboriosas', 'Mãos Ajudadoras'],
    explicacao: 'Edificadores é a classe das crianças de 8 anos.'
  },
  {
    emojis: ['🤝', '🙌'],
    resposta: 'Mãos Ajudadoras',
    erradas: ['Edificadores', 'Luminares', 'Abelhinhas Laboriosas'],
    explicacao: 'Mãos Ajudadoras é a classe das crianças de 9 anos.'
  },

  // ===== SÍMBOLOS DO CLUBE =====
  {
    emojis: ['🧣', '❤️'],
    resposta: 'Lenço',
    erradas: ['Bandeira', 'Bíblia', 'Boné'],
    explicacao: 'O lenço vinho lembra o sangue de Jesus derramado na cruz.'
  },
  {
    emojis: ['🚩', '⚪'],
    resposta: 'Bandeira',
    erradas: ['Lenço', 'Boné', 'Camiseta'],
    explicacao: 'A bandeira do clube tem as cores vinho e branco.'
  },
  {
    emojis: ['📖', '✝️'],
    resposta: 'Bíblia',
    erradas: ['Dicionário', 'Revista', 'Jornal'],
    explicacao: 'A Bíblia é o livro sagrado que aprendemos a amar no clube.'
  },
  {
    emojis: ['⭐', '🎁'],
    resposta: 'Estrela (bônus)',
    erradas: ['Foguete', 'Dado', 'Bandeira'],
    explicacao: 'A estrela é uma casa especial que dá pontos em dobro!'
  },
  {
    emojis: ['🎵', '🎶'],
    resposta: 'Hino',
    erradas: ['Bíblia', 'Livro', 'Oração'],
    explicacao: 'O hino é uma das músicas que aprendemos no clube.'
  },

  // ===== NATUREZA =====
  {
    emojis: ['🌳', '🌿'],
    resposta: 'Natureza',
    erradas: ['Cidade', 'Escola', 'Shopping'],
    explicacao: 'A natureza é parte importante do estudo dos Aventureiros.'
  },
  {
    emojis: ['🍯', '🐝'],
    resposta: 'Mel',
    erradas: ['Leite', 'Suco', 'Água'],
    explicacao: 'As abelhas produzem o mel que comemos.'
  },
  {
    emojis: ['🦁', '👑'],
    resposta: 'Leão',
    erradas: ['Tigre', 'Elefante', 'Macaco'],
    explicacao: 'O leão é conhecido como o "rei da selva".'
  },
  {
    emojis: ['🌈', '🌧️'],
    resposta: 'Arco-íris',
    erradas: ['Chuva', 'Sol', 'Nuvem'],
    explicacao: 'O arco-íris tem 7 cores e aparece depois da chuva.'
  },
  {
    emojis: ['☀️', '💧', '🌱'],
    resposta: 'Crescer uma planta',
    erradas: ['Fazer uma fogueira', 'Lavar roupa', 'Tomar banho'],
    explicacao: 'Toda planta precisa de água e luz do sol para crescer.'
  },
  {
    emojis: ['🐟', '🌊'],
    resposta: 'Peixe',
    erradas: ['Pássaro', 'Cachorro', 'Gato'],
    explicacao: 'O peixe é um animal que vive na água.'
  },

  // ===== BÍBLIA E VALORES =====
  {
    emojis: ['❤️', '✝️'],
    resposta: 'Amor de Jesus',
    erradas: ['Amor ao dinheiro', 'Amor aos brinquedos', 'Amor à comida'],
    explicacao: 'O amor de Jesus é o maior tesouro de um Aventureiro.'
  },
  {
    emojis: ['🤝', '👐'],
    resposta: 'Trabalho em equipe',
    erradas: ['Briga', 'Solidão', 'Competição'],
    explicacao: 'O mais importante em uma equipe é trabalhar juntos!'
  },
  {
    emojis: ['🏆', '🥇'],
    resposta: 'Vitória',
    erradas: ['Derrota', 'Empate', 'Desistência'],
    explicacao: 'A vitória é o resultado de esforço e trabalho em equipe.'
  },

  // ===== ACAMPAMENTO E ATIVIDADES =====
  {
    emojis: ['⛺', '🔥'],
    resposta: 'Acampamento',
    erradas: ['Praia', 'Cinema', 'Escola'],
    explicacao: 'No acampamento, montamos barracas e fazemos fogueira (com adulto).'
  },
  {
    emojis: ['🧭', '🗺️'],
    resposta: 'Orientação',
    erradas: ['Cozinhar', 'Dormir', 'Brincar'],
    explicacao: 'A bússola e o mapa ajudam a nos orientar na natureza.'
  },
  {
    emojis: ['🐻', '🐰', '🐼', '🦊'],
    resposta: 'Equipes de animais',
    erradas: ['Zoológico', 'Fazenda', 'Floresta'],
    explicacao: 'Cada equipe dos Aventureiros tem um animal diferente!'
  }
];

// -------- ESTADO --------
let teams = [];
let currentTeamIndex = 0;
let roundNumber = 1;
let totalRounds = 0;
let availableChallenges = [];
let currentChallenge = null;
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
const timerBar = document.getElementById('timer-bar');
const timerNumber = document.getElementById('timer-number');
const emojiDisplay = document.getElementById('emoji-display');
const optionsContainer = document.getElementById('options-container');
const feedbackPanel = document.getElementById('feedback-panel');
const feedbackTitle = document.getElementById('feedback-title');
const feedbackText = document.getElementById('feedback-text');
const nextBtn = document.getElementById('next-btn');
const scoreboardEl = document.getElementById('scoreboard');
const winnerDisplay = document.getElementById('winner-display');
const finalScores = document.getElementById('final-scores');

// ============================================
//  INICIAR JOGO
// ============================================
function initGame() {
  teams = EQUIPES_AVENTUREIROS.map(e => ({ ...e, score: 0 }));
  currentTeamIndex = 0;
  roundNumber = 1;
  totalRounds = teams.length * RODADAS_POR_EQUIPE;
  gameActive = true;
  availableChallenges = shuffle([...DESAFIOS]);

  startScreen.classList.add('hidden');
  endScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');

  updateHeader();
  updateScoreboard();
  nextRound();
}

// ============================================
//  PRÓXIMA RODADA
// ============================================
function nextRound() {
  if (roundNumber > totalRounds) {
    endGame();
    return;
  }

  answered = false;
  nextBtn.classList.add('hidden');
  feedbackPanel.classList.add('hidden');

  if (availableChallenges.length === 0) {
    availableChallenges = shuffle([...DESAFIOS]);
  }
  currentChallenge = availableChallenges.pop();

  // Renderiza emojis
  renderEmojis();

  // Renderiza opções
  renderOptions();

  roundInfoText.textContent = `Rodada ${roundNumber} de ${totalRounds}`;
  updateHeader();

  startTimer();
}

// ============================================
//  RENDERIZAR EMOJIS
// ============================================
function renderEmojis() {
  emojiDisplay.innerHTML = '';
  emojiDisplay.style.animation = 'none';
  void emojiDisplay.offsetWidth;
  emojiDisplay.style.animation = 'emojiPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';

  currentChallenge.emojis.forEach(emoji => {
    const span = document.createElement('span');
    span.classList.add('emoji-item');
    span.textContent = emoji;
    emojiDisplay.appendChild(span);
  });
}

// ============================================
//  RENDERIZAR OPÇÕES
// ============================================
function renderOptions() {
  const allOptions = shuffle([currentChallenge.resposta, ...currentChallenge.erradas]);
  const letters = ['A', 'B', 'C', 'D'];

  optionsContainer.innerHTML = '';
  allOptions.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.classList.add('option-btn');
    btn.innerHTML = `<span class="letter">${letters[i]}</span><span>${opt}</span>`;
    btn.dataset.option = opt;
    btn.disabled = true;
    btn.addEventListener('click', () => handleAnswer(btn, opt));
    optionsContainer.appendChild(btn);
  });

  // Habilita após curto delay
  setTimeout(() => {
    if (!gameActive) return;
    optionsContainer.querySelectorAll('.option-btn').forEach(b => b.disabled = false);
  }, 500);
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
  timerBar.style.width = `${pct}%`;
  timerNumber.textContent = Math.ceil(Math.max(0, timeLeft));

  timerBar.classList.remove('warning', 'danger');
  if (timeLeft <= 5) timerBar.classList.add('danger');
  else if (timeLeft <= 10) timerBar.classList.add('warning');
}

function timeUp() {
  if (answered) return;
  answered = true;
  lockOptions();

  playSound('buzz');
  showFeedback('timeout', '⏱️ Tempo esgotado!', `A resposta correta era: <strong>${currentChallenge.resposta}</strong>.<br><em>${currentChallenge.explicacao}</em>`);

  highlightCorrect();
  nextBtn.classList.remove('hidden');
}

// ============================================
//  RESPOSTA
// ============================================
function handleAnswer(btn, chosen) {
  if (answered || !gameActive) return;
  answered = true;
  clearInterval(timerInterval);
  lockOptions();

  const isCorrect = chosen === currentChallenge.resposta;
  const team = teams[currentTeamIndex];

  if (isCorrect) {
    btn.classList.add('correct');
    team.score++;
    updateScoreboard();
    playSound('correct');
    launchConfetti({ count: 60, duration: 1500 });

    showFeedback(
      'correct',
      '✅ Acertou!',
      `${team.emoji} ${team.name} marcou 1 ponto.<br><em>${currentChallenge.explicacao}</em>`
    );
  } else {
    btn.classList.add('wrong');
    highlightCorrect();
    playSound('wrong');

    showFeedback(
      'wrong',
      '❌ Errou!',
      `A resposta certa era: <strong>${currentChallenge.resposta}</strong>.<br><em>${currentChallenge.explicacao}</em>`
    );
  }

  nextBtn.classList.remove('hidden');
}

function lockOptions() {
  optionsContainer.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
}

function highlightCorrect() {
  optionsContainer.querySelectorAll('.option-btn').forEach(b => {
    if (b.dataset.option === currentChallenge.resposta) b.classList.add('correct');
  });
}

// ============================================
//  FEEDBACK
// ============================================
function showFeedback(type, title, text) {
  feedbackPanel.className = `feedback-panel ${type}`;
  feedbackTitle.textContent = title;
  feedbackText.innerHTML = text;
}

// ============================================
//  BOTÃO PRÓXIMO
// ============================================
nextBtn.addEventListener('click', () => {
  roundNumber++;
  currentTeamIndex = (currentTeamIndex + 1) % teams.length;
  updateHeader();
  updateScoreboard();
  nextRound();
});

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