# Bonjour, Elisa! — Francês, 4º bimestre

Adaptação do Laboratório da Elisa de Ciências do 4º bimestre, com o mesmo mapa e uma atividade por vez.

Abra `abrir-jogo.bat` para iniciar um servidor local e abrir no Google Chrome. É necessário ter Node.js instalado. Alternativa no terminal desta pasta: `node servir.cjs`, depois acesse http://127.0.0.1:8784. O servidor aceita conexões apenas do próprio computador. Abrir `index.html` diretamente permite jogar, mas o YouTube pode recusar o vídeo por falta de referência HTTP.

As cinco missões são números de 1 a 10, cores, animais, cumprimentos e apresentação. O vídeo indicado pela família constitui a explicação antes das atividades; não há reprodução automática nem tempo mínimo obrigatório. No vídeo de animais, os botões oferecem trechos de animais selvagens, da fazenda e aquáticos. Há link alternativo para o YouTube em cada missão. Os vídeos exigem internet e a disponibilidade é controlada pelo YouTube.

As atividades incluem escolher alternativas, ligar cartões e ordenar blocos. Se precisar, a criança pode pedir uma pista, rever o vídeo sem perder a resposta em curso e tentar novamente. Na revisão final, o botão de vídeo abre a explicação do tema da pergunta. A apresentação digital pratica reconhecimento e montagem de frases; não avalia pronúncia ou produção oral espontânea.

Não há vidas, cronômetro, perda de pontos ou bloqueio de missões. O botão Pausa interrompe o vídeo; ao voltar, ele é recarregado sem reprodução automática. O botão de movimento reduzido remove transições e entra diretamente na missão. A preferência de movimento reduzido do sistema também é respeitada.

O progresso registra as missões percorridas neste navegador, não domínio do conteúdo. Ele usa uma chave local exclusiva de Francês; o jogo de Ciências permanece independente. O progresso se mantém ao fechar e reabrir o navegador, quando o armazenamento local estiver disponível. A resposta em andamento se mantém ao rever o vídeo ou pausar, mas não após recarregar a página.

Estrutura: `missoes.js` contém o banco de conteúdo; `app.js`, o motor; `style.css`, o visual; `assets`, os três arquivos visuais reaproveitados do jogo de Ciências. Não há dependências de bibliotecas para jogar.
