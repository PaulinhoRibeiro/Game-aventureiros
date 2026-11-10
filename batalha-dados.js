// ============================================
//  BATALHA DOS DADOS — Aventureiros
// ============================================

const MAX_HP = 100;
const DICE_MULTIPLIER = 5;

// -------- ESTADO --------
let teams = [];
let currentTeamIndex = 0;
let currentQuestion = null;
let availableQuestions = [];
let gameActive = false;
let answered = false;
let selectedTarget = null;

// -------- DOM --------
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const winScreen = document.getElementById('win-screen');
const startBtn = document.getElementById('start-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const turnIndicator = document.getElementById('turn-indicator');
const turnEmoji = document.getElementById('turn-emoji');
const turnName = document.getElementById('turn-name');
const roundInfoText = document.getElementById('round-info-text');
const arena = document.getElementById('arena');
const questionCard = document.getElementById('question-card');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedbackPanel = document.getElementById('feedback-panel');
const feedbackTitle = document.getElementById('feedback-title');
const feedbackText = document.getElementById('feedback-text');
const nextBtn = document.getElementById('next-btn');

const attackModal = document.getElementById('attack-modal');
const diceDisplay = document.getElementById('dice-display');
const rollAttackBtn = document.getElementById('roll-attack-btn');

const targetModal = document.getElementById('target-modal');
const targetList = document.getElementById('target-list');

const resultModal = document.getElementById('result-modal');
const resultEmoji = document.getElementById('result-emoji');
const resultTitle = document.getElementById('result-title');
const resultText = document.getElementById('result-text');
const resultContinueBtn = document.getElementById('result-continue-btn');

const winEmoji = document.getElementById('win-emoji');
const winTitle = document.getElementById('win-title');
const winMessage = document.getElementById('win-message');
const winStats = document.getElementById('win-stats');

// ============================================
//  INICIAR JOGO
// ============================================
function initGame() {
  teams = EQUIPES_AVENTUREIROS.map((t, i) => ({
    ...t,
    id: i,
    hp: MAX_HP,
    maxHp: MAX_HP,
    alive: true
  }));

  currentTeamIndex = 0;
  currentQuestion = null;
  answered = false;
  selectedTarget = null;
  gameActive = true;
  availableQuestions = embaralharPerguntasComRotacao();

  startScreen.classList.add('hidden');
  winScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  attackModal.classList.add('hidden');
  targetModal.classList.add('hidden');
  resultModal.classList.add('hidden');

  buildArena();
  updateHeader();
  loadQuestion();
}

// ============================================
//  CONSTRUIR ARENA
// ============================================
function buildArena() {
  arena.innerHTML = '';
  teams.forEach(team => {
    const el = document.createElement('div');
    el.className = 'champion';
    el.id = `champion-${team.id}`;
    el.dataset.teamId = team.id;

    el.innerHTML = `
      <div class="champion-emoji">${team.emoji}</div>
      <div class="champion-name">${team.name}</div>
      <div class="hp-bar-container">
        <div class="hp-bar" id="hp-bar-${team.id}" style="width: 100%"></div>
        <div class="hp-text" id="hp-text-${team.id}">${team.hp}/${team.maxHp}</div>
      </div>
    `;

    arena.appendChild(el);
  });

  updateArena();
}

// ============================================
//  ATUALIZAR ARENA
// ============================================
function updateArena() {
  teams.forEach(team => {
    const el = document.getElementById(`champion-${team.id}`);
    const hpBar = document.getElementById(`hp-bar-${team.id}`);
    const hpText = document.getElementById(`hp-text-${team.id}`);

    if (!el || !hpBar || !hpText) return;

    el.classList.remove('active', 'dead', 'eliminated');
    if (team.id === currentTeamIndex && team.alive && gameActive) {
      el.classList.add('active');
    }
    if (!team.alive) {
      el.classList.add('dead', 'eliminated');
    }

    const pct = (team.hp / team.maxHp) * 100;
    hpBar.style.width = `${Math.max(0, pct)}%`;
    hpText.textContent = `${Math.max(0, team.hp)}/${team.maxHp}`;

    hpBar.classList.remove('warning', 'danger');
    if (pct <= 25) hpBar.classList.add('danger');
    else if (pct <= 50) hpBar.classList.add('warning');
  });
}

// ============================================
//  ATUALIZAR CABEÇALHO
// ============================================
function updateHeader() {
  const team = teams[currentTeamIndex];
  turnEmoji.textContent = team.emoji;
  turnName.textContent = `Vez da ${team.name}`;
  turnIndicator.style.borderColor = team.color;

  roundInfoText.textContent = `⚔️ ${teams.filter(t => t.alive).length} equipes na batalha`;
}

// ============================================
//  CARREGAR PERGUNTA
// ============================================
function loadQuestion() {
  if (!gameActive) return;

  answered = false;
  nextBtn.classList.add('hidden');
  feedbackPanel.classList.add('hidden');

  if (availableQuestions.length === 0) {
    availableQuestions = embaralharPerguntasComRotacao();
  }
  currentQuestion = availableQuestions.shift();
  marcarPerguntaUsada(currentQuestion);

  questionText.textContent = currentQuestion.q;
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

  updateHeader();
  updateArena();
}

// ============================================
//  RESPOSTA
// ============================================
function handleAnswer(btn, chosen, correct) {
  if (answered || !gameActive) return;
  answered = true;
  lockOptions();

  const isCorrect = chosen === correct;
  const team = teams[currentTeamIndex];

  if (isCorrect) {
    btn.classList.add('correct');
    playSound('correct');
    launchConfetti({ count: 40, duration: 1200 });

    feedbackPanel.className = 'feedback-panel correct';
    feedbackTitle.textContent = '✅ Acertou!';
    feedbackText.textContent = 'Prepare o ataque! 🎲';

    // Escolhe alvo (ou pula direto se só tem 1 oponente)
    setTimeout(() => chooseTarget(), 700);
  } else {
    btn.classList.add('wrong');
    const correctBtn = Array.from(optionsContainer.querySelectorAll('.option-btn'))
      .find(b => b.dataset.option === correct);
    if (correctBtn) correctBtn.classList.add('correct');

    playSound('wrong');

    feedbackPanel.className = 'feedback-panel wrong';
    feedbackTitle.textContent = '❌ Errou!';
    feedbackText.innerHTML = `A resposta era: <strong>${correct}</strong>.<br>A equipe perdeu a vez.`;

    nextBtn.classList.remove('hidden');
    nextBtn.textContent = 'Próxima Equipe →';
    nextBtn.onclick = nextTurn;
  }
}

function lockOptions() {
  optionsContainer.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
}

// ============================================
//  ESCOLHER ALVO
// ============================================
function chooseTarget() {
  const enemies = teams.filter(t => t.id !== currentTeamIndex && t.alive);

  if (enemies.length === 0) {
    endGame();
    return;
  }

  if (enemies.length === 1) {
    selectedTarget = enemies[0];
    rollDice();
    return;
  }

  // Mais de um inimigo: abre modal de escolha
  targetList.innerHTML = '';
  enemies.forEach(enemy => {
    const btn = document.createElement('button');
    btn.className = 'target-btn';
    btn.innerHTML = `
      <span class="t-emoji">${enemy.emoji}</span>
      <span class="t-name">${enemy.name}</span>
      <span class="t-hp">${enemy.hp} HP</span>
    `;
    btn.onclick = () => {
      selectedTarget = enemy;
      targetModal.classList.add('hidden');
      rollDice();
    };
    targetList.appendChild(btn);
  });

  targetModal.classList.remove('hidden');
}

// ============================================
//  ROLAR DADO
// ============================================
function rollDice() {
  attackModal.classList.remove('hidden');
  diceDisplay.textContent = '?';
  diceDisplay.classList.remove('rolling');
  rollAttackBtn.disabled = false;
  rollAttackBtn.onclick = executeRoll;
}

async function executeRoll() {
  rollAttackBtn.disabled = true;
  diceDisplay.classList.add('rolling');
  playSound('dice');

  // Animação de rolagem
  for (let i = 0; i < 12; i++) {
    await sleep(70);
    diceDisplay.textContent = Math.floor(Math.random() * 6) + 1;
  }

  const finalRoll = Math.floor(Math.random() * 6) + 1;
  diceDisplay.classList.remove('rolling');
  diceDisplay.textContent = finalRoll;

  await sleep(400);

  applyDamage(finalRoll);
}

// ============================================
//  APLICAR DANO
// ============================================
function applyDamage(roll) {
  attackModal.classList.add('hidden');

  const isCritical = roll === 6;
  let damage = roll * DICE_MULTIPLIER;
  if (isCritical) damage *= 2;

  selectedTarget.hp = Math.max(0, selectedTarget.hp - damage);

  // Animação de hit no campeão
  const championEl = document.getElementById(`champion-${selectedTarget.id}`);
  if (championEl) {
    championEl.classList.add('hit');
    setTimeout(() => championEl.classList.remove('hit'), 500);

    // Número de dano flutuante
    const dmgFloat = document.createElement('div');
    dmgFloat.className = 'damage-float';
    dmgFloat.textContent = `-${damage}`;
    if (isCritical) {
      dmgFloat.style.color = '#ffd700';
      dmgFloat.style.fontSize = '3rem';
    }
    championEl.appendChild(dmgFloat);
    setTimeout(() => dmgFloat.remove(), 1600);
  }

  // Verifica eliminação
  if (selectedTarget.hp <= 0) {
    selectedTarget.alive = false;
  }

  updateArena();

  // Modal de resultado
  resultEmoji.textContent = isCritical ? '💥' : '⚔️';
  resultTitle.textContent = isCritical ? 'GOLPE CRÍTICO!' : 'Ataque!';
  resultTitle.className = 'result-title' + (isCritical ? ' critical' : '');
  resultText.innerHTML = `
    <strong>${roll}</strong> no dado${isCritical ? ' (6!)' : ''}<br>
    <strong>${damage} de dano</strong> em ${selectedTarget.emoji} ${selectedTarget.name}!<br>
    ${selectedTarget.alive
      ? `Restam <strong>${selectedTarget.hp} HP</strong>.`
      : `☠️ ${selectedTarget.name} foi <strong>eliminada</strong>!`
    }
  `;

  playSound(isCritical ? 'win' : 'correct');
  if (isCritical) {
    launchConfetti({ count: 100, duration: 2000 });
  }

  resultModal.classList.remove('hidden');

  resultContinueBtn.onclick = () => {
    resultModal.classList.add('hidden');
    checkGameOver();
  };
}

// ============================================
//  VERIFICAR FIM DE JOGO
// ============================================
function checkGameOver() {
  const aliveTeams = teams.filter(t => t.alive);

  if (aliveTeams.length === 1) {
    endGame();
    return;
  }

  if (aliveTeams.length === 0) {
    endGame();
    return;
  }

  nextTurn();
}

// ============================================
//  PRÓXIMO TURNO
// ============================================
function nextTurn() {
  // Pula times eliminados
  let attempts = 0;
  do {
    currentTeamIndex = (currentTeamIndex + 1) % teams.length;
    attempts++;
  } while (!teams[currentTeamIndex].alive && attempts < teams.length);

  if (teams.filter(t => t.alive).length <= 1) {
    endGame();
    return;
  }

  answered = false;
  updateHeader();
  updateArena();
  loadQuestion();
}

// ============================================
//  FIM DE JOGO
// ============================================
function endGame() {
  gameActive = false;
  gameScreen.classList.add('hidden');
  winScreen.classList.remove('hidden');

  const aliveTeams = teams.filter(t => t.alive);
  const winner = aliveTeams[0] || null;

  if (winner) {
    winEmoji.textContent = winner.emoji;
    winTitle.textContent = `🏆 ${winner.name} venceu!`;
    winMessage.innerHTML = `A equipe ${winner.name} foi a última de pé na batalha com <strong>${winner.hp} HP</strong> restantes!`;
    winMessage.style.borderLeftColor = winner.color;
    playSound('win');
    launchConfetti({ count: 350, duration: 6000 });
  } else {
    winEmoji.textContent = '🤝';
    winTitle.textContent = 'Empate!';
    winMessage.textContent = 'Todas as equipes caíram ao mesmo tempo!';
    playSound('buzz');
  }

  // Ranking final
  winStats.innerHTML = '';
  const sorted = [...teams].sort((a, b) => {
    if (a.alive !== b.alive) return a.alive ? -1 : 1;
    return b.hp - a.hp;
  });

  sorted.forEach((t, i) => {
    const item = document.createElement('div');
    item.className = 'stat-item';
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🏅';
    item.innerHTML = `
      <strong>${medal} ${t.emoji}</strong>
      ${t.name}<br>${t.alive ? `${t.hp} HP` : '☠️ Eliminada'}
    `;
    winStats.appendChild(item);
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

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ============================================
//  EVENTOS
// ============================================
startBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);