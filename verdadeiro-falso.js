// ============================================
//  VERDADEIRO OU FALSO — Aventureiros
// ============================================

const TEMPO_PERGUNTA = 15;
const RODADAS_POR_EQUIPE = 3;

// -------- BANCO DE AFIRMAÇÕES --------
const AFIRMACOES = [
  // ===== CLASSES =====
  { texto: 'A primeira classe dos Aventureiros é Abelhinhas Laboriosas.', v: true, explicacao: 'Correto! É a classe das crianças de 6 anos.' },
  { texto: 'A classe dos Aventureiros de 7 anos é chamada Luminares.', v: true, explicacao: 'Correto! Luminares é a classe dos 7 anos.' },
  { texto: 'Edificadores é a classe dos Aventureiros de 9 anos.', v: false, explicacao: 'Falso! Edificadores é para 8 anos. Os de 9 anos são Mãos Ajudadoras.' },
  { texto: 'O Clube de Aventureiros tem apenas 3 classes.', v: false, explicacao: 'Falso! Tem 4 classes: Abelhinhas, Luminares, Edificadores e Mãos Ajudadoras.' },
  { texto: 'Mãos Ajudadoras é a última classe dos Aventureiros.', v: true, explicacao: 'Correto! É a classe das crianças de 9 anos.' },

  // ===== IDEAIS =====
  { texto: 'O voto dos Aventureiros é: "Por amor a Jesus, farei sempre o meu melhor".', v: true, explicacao: 'Correto! Esse é o voto dos Aventureiros.' },
  { texto: 'O lema dos Aventureiros é "Sempre alerta, para servir".', v: true, explicacao: 'Correto! Esse é o lema do clube.' },
  { texto: 'Segundo a lei, Jesus nos ajuda a ser apenas corajoso.', v: false, explicacao: 'Falso! A lei diz: obediente, puro, reverente, bondoso e colaborador.' },
  { texto: 'Jesus nos ajuda a ser obediente, puro, reverente, bondoso e colaborador.', v: true, explicacao: 'Correto! Esses são os 5 valores da lei dos Aventureiros.' },

  // ===== SÍMBOLOS =====
  { texto: 'O lenço dos Aventureiros é azul.', v: false, explicacao: 'Falso! O lenço é vinho, lembrando o sangue de Jesus.' },
  { texto: 'O branco da bandeira representa a pureza.', v: true, explicacao: 'Correto! O branco lembra pureza.' },
  { texto: 'A cor vinho do lenço representa o sangue de Jesus.', v: true, explicacao: 'Correto! É esse o significado da cor vinho.' },
  { texto: 'As cores da bandeira dos Aventureiros são azul e amarelo.', v: false, explicacao: 'Falso! As cores são vinho e branco.' },

  // ===== ESPECIALIDADES =====
  { texto: 'Os Aventureiros ganham uma insígnia ao completar uma especialidade.', v: true, explicacao: 'Correto! As insígnias são colocadas no uniforme.' },
  { texto: 'Estudo da Natureza é uma categoria de especialidade do clube.', v: true, explicacao: 'Correto! É uma das categorias de especialidade.' },
  { texto: 'Artes Manuais NÃO é uma especialidade dos Aventureiros.', v: false, explicacao: 'Falso! Artes Manuais é uma das categorias de especialidade.' },
  { texto: 'Saúde é uma categoria de especialidade dos Aventureiros.', v: true, explicacao: 'Correto! Inclui primeiros socorros e bons hábitos.' },

  // ===== BÍBLIA =====
  { texto: 'A Bíblia é o livro sagrado que aprendemos a amar no clube.', v: true, explicacao: 'Correto! A Bíblia é o livro sagrado dos cristãos.' },
  { texto: 'Quem criou o mundo foi o homem.', v: false, explicacao: 'Falso! Deus criou o mundo e tudo o que nele existe.' },
  { texto: 'Deus criou o mundo em 6 dias.', v: true, explicacao: 'Correto! E no sétimo dia descansou.' },
  { texto: 'O primeiro homem criado por Deus foi Moisés.', v: false, explicacao: 'Falso! O primeiro homem foi Adão.' },
  { texto: 'Noé construiu a arca.', v: true, explicacao: 'Correto! Noé construiu a arca por ordem de Deus.' },
  { texto: 'Jonas foi engolido por um grande peixe.', v: true, explicacao: 'Correto! Jonas ficou 3 dias no peixe.' },
  { texto: 'Moisés abriu o Mar Vermelho.', v: true, explicacao: 'Correto! Deus abriu o mar através de Moisés.' },
  { texto: 'Jesus nasceu em Nazaré.', v: false, explicacao: 'Falso! Jesus nasceu em Belém, mas cresceu em Nazaré.' },
  { texto: 'Jesus teve 12 discípulos.', v: true, explicacao: 'Correto! Eram 12 discípulos.' },
  { texto: 'O maior mandamento é amar a Deus sobre todas as coisas.', v: true, explicacao: 'Correto! E o segundo é amar ao próximo.' },

  // ===== NATUREZA =====
  { texto: 'As abelhas produzem mel.', v: true, explicacao: 'Correto! E também ajudam a polinizar as flores.' },
  { texto: 'A aranha tem 6 patas.', v: false, explicacao: 'Falso! A aranha tem 8 patas. Insetos têm 6.' },
  { texto: 'A baleia-azul é o maior animal do mundo.', v: true, explicacao: 'Correto! Pode chegar a 30 metros de comprimento.' },
  { texto: 'A planta precisa de água e luz do sol para crescer.', v: true, explicacao: 'Correto! Sem eles, a planta não cresce.' },
  { texto: 'O arco-íris tem apenas 3 cores.', v: false, explicacao: 'Falso! O arco-íris tem 7 cores.' },
  { texto: 'O verão é a estação mais quente do ano.', v: true, explicacao: 'Correto! É a estação do calor.' },
  { texto: 'O camaleão é um animal que muda de cor.', v: true, explicacao: 'Correto! Ele muda de cor para se camuflar.' },
  { texto: 'Júpiter é o maior planeta do sistema solar.', v: true, explicacao: 'Correto! É muito maior que a Terra.' },

  // ===== SAÚDE E SEGURANÇA =====
  { texto: 'Devemos escovar os dentes 3 vezes por dia.', v: true, explicacao: 'Correto! Após as principais refeições.' },
  { texto: 'Água é a melhor bebida para a saúde.', v: true, explicacao: 'Correto! Devemos beber bastante água.' },
  { texto: 'Ao andar de bicicleta, não precisamos de capacete.', v: false, explicacao: 'Falso! O capacete é essencial para proteger a cabeça.' },
  { texto: 'Devemos olhar para os dois lados antes de atravessar a rua.', v: true, explicacao: 'Correto! É regra básica de segurança.' },

  // ===== ACAMPAMENTO =====
  { texto: 'No acampamento, usamos barraca para dormir.', v: true, explicacao: 'Correto! A barraca protege do frio e da chuva.' },
  { texto: 'Devemos jogar lixo no chão durante o acampamento.', v: false, explicacao: 'Falso! Devemos jogar o lixo na lixeira e cuidar da natureza.' },
  { texto: 'A bússola ajuda a nos orientar na natureza.', v: true, explicacao: 'Correto! A bússola aponta sempre para o norte.' },

  // ===== EQUIPE E VALORES =====
  { texto: 'Devemos consolar um amigo triste.', v: true, explicacao: 'Correto! Amor ao próximo é o segundo maior mandamento.' },
  { texto: 'Devemos dizer "obrigado" quando alguém nos ajuda.', v: true, explicacao: 'Correto! Gratidão é um valor importante.' },
  { texto: 'O mais importante em uma equipe é ganhar sozinho.', v: false, explicacao: 'Falso! O mais importante é trabalhar juntos.' },

  // ===== HISTÓRIA =====
  { texto: 'O Clube de Aventureiros está ligado à Igreja Adventista do Sétimo Dia.', v: true, explicacao: 'Correto! É um departamento da igreja.' },
  { texto: 'O Clube de Aventureiros foi criado em 1900.', v: false, explicacao: 'Falso! Foi criado em 1972.' },
  { texto: 'O Clube de Aventureiros é para crianças de 6 a 9 anos.', v: true, explicacao: 'Correto! Essa é a faixa etária do clube.' },
  { texto: 'Depois do Clube de Aventureiros, a criança pode entrar no Clube de Desbravadores.', v: true, explicacao: 'Correto! Os Desbravadores são o próximo passo.' }
];

