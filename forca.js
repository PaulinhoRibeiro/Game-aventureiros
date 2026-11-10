// ============================================
//  FORCA DOS AVENTUREIROS
// ============================================

const RODADAS_POR_EQUIPE = 3;
const MAX_ERRORS = 6;

// -------- BANCO DE PALAVRAS --------
// Palavras SEM acentos (fácil de digitar no teclado)
const PALAVRAS = [
  // Símbolos e ideais
  { palavra: 'LENCO', dica: 'O que usamos no pescoço e é vinho' },
  { palavra: 'BANDEIRA', dica: 'Símbolo do clube, com cores vinho e branco' },
  { palavra: 'BIBLIA', dica: 'O livro sagrado dos cristãos' },
  { palavra: 'HINO', dica: 'A música oficial do clube' },
  { palavra: 'VOTO', dica: 'Promessa: "Por amor a Jesus, farei o meu melhor"' },
  { palavra: 'LEI', dica: 'Tem 5 valores: obediente, puro, reverente, bondoso, colaborador' },
  { palavra: 'LEMA', dica: 'Frase curta que nos guia' },
  { palavra: 'ALERTA', dica: 'Primeira palavra do lema' },
  { palavra: 'SERVIR', dica: 'Segunda palavra do lema — ajudar os outros' },

  // Bíblia e valores
  { palavra: 'JESUS', dica: 'O melhor amigo dos Aventureiros' },
  { palavra: 'DEUS', dica: 'Quem criou o mundo e tudo o que existe' },
  { palavra: 'ORACAO', dica: 'Quando falamos com Deus' },
  { palavra: 'AMOR', dica: 'O maior mandamento' },
  { palavra: 'AMIGO', dica: 'Pessoa que nos acompanha e ajuda' },
  { palavra: 'FAMILIA', dica: 'Pessoas que amamos em casa' },
  { palavra: 'CORAGEM', dica: 'Força para enfrentar o medo' },

  // Natureza
  { palavra: 'NATUREZA', dica: 'Tudo o que Deus criou: plantas, animais, rios' },
  { palavra: 'FLORESTA', dica: 'Lugar com muitas árvores' },
  { palavra: 'ABELHA', dica: 'Inseto que produz mel' },
  { palavra: 'LEAO', dica: 'Conhecido como o "rei da selva"' },
  { palavra: 'ESTRELA', dica: 'Brilha no céu ou dá bônus no tabuleiro' },
  { palavra: 'MONTANHA', dica: 'Grande elevação na natureza' },

  // Acampamento
  { palavra: 'ACAMPAMENTO', dica: 'Atividade onde montamos barracas' },
  { palavra: 'BARRACA', dica: 'Onde dormimos durante o acampamento' },
  { palavra: 'FOGUEIRA', dica: 'Fogo do acampamento (feito com adulto!)' },
  { palavra: 'BUSSOLA', dica: 'Nos ajuda a nos orientar na natureza' },
  { palavra: 'LANTERNA', dica: 'Usamos à noite para iluminar a barraca' },

  // Equipe e diversão
  { palavra: 'EQUIPE', dica: 'Grupo que trabalha junto' },
  { palavra: 'UNIAO', dica: 'Estar juntos, fortes como um só' },
  { palavra: 'TESOURO', dica: 'O que os Aventureiros buscam na Sala de Escape' },
  { palavra: 'VITORIA', dica: 'Ganhar o jogo!' },
  { palavra: 'AVENTURA', dica: 'O que vivemos no clube e no acampamento' },
  { palavra: 'DIVERSÃO', dica: 'O que fazemos nos jogos — sem acento: DIVERSÃO' }
];

// Removendo a palavra com problema — DIVERSÃO tem acento/cedilha, vou usar BRINCADEIRA
// Corrigindo: vou substituir por uma palavra sem acento
PALAVRAS[PALAVRAS.length - 1] = { palavra: 'BRINCAR', dica: 'O que mais gostamos de fazer nos jogos' };

// -------- ESTADO --------
let teams = [];
let currentTeamIndex = 0;
let roundNumber = 1;
let totalRounds = 0;
let availableWords = [];
let currentWord = null;
let guessedLetters = new Set();
let wrongLetters = [];
let gameActive = false;
let wordSolved = false;

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
const hintText = document.getElementById('hint-text');
const wordDisplay = document.getElementById('word-display');
const wrongCountEl = document.getElementById('wrong-count');
const keyboardEl = document.getElementById('keyboard');
const feedbackPanel = document.getElementById('feedback-panel');
const feedbackTitle = document.getElementById('feedback-title');
const feedbackText = document.getElementById('feedback-text');
const nextBtn = document.getElementById('next-btn');
const scoreboardEl = document.getElementById('scoreboard');
const winnerDisplay = document.getElementById('winner-display');
const finalScores = document.getElementById('final-scores');

