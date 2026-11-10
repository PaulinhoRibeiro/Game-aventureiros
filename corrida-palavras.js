// ============================================
//  CORRIDA DAS PALAVRAS — Aventureiros
// ============================================

const TEMPO_PALAVRA = 30;
const RODADAS_POR_EQUIPE = 3;

// -------- BANCO DE PALAVRAS --------
// Palavras SEM acentos (para funcionar no teclado virtual)
const PALAVRAS = [
  // Símbolos e ideais
  { palavra: 'LENCO', dica: 'O que usamos no pescoço e é vinho' },
  { palavra: 'BANDEIRA', dica: 'Símbolo do clube, com cores vinho e branco' },
  { palavra: 'BIBLIA', dica: 'O livro sagrado dos cristãos' },
  { palavra: 'HINO', dica: 'A música oficial do clube' },
  { palavra: 'VOTO', dica: 'Promessa: "Por amor a Jesus..."' },
  { palavra: 'LEMA', dica: 'Frase curta que nos guia' },
  { palavra: 'ALERTA', dica: 'Primeira palavra do lema' },
  { palavra: 'SERVIR', dica: 'Segunda palavra do lema' },
  { palavra: 'UNIFORME', dica: 'Roupa oficial do clube' },
  { palavra: 'INSIGNIA', dica: 'Ganhamos ao completar uma especialidade' },

  // Bíblia e valores
  { palavra: 'JESUS', dica: 'O melhor amigo dos Aventureiros' },
  { palavra: 'DEUS', dica: 'Quem criou o mundo' },
  { palavra: 'ORACAO', dica: 'Quando falamos com Deus' },
  { palavra: 'AMOR', dica: 'O maior mandamento' },
  { palavra: 'AMIGO', dica: 'Pessoa que nos acompanha e ajuda' },
  { palavra: 'FE', dica: 'Crença em Deus' },
  { palavra: 'PAZ', dica: 'Tranquilidade do coração' },
  { palavra: 'BONDADE', dica: 'Ser gentil e ajudar' },
  { palavra: 'CORAGEM', dica: 'Força para enfrentar o medo' },
  { palavra: 'RESPEITO', dica: 'Tratar bem os outros' },

  // Natureza
  { palavra: 'NATUREZA', dica: 'Tudo o que Deus criou' },
  { palavra: 'FLORESTA', dica: 'Lugar com muitas árvores' },
  { palavra: 'ABELHA', dica: 'Inseto que produz mel' },
  { palavra: 'LEAO', dica: 'Conhecido como "rei da selva"' },
  { palavra: 'ESTRELA', dica: 'Brilha no céu (ou dá bônus no tabuleiro)' },
  { palavra: 'MONTANHA', dica: 'Grande elevação na natureza' },
  { palavra: 'ARVORE', dica: 'Planta grande com tronco e folhas' },
  { palavra: 'FLOR', dica: 'Parte colorida da planta' },

  // Acampamento
  { palavra: 'BARRACA', dica: 'Onde dormimos no acampamento' },
  { palavra: 'FOGUEIRA', dica: 'Fogo do acampamento (com adulto!)' },
  { palavra: 'BUSSOLA', dica: 'Nos ajuda a nos orientar' },
  { palavra: 'LANTERNA', dica: 'Usamos à noite na barraca' },
  { palavra: 'TRILHA', dica: 'Caminho na natureza' },
  { palavra: 'MOCHILA', dica: 'Onde levamos nossas coisas' },

  // Equipe e diversão
  { palavra: 'EQUIPE', dica: 'Grupo que trabalha junto' },
  { palavra: 'UNIAO', dica: 'Estar juntos, fortes como um só' },
  { palavra: 'TESOURO', dica: 'O que os Aventureiros buscam' },
  { palavra: 'VITORIA', dica: 'Ganhar o jogo!' },
  { palavra: 'AVENTURA', dica: 'O que vivemos no clube' },
  { palavra: 'AMIZADE', dica: 'Vínculo entre amigos' },
  { palavra: 'ALEGRIA', dica: 'Sentimento bom de felicidade' }
];