// -------- ESTADO --------
let teams = [];
let currentTeamIndex = 0;
let roundNumber = 1;
let totalRounds = 0;
let availableStatements = [];
let currentStatement = null;
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
const statementText = document.getElementById('statement-text');
const statementCard = document.getElementById('statement-card');
const trueBtn = document.getElementById('true-btn');
const falseBtn = document.getElementById('false-btn');
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
  availableStatements = shuffle([...AFIRMACOES]);

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
  trueBtn.disabled = true;
  falseBtn.disabled = true;
  trueBtn.classList.remove('correct', 'wrong-answer');
  falseBtn.classList.remove('correct', 'wrong-answer');

  if (availableStatements.length === 0) {
    availableStatements = shuffle([...AFIRMACOES]);
  }
  currentStatement = availableStatements.pop();

  // ✅ CORREÇÃO: usa .texto (não .text)
  statementText.textContent = currentStatement.texto;

  statementCard.style.animation = 'none';
  void statementCard.offsetWidth;
  statementCard.style.animation = 'cardPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';

  roundInfoText.textContent = `Rodada ${roundNumber} de ${totalRounds}`;
  updateHeader();

  setTimeout(() => {
    if (!gameActive) return;
    trueBtn.disabled = false;
    falseBtn.disabled = false;
    startTimer();
  }, 600);
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
  trueBtn.disabled = true;
  falseBtn.disabled = true;

  playSound('buzz');
  showFeedback('timeout', '⏱️ Tempo esgotado!', `A resposta correta era: ${currentStatement.v ? '✅ VERDADEIRO' : '❌ FALSO'}.<br><em>${currentStatement.explicacao}</em>`);

  if (currentStatement.v) trueBtn.classList.add('correct');
  else falseBtn.classList.add('correct');

  nextBtn.classList.remove('hidden');
}

