// ============================================
//  JOGO DOS AVENTUREIROS — Lógica Completa
// ============================================

// -------- CONFIGURAÇÃO --------
const TEAMS = [
  { name: 'Equipe Urso',    emoji: '🐻', color: '#8D6E63' },
  { name: 'Equipe Coelho',  emoji: '🐰', color: '#F48FB1' },
  { name: 'Equipe Panda',   emoji: '🐼', color: '#90CAF9' },
  { name: 'Equipe Raposa',  emoji: '🦊', color: '#FFB74D' }
];

const BOARD_SIZE = 30;

// Casas especiais (número da casa : tipo)
const SPECIAL_SPACES = {
  3:  'star',
  7:  'dice',
  11: 'rocket',
  15: 'star',
  19: 'dice',
  23: 'rocket',
  27: 'star'
};

// Ícones das casas especiais
const SPACE_ICONS = {
  star:   '⭐',
  dice:   '🎲',
  rocket: '🚀',
  finish: '🏆',
  normal: '🌿'
};

// -------- BANCO DE PERGUNTAS --------
// A primeira opção é SEMPRE a correta (o script embaralha)
const QUESTIONS = [
  { q: 'Qual é o voto dos Aventureiros?', options: ['Por amor a Jesus, farei sempre o meu melhor', 'Por amor a Jesus, serei sempre o primeiro', 'Vou brincar sempre que puder', 'Farei o meu melhor só quando quiser'] },
  { q: 'Qual é a classe dos Aventureiros que tem 6 anos?', options: ['Abelhinhas Laboriosas', 'Luminares', 'Edificadores', 'Mãos Ajudadoras'] },
  { q: 'Qual é a classe dos Aventureiros que tem 7 anos?', options: ['Luminares', 'Abelhinhas Laboriosas', 'Edificadores', 'Mãos Ajudadoras'] },
  { q: 'Qual é a classe dos Aventureiros que tem 8 anos?', options: ['Edificadores', 'Luminares', 'Abelhinhas Laboriosas', 'Mãos Ajudadoras'] },
  { q: 'Qual é a última classe do Clube de Aventureiros?', options: ['Mãos Ajudadoras', 'Edificadores', 'Luminares', 'Abelhinhas Laboriosas'] },
  { q: 'Quantas classes tem o Clube de Aventureiros?', options: ['4', '2', '6', '8'] },
  { q: 'Qual é a cor do lenço dos Aventureiros?', options: ['Vinho', 'Azul', 'Verde', 'Amarelo'] },
  { q: 'O que a cor vinho do lenço representa?', options: ['O sangue de Jesus derramado na cruz', 'A cor do céu', 'A cor da natureza', 'A cor da água'] },
  { q: 'Quais são as cores da bandeira dos Aventureiros?', options: ['Vinho e branco', 'Azul e amarelo', 'Verde e vermelho', 'Preto e branco'] },
  { q: 'O que o branco da bandeira representa?', options: ['Pureza', 'Força', 'Alegria', 'Coragem'] },
  { q: 'Qual é o livro sagrado que aprendemos a amar no clube?', options: ['Bíblia', 'Dicionário', 'Revista', 'Jornal'] },
  { q: 'Quem criou o mundo e tudo o que nele existe?', options: ['Deus', 'O homem', 'Os animais', 'Os anjos'] },
  { q: 'Complete a lei: "Jesus me ajuda a ser..."', options: ['Obediente, puro, reverente, bondoso e colaborador', 'Forte, rápido, esperto e corajoso', 'Obediente, teimoso e desobediente', 'O melhor de todos sempre'] },
  { q: 'O que os Aventureiros ganham ao completar uma especialidade?', options: ['Uma insígnia', 'Um brinquedo', 'Um doce', 'Um diploma de faculdade'] },
  { q: 'Qual é uma categoria de especialidade dos Aventureiros?', options: ['Estudo da Natureza', 'Jogar videogame', 'Assistir televisão', 'Dormir até tarde'] },
  { q: 'Qual é outra categoria de especialidade dos Aventureiros?', options: ['Artes Manuais', 'Futebol de botão', 'Vídeo game', 'Novela'] },
  { q: 'Qual é uma atividade típica do Clube de Aventureiros?', options: ['Oficinas de culinária infantil', 'Aulas de direção', 'Treinamento de tiro', 'Curso de informática avançada'] },
  { q: 'O que as oficinas práticas do clube ensinam?', options: ['Jardinagem e trabalhos manuais', 'Como usar o celular', 'Como dirigir um carro', 'Como jogar cartas de baralho'] },
  { q: 'O que devemos fazer quando encontramos um amigo triste?', options: ['Consolar e ajudar', 'Ignorar', 'Rir dele', 'Fugir'] },
  { q: 'Como devemos tratar nossos colegas?', options: ['Com respeito e carinho', 'Com gritos', 'Com indiferença', 'Com brigas'] },
  { q: 'O que é mais importante em uma equipe?', options: ['Trabalhar juntos', 'Ganhar sozinho', 'Brigar', 'Competir com raiva'] },
  { q: 'O que devemos fazer com nossos brinquedos?', options: ['Compartilhar com os amigos', 'Guardar só para mim', 'Jogar fora', 'Quebrar'] },
  { q: 'O que devemos dizer quando alguém nos ajuda?', options: ['Obrigado', 'Nada', 'Tchau', 'Deixa pra lá'] },
  { q: 'Em um acampamento, o que usamos para nos proteger do sol?', options: ['Boné ou chapéu', 'Guarda-chuva', 'Cachecol', 'Luva'] },
  { q: 'O que usamos para dormir no acampamento?', options: ['Barraca', 'Geladeira', 'Televisão', 'Sofá'] },
  { q: 'O que devemos fazer antes de comer?', options: ['Lavar as mãos', 'Correr', 'Pular', 'Dormir'] },
  { q: 'Qual desses é um alimento saudável?', options: ['Frutas', 'Refrigerante', 'Doces', 'Salgadinhos'] },
  { q: 'O que devemos fazer com o lixo no acampamento?', options: ['Jogar na lixeira', 'Deixar no chão', 'Jogar no rio', 'Enterrar'] },
  { q: 'O que usamos para nos orientar na natureza?', options: ['Bússola', 'Celular', 'Televisão', 'Rádio'] },
  { q: 'No hino dos Aventureiros, somos...', options: ['Aventureiros alegres que confiam no amigo Jesus', 'Aventureiros tristes que não confiam em ninguém', 'Aventureiros bravos que brigam sempre', 'Aventureiros que só querem brincar'] }
];

