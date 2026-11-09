// Banco de revisão: o vídeo de cada missão é a explicação principal.
// As atividades verificam reconhecimento e construção com cartões, não pronúncia.
const question = (icon, text, options, answer, hint, why, extra = {}) =>
  ({ icon, text, options, answer, hint, why, ...extra });
const matching = (icon, text, pairs, hint, why) =>
  ({ type: 'matching', icon, text, pairs: pairs.map(([left, right]) => ({ left, right })), hint, why });
const ordering = (icon, text, tokens, answer, hint, why) =>
  ({ type: 'ordering', icon, text, tokens, answer, hint, why });
const lessonVideo = (id, title) => ({ id, title, url: `https://www.youtube.com/watch?v=${id}` });

const modules = [
  {
    id: 'nombres', icon: '🔢', short: 'Les nombres',
    title: 'Conte de 1 a 10',
    concept: 'Reconhecer os números de 1 a 10 em francês.',
    video: lessonVideo('WNOZLPK7-g8', 'Les nombres · Os números de 1 a 10'),
    explanation: [],
    questions: [
      question('🔢', 'Qual palavra em francês corresponde ao número 3?', ['trois', 'six', 'un'], 0,
        'Conte devagar: un, deux, trois.', 'Trois corresponde ao número 3.', { visual: '3', visualLabel: 'Número 3' }),
      question('🔢', 'Qual palavra em francês corresponde ao número 7?', ['quatre', 'sept', 'dix'], 1,
        'O número vem depois de six e antes de huit.', 'Sept corresponde ao número 7.', { visual: '7', visualLabel: 'Número 7' }),
      ordering('🧩', 'Coloque os números de 1 a 3 na ordem de contar.', ['trois', 'un', 'deux'], [1, 2, 0],
        'Comece por un, que significa 1.', 'A ordem é un → deux → trois: 1, 2, 3.'),
      matching('🔗', 'Ligue cada número à palavra em francês.', [['1', 'un'], ['2', 'deux'], ['3', 'trois'], ['4', 'quatre'], ['5', 'cinq']],
        'Use a sequência de contar do vídeo, uma ligação por vez.', 'As ligações são 1–un, 2–deux, 3–trois, 4–quatre e 5–cinq.'),
      matching('🔗', 'Agora ligue os números de 6 a 10.', [['6', 'six'], ['7', 'sept'], ['8', 'huit'], ['9', 'neuf'], ['10', 'dix']],
        'Continue a contagem depois de cinq.', 'As ligações são 6–six, 7–sept, 8–huit, 9–neuf e 10–dix.'),
      question('🔢', 'Conte as bolinhas. Qual é a quantidade em francês?', ['deux', 'dix', 'six'], 2,
        'Conte uma bolinha de cada vez. São seis.', 'Há 6 bolinhas. Em francês, dizemos six.', { visual: '● ● ●\n● ● ●', visualLabel: 'Seis bolinhas, em duas fileiras de três' })
    ],
    review: question('🔢', 'Uma caixa tem 8 lápis. Qual palavra indica essa quantidade?', ['huit', 'trois', 'neuf'], 0,
      'Oito vem depois de sept.', 'Huit corresponde ao número 8.', { visual: '8', visualLabel: 'Número 8' })
  },
  {
    id: 'couleurs', icon: '🎨', short: 'Les couleurs',
    title: 'Encontre as cores',
    concept: 'Relacionar cores aos seus nomes em francês.',
    video: lessonVideo('jy1o3HHWc8I', 'Les couleurs · As cores'),
    explanation: [],
    questions: [
      question('🎨', 'Como se chama esta cor em francês?', ['bleu', 'rouge', 'jaune'], 1,
        'A amostra é vermelha. Em francês, vermelho é rouge.', 'Rouge significa vermelho.', { swatch: '#d62828', visualLabel: 'Amostra vermelha' }),
      question('🎨', 'Escolha o nome em francês desta cor.', ['vert', 'noir', 'bleu'], 2,
        'A amostra é azul. Procure bleu.', 'Bleu significa azul.', { swatch: '#2265c7', visualLabel: 'Amostra azul' }),
      question('🎨', 'Qual palavra combina com esta amostra?', ['jaune', 'rose', 'blanc'], 0,
        'A amostra é amarela. Procure jaune.', 'Jaune significa amarelo.', { swatch: '#ffd43b', visualLabel: 'Amostra amarela' }),
      question('🎨', 'Como se chama esta cor em francês?', ['orange', 'vert', 'rouge'], 1,
        'A amostra é verde. Procure vert.', 'Vert significa verde.', { swatch: '#238442', visualLabel: 'Amostra verde' }),
      matching('🔗', 'Ligue os nomes das cores em português e francês.', [['preto', 'noir'], ['branco', 'blanc'], ['laranja', 'orange']],
        'Comece por uma cor que você lembra. Orange parece com laranja.', 'Preto é noir, branco é blanc e laranja é orange.'),
      matching('🔗', 'Encontre os outros quatro pares de cores.', [['rosa', 'rose'], ['roxo', 'violet'], ['marrom', 'marron'], ['cinza', 'gris']],
        'Observe as palavras parecidas: rosa–rose e marrom–marron. Cinza é gris.', 'Rosa é rose, roxo é violet, marrom é marron e cinza é gris.')
    ],
    review: question('🎨', 'Você quer a tinta azul. Qual nome deve procurar?', ['jaune', 'bleu', 'vert'], 1,
      'Azul em francês é bleu.', 'Procure bleu para escolher a tinta azul.', { swatch: '#2265c7', visualLabel: 'Amostra azul' })
  },
  {
    id: 'animaux', icon: '🦁', short: 'Les animaux',
    title: 'Conheça os animais',
    concept: 'Relacionar animais aos seus nomes em francês.',
    video: lessonVideo('gRpfi3B1dy4', 'Les animaux · Animais selvagens, da fazenda e aquáticos'),
    explanation: [],
    questions: [
      question('🦁', 'Como se diz leão em francês?', ['le lapin', 'le chat', 'le lion'], 2,
        'Leão tem um nome parecido em francês: lion.', 'Le lion é o leão.', { visual: '🦁', visualLabel: 'Leão' }),
      question('🐕', 'Qual é o nome do cachorro em francês?', ['le chien', 'le cheval', 'le crabe'], 0,
        'Procure le chien. Cheval é cavalo.', 'Le chien é o cachorro.', { visual: '🐕', visualLabel: 'Cachorro' }),
      question('🐴', 'Escolha a palavra que significa cavalo.', ['la vache', 'le cheval', 'la poule'], 1,
        'No vídeo da fazenda, o cavalo é chamado cheval.', 'Le cheval é o cavalo.', { visual: '🐴', visualLabel: 'Cavalo' }),
      question('🐬', 'Como se diz golfinho em francês?', ['la baleine', 'le lion', 'le dauphin'], 2,
        'No trecho dos animais aquáticos, golfinho é dauphin.', 'Le dauphin é o golfinho.', { visual: '🐬', visualLabel: 'Golfinho' }),
      matching('🔗', 'Ligue os animais da fazenda aos seus nomes.', [['vaca', 'la vache'], ['galinha', 'la poule'], ['coelho', 'le lapin'], ['gato', 'le chat']],
        'Você pode voltar ao vídeo no trecho dos animais da fazenda.', 'Vaca é la vache; galinha, la poule; coelho, le lapin; gato, le chat.'),
      matching('🔗', 'Mais quatro animais: encontre cada par.', [['elefante', 'l’éléphant'], ['girafa', 'la girafe'], ['zebra', 'le zèbre'], ['caranguejo', 'le crabe']],
        'Comece pelos nomes parecidos, como girafe e crabe.', 'Elefante é l’éléphant; girafa, la girafe; zebra, le zèbre; caranguejo, le crabe.')
    ],
    review: question('🐳', 'Qual palavra em francês significa baleia?', ['la baleine', 'le cheval', 'la vache'], 0,
      'Procure o nome do grande animal aquático: baleine.', 'La baleine é a baleia.', { visual: '🐳', visualLabel: 'Baleia' })
  },
  {
    id: 'politesse', icon: '👋', short: 'Les mots de politesse',
    title: 'Cumprimente em francês',
    concept: 'Escolher uma saudação de acordo com a situação.',
    video: lessonVideo('lwmrMVsU3uU', 'Les mots de politesse · Cumprimentos em francês'),
    explanation: [],
    questions: [
      question('🌤️', 'É de manhã. Você chega à escola. Qual cumprimento combina?', ['Au revoir !', 'Bonjour !', 'Bonne nuit !'], 1,
        'Bonjour é usado para cumprimentar durante o dia.', 'Bonjour ! é um cumprimento usado durante o dia, como bom dia ou olá.'),
      question('🌙', 'É de noite. Você chega para encontrar a família. Como cumprimenta?', ['Bonsoir !', 'Au revoir !', 'Bonjour !'], 0,
        'Para cumprimentar à noite, use bonsoir.', 'Bonsoir ! é um cumprimento ao encontrar alguém à noite.'),
      question('🚪', 'Você está indo embora. Qual expressão de despedida pode usar?', ['Bonsoir !', 'Bonjour !', 'Au revoir !'], 2,
        'Au revoir é usado ao se despedir.', 'Au revoir ! significa até logo ou adeus, conforme a situação.'),
      question('👋', 'Você encontra um amigo. Qual cumprimento informal combina?', ['Bonne nuit !', 'Salut !', 'Au revoir !'], 1,
        'Salut é um jeito informal de dizer oi.', 'Salut ! pode ser usado para cumprimentar um amigo.'),
      matching('🔗', 'Ligue cada situação à expressão que combina.', [['cumprimentar durante o dia', 'Bonjour !'], ['cumprimentar à noite', 'Bonsoir !'], ['despedir-se ao ir embora', 'Au revoir !']],
        'Observe se a pessoa está chegando ou saindo e se é dia ou noite.', 'Bonjour cumprimenta durante o dia; bonsoir, à noite; au revoir é uma despedida.'),
      question('🛏️', 'Você vai dormir. Qual expressão combina com esse momento?', ['Bonne nuit !', 'Bonjour !', 'Bonsoir !'], 0,
        'Para desejar boa noite antes de dormir, use bonne nuit.', 'Bonne nuit ! é usado para desejar uma boa noite de sono.')
    ],
    review: question('🚶', 'A visita acabou e você vai para casa. O que pode dizer?', ['Bonjour !', 'Bonsoir !', 'Au revoir !'], 2,
      'Escolha uma expressão de despedida.', 'Au revoir ! é uma forma de se despedir.')
  },
  {
    id: 'presentation', icon: '💬', short: 'La présentation',
    title: 'Apresente-se em francês',
    concept: 'Reconhecer perguntas e montar frases simples de apresentação.',
    video: lessonVideo('L6ycq_IRUY8', 'La présentation · Apresentar-se em francês'),
    explanation: [],
    questions: [
      question('💬', 'Qual frase diz “Eu me chamo Elisa”?', ['Merci !', 'Je m’appelle Elisa.', 'Bonjour !'], 1,
        'Je m’appelle é a expressão usada para dizer o nome.', 'Je m’appelle Elisa. significa Eu me chamo Elisa.'),
      question('💬', 'A pergunta é “Comment t’appelles-tu ?”. O que a pessoa quer saber?', ['Seu nome', 'Sua idade', 'Sua cor favorita'], 0,
        'A palavra appelles lembra a frase Je m’appelle.', 'Comment t’appelles-tu ? pergunta Como você se chama?'),
      ordering('🧩', 'Monte a frase “Eu me chamo Elisa”.', ['Elisa.', 'm’appelle', 'Je'], [2, 1, 0],
        'Comece por Je, depois use m’appelle e o nome.', 'A frase fica Je m’appelle Elisa.'),
      question('💬', 'Hugo diz “Moi, c’est Hugo.”. O que ele está fazendo?', ['Dizendo até logo', 'Perguntando o nome de alguém', 'Apresentando o próprio nome'], 2,
        'Moi, c’est... também é um jeito de se apresentar.', 'Moi, c’est Hugo. é uma forma de dizer Eu sou o Hugo.'),
      ordering('🧩', 'Monte a pergunta “Como você se chama?”.', ['t’appelles-tu', 'Comment', '?'], [1, 0, 2],
        'A pergunta começa com Comment. O ponto de interrogação fica no fim.', 'A pergunta fica Comment t’appelles-tu ?'),
      matching('🔗', 'Ligue as expressões do vídeo aos seus significados.', [['Je m’appelle Hugo.', 'Eu me chamo Hugo.'], ['s’il te plaît', 'por favor'], ['merci', 'obrigado / obrigada']],
        'Je m’appelle apresenta o nome. S’il te plaît pede com gentileza. Merci agradece.', 'Je m’appelle Hugo. apresenta o nome. S’il te plaît significa por favor; merci significa obrigado ou obrigada.')
    ],
    review: question('💬', 'Léo quer dizer seu nome. Qual frase deve escolher?', ['Comment t’appelles-tu ?', 'Je m’appelle Léo.', 'Merci !'], 1,
      'Para dizer o nome, use Je m’appelle e o nome da pessoa.', 'Je m’appelle Léo. significa Eu me chamo Léo.')
  }
];
