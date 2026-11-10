// ============================================
//  BANCO DE PERGUNTAS + ROTAÇÃO INTELIGENTE
//  Total: 250 perguntas em 10 categorias
// ============================================

const PERGUNTAS_AVENTUREIROS = [

  // ==========================================
  //  CLASSES E IDADES (25 perguntas)
  // ==========================================
  { q: 'Qual é a classe dos Aventureiros que tem 6 anos?', options: ['Abelhinhas Laboriosas', 'Luminares', 'Edificadores', 'Mãos Ajudadoras'], categoria: 'classes', dificuldade: 1 },
  { q: 'Qual é a classe dos Aventureiros que tem 7 anos?', options: ['Luminares', 'Abelhinhas Laboriosas', 'Edificadores', 'Mãos Ajudadoras'], categoria: 'classes', dificuldade: 1 },
  { q: 'Qual é a classe dos Aventureiros que tem 8 anos?', options: ['Edificadores', 'Luminares', 'Abelhinhas Laboriosas', 'Mãos Ajudadoras'], categoria: 'classes', dificuldade: 1 },
  { q: 'Qual é a classe dos Aventureiros que tem 9 anos?', options: ['Mãos Ajudadoras', 'Edificadores', 'Luminares', 'Abelhinhas Laboriosas'], categoria: 'classes', dificuldade: 1 },
  { q: 'Qual é a última classe do Clube de Aventureiros?', options: ['Mãos Ajudadoras', 'Edificadores', 'Luminares', 'Abelhinhas Laboriosas'], categoria: 'classes', dificuldade: 1 },
  { q: 'Qual é a primeira classe do Clube de Aventureiros?', options: ['Abelhinhas Laboriosas', 'Luminares', 'Edificadores', 'Mãos Ajudadoras'], categoria: 'classes', dificuldade: 1 },
  { q: 'Quantas classes tem o Clube de Aventureiros?', options: ['4', '2', '6', '8'], categoria: 'classes', dificuldade: 1 },
  { q: 'Qual classe vem depois das Abelhinhas Laboriosas?', options: ['Luminares', 'Edificadores', 'Mãos Ajudadoras', 'Nenhuma'], categoria: 'classes', dificuldade: 2 },
  { q: 'Qual classe vem antes das Mãos Ajudadoras?', options: ['Edificadores', 'Luminares', 'Abelhinhas Laboriosas', 'Nenhuma'], categoria: 'classes', dificuldade: 2 },
  { q: 'Qual classe vem depois dos Luminares?', options: ['Edificadores', 'Mãos Ajudadoras', 'Abelhinhas Laboriosas', 'Nenhuma'], categoria: 'classes', dificuldade: 2 },
  { q: 'As classes dos Aventureiros são divididas de acordo com o quê?', options: ['A idade', 'A altura', 'A cor do cabelo', 'O time do coração'], categoria: 'classes', dificuldade: 2 },
  { q: 'Uma criança de 7 anos está em qual classe?', options: ['Luminares', 'Abelhinhas Laboriosas', 'Edificadores', 'Mãos Ajudadoras'], categoria: 'classes', dificuldade: 2 },
  { q: 'Uma criança de 9 anos está em qual classe?', options: ['Mãos Ajudadoras', 'Luminares', 'Edificadores', 'Abelhinhas Laboriosas'], categoria: 'classes', dificuldade: 2 },
  { q: 'Abelhinhas Laboriosas é para crianças de quantos anos?', options: ['6 anos', '7 anos', '8 anos', '9 anos'], categoria: 'classes', dificuldade: 2 },
  { q: 'Edificadores é para crianças de quantos anos?', options: ['8 anos', '6 anos', '7 anos', '9 anos'], categoria: 'classes', dificuldade: 2 },
  { q: 'Qual classe tem nome de um inseto?', options: ['Abelhinhas Laboriosas', 'Luminares', 'Edificadores', 'Mãos Ajudadoras'], categoria: 'classes', dificuldade: 1 },
  { q: 'Qual classe tem nome ligado a luz?', options: ['Luminares', 'Abelhinhas Laboriosas', 'Edificadores', 'Mãos Ajudadoras'], categoria: 'classes', dificuldade: 1 },
  { q: 'Qual classe tem nome ligado a construção?', options: ['Edificadores', 'Luminares', 'Abelhinhas Laboriosas', 'Mãos Ajudadoras'], categoria: 'classes', dificuldade: 1 },
  { q: 'Qual classe tem nome ligado a ajudar?', options: ['Mãos Ajudadoras', 'Edificadores', 'Luminares', 'Abelhinhas Laboriosas'], categoria: 'classes', dificuldade: 1 },
  { q: 'Antes de ser Edificador, a criança foi...', options: ['Luminar', 'Abelhinha', 'Mão Ajudadora', 'Nenhuma'], categoria: 'classes', dificuldade: 3 },
  { q: 'A criança de 6 anos deve se juntar a qual classe?', options: ['Abelhinhas Laboriosas', 'Luminares', 'Edificadores', 'Mãos Ajudadoras'], categoria: 'classes', dificuldade: 1 },
  { q: 'Quando termina as Abelhinhas, a próxima classe é...', options: ['Luminares', 'Edificadores', 'Mãos Ajudadoras', 'Nenhuma'], categoria: 'classes', dificuldade: 2 },
  { q: 'Os Luminares vêm em qual posição na ordem das classes?', options: ['Segunda', 'Primeira', 'Terceira', 'Quarta'], categoria: 'classes', dificuldade: 2 },
  { q: 'As Mãos Ajudadoras vêm em qual posição na ordem?', options: ['Quarta', 'Primeira', 'Segunda', 'Terceira'], categoria: 'classes', dificuldade: 2 },
  { q: 'Os Edificadores são a qual classe na ordem?', options: ['Terceira', 'Primeira', 'Segunda', 'Quarta'], categoria: 'classes', dificuldade: 2 },

  // ==========================================
  //  IDEAIS: VOTO, LEI, HINO E LEMA (25)
  // ==========================================
  { q: 'Qual é o voto dos Aventureiros?', options: ['Por amor a Jesus, farei sempre o meu melhor', 'Por amor a Jesus, serei sempre o primeiro', 'Vou brincar sempre que puder', 'Farei o meu melhor só quando quiser'], categoria: 'ideais', dificuldade: 1 },
  { q: 'Complete a lei: "Jesus me ajuda a ser..."', options: ['Obediente, puro, reverente, bondoso e colaborador', 'Forte, rápido, esperto e corajoso', 'Obediente, teimoso e desobediente', 'O melhor de todos sempre'], categoria: 'ideais', dificuldade: 1 },
  { q: 'Segundo a lei, Jesus me ajuda a ser...', options: ['Obediente', 'Teimoso', 'Desobediente', 'Preguiçoso'], categoria: 'ideais', dificuldade: 1 },
  { q: 'Segundo a lei, Jesus me ajuda a ser...', options: ['Puro', 'Malvado', 'Invejoso', 'Desobediente'], categoria: 'ideais', dificuldade: 1 },
  { q: 'Segundo a lei, Jesus me ajuda a ser...', options: ['Reverente', 'Desobediente', 'Ansioso', 'Desatento'], categoria: 'ideais', dificuldade: 2 },
  { q: 'Segundo a lei, Jesus me ajuda a ser...', options: ['Bondoso', 'Egoísta', 'Zangado', 'Triste'], categoria: 'ideais', dificuldade: 1 },
  { q: 'Segundo a lei, Jesus me ajuda a ser...', options: ['Colaborador', 'Preguiçoso', 'Dorminhoco', 'Teimoso'], categoria: 'ideais', dificuldade: 2 },
  { q: 'Qual é o lema dos Aventureiros?', options: ['Sempre alerta, para servir', 'Vamos lá, vamos lá', 'Força e coragem', 'Eu quero, eu posso'], categoria: 'ideais', dificuldade: 1 },
  { q: 'Complete o lema: "Sempre alerta, para..."', options: ['Servir', 'Brincar', 'Dormir', 'Comer'], categoria: 'ideais', dificuldade: 1 },
  { q: 'No hino dos Aventureiros, somos...', options: ['Aventureiros alegres que confiam no amigo Jesus', 'Aventureiros tristes que não confiam em ninguém', 'Aventureiros bravos que brigam sempre', 'Aventureiros que só querem brincar'], categoria: 'ideais', dificuldade: 1 },
  { q: 'Segundo o hino, aprendemos que sempre devemos ser...', options: ['Para todos o brilho da luz', 'O melhor da turma', 'O mais forte', 'O mais rápido'], categoria: 'ideais', dificuldade: 2 },
  { q: 'Segundo o hino, descobrimos em tudo...', options: ['A beleza e o amor de um Deus criador', 'A tristeza do mundo', 'A força da natureza', 'O poder do homem'], categoria: 'ideais', dificuldade: 2 },
  { q: 'O voto dos Aventureiros começa com...', options: ['Por amor a Jesus', 'Por medo do castigo', 'Por causa dos amigos', 'Porque me mandaram'], categoria: 'ideais', dificuldade: 2 },
  { q: 'O voto dos Aventureiros termina com...', options: ['Farei sempre o meu melhor', 'Farei só quando quiser', 'Serei sempre o primeiro', 'Vou brincar sempre'], categoria: 'ideais', dificuldade: 2 },
  { q: 'Quem nos ajuda a cumprir o voto dos Aventureiros?', options: ['Jesus', 'Sozinhos', 'Os amigos', 'Os brinquedos'], categoria: 'ideais', dificuldade: 2 },
  { q: 'O voto começa com "Por amor a..."', options: ['Jesus', 'Maria', 'Moisés', 'O clube'], categoria: 'ideais', dificuldade: 1 },
  { q: 'A lei dos Aventureiros tem quantos valores?', options: ['5', '3', '7', '10'], categoria: 'ideais', dificuldade: 2 },
  { q: '"Sempre alerta" é parte de qual ideal?', options: ['Lema', 'Voto', 'Lei', 'Hino'], categoria: 'ideais', dificuldade: 2 },
  { q: 'O hino fala sobre ser brilho da...', options: ['Luz', 'Noite', 'Terra', 'Água'], categoria: 'ideais', dificuldade: 2 },
  { q: 'O voto é uma promessa feita com...', options: ['Amor', 'Medo', 'Pressa', 'Raiva'], categoria: 'ideais', dificuldade: 2 },
  { q: 'Complete: "Farei sempre o meu..."', options: ['Melhor', 'Pior', 'Pouco', 'Nada'], categoria: 'ideais', dificuldade: 1 },
  { q: 'Ser puro significa...', options: ['Ser limpo e sem maldade', 'Ser sujo', 'Ser forte', 'Ser famoso'], categoria: 'ideais', dificuldade: 2 },
  { q: 'Ser reverente significa...', options: ['Tratar as coisas de Deus com respeito', 'Ter medo', 'Ser quieto', 'Ser barulhento'], categoria: 'ideais', dificuldade: 2 },
  { q: 'Ser colaborador significa...', options: ['Ajudar os outros', 'Mandar nos outros', 'Ficar quieto', 'Ignorar'], categoria: 'ideais', dificuldade: 2 },
  { q: 'O lema dos Aventureiros começa com...', options: ['Sempre', 'Nunca', 'Talvez', 'Vamos'], categoria: 'ideais', dificuldade: 1 },

  // ==========================================
  //  SÍMBOLOS E UNIFORME (25)
  // ==========================================
  { q: 'Qual é a cor do lenço dos Aventureiros?', options: ['Vinho', 'Azul', 'Verde', 'Amarelo'], categoria: 'simbolos', dificuldade: 1 },
  { q: 'O que a cor vinho do lenço representa?', options: ['O sangue de Jesus derramado na cruz', 'A cor do céu', 'A cor da natureza', 'A cor da água'], categoria: 'simbolos', dificuldade: 2 },
  { q: 'Quais são as cores da bandeira dos Aventureiros?', options: ['Vinho e branco', 'Azul e amarelo', 'Verde e vermelho', 'Preto e branco'], categoria: 'simbolos', dificuldade: 1 },
  { q: 'O que o branco da bandeira representa?', options: ['Pureza', 'Força', 'Alegria', 'Coragem'], categoria: 'simbolos', dificuldade: 2 },
  { q: 'O lenço dos Aventureiros representa...', options: ['A identidade do clube', 'Um acessório de moda', 'Uma proteção contra o frio', 'Um enfeite para o cabelo'], categoria: 'simbolos', dificuldade: 2 },
  { q: 'Quando usamos o lenço dos Aventureiros?', options: ['Nas reuniões e atividades oficiais', 'Só para dormir', 'Só no banho', 'Só em casa'], categoria: 'simbolos', dificuldade: 2 },
  { q: 'Como devemos usar o lenço dos Aventureiros?', options: ['Com respeito e orgulho', 'De qualquer jeito', 'Amarrotado na mochila', 'Embaixo da cama'], categoria: 'simbolos', dificuldade: 2 },
  { q: 'O que devemos fazer com o lenço após a reunião?', options: ['Guardar com cuidado', 'Jogar no chão', 'Perder', 'Rasgar'], categoria: 'simbolos', dificuldade: 1 },
  { q: 'A bandeira dos Aventureiros tem quantas cores principais?', options: ['2', '1', '3', '4'], categoria: 'simbolos', dificuldade: 2 },
  { q: 'O uniforme dos Aventureiros geralmente inclui...', options: ['Camiseta, lenço e calça', 'Só o lenço', 'Roupa de banho', 'Pijama'], categoria: 'simbolos', dificuldade: 2 },
  { q: 'O lenço é colocado em qual parte do corpo?', options: ['No pescoço', 'Na cabeça', 'No pé', 'Na mão'], categoria: 'simbolos', dificuldade: 1 },
  { q: 'O símbolo do clube está presente...', options: ['Na bandeira e no uniforme', 'Só nos brinquedos', 'Só no celular', 'Só na escola'], categoria: 'simbolos', dificuldade: 2 },
  { q: 'Para que serve o lenço?', options: ['Identificar o membro do clube', 'Moda', 'Aquecer', 'Enfeitar'], categoria: 'simbolos', dificuldade: 2 },
  { q: 'O uniforme oficial tem as cores...', options: ['Vinho e branco', 'Azul e amarelo', 'Verde e vermelho', 'Preto e branco'], categoria: 'simbolos', dificuldade: 2 },
  { q: 'Se você vê alguém com lenço vinho, sabe que é...', options: ['Aventureiro', 'Desbravador', 'Escoteiro', 'Explorador'], categoria: 'simbolos', dificuldade: 1 },
  { q: 'O símbolo do clube pode ser encontrado no...', options: ['Uniforme e bandeira', 'Só na bandeira', 'Só no uniforme', 'Só no lenço'], categoria: 'simbolos', dificuldade: 2 },
  { q: 'A bandeira é hasteada em...', options: ['Cerimônias do clube', 'Casa', 'Escola', 'Nada'], categoria: 'simbolos', dificuldade: 2 },
  { q: 'O branco da bandeira lembra...', options: ['Pureza', 'Força', 'Coragem', 'Medo'], categoria: 'simbolos', dificuldade: 2 },
  { q: 'O vinho do lenço lembra...', options: ['O sangue de Jesus', 'O céu', 'O mar', 'A terra'], categoria: 'simbolos', dificuldade: 2 },
  { q: 'O lenço deve ser guardado com...', options: ['Cuidado', 'Descuido', 'Raiva', 'Pressa'], categoria: 'simbolos', dificuldade: 1 },
  { q: 'O uniforme é usado em...', options: ['Reuniões e atividades do clube', 'Casa', 'Escola', 'Festas'], categoria: 'simbolos', dificuldade: 2 },
  { q: 'Se o lenço rasgar, devemos...', options: ['Consertar ou pedir um novo ao clube', 'Jogar fora', 'Ignorar', 'Usar rasgado'], categoria: 'simbolos', dificuldade: 2 },
  { q: 'O lenço é entregue ao Aventureiro em uma cerimônia chamada...', options: ['Investidura', 'Formatura', 'Batismo', 'Casamento'], categoria: 'simbolos', dificuldade: 3 },
  { q: 'A bandeira é hasteada por...', options: ['A diretoria e o clube reunido', 'Só pelo diretor', 'Só pelas crianças', 'Ninguém'], categoria: 'simbolos', dificuldade: 3 },
  { q: 'Quem deve usar o uniforme completo?', options: ['Todos os membros do clube', 'Só o diretor', 'Só os líderes', 'Só as meninas'], categoria: 'simbolos', dificuldade: 2 },

  // ==========================================
  //  ESPECIALIDADES (25)
  // ==========================================
  { q: 'O que os Aventureiros ganham ao completar uma especialidade?', options: ['Uma insígnia', 'Um brinquedo', 'Um doce', 'Um diploma de faculdade'], categoria: 'especialidades', dificuldade: 1 },
  { q: 'Qual é uma categoria de especialidade dos Aventureiros?', options: ['Estudo da Natureza', 'Jogar videogame', 'Assistir televisão', 'Dormir até tarde'], categoria: 'especialidades', dificuldade: 1 },
  { q: 'Qual é outra categoria de especialidade dos Aventureiros?', options: ['Artes Manuais', 'Futebol de botão', 'Vídeo game', 'Novela'], categoria: 'especialidades', dificuldade: 1 },
  { q: 'Qual é outra categoria de especialidade dos Aventureiros?', options: ['Saúde', 'Luta', 'Corrida radical', 'Vídeo game'], categoria: 'especialidades', dificuldade: 2 },
  { q: 'Qual é outra categoria de especialidade dos Aventureiros?', options: ['Recreação', 'Novela', 'Séries', 'Filmes'], categoria: 'especialidades', dificuldade: 2 },
  { q: 'As especialidades dos Aventureiros são divididas em...', options: ['Categorias', 'Números', 'Cores', 'Letras'], categoria: 'especialidades', dificuldade: 2 },
  { q: 'As insígnias são colocadas onde?', options: ['Em uma faixa ou distintivo do uniforme', 'Na mochila da escola', 'No tênis', 'No cabelo'], categoria: 'especialidades', dificuldade: 2 },
  { q: 'Qual dessas é uma especialidade de natureza?', options: ['Observação de pássaros', 'Jogar videogame', 'Assistir filme', 'Dormir'], categoria: 'especialidades', dificuldade: 2 },
  { q: 'Qual dessas é uma especialidade de artes manuais?', options: ['Pintura', 'Futebol', 'Natação', 'Corrida'], categoria: 'especialidades', dificuldade: 2 },
  { q: 'Qual dessas é uma especialidade de saúde?', options: ['Primeiros socorros', 'Videogame', 'Novela', 'Dormir tarde'], categoria: 'especialidades', dificuldade: 2 },
  { q: 'Qual dessas é uma especialidade de recreação?', options: ['Jogos ao ar livre', 'Assistir TV', 'Ficar no celular', 'Dormir'], categoria: 'especialidades', dificuldade: 2 },
  { q: 'Praticar esportes é uma especialidade de qual categoria?', options: ['Recreação', 'Natureza', 'Artes Manuais', 'Saúde'], categoria: 'especialidades', dificuldade: 3 },
  { q: 'Aprender sobre animais é uma especialidade de qual categoria?', options: ['Estudo da Natureza', 'Artes Manuais', 'Recreação', 'Saúde'], categoria: 'especialidades', dificuldade: 3 },
  { q: '"Culinária" é de qual área?', options: ['Recreação', 'Natureza', 'Saúde', 'Artes Manuais'], categoria: 'especialidades', dificuldade: 2 },
  { q: '"Primeiros socorros" é de qual área?', options: ['Saúde', 'Natureza', 'Recreação', 'Artes Manuais'], categoria: 'especialidades', dificuldade: 2 },
  { q: '"Observação de pássaros" é de qual área?', options: ['Natureza', 'Saúde', 'Recreação', 'Artes Manuais'], categoria: 'especialidades', dificuldade: 2 },
  { q: '"Pintura" é de qual área?', options: ['Artes Manuais', 'Natureza', 'Saúde', 'Recreação'], categoria: 'especialidades', dificuldade: 2 },
  { q: '"Nós e amarras" é especialidade de...', options: ['Acampamento', 'Saúde', 'Artes Manuais', 'Recreação'], categoria: 'especialidades', dificuldade: 2 },
  { q: '"Canto" é de qual área?', options: ['Recreação/Música', 'Natureza', 'Saúde', 'Artes Manuais'], categoria: 'especialidades', dificuldade: 2 },
  { q: '"Jardinagem" é de qual área?', options: ['Natureza', 'Saúde', 'Recreação', 'Artes Manuais'], categoria: 'especialidades', dificuldade: 2 },
  { q: '"Natação" é de qual área?', options: ['Recreação/Esporte', 'Natureza', 'Saúde', 'Artes Manuais'], categoria: 'especialidades', dificuldade: 2 },
  { q: 'Para ganhar uma especialidade, o Aventureiro precisa...', options: ['Completar as atividades', 'Só aparecer', 'Pagar', 'Nada'], categoria: 'especialidades', dificuldade: 1 },
  { q: 'As insígnias são colocadas no...', options: ['Uniforme', 'Mochila', 'Tênis', 'Cabelo'], categoria: 'especialidades', dificuldade: 1 },
  { q: 'As especialidades servem para...', options: ['Aprender coisas novas', 'Só brincar', 'Competir', 'Nada'], categoria: 'especialidades', dificuldade: 2 },
  { q: 'Fazer um lanche simples é uma especialidade de qual área?', options: ['Culinária', 'Natureza', 'Saúde', 'Artes Manuais'], categoria: 'especialidades', dificuldade: 2 },

  // ==========================================
  //  BÍBLIA E VALORES (25)
  // ==========================================
  { q: 'Qual é o livro sagrado dos cristãos?', options: ['Bíblia', 'Dicionário', 'Revista', 'Jornal'], categoria: 'biblia', dificuldade: 1 },
  { q: 'Quem criou o mundo e tudo o que nele existe?', options: ['Deus', 'O homem', 'Os animais', 'Os anjos'], categoria: 'biblia', dificuldade: 1 },
  { q: 'Em quantos dias Deus criou o mundo?', options: ['6 dias', '1 dia', '10 dias', '30 dias'], categoria: 'biblia', dificuldade: 2 },
  { q: 'Quem foi o primeiro homem criado por Deus?', options: ['Adão', 'Noé', 'Moisés', 'Davi'], categoria: 'biblia', dificuldade: 1 },
  { q: 'Quem foi a primeira mulher?', options: ['Eva', 'Maria', 'Sara', 'Ana'], categoria: 'biblia', dificuldade: 2 },
  { q: 'Qual é o primeiro livro da Bíblia?', options: ['Gênesis', 'Êxodo', 'Salmos', 'Apocalipse'], categoria: 'biblia', dificuldade: 2 },
  { q: 'Qual é o último livro da Bíblia?', options: ['Apocalipse', 'Gênesis', 'João', 'Mateus'], categoria: 'biblia', dificuldade: 2 },
  { q: 'Quantos livros tem a Bíblia?', options: ['66', '10', '50', '100'], categoria: 'biblia', dificuldade: 3 },
  { q: 'Quem construiu a arca?', options: ['Noé', 'Moisés', 'Davi', 'Jonas'], categoria: 'biblia', dificuldade: 1 },
  { q: 'Quem foi engolido por um grande peixe?', options: ['Jonas', 'Noé', 'Pedro', 'Paulo'], categoria: 'biblia', dificuldade: 2 },
  { q: 'Quem abriu o Mar Vermelho?', options: ['Moisés', 'Noé', 'Abraão', 'Davi'], categoria: 'biblia', dificuldade: 2 },
  { q: 'Qual é o mandamento que fala sobre honrar?', options: ['Honrar pai e mãe', 'Não matar', 'Não roubar', 'Não mentir'], categoria: 'biblia', dificuldade: 2 },
  { q: 'Quantos mandamentos Deus deu a Moisés?', options: ['10', '5', '7', '12'], categoria: 'biblia', dificuldade: 1 },
  { q: 'Quem batizou Jesus?', options: ['João Batista', 'Pedro', 'Paulo', 'Moisés'], categoria: 'biblia', dificuldade: 2 },
  { q: 'Onde Jesus nasceu?', options: ['Belém', 'Nazaré', 'Jerusalém', 'Egito'], categoria: 'biblia', dificuldade: 2 },
  { q: 'Em que cidade Jesus cresceu?', options: ['Nazaré', 'Belém', 'Jerusalém', 'Roma'], categoria: 'biblia', dificuldade: 2 },
  { q: 'Qual é o maior mandamento?', options: ['Amar a Deus sobre todas as coisas', 'Não matar', 'Não roubar', 'Guardar o sábado'], categoria: 'biblia', dificuldade: 2 },
  { q: 'Qual é o segundo maior mandamento?', options: ['Amar ao próximo como a si mesmo', 'Não mentir', 'Honrar pai e mãe', 'Não roubar'], categoria: 'biblia', dificuldade: 2 },
  { q: 'Quem traiu Jesus?', options: ['Judas', 'Pedro', 'João', 'Tiago'], categoria: 'biblia', dificuldade: 2 },
  { q: 'Quantos discípulos Jesus teve?', options: ['12', '10', '7', '3'], categoria: 'biblia', dificuldade: 2 },
  { q: 'Quem foi o irmão de Moisés?', options: ['Arão', 'Josué', 'Calebe', 'Davi'], categoria: 'biblia', dificuldade: 3 },
  { q: 'Qual é o primeiro dos 10 mandamentos?', options: ['Não terás outros deuses', 'Não matarás', 'Não roubarás', 'Honrar pai e mãe'], categoria: 'biblia', dificuldade: 3 },
  { q: 'Qual livro da Bíblia conta sobre a criação?', options: ['Gênesis', 'Êxodo', 'Apocalipse', 'Salmos'], categoria: 'biblia', dificuldade: 2 },
  { q: 'Quem foi o filho prometido a Abraão?', options: ['Isaque', 'Jacó', 'Esaú', 'José'], categoria: 'biblia', dificuldade: 3 },
  { q: 'Quantos dias e noites choveu no dilúvio?', options: ['40', '7', '10', '100'], categoria: 'biblia', dificuldade: 2 },

  // ==========================================
  //  NATUREZA E CRIAÇÃO (25)
  // ==========================================
  { q: 'O que as abelhas produzem?', options: ['Mel', 'Leite', 'Suco', 'Pão'], categoria: 'natureza', dificuldade: 1 },
  { q: 'Qual é o maior animal do mundo?', options: ['Baleia-azul', 'Elefante', 'Girafa', 'Tubarão'], categoria: 'natureza', dificuldade: 1 },
  { q: 'Qual é o animal terrestre mais rápido do mundo?', options: ['Guepardo', 'Leão', 'Cavalo', 'Coelho'], categoria: 'natureza', dificuldade: 2 },
  { q: 'Quantas patas tem uma aranha?', options: ['8', '4', '6', '10'], categoria: 'natureza', dificuldade: 1 },
  { q: 'Quantas patas tem um inseto?', options: ['6', '4', '8', '10'], categoria: 'natureza', dificuldade: 2 },
  { q: 'O que a planta precisa para crescer?', options: ['Água e luz do sol', 'Só vento', 'Só terra', 'Só escuridão'], categoria: 'natureza', dificuldade: 1 },
  { q: 'Qual é a estação mais quente do ano?', options: ['Verão', 'Inverno', 'Outono', 'Primavera'], categoria: 'natureza', dificuldade: 1 },
  { q: 'Qual é a estação mais fria do ano?', options: ['Inverno', 'Verão', 'Outono', 'Primavera'], categoria: 'natureza', dificuldade: 1 },
  { q: 'O que cai do céu quando chove?', options: ['Água', 'Areia', 'Folhas', 'Pedras'], categoria: 'natureza', dificuldade: 1 },
  { q: 'Qual é o animal conhecido como "rei da selva"?', options: ['Leão', 'Elefante', 'Macaco', 'Tigre'], categoria: 'natureza', dificuldade: 1 },
  { q: 'Quantas cores tem o arco-íris?', options: ['7', '3', '5', '10'], categoria: 'natureza', dificuldade: 1 },
  { q: 'Qual desses animais vive na água?', options: ['Peixe', 'Leão', 'Macaco', 'Galinha'], categoria: 'natureza', dificuldade: 1 },
  { q: 'Que animal faz "miau"?', options: ['Gato', 'Cachorro', 'Vaca', 'Pato'], categoria: 'natureza', dificuldade: 1 },
  { q: 'Que animal faz "muu"?', options: ['Vaca', 'Gato', 'Cachorro', 'Galinha'], categoria: 'natureza', dificuldade: 1 },
  { q: 'Qual é o maior planeta do sistema solar?', options: ['Júpiter', 'Terra', 'Marte', 'Saturno'], categoria: 'natureza', dificuldade: 2 },
  { q: 'Qual é o planeta em que vivemos?', options: ['Terra', 'Marte', 'Júpiter', 'Vênus'], categoria: 'natureza', dificuldade: 1 },
  { q: 'O que o girassol sempre olha?', options: ['O sol', 'A lua', 'As estrelas', 'A chuva'], categoria: 'natureza', dificuldade: 2 },
  { q: 'Qual é a parte da planta que fica embaixo da terra?', options: ['Raiz', 'Folha', 'Flor', 'Fruto'], categoria: 'natureza', dificuldade: 2 },
  { q: 'Qual é o animal conhecido por mudar de cor?', options: ['Camaleão', 'Cavalo', 'Coelho', 'Gato'], categoria: 'natureza', dificuldade: 2 },
  { q: 'Qual é a cor das folhas na primavera?', options: ['Verde', 'Vermelha', 'Amarela', 'Marrom'], categoria: 'natureza', dificuldade: 1 },
  { q: 'Qual é o animal mais alto do mundo?', options: ['Girafa', 'Elefante', 'Baleia', 'Avestruz'], categoria: 'natureza', dificuldade: 1 },
  { q: 'Qual planeta é conhecido como "planeta vermelho"?', options: ['Marte', 'Vênus', 'Júpiter', 'Saturno'], categoria: 'natureza', dificuldade: 2 },
  { q: 'Qual é a estrela mais próxima da Terra?', options: ['O Sol', 'A Lua', 'Sírius', 'Estrela Polar'], categoria: 'natureza', dificuldade: 2 },
  { q: 'Quantas patas tem um caranguejo?', options: ['10', '6', '8', '4'], categoria: 'natureza', dificuldade: 2 },
  { q: 'Qual é o maior oceano do mundo?', options: ['Pacífico', 'Atlântico', 'Índico', 'Ártico'], categoria: 'natureza', dificuldade: 2 },

  // ==========================================
  //  SAÚDE E SEGURANÇA (25)
  // ==========================================
  { q: 'O que devemos fazer antes de comer?', options: ['Lavar as mãos', 'Correr', 'Pular', 'Dormir'], categoria: 'saude', dificuldade: 1 },
  { q: 'O que devemos fazer antes de dormir?', options: ['Escovar os dentes', 'Comer doces', 'Correr', 'Assistir TV'], categoria: 'saude', dificuldade: 1 },
  { q: 'Quantas vezes devemos escovar os dentes por dia?', options: ['3 vezes', '1 vez', 'Nenhuma', 'Só quando lembrar'], categoria: 'saude', dificuldade: 1 },
  { q: 'Qual é a melhor bebida para a saúde?', options: ['Água', 'Refrigerante', 'Suco de caixinha', 'Leite com chocolate'], categoria: 'saude', dificuldade: 1 },
  { q: 'O que devemos fazer ao atravessar a rua?', options: ['Olhar para os dois lados', 'Correr', 'Fechar os olhos', 'Pular'], categoria: 'saude', dificuldade: 1 },
  { q: 'O que devemos usar ao andar de bicicleta?', options: ['Capacete', 'Boné', 'Chapéu', 'Gravata'], categoria: 'saude', dificuldade: 1 },
  { q: 'O que devemos fazer se nos machucarmos?', options: ['Avisar um adulto', 'Esconder', 'Chorar sozinho', 'Continuar brincando'], categoria: 'saude', dificuldade: 1 },
  { q: 'Qual desses é um alimento saudável?', options: ['Frutas', 'Refrigerante', 'Doces', 'Salgadinhos'], categoria: 'saude', dificuldade: 1 },
  { q: 'Qual desses devemos evitar em excesso?', options: ['Doces', 'Frutas', 'Água', 'Legumes'], categoria: 'saude', dificuldade: 1 },
  { q: 'Quantas horas de sono uma criança precisa?', options: ['8 a 10 horas', '3 horas', '4 horas', '12 horas'], categoria: 'saude', dificuldade: 2 },
  { q: 'O que devemos fazer com as frutas antes de comer?', options: ['Lavar bem', 'Nada', 'Descascar com a mão suja', 'Jogar no chão'], categoria: 'saude', dificuldade: 1 },
  { q: 'O que protege nossa pele do sol?', options: ['Protetor solar', 'Água', 'Vento', 'Chapéu de chuva'], categoria: 'saude', dificuldade: 2 },
  { q: 'O que devemos fazer quando estamos com febre?', options: ['Avisar um adulto e descansar', 'Correr', 'Comer doces', 'Pular'], categoria: 'saude', dificuldade: 2 },
  { q: 'Devemos escovar os dentes após...', options: ['As refeições', 'Só à noite', 'Nunca', 'Só quando lembrar'], categoria: 'saude', dificuldade: 1 },
  { q: 'Qual hábito ajuda a manter o corpo saudável?', options: ['Praticar exercícios', 'Ficar o dia todo no celular', 'Dormir tarde', 'Comer só doces'], categoria: 'saude', dificuldade: 1 },
  { q: 'Devemos tomar banho...', options: ['Todos os dias', '1x por semana', 'Nunca', '1x por mês'], categoria: 'saude', dificuldade: 1 },
  { q: 'Devemos trocar de roupa...', options: ['Todos os dias', '1x por mês', 'Nunca', '1x por semana'], categoria: 'saude', dificuldade: 1 },
  { q: 'Frutas e verduras são importantes porque...', options: ['Têm vitaminas', 'Não têm sabor', 'São caras', 'Nada'], categoria: 'saude', dificuldade: 2 },
  { q: 'Beber água com frequência ajuda a...', options: ['Manter o corpo hidratado', 'Ficar com sede', 'Nada', 'Só em dias quentes'], categoria: 'saude', dificuldade: 1 },
  { q: 'O protetor solar deve ser usado...', options: ['Antes de sair no sol', 'Só na praia', 'Nunca', 'À noite'], categoria: 'saude', dificuldade: 2 },
  { q: 'Para evitar doenças, devemos lavar as mãos...', options: ['Antes de comer e após o banheiro', 'Nunca', 'Só após brincar na terra', 'Só antes de dormir'], categoria: 'saude', dificuldade: 2 },
  { q: 'Devemos usar roupas...', options: ['Limpas', 'Sujas', 'Rasgadas', 'Apertadas'], categoria: 'saude', dificuldade: 1 },
  { q: 'Correr, pular e brincar ajudam a...', options: ['Manter o corpo saudável', 'Ficar doente', 'Nada', 'Só em dias frios'], categoria: 'saude', dificuldade: 1 },
  { q: 'Se alguém se machuca, devemos...', options: ['Avisar um adulto', 'Rir', 'Ignorar', 'Continuar brincando'], categoria: 'saude', dificuldade: 1 },
  { q: 'O que devemos fazer antes de dormir para relaxar?', options: ['Ler uma história ou orar', 'Correr', 'Assistir TV até tarde', 'Comer doces'], categoria: 'saude', dificuldade: 2 },

  // ==========================================
  //  ACAMPAMENTO E ATIVIDADES (25)
  // ==========================================
  { q: 'O que usamos para dormir no acampamento?', options: ['Barraca', 'Geladeira', 'Televisão', 'Sofá'], categoria: 'acampamento', dificuldade: 1 },
  { q: 'O que usamos para nos proteger do sol no acampamento?', options: ['Boné ou chapéu', 'Guarda-chuva', 'Cachecol', 'Luva'], categoria: 'acampamento', dificuldade: 1 },
  { q: 'O que usamos para nos orientar na natureza?', options: ['Bússola', 'Celular', 'Televisão', 'Rádio'], categoria: 'acampamento', dificuldade: 1 },
  { q: 'O que devemos fazer com o lixo no acampamento?', options: ['Jogar na lixeira', 'Deixar no chão', 'Jogar no rio', 'Enterrar'], categoria: 'acampamento', dificuldade: 1 },
  { q: 'Qual é uma atividade típica de acampamento?', options: ['Fazer fogueira (com adulto)', 'Assistir filme', 'Jogar videogame', 'Ir ao shopping'], categoria: 'acampamento', dificuldade: 1 },
  { q: 'Qual é uma comida típica de acampamento?', options: ['Marshmallow assado', 'Sushi', 'Pizza congelada', 'Hambúrguer de restaurante'], categoria: 'acampamento', dificuldade: 2 },
  { q: 'O que devemos levar em uma caminhada?', options: ['Água e lanche', 'Só o celular', 'Video game', 'Travesseiro'], categoria: 'acampamento', dificuldade: 1 },
  { q: 'O que devemos fazer antes de acender uma fogueira?', options: ['Pedir ajuda a um adulto', 'Fazer sozinho', 'Jogar álcool', 'Nada'], categoria: 'acampamento', dificuldade: 1 },
  { q: 'O que nunca devemos fazer com uma fogueira?', options: ['Deixar sem supervisão', 'Apagar com água', 'Fazer com adulto', 'Cercar com pedras'], categoria: 'acampamento', dificuldade: 2 },
  { q: 'Qual é o melhor calçado para uma caminhada?', options: ['Tênis fechado', 'Chinelo', 'Salto alto', 'Sapato social'], categoria: 'acampamento', dificuldade: 1 },
  { q: 'O que devemos fazer ao encontrar um animal selvagem?', options: ['Observar de longe', 'Tocar', 'Correr atrás', 'Gritar'], categoria: 'acampamento', dificuldade: 2 },
  { q: 'Como se chama o local onde montamos as barracas?', options: ['Acampamento', 'Shopping', 'Escola', 'Praia'], categoria: 'acampamento', dificuldade: 1 },
  { q: 'O que usamos para iluminar a barraca à noite?', options: ['Lanterna', 'Fogão', 'Geladeira', 'Ventilador'], categoria: 'acampamento', dificuldade: 1 },
  { q: 'O que devemos fazer quando começamos uma caminhada?', options: ['Avisar um líder', 'Sair sozinho', 'Correr na frente', 'Nada'], categoria: 'acampamento', dificuldade: 2 },
  { q: 'O que devemos fazer antes de entrar em uma barraca com os pés sujos?', options: ['Limpar os pés', 'Entrar assim mesmo', 'Correr', 'Pular'], categoria: 'acampamento', dificuldade: 2 },
  { q: 'A bússola aponta sempre para...', options: ['O norte', 'O sul', 'O leste', 'O oeste'], categoria: 'acampamento', dificuldade: 2 },
  { q: 'A fogueira serve para...', options: ['Aquecer e iluminar', 'Só cozinhar', 'Só queimar', 'Só enfeitar'], categoria: 'acampamento', dificuldade: 1 },
  { q: 'Devemos cuidar da natureza porque...', options: ['É criação de Deus', 'Não é importante', 'É dos outros', 'Ninguém liga'], categoria: 'acampamento', dificuldade: 1 },
  { q: 'Antes de fazer uma trilha, devemos...', options: ['Avisar um líder', 'Sair sozinhos', 'Correr na frente', 'Nada'], categoria: 'acampamento', dificuldade: 2 },
  { q: 'Devemos caminhar sempre em...', options: ['Grupo, com um líder', 'Sozinhos', 'Correndo', 'À noite'], categoria: 'acampamento', dificuldade: 2 },
  { q: 'Que tipo de roupa devemos usar no acampamento?', options: ['Roupas confortáveis e fechadas', 'Roupas de festa', 'Só sunga', 'Só pijama'], categoria: 'acampamento', dificuldade: 2 },
  { q: 'Em um acampamento, onde devemos fazer nossas necessidades?', options: ['No banheiro do local', 'No mato', 'Na barraca', 'No rio'], categoria: 'acampamento', dificuldade: 1 },
  { q: 'Por que é importante beber água durante a caminhada?', options: ['Para se manter hidratado', 'Para gastar mais', 'Não é importante', 'Só em dias quentes'], categoria: 'acampamento', dificuldade: 2 },
  { q: 'O que devemos fazer se avistarmos um animal perigoso?', options: ['Manter distância e avisar um adulto', 'Tocar', 'Correr atrás', 'Gritar'], categoria: 'acampamento', dificuldade: 2 },
  { q: 'A barraca deve ser montada em local...', options: ['Plano e seguro', 'Em cima de pedras', 'Perto do rio', 'Em declive'], categoria: 'acampamento', dificuldade: 3 },

  // ==========================================
  //  TRABALHO EM EQUIPE E AMIZADE (25)
  // ==========================================
  { q: 'O que devemos fazer quando encontramos um amigo triste?', options: ['Consolar e ajudar', 'Ignorar', 'Rir dele', 'Fugir'], categoria: 'equipe', dificuldade: 1 },
  { q: 'Como devemos tratar nossos colegas?', options: ['Com respeito e carinho', 'Com gritos', 'Com indiferença', 'Com brigas'], categoria: 'equipe', dificuldade: 1 },
  { q: 'O que é mais importante em uma equipe?', options: ['Trabalhar juntos', 'Ganhar sozinho', 'Brigar', 'Competir com raiva'], categoria: 'equipe', dificuldade: 1 },
  { q: 'O que devemos fazer com nossos brinquedos?', options: ['Compartilhar com os amigos', 'Guardar só para mim', 'Jogar fora', 'Quebrar'], categoria: 'equipe', dificuldade: 1 },
  { q: 'O que devemos dizer quando alguém nos ajuda?', options: ['Obrigado', 'Nada', 'Tchau', 'Deixa pra lá'], categoria: 'equipe', dificuldade: 1 },
  { q: 'O que devemos dizer quando queremos algo?', options: ['Por favor', 'Nada', 'Tchau', 'Agora'], categoria: 'equipe', dificuldade: 1 },
  { q: 'O que devemos fazer quando erramos?', options: ['Pedir desculpas', 'Culpar o outro', 'Fingir que nada aconteceu', 'Fugir'], categoria: 'equipe', dificuldade: 1 },
  { q: 'O que devemos fazer quando um amigo novo chega?', options: ['Acolher e fazer amizade', 'Ignorar', 'Zombar', 'Expulsar'], categoria: 'equipe', dificuldade: 1 },
  { q: 'Como devemos falar com as pessoas?', options: ['Com educação', 'Gritando', 'Com grosseria', 'Só por mensagem'], categoria: 'equipe', dificuldade: 1 },
  { q: 'O que devemos fazer quando um amigo está com dificuldade?', options: ['Ajudar', 'Rir', 'Ignorar', 'Fugir'], categoria: 'equipe', dificuldade: 1 },
  { q: 'Devemos elogiar um amigo quando ele faz algo bom?', options: ['Sim, sempre', 'Nunca', 'Só em festas', 'Só se ele pedir'], categoria: 'equipe', dificuldade: 1 },
  { q: 'Devemos escutar quando alguém está falando?', options: ['Sim, sempre', 'Não', 'Só às vezes', 'Só se for adulto'], categoria: 'equipe', dificuldade: 1 },
  { q: 'Devemos compartilhar o que sabemos com os amigos?', options: ['Sim, sempre que possível', 'Nunca', 'Só se pagarem', 'Só com os professores'], categoria: 'equipe', dificuldade: 2 },
  { q: 'Quando ajudamos alguém, é bom ouvir...', options: ['Obrigado', 'Nada', 'Reclamação', 'Silêncio'], categoria: 'equipe', dificuldade: 1 },
  { q: 'Um bom amigo é aquele que...', options: ['Ajuda e respeita', 'Brinca sozinho', 'Grita', 'Ignora'], categoria: 'equipe', dificuldade: 1 },
  { q: 'Trabalhar em equipe é importante porque...', options: ['Juntos somos mais fortes', 'Só um manda', 'Ninguém se ajuda', 'Ninguém precisa'], categoria: 'equipe', dificuldade: 2 },
  { q: 'Devemos tratar o próximo como...', options: ['Gostaríamos de ser tratados', 'Quisermos', 'Não importa', 'Só às vezes'], categoria: 'equipe', dificuldade: 2 },
  { q: 'Devemos emprestar nossos materiais?', options: ['Sim, com cuidado e respeito', 'Nunca', 'Só se pagarem', 'Só para o professor'], categoria: 'equipe', dificuldade: 1 },
  { q: 'Quando um amigo ganha um jogo, devemos...', options: ['Parabenizar', 'Ficar com raiva', 'Chorar', 'Sair de perto'], categoria: 'equipe', dificuldade: 1 },
  { q: 'Quando perdemos um jogo, devemos...', options: ['Aceitar com esportividade', 'Chorar muito', 'Brigar', 'Culpar os outros'], categoria: 'equipe', dificuldade: 2 },
  { q: 'Devemos falar palavrões?', options: ['Não, nunca', 'Sim', 'Às vezes', 'Depende'], categoria: 'equipe', dificuldade: 1 },
  { q: 'Devemos brigar para conseguir o que queremos?', options: ['Não, sempre conversar', 'Sim', 'Às vezes', 'Com os amigos sim'], categoria: 'equipe', dificuldade: 2 },
  { q: 'Devemos respeitar as regras do jogo?', options: ['Sim, sempre', 'Não', 'Só se ganharmos', 'Só às vezes'], categoria: 'equipe', dificuldade: 1 },
  { q: 'Devemos ajudar a limpar depois de brincar?', options: ['Sim, todos juntos', 'Não', 'Só o líder', 'Só quem bagunçou mais'], categoria: 'equipe', dificuldade: 1 },
  { q: 'Se um amigo estiver sendo excluído, devemos...', options: ['Chamar ele para brincar', 'Ignorar', 'Rir', 'Concordar com a exclusão'], categoria: 'equipe', dificuldade: 2 },

  // ==========================================
  //  HISTÓRIA E ORGANIZAÇÃO (25)
  // ==========================================
  { q: 'Em que ano o Clube de Aventureiros foi criado?', options: ['1972', '1500', '1900', '2020'], categoria: 'historia', dificuldade: 3 },
  { q: 'A qual igreja o Clube de Aventureiros está ligado?', options: ['Igreja Adventista do Sétimo Dia', 'Igreja Católica', 'Igreja Batista', 'Igreja Universal'], categoria: 'historia', dificuldade: 1 },
  { q: 'O Clube de Aventureiros faz parte de qual departamento da igreja?', options: ['Ministério da Criança', 'Ministério da Mulher', 'Ministério da Música', 'Ministério da Família'], categoria: 'historia', dificuldade: 3 },
  { q: 'Qual é o objetivo do Clube de Aventureiros?', options: ['Ajudar a criança a partilhar sua fé e se preparar para esta vida e a vida eterna', 'Só ensinar a brincar', 'Só ensinar a ler e escrever', 'Só fazer amizades'], categoria: 'historia', dificuldade: 2 },
  { q: 'Quem pode participar do Clube de Aventureiros?', options: ['Crianças de 6 a 9 anos', 'Crianças de 1 a 5 anos', 'Jovens de 15 a 20 anos', 'Adultos'], categoria: 'historia', dificuldade: 1 },
  { q: 'Qual é a idade máxima para participar?', options: ['9 anos', '5 anos', '12 anos', '15 anos'], categoria: 'historia', dificuldade: 2 },
  { q: 'Qual é a idade mínima para participar?', options: ['6 anos', '3 anos', '8 anos', '10 anos'], categoria: 'historia', dificuldade: 2 },
  { q: 'Qual clube vem depois do Clube de Aventureiros?', options: ['Clube de Desbravadores', 'Clube de Mães', 'Clube da Melhor Idade', 'Nenhum'], categoria: 'historia', dificuldade: 1 },
  { q: 'Quem lidera o Clube de Aventureiros?', options: ['Um diretor e líderes voluntários', 'O prefeito', 'Os próprios pais', 'A polícia'], categoria: 'historia', dificuldade: 2 },
  { q: 'As atividades incluem...', options: ['Reuniões, especialidades e acampamentos', 'Só dormir', 'Só brincar', 'Só comer'], categoria: 'historia', dificuldade: 1 },
  { q: 'Em que país o Clube de Aventureiros foi criado?', options: ['Estados Unidos', 'Brasil', 'Inglaterra', 'Canadá'], categoria: 'historia', dificuldade: 3 },
  { q: 'Qual clube vem ANTES dos Aventureiros?', options: ['Nenhum — é o primeiro do movimento', 'Desbravadores', 'Escoteiros', 'Exploradores'], categoria: 'historia', dificuldade: 2 },
  { q: 'Quem pode liderar o Clube de Aventureiros?', options: ['Adultos voluntários treinados', 'Crianças', 'Jovens sem treino', 'Ninguém'], categoria: 'historia', dificuldade: 2 },
  { q: 'A sede mundial do movimento está em qual país?', options: ['Estados Unidos', 'Brasil', 'Inglaterra', 'Austrália'], categoria: 'historia', dificuldade: 3 },
  { q: 'Em qual século o clube foi criado?', options: ['Século XX', 'Século XIX', 'Século XXI', 'Século XVIII'], categoria: 'historia', dificuldade: 3 },
  { q: 'Quem escreveu o currículo dos Aventureiros?', options: ['Teresa Reeve', 'Ellen White', 'Maria', 'Ana'], categoria: 'historia', dificuldade: 3 },
  { q: 'O objetivo principal é preparar a criança para...', options: ['Esta vida e a eterna', 'Só brincar', 'Só competir', 'Só estudar'], categoria: 'historia', dificuldade: 2 },
  { q: 'O clube é dividido em quantos níveis?', options: ['4 classes', '2', '3', '6'], categoria: 'historia', dificuldade: 2 },
  { q: 'Fora os Aventureiros, qual outro clube existe?', options: ['Clube de Desbravadores', 'Escoteiros', 'Exploradores', 'Só existe um'], categoria: 'historia', dificuldade: 1 },
  { q: 'O currículo dos Aventureiros é baseado em...', options: ['Classes e especialidades', 'Só em brincadeiras', 'Só em provas', 'Só em leitura'], categoria: 'historia', dificuldade: 2 },
  { q: 'O clube trabalha com crianças na faixa etária de...', options: ['6 a 9 anos', '5 a 8', '7 a 10', '10 a 15'], categoria: 'historia', dificuldade: 1 },
  { q: 'As atividades acontecem normalmente...', options: ['Nas igrejas locais', 'Só em casa', 'Só em escolas', 'Só em acampamentos'], categoria: 'historia', dificuldade: 2 },
  { q: 'O clube utiliza um sistema de progressão por...', options: ['Classes e especialidades', 'Notas escolares', 'Prova final', 'Nenhum'], categoria: 'historia', dificuldade: 2 },
  { q: 'O Clube de Aventureiros prepara a criança para se tornar futuramente um...', options: ['Desbravador', 'Escoteiro', 'Explorador', 'Nada'], categoria: 'historia', dificuldade: 2 },
  { q: 'Quem deve acompanhar a criança nas atividades do clube?', options: ['Pais e líderes voluntários', 'Só os amigos', 'Ninguém', 'Só o diretor'], categoria: 'historia', dificuldade: 2 }

];