// -------- ESTADO DO JOGO --------
let teams = [];
let currentTeamIndex = 0;
let availableQuestions = [];
let currentQuestion = null;
let isRolling = false;
let gameOver = false;

// -------- REFERÊNCIAS DOM --------
const boardEl = document.getElementById('board');
const diceEl = document.getElementById('dice');
const rollBtn = document.getElementById('roll-btn');
const scoreboardEl = document.getElementById('scoreboard');
const questionModal = document.getElementById('question-modal');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedbackEl = document.getElementById('feedback');
const continueBtn = document.getElementById('continue-btn');
const questionTeamName = document.getElementById('question-team-name');
const questionSpaceIcon = document.getElementById('question-space-icon');
const winModal = document.getElementById('win-modal');
const winnerDisplay = document.getElementById('winner-display');
const playAgainBtn = document.getElementById('play-again-btn');
const currentTeamNameEl = document.getElementById('current-team-name');
const currentTeamEmojiEl = document.getElementById('current-team-emoji');
const confettiCanvas = document.getElementById('confetti-canvas');

// ============================================
//  INICIALIZAÇÃO
// ============================================
function initGame() {
  teams = TEAMS.map((t, i) => ({
    ...t,
    position: 1,
    points: 0,
    id: i
  }));

  currentTeamIndex = 0;
  availableQuestions = embaralharPerguntasComRotacao();
  gameOver = false;
  isRolling = false;

  createBoard();
  createTokens();
  updateScoreboard();
  updateCurrentTeamDisplay();
  updateTokenPositions();

  diceEl.textContent = '?';
  rollBtn.disabled = false;
  questionModal.classList.add('hidden');
  winModal.classList.add('hidden');
}