// Partes do corpo do boneco
const BODY_PARTS = ['part-head', 'part-body', 'part-arm-left', 'part-arm-right', 'part-leg-left', 'part-leg-right'];

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

  wordSolved = false;
  guessedLetters = new Set();
  wrongLetters = [];

  nextBtn.classList.add('hidden');
  feedbackPanel.classList.add('hidden');

  if (availableWords.length === 0) {
    availableWords = shuffle([...PALAVRAS]);
  }
  currentWord = availableWords.pop();

  hintText.textContent = currentWord.dica;
  wrongCountEl.textContent = '0';

  renderWord();
  renderKeyboard();
  resetGallows();

  roundInfoText.textContent = `Rodada ${roundNumber} de ${totalRounds}`;
  updateHeader();
}

// ============================================
//  RENDERIZAR PALAVRA
// ============================================
function renderWord() {
  wordDisplay.innerHTML = '';
  for (let i = 0; i < currentWord.palavra.length; i++) {
    const letter = currentWord.palavra[i];
    const slot = document.createElement('div');
    slot.classList.add('letter-slot');
    slot.dataset.index = i;

    if (guessedLetters.has(letter)) {
      slot.textContent = letter;
      slot.classList.add('revealed');
    } else {
      slot.textContent = '';
    }

    wordDisplay.appendChild(slot);
  }
}

function revealLetters(letter) {
  const slots = wordDisplay.querySelectorAll('.letter-slot');
  currentWord.palavra.split('').forEach((l, i) => {
    if (l === letter && slots[i]) {
      slots[i].textContent = letter;
      slots[i].classList.add('revealed');
    }
  });
}

// ============================================
//  RENDERIZAR TECLADO
// ============================================
function renderKeyboard() {
  keyboardEl.innerHTML = '';
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  letters.forEach(letter => {
    const key = document.createElement('button');
    key.classList.add('key');
    key.textContent = letter;
    key.dataset.letter = letter;

    // Se já foi usada, marca como correta ou errada
    if (guessedLetters.has(letter)) {
      key.disabled = true;
      if (currentWord.palavra.includes(letter)) {
        key.classList.add('correct');
      } else {
        key.classList.add('wrong');
      }
    }

    key.addEventListener('click', () => handleLetterClick(letter, key));
    keyboardEl.appendChild(key);
  });
}

// ============================================
//  CLIQUE EM LETRA
// ============================================
function handleLetterClick(letter, keyEl) {
  if (!gameActive || wordSolved) return;
  if (guessedLetters.has(letter)) return;

  guessedLetters.add(letter);
  keyEl.disabled = true;

  const isCorrect = currentWord.palavra.includes(letter);

  if (isCorrect) {
    keyEl.classList.add('correct');
    playSound('tick');
    revealLetters(letter);
    checkWin();
  } else {
    keyEl.classList.add('wrong');
    wrongLetters.push(letter);
    wrongCountEl.textContent = wrongLetters.length;
    playSound('wrong');

    // Revela próxima parte do boneco
    const partIndex = wrongLetters.length - 1;
    if (partIndex < BODY_PARTS.length) {
      const part = document.getElementById(BODY_PARTS[partIndex]);
      if (part) part.classList.add('visible');
    }

    checkLose();
  }
}

// ============================================
//  VERIFICAR VITÓRIA
// ============================================
function checkWin() {
  const allRevealed = currentWord.palavra.split('').every(l => guessedLetters.has(l));
  if (!allRevealed) return;

  wordSolved = true;
  lockKeyboard();

  const team = teams[currentTeamIndex];
  team.score++;
  updateScoreboard();

  playSound('correct');
  launchConfetti({ count: 120, duration: 2500 });

  showFeedback(
    'correct',
    '🎉 Acertaram a palavra!',
    `${team.emoji} ${team.name} marcou 1 ponto!<br>A palavra era: <strong>${currentWord.palavra}</strong>`
  );

  nextBtn.classList.remove('hidden');
}

// ============================================
//  VERIFICAR DERROTA
// ============================================
function checkLose() {
  if (wrongLetters.length < MAX_ERRORS) return;
  if (wordSolved) return;

  wordSolved = true;
  lockKeyboard();

  playSound('buzz');

  // Revela a palavra toda
  const slots = wordDisplay.querySelectorAll('.letter-slot');
  currentWord.palavra.split('').forEach((l, i) => {
    if (slots[i]) {
      slots[i].textContent = l;
      slots[i].classList.add('revealed');
    }
  });

  // Marca as letras restantes no teclado como erradas? Não — mantém só as usadas.
  showFeedback(
    'wrong',
    '💀 Forca!',
    `A equipe não conseguiu. A palavra era: <strong>${currentWord.palavra}</strong>`
  );

  nextBtn.classList.remove('hidden');
}

function lockKeyboard() {
  keyboardEl.querySelectorAll('.key').forEach(k => k.disabled = true);
}

function resetGallows() {
  BODY_PARTS.forEach(id => {
    const part = document.getElementById(id);
    if (part) part.classList.remove('visible');
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