// ============================================
//  SISTEMA DE ROTAÇÃO INTELIGENTE
//  Usa localStorage para memorizar quais perguntas
//  foram usadas recentemente e prioriza as menos vistas
// ============================================

const _PERGUNTAS_USO_KEY = 'perguntas_uso_v1';

function _getPerguntasUso() {
  try {
    const raw = localStorage.getItem(_PERGUNTAS_USO_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return (parsed && typeof parsed === 'object') ? parsed : {};
  } catch (e) { return {}; }
}

function _savePerguntasUso(obj) {
  try {
    localStorage.setItem(_PERGUNTAS_USO_KEY, JSON.stringify(obj));
  } catch (e) {}
}

// Marca uma pergunta como usada (chame após selecioná-la em um jogo)
function marcarPerguntaUsada(pergunta) {
  if (!pergunta || !pergunta.q) return;
  const uso = _getPerguntasUso();
  uso[pergunta.q] = Date.now();
  _savePerguntasUso(uso);
}

// Retorna perguntas ordenadas por prioridade:
// 1º as nunca usadas, depois as usadas há mais tempo
function getPerguntasPrioritarias(filtro) {
  const uso = _getPerguntasUso();
  let pool = PERGUNTAS_AVENTUREIROS.slice();

  if (typeof filtro === 'function') {
    pool = pool.filter(filtro);
  }

  const scored = pool.map(q => ({
    q,
    timestamp: uso[q.q] !== undefined ? uso[q.q] : -1
  }));

  scored.sort((a, b) => a.timestamp - b.timestamp);
  return scored.map(s => s.q);
}

function _shufflePerguntas(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Retorna um array embaralhado com prioridade para as perguntas
// menos recentemente usadas (as 60% "mais novas" vêm primeiro)
function embaralharPerguntasComRotacao(filtro) {
  const priorizadas = getPerguntasPrioritarias(filtro);
  const freshCount = Math.min(Math.ceil(priorizadas.length * 0.6), priorizadas.length);
  const fresh = _shufflePerguntas(priorizadas.slice(0, freshCount));
  const rest = _shufflePerguntas(priorizadas.slice(freshCount));
  return [...fresh, ...rest];
}

// Zera a rotação (útil para começar um novo acampamento)
function resetarRotacaoPerguntas() {
  localStorage.removeItem(_PERGUNTAS_USO_KEY);
}

// Diagnóstico: retorna quantas perguntas já foram usadas e quantas estão "frescas"
function estatisticasRotacao() {
  const uso = _getPerguntasUso();
  const total = PERGUNTAS_AVENTUREIROS.length;
  const usadas = Object.keys(uso).filter(k =>
    PERGUNTAS_AVENTUREIROS.some(p => p.q === k)
  ).length;
  return {
    total,
    usadas,
    naoUsadas: total - usadas
  };
}