// ============================================
//  CRIAÇÃO DO TABULEIRO (layout serpentina)
// ============================================
function createBoard() {
  boardEl.innerHTML = '';
  for (let n = 1; n <= BOARD_SIZE; n++) {
    const space = document.createElement('div');
    space.classList.add('space');
    space.dataset.space = n;

    // Calcula posição na serpentina (5 colunas x 6 linhas)
    const row = Math.ceil(n / 5);
    const posInRow = ((n - 1) % 5) + 1;
    const col = (row % 2 === 1) ? posInRow : (6 - posInRow);
    space.style.gridRow = row;
    space.style.gridColumn = col;

    // Tipo de casa
    let type = 'normal';
    if (n === BOARD_SIZE) type = 'finish';
    else if (SPECIAL_SPACES[n]) type = SPECIAL_SPACES[n];

    if (type !== 'normal') space.classList.add(type);

    // Número da casa
    const num = document.createElement('span');
    num.classList.add('space-number');
    num.textContent = n;
    space.appendChild(num);

    // Ícone
    const icon = document.createElement('span');
    icon.classList.add('space-icon');
    icon.textContent = type === 'finish' ? SPACE_ICONS.finish :
                       (SPACE_ICONS[type] || SPACE_ICONS.normal);
    space.appendChild(icon);

    boardEl.appendChild(space);
  }
}

// ============================================
//  PEÕES
// ============================================
function createTokens() {
  // Remove peões antigos
  document.querySelectorAll('.token').forEach(t => t.remove());

  teams.forEach(team => {
    const token = document.createElement('div');
    token.classList.add('token');
    token.id = `token-${team.id}`;
    token.style.background = team.color;
    token.textContent = team.emoji;
    boardEl.appendChild(token);
  });
}

function updateTokenPositions() {
  const boardRect = boardEl.getBoundingClientRect();
  const boardW = boardRect.width;
  const boardH = boardRect.height;

  teams.forEach((team, index) => {
    const token = document.getElementById(`token-${team.id}`);
    const space = boardEl.querySelector(`[data-space="${team.position}"]`);
    if (!token || !space) return;

    // Calcula posição relativa ao tabuleiro
    const spaceRect = space.getBoundingClientRect();
    let x = spaceRect.left - boardRect.left + spaceRect.width / 2;
    let y = spaceRect.top - boardRect.top + spaceRect.height / 2;

    // Desloca para não sobrepor quando há mais de um peão na casa
    const tokensHere = teams.filter(t => t.position === team.position);
    if (tokensHere.length > 1) {
      const idx = tokensHere.findIndex(t => t.id === team.id);
      const offsets = [
        { dx: -10, dy: -10 }, { dx: 10, dy: -10 },
        { dx: -10, dy: 10 },  { dx: 10, dy: 10 }
      ];
      const off = offsets[idx % 4];
      x += off.dx; y += off.dy;
    }

    token.style.left = `${x}px`;
    token.style.top = `${y}px`;
  });
}

// ============================================
//  PLACAR E EQUIPE ATUAL
// ============================================
function updateScoreboard() {
  scoreboardEl.innerHTML = '';
  teams.forEach((team, i) => {
    const item = document.createElement('div');
    item.classList.add('score-item');
    if (i === currentTeamIndex && !gameOver) item.classList.add('active');
    item.style.borderLeftColor = team.color;
    item.innerHTML = `
      <span class="score-emoji">${team.emoji}</span>
      <span class="score-name">${team.name}</span>
      <span class="score-points">${team.points} pts</span>
    `;
    scoreboardEl.appendChild(item);
  });
}