// ============================================
//  RESPOSTA
// ============================================
trueBtn.addEventListener('click', () => handleAnswer(true));
falseBtn.addEventListener('click', () => handleAnswer(false));

function handleAnswer(chosen) {
  if (answered || !gameActive) return;
  answered = true;
  clearInterval(timerInterval);

  trueBtn.disabled = true;
  falseBtn.disabled = true;

  const isCorrect = chosen === currentStatement.v;
  const team = teams[currentTeamIndex];

  if (isCorrect) {
    team.score++;
    updateScoreboard();
    playSound('correct');
    launchConfetti({ count: 60, duration: 1500 });

    const btn = chosen ? trueBtn : falseBtn;
    btn.classList.add('correct');

    showFeedback(
      'correct',
      '✅ Acertou!',
      `${team.emoji} ${team.name} marcou 1 ponto.<br><em>${currentStatement.explicacao}</em>`
    );
  } else {
    playSound('wrong');
    const btn = chosen ? trueBtn : falseBtn;
    btn.classList.add('wrong-answer');

    const correctBtn = currentStatement.v ? trueBtn : falseBtn;
    correctBtn.classList.add('correct');

    showFeedback(
      'wrong',
      '❌ Errou!',
      `A resposta certa era: ${currentStatement.v ? '✅ VERDADEIRO' : '❌ FALSO'}.<br><em>${currentStatement.explicacao}</em>`
    );
  }

  nextBtn.classList.remove('hidden');
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