// -------- ESTADO --------
let teams = [];
let currentTeamIndex = 0;
let roundNumber = 1;
let totalRounds = 0;
let availableWords = [];
let currentWord = null;
let currentAnswer = []; // [{ letter, btnIndex }]
let scrambledLetters = []; // [{ letter, btnEl, used }]
let timeLeft = TEMPO_PALAVRA;
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
const timerFill = document.getElementById('timer-fill');
const timerText = document.getElementById('timer-text');
const hintText = document.getElementById('hint-text');
const scrambledLettersEl = document.getElementById('scrambled-letters');
const answerSlotsEl = document.getElementById('answer-slots');
const clearBtn = document.getElementById('clear-btn');
const submitBtn = document.getElementById('submit-btn');
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
  availableWords = shuffle([...PALAVRAS]);

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
  currentAnswer = [];
  nextBtn.classList.add('hidden');
  feedbackPanel.classList.add('hidden');
  timerFill.classList.remove('warning', 'danger');

  if (availableWords.length === 0) {
    availableWords = shuffle([...PALAVRAS]);
  }
  currentWord = availableWords.pop();

  hintText.textContent = currentWord.dica;

  buildScrambledLetters();
  buildAnswerSlots();
  updateSubmitButton();

  roundInfoText.textContent = `Rodada ${roundNumber} de ${totalRounds}`;
  updateHeader();

  startTimer();
}

// ============================================
//  LETRAS EMBARALHADAS
// ============================================
function buildScrambledLetters() {
  const letters = currentWord.palavra.split('');
  let shuffled = shuffle([...letters]);

  // Evita que a palavra já venha na ordem certa
  let attempts = 0;
  while (shuffled.join('') === currentWord.palavra && attempts < 10) {
    shuffled = shuffle([...shuffled]);
    attempts++;
  }

  scrambledLettersEl.innerHTML = '';
  scrambledLetters = [];

  shuffled.forEach((letter, i) => {
    const btn = document.createElement('button');
    btn.className = 'scrambled-letter';
    btn.textContent = letter;
    btn.dataset.index = i;
    btn.dataset.letter = letter;
    btn.addEventListener('click', () => handleLetterClick(i));
    scrambledLettersEl.appendChild(btn);
    scrambledLetters.push({ letter, btnEl: btn, used: false });
  });
}

// ============================================
//  SLOTS DA RESPOSTA
// ============================================
function buildAnswerSlots() {
  answerSlotsEl.innerHTML = '';
  const total = currentWord.palavra.length;

  for (let i = 0; i < total; i++) {
    const slot = document.createElement('div');
    slot.className = 'answer-slot';
    slot.dataset.slotIndex = i;
    slot.addEventListener('click', () => handleSlotClick(i));
    answerSlotsEl.appendChild(slot);
  }
}

// ============================================
//  CLIQUE EM LETRA EMBARALHADA
// ============================================
function handleLetterClick(index) {
  if (!gameActive || answered) return;
  if (scrambledLetters[index].used) return;
  if (currentAnswer.length >= currentWord.palavra.length) return;

  // Pega o próximo slot vazio
  const slotIndex = findNextEmptySlot();
  if (slotIndex === -1) return;

  // Adiciona a letra
  scrambledLetters[index].used = true;
  scrambledLetters[index].btnEl.classList.add('used');

  placeLetterInSlot(slotIndex, index);
  playSound('tick');
}

// ============================================
//  CLIQUE EM SLOT (remover letra)
// ============================================
function handleSlotClick(slotIndex) {
  if (!gameActive || answered) return;
  const existing = currentAnswer.find(a => a.slotIndex === slotIndex);
  if (!existing) return;

  // Devolve a letra
  scrambledLetters[existing.btnIndex].used = false;
  scrambledLetters[existing.btnIndex].btnEl.classList.remove('used');

  currentAnswer = currentAnswer.filter(a => a.slotIndex !== slotIndex);

  const slot = answerSlotsEl.querySelector(`[data-slot-index="${slotIndex}"]`);
  slot.textContent = '';
  slot.classList.remove('filled');
  slot.classList.remove('correct', 'wrong');

  updateSubmitButton();
  playSound('tick');
}

// ============================================
//  COLOCAR LETRA NO SLOT
// ============================================
function placeLetterInSlot(slotIndex, btnIndex) {
  const letter = scrambledLetters[btnIndex].letter;

  // Remove qualquer outra resposta nesse slot (não deveria acontecer, mas protege)
  currentAnswer = currentAnswer.filter(a => a.slotIndex !== slotIndex);
  currentAnswer.push({ slotIndex, btnIndex, letter });

  const slot = answerSlotsEl.querySelector(`[data-slot-index="${slotIndex}"]`);
  slot.textContent = letter;
  slot.classList.add('filled');

  updateSubmitButton();
}

function findNextEmptySlot() {
  const total = currentWord.palavra.length;
  for (let i = 0; i < total; i++) {
    if (!currentAnswer.find(a => a.slotIndex === i)) return i;
  }
  return -1;
}