function updateCurrentTeamDisplay() {
  const team = teams[currentTeamIndex];
  currentTeamNameEl.textContent = team.name;
  currentTeamEmojiEl.textContent = team.emoji;
  document.getElementById('current-team-display').style.borderLeft = `6px solid ${team.color}`;
}

// ============================================
//  ROLAGEM DO DADO
// ============================================
rollBtn.addEventListener('click', async () => {
  if (isRolling || gameOver) return;
  isRolling = true;
  rollBtn.disabled = true;

  const team = teams[currentTeamIndex];
  const finalValue = Math.floor(Math.random() * 6) + 1;

  // Animação de rolagem
  diceEl.classList.add('rolling');
  const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
  const numbers = ['1', '2', '3', '4', '5', '6'];
  for (let i = 0; i < 10; i++) {
    await sleep(60);
    diceEl.textContent = numbers[Math.floor(Math.random() * 6)];
  }
  diceEl.classList.remove('rolling');
  diceEl.textContent = finalValue;
  playSound('dice');

  await sleep(300);

  // Move o peão
  const oldPos = team.position;
  const newPos = Math.min(team.position + finalValue, BOARD_SIZE);
  team.position = newPos;
  updateTokenPositions();
  playSound('move');

  await sleep(500);

  // Chegou ao final?
  if (newPos >= BOARD_SIZE) {
    finishGame(team);
    return;
  }

  // Mostra a pergunta
  showQuestion(team);
});

// ============================================
//  PERGUNTAS
// ============================================
function showQuestion(team) {
  // Sorteia uma pergunta
  if (availableQuestions.length === 0) {
    availableQuestions = embaralharPerguntasComRotacao();
  }
  const qIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions.shift(); marcarPerguntaUsada(currentQuestion);

  // Cabeçalho
  questionTeamName.textContent = `${team.emoji} ${team.name}`;
  const spaceType = SPECIAL_SPACES[team.position] || 'normal';
  questionSpaceIcon.textContent = SPACE_ICONS[spaceType] || '📖';

  // Texto da pergunta
  questionText.textContent = currentQuestion.q;

  // Embaralha alternativas
  const correctAnswer = currentQuestion.options[0];
  const shuffled = shuffle([...currentQuestion.options]);

  // Renderiza botões
  optionsContainer.innerHTML = '';
  feedbackEl.textContent = '';
  feedbackEl.className = '';
  continueBtn.classList.add('hidden');

  shuffled.forEach(opt => {
    const btn = document.createElement('button');
    btn.classList.add('option-btn');
    btn.textContent = opt;
    btn.addEventListener('click', () => handleAnswer(btn, opt, correctAnswer, team));
    optionsContainer.appendChild(btn);
  });

  questionModal.classList.remove('hidden');
}

function handleAnswer(btn, chosen, correct, team) {
  // Desabilita todos os botões
  document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

  const isCorrect = chosen === correct;

  if (isCorrect) {
    btn.classList.add('correct');
    feedbackEl.textContent = '✅ Acertou! +1 ponto';
    feedbackEl.className = 'correct';
    team.points += 1;
    playSound('correct');

    // Aplica efeito da casa especial (bônus)
    const spaceType = SPECIAL_SPACES[team.position];
    if (spaceType === 'star') {
      team.points += 2;
      feedbackEl.textContent = '⭐ ACERTOU! Estrela bônus: +3 pontos no total!';
    } else if (spaceType === 'dice') {
      feedbackEl.textContent = '🎲 ACERTOU! Você ganhou uma jogada extra!';
    } else if (spaceType === 'rocket') {
      setTimeout(async () => {
        team.position = Math.min(team.position + 2, BOARD_SIZE);
        updateTokenPositions();
        playSound('move');
        if (team.position >= BOARD_SIZE) finishGame(team);
      }, 800);
      feedbackEl.textContent = '🚀 ACERTOU! Foguete: avança 2 casas!';
    }
  } else {
    btn.classList.add('wrong');
    // Mostra a correta
    document.querySelectorAll('.option-btn').forEach(b => {
      if (b.textContent === correct) b.classList.add('correct');
    });
    feedbackEl.textContent = `❌ Errou! A resposta era: "${correct}"`;
    feedbackEl.className = 'wrong';
    playSound('wrong');

    // Volta 1 casa (se não estiver na primeira)
    if (team.position > 1) {
      setTimeout(() => {
        team.position -= 1;
        updateTokenPositions();
        playSound('move');
      }, 600);
    }
  }

  updateScoreboard();

  // Botão continuar
  continueBtn.classList.remove('hidden');
  continueBtn.onclick = () => {
    questionModal.classList.add('hidden');

    // Casa "dado": mesma equipe joga de novo
    if (isCorrect && SPECIAL_SPACES[team.position] === 'dice') {
      // Mantém o mesmo time
    } else {
      currentTeamIndex = (currentTeamIndex + 1) % teams.length;
    }

    updateScoreboard();
    updateCurrentTeamDisplay();
    rollBtn.disabled = false;
    isRolling = false;
  };
}

// ============================================
//  FIM DE JOGO
// ============================================
function finishGame(winner) {
  gameOver = true;
  rollBtn.disabled = true;
  winnerDisplay.textContent = `${winner.emoji} ${winner.name} venceu com ${winner.points} pontos! 🏆`;
  winModal.classList.remove('hidden');
  playSound('win');
  launchConfetti();
}

playAgainBtn.addEventListener('click', () => {
  winModal.classList.add('hidden');
  initGame();
});

// ============================================
//  SOM (Web Audio API — sem arquivos externos)
// ============================================
let audioCtx = null;
function ensureAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playSound(type) {
  try {
    ensureAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const now = audioCtx.currentTime;

    function tone(freq, start, duration, wave = 'sine', vol = 0.15) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = wave;
      osc.frequency.setValueAtTime(freq, now + start);
      gain.gain.setValueAtTime(vol, now + start);
      gain.gain.exponentialRampToValueAtTime(0.001, now + start + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + start);
      osc.stop(now + start + duration);
    }

    if (type === 'dice') {
      tone(400, 0, 0.08, 'square');
      tone(600, 0.08, 0.08, 'square');
      tone(800, 0.16, 0.1, 'square');
    } else if (type === 'move') {
      tone(500, 0, 0.1, 'triangle');
      tone(700, 0.1, 0.1, 'triangle');
    } else if (type === 'correct') {
      tone(523, 0, 0.15);    // C5
      tone(659, 0.12, 0.15); // E5
      tone(784, 0.24, 0.25); // G5
    } else if (type === 'wrong') {
      tone(400, 0, 0.2, 'sawtooth');
      tone(300, 0.15, 0.3, 'sawtooth');
    } else if (type === 'win') {
      tone(523, 0, 0.15);
      tone(659, 0.15, 0.15);
      tone(784, 0.30, 0.15);
      tone(1047, 0.45, 0.4);
      tone(784, 0.65, 0.2);
      tone(1047, 0.85, 0.5);
    }
  } catch (e) { /* som é opcional */ }
}

// ============================================
//  CONFETES
// ============================================
function launchConfetti() {
  const canvas = confettiCanvas;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3'];
  const particles = [];

  for (let i = 0; i < 200; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.5,
      w: 8 + Math.random() * 8,
      h: 8 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: 2 + Math.random() * 4,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.2,
      life: 1
    });
  }

  let startTime = performance.now();
  function animate(now) {
    const elapsed = now - startTime;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08; // gravidade
      p.rot += p.vrot;
      if (elapsed > 2500) p.life -= 0.01;

      ctx.save();
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    if (elapsed < 5000) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  requestAnimationFrame(animate);
}

// ============================================
//  UTILITÁRIOS
// ============================================
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Reposiciona peões ao redimensionar a janela
window.addEventListener('resize', updateTokenPositions);

// ============================================
//  START
// ============================================
initGame();