// ============================================
//  BOTÃO APAGAR
// ============================================
clearBtn.addEventListener('click', () => {
  if (!gameActive || answered) return;

  // Devolve todas as letras
  currentAnswer.forEach(a => {
    scrambledLetters[a.btnIndex].used = false;
    scrambledLetters[a.btnIndex].btnEl.classList.remove('used');
  });
  currentAnswer = [];

  answerSlotsEl.querySelectorAll('.answer-slot').forEach(slot => {
    slot.textContent = '';
    slot.classList.remove('filled', 'correct', 'wrong');
  });

  updateSubmitButton();
  playSound('tick');
});

// ============================================
//  BOTÃO VERIFICAR
// ============================================
function updateSubmitButton() {
  submitBtn.disabled = currentAnswer.length !== currentWord.palavra.length;
}

submitBtn.addEventListener('click', () => {
  if (!gameActive || answered) return;
  if (currentAnswer.length !== currentWord.palavra.length) return;
  checkAnswer();
});

// ============================================
//  VERIFICAR RESPOSTA
// ============================================
function checkAnswer() {
  answered = true;
  clearInterval(timerInterval);
  submitBtn.disabled = true;
  clearBtn.disabled = true;

  const answer = buildAnswerString();
  const isCorrect = answer === currentWord.palavra;

  if (isCorrect) {
    // ✅ Acertou
    const team = teams[currentTeamIndex];
    team.score++;
    updateScoreboard();

    answerSlotsEl.querySelectorAll('.answer-slot').forEach(slot => {
      slot.classList.remove('filled');
      slot.classList.add('correct');
    });

    playSound('correct');
    launchConfetti({ count: 80, duration: 2000 });

    feedbackPanel.className = 'feedback-panel correct';
    feedbackTitle.textContent = '⚡ Acertou!';
    feedbackText.innerHTML = `${team.emoji} ${team.name} marcou 1 ponto!<br>A palavra era: <strong>${currentWord.palavra}</strong>`;

    nextBtn.classList.remove('hidden');
    nextBtn.textContent = 'Próxima Rodada →';
    nextBtn.onclick = advanceRound;
  } else {
    // ❌ Errou
    answerSlotsEl.querySelectorAll('.answer-slot').forEach(slot => {
      slot.classList.remove('filled');
      slot.classList.add('wrong');
    });

    playSound('wrong');

    feedbackPanel.className = 'feedback-panel wrong';
    feedbackTitle.textContent = '❌ Quase!';
    feedbackText.innerHTML = `Vocês montaram <strong>${answer}</strong>, mas a palavra era <strong>${currentWord.palavra}</strong>.`;

    nextBtn.classList.remove('hidden');
    nextBtn.textContent = 'Próxima Equipe →';
    nextBtn.onclick = advanceRound;
  }
}

function buildAnswerString() {
  const total = currentWord.palavra.length;
  const arr = Array(total).fill('');
  currentAnswer.forEach(a => { arr[a.slotIndex] = a.letter; });
  return arr.join('');
}

// ============================================
//  TIMER
// ============================================
function startTimer() {
  clearInterval(timerInterval);
  timeLeft = TEMPO_PALAVRA;
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
  const pct = Math.max(0, (timeLeft / TEMPO_PALAVRA) * 100);
  timerFill.style.width = `${pct}%`;
  timerText.textContent = Math.ceil(Math.max(0, timeLeft));

  timerFill.classList.remove('warning', 'danger');
  if (timeLeft <= 5) timerFill.classList.add('danger');
  else if (timeLeft <= 10) timerFill.classList.add('warning');
}

function timeUp() {
  if (answered) return;
  answered = true;
  submitBtn.disabled = true;
  clearBtn.disabled = true;

  // Mostra a palavra correta
  const correctLetters = currentWord.palavra.split('');
  answerSlotsEl.querySelectorAll('.answer-slot').forEach((slot, i) => {
    slot.textContent = correctLetters[i];
    slot.classList.remove('filled', 'wrong');
    slot.classList.add('correct');
  });

  playSound('buzz');

  feedbackPanel.className = 'feedback-panel timeout';
  feedbackTitle.textContent = '⏱️ Tempo esgotado!';
  feedbackText.innerHTML = `A palavra era: <strong>${currentWord.palavra}</strong>`;

  nextBtn.classList.remove('hidden');
  nextBtn.textContent = 'Próxima Equipe →';
  nextBtn.onclick = advanceRound;
}

// ============================================
//  AVANÇAR RODADA
// ============================================
function advanceRound() {
  roundNumber++;
  currentTeamIndex = (currentTeamIndex + 1) % teams.length;
  updateHeader();
  updateScoreboard();
  nextRound();
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