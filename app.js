'use strict';
const $ = (id) => document.getElementById(id);
const storageKey = 'elisa-frances-4b-concluidas-v1';
function loadCompleted() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return new Set(modules.filter(module => Array.isArray(saved) && saved.includes(module.id)).map(module => module.id));
  } catch { return new Set(); }
}
const state = { moduleIndex: 0, questionIndex: 0, selected: null, answered: false,
  isReview: false, reviewMisses: new Set(), completed: loadCompleted(), order: [],
  matches: new Map(), matchLeft: null, reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches };
const adventures = [
  { place:'La place', landmark:'🔢', scene:'Na praça, vamos contar em francês.' },
  { place:'Le jardin', landmark:'🎨', scene:'O jardim está cheio de cores. Vamos descobrir seus nomes.' },
  { place:'Le parc', landmark:'🐾', scene:'Os animais do parque têm nomes em francês.' },
  { place:'Le café', landmark:'👋', scene:'No café, vamos praticar as palavras para cumprimentar e conversar.' },
  { place:'La rencontre', landmark:'💬', scene:'Um novo encontro! Vamos aprender a nos apresentar.' }
];
const mapPositions = [{x:18,y:18},{x:50,y:14},{x:81,y:24},{x:28,y:59},{x:72,y:66}];
let discoveries = [];
let mapTimer = null;
let mapDestination = null;
let videoWasActive = false;
function saveCompleted() {
  try { localStorage.setItem(storageKey, JSON.stringify([...state.completed])); } catch { /* Play remains available without storage. */ }
}
function make(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function shuffle(values) {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
function clearMapTrip() {
  if (mapTimer !== null) clearTimeout(mapTimer);
  mapTimer = null; mapDestination = null; $('skipWalk').hidden = true;
}
function enterMapDestination() {
  const index = mapDestination;
  clearMapTrip();
  if (index !== null) startMission(index);
}
function renderModuleList() {
  $('moduleList').replaceChildren(...modules.map((module, index) => {
    const button = make('button', 'module-item'); button.type = 'button';
    button.dataset.module = index;
    button.style.setProperty('--x', mapPositions[index].x + '%');
    button.style.setProperty('--y', mapPositions[index].y + '%');
    const active = !state.isReview && index === state.moduleIndex;
    button.classList.toggle('active', active);
    if (active) button.setAttribute('aria-current', 'step');
    const icon = make('span', 'module-icon', adventures[index].landmark); icon.setAttribute('aria-hidden', 'true');
    const name = make('span', 'module-name');
    name.append(make('small', '', adventures[index].place), document.createElement('br'), document.createTextNode(module.short));
    const done = state.completed.has(module.id);
    const check = make('span', 'module-check', done ? '✓' : '');
    if (done) check.setAttribute('aria-label', 'concluída'); else check.setAttribute('aria-hidden', 'true');
    button.append(icon, name, check); return button;
  }));
  if (state.isReview) $('finalReviewButton').setAttribute('aria-current', 'step');
  else $('finalReviewButton').removeAttribute('aria-current');
}
function renderProgress() {
  const percent = Math.round(state.completed.size / modules.length * 100);
  $('progressText').textContent = `${state.completed.size} de ${modules.length} missões concluídas`;
  $('progressPercent').textContent = percent + '%'; $('progressFill').style.width = percent + '%';
  $('resetButton').disabled = !state.completed.size;
}
function videoURL(video) {
  const url = new URL('https://www.youtube-nocookie.com/embed/' + video.id);
  url.search = 'rel=0&playsinline=1';
  return url.href;
}
function activateVideo() {
  const frame = $('lessonVideo');
  if (frame && frame.src === 'about:blank') frame.src = frame.dataset.source;
}
function stopVideo() {
  const frame = $('lessonVideo');
  if (frame && frame.src !== 'about:blank') frame.src = 'about:blank';
}
function renderExplanation(showQuestionVideo = false) {
  stopVideo();
  const host = $('videoLesson'); host.replaceChildren();
  const intro = document.querySelector('#learningCard .learning-intro');
  const source = modules[state.isReview && showQuestionVideo ? state.questionIndex : state.moduleIndex];
  $('learningTitle').textContent = state.isReview && !showQuestionVideo ? 'Uma nova rodada de descobertas' : 'O vídeo explica: ' + source.short;
  intro.textContent = state.isReview && !showQuestionVideo ? 'Uma atividade de cada tema. Durante as perguntas, você também pode rever o vídeo.' : 'Assista, pause e repita no seu ritmo. Depois, clique em “Jogar esta missão”.';
  if (state.isReview && !showQuestionVideo) {
    host.append(make('p', 'review-intro', 'Você pode pedir pistas durante toda a revisão. Não há cronômetro.'));
    return;
  }
  const video = source.video;
  const frame = document.createElement('iframe'); frame.id = 'lessonVideo';
  frame.title = video.title || modules[state.moduleIndex].short + ' — explicação em vídeo';
  frame.dataset.source = videoURL(video); frame.src = frame.dataset.source;
  frame.allow = 'accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen';
  frame.allowFullscreen = true; frame.referrerPolicy = 'strict-origin-when-cross-origin';
  const wrap = make('div', 'video-frame'); wrap.append(frame); host.append(wrap);
  if (source.id === 'animaux') {
    const chapters = make('div', 'video-chapters');
    chapters.append(make('p', '', 'Você pode assistir em partes:'));
    [['Animais selvagens',0],['Animais da fazenda',196],['Animais aquáticos',401]].forEach(([label,start]) => {
      const button = make('button','secondary-button',label); button.type = 'button';
      button.addEventListener('click',()=>{ const url = new URL(videoURL(video)); url.searchParams.set('start',start); frame.dataset.source = url.href; frame.src = url.href; });
      chapters.append(button);
    }); host.append(chapters);
  }
  const fallback = make('p', 'video-fallback', 'Se o vídeo não abrir aqui: ');
  const link = make('a', '', 'assistir no YouTube ↗'); link.href = video.url || 'https://www.youtube.com/watch?v=' + video.id;
  link.target = '_blank'; link.rel = 'noopener noreferrer'; fallback.append(link); host.append(fallback);
  host.append(make('p', 'video-note', 'Os vídeos precisam de internet. O jogo não exige assistir até o fim para continuar.'));
}
function showStage(stage, moveFocus = true) {
  if (stage !== 'learn') stopVideo(); else activateVideo();
  $('learningCard').hidden = stage !== 'learn'; $('conceptCard').hidden = stage !== 'learn';
  $('questionCard').hidden = stage !== 'play'; $('finishCard').hidden = stage !== 'finish';
  if (moveFocus) $({learn:'learningTitle',play:'questionText',finish:'finishTitle'}[stage]).focus();
}
function currentQuestion() { return state.isReview ? modules[state.questionIndex].review : modules[state.moduleIndex].questions[state.questionIndex]; }
function questionTotal() { return state.isReview ? modules.length : modules[state.moduleIndex].questions.length; }
function questionKind(item) { return ({order:'ordering',match:'matching'})[item.type] || item.type || 'choice'; }
function renderAdventure() {
  const host = $('adventureScene'); host.hidden = state.isReview; host.replaceChildren();
  if (state.isReview) return;
  const landscape = make('div', 'adventure-landscape');
  landscape.setAttribute('aria-hidden', 'true');
  landscape.append(make('span','adventure-landmark', adventures[state.moduleIndex].landmark),make('span','adventure-object',currentQuestion().icon));
  const trail = make('div','discovery-trail'); trail.setAttribute('aria-label', 'Atividades conferidas: ' + discoveries.filter(Boolean).length + ' de ' + questionTotal());
  for (let i = 0; i < questionTotal(); i++) { const token = make('span','',discoveries[i] || '◇'); token.setAttribute('aria-hidden','true'); trail.append(token); }
  host.append(landscape,make('p','',adventures[state.moduleIndex].scene),trail);
}
function renderVisual(item) {
  const host = $('questionVisual'); host.replaceChildren(); host.hidden = !item.swatch && !item.visual && !item.material;
  if (item.swatch && /^#[0-9a-f]{3,8}$/i.test(item.swatch)) {
    const swatch = make('div', 'color-swatch'); swatch.style.backgroundColor = item.swatch;
    swatch.setAttribute('role','img'); swatch.setAttribute('aria-label',item.visualLabel || 'Amostra da cor'); host.append(swatch);
  }
  if (item.visual || item.material) {
    const visual = make('p','visual-symbols',item.visual || item.material);
    if(item.visualLabel){visual.setAttribute('role','img');visual.setAttribute('aria-label',item.visualLabel);}
    host.append(visual);
  }
}
function updateReady() {
  const item = currentQuestion(); const kind = questionKind(item);
  $('nextButton').disabled = kind === 'ordering' ? state.order.length !== (item.tokens || item.options).length
    : kind === 'matching' ? state.matches.size !== item.pairs.length : state.selected === null;
}
function renderOrdering(item) {
  const tokens = item.tokens || item.options;
  const answer = make('div', 'ordered-answer'); answer.id = 'orderedAnswer'; answer.setAttribute('aria-live','polite');
  const instruction = make('p','activity-instruction','Clique nos blocos na ordem. Você pode desfazer antes de conferir.');
  const pool = make('div','token-pool');
  const undo = make('button','text-button','↶ Desfazer último'); undo.type = 'button'; undo.id = 'undoOrder'; undo.disabled = true;
  const refresh = () => {
    answer.replaceChildren(...state.order.map(index=>make('span','ordered-token',tokens[index])));
    if (!state.order.length) answer.append(make('span','empty-answer','Sua sequência aparece aqui.'));
    pool.querySelectorAll('button').forEach(button=>{ button.disabled = state.order.includes(Number(button.dataset.token)); });
    undo.disabled = !state.order.length; updateReady();
  };
  tokens.forEach((token,index)=>{ const button=make('button','secondary-button token',token); button.type='button';button.dataset.token=index;button.lang='fr';button.addEventListener('click',()=>{if(state.answered)return;state.order.push(index);refresh();});pool.append(button); });
  undo.addEventListener('click',()=>{if(state.answered)return;state.order.pop();refresh();});
  $('answerArea').append(instruction,answer,pool,undo); refresh();
}
function renderMatching(item) {
  const instruction = make('p','activity-instruction','Escolha um cartão à esquerda e depois o par à direita. Para trocar, escolha o cartão novamente.');
  const columns = make('div','matching-columns'); const left=make('div','matching-side'); const right=make('div','matching-side');
  left.setAttribute('aria-label','Primeiros cartões');right.setAttribute('aria-label','Cartões para associar');
  const status=make('p','match-status');status.id='matchStatus';status.setAttribute('aria-live','polite');
  const refresh = () => {
    left.querySelectorAll('button').forEach(button=>{
      const index=Number(button.dataset.left); const selected=state.matchLeft===index;
      button.setAttribute('aria-pressed',String(selected));button.classList.toggle('selected',selected);
      const paired=state.matches.get(index);
      button.textContent=item.pairs[index].left+(paired===undefined?'':' → '+item.pairs[paired].right);
    });
    right.querySelectorAll('button').forEach(button=>{
      const index=Number(button.dataset.right); const used=[...state.matches.values()].includes(index);
      button.classList.toggle('paired',used);button.setAttribute('aria-pressed',String(used));
    });
    status.textContent=`${state.matches.size} de ${item.pairs.length} pares montados.`; updateReady();
  };
  item.pairs.forEach((pair,index)=>{const button=make('button','answer-option match-card',pair.left);button.type='button';button.dataset.left=index;button.addEventListener('click',()=>{if(state.answered)return;state.matchLeft=index;refresh();});left.append(button);});
  shuffle(item.pairs.map((_,index)=>index)).forEach(index=>{const button=make('button','answer-option match-card',item.pairs[index].right);button.type='button';button.dataset.right=index;button.addEventListener('click',()=>{
    if(state.answered)return;
    if(state.matchLeft===null){status.textContent='Primeiro, escolha um cartão à esquerda.';return;}
    for(const [key,value] of state.matches) if(value===index) state.matches.delete(key);
    state.matches.set(state.matchLeft,index);state.matchLeft=null;refresh();
  });right.append(button);});
  columns.append(left,right);$('answerArea').append(instruction,columns,status);refresh();
}
function renderQuestion() {
  const item=currentQuestion();state.selected=null;state.answered=false;state.order=[];state.matches.clear();state.matchLeft=null;
  const kind=questionKind(item);
  $('questionCount').textContent=`${item.stage==='guided'?'Prática com apoio':'Atividade'} ${state.questionIndex+1} de ${questionTotal()}`;
  $('classification').hidden=true;
  $('questionIcon').textContent=item.icon;$('questionText').textContent=item.text;
  $('answerArea').className='answer-area'+(['ordering','matching'].includes(kind)?' construction-area':'');
  $('answerArea').replaceChildren();renderAdventure();renderVisual(item);
  $('hintArea').hidden=true;$('hintArea').textContent='Pista · '+item.hint;
  $('feedbackArea').hidden=true;$('feedbackArea').textContent='';$('feedbackArea').classList.remove('needs-practice');
  $('hintButton').disabled=false;$('retryButton').hidden=true;$('nextButton').hidden=false;$('nextButton').disabled=true;$('nextButton').textContent='Conferir';
  if(kind==='ordering')renderOrdering(item);
  else if(kind==='matching')renderMatching(item);
  else item.options.forEach((option,index)=>{
    const button=make('button','answer-option');button.type='button';button.dataset.answer=index;button.setAttribute('aria-pressed','false');
    const letter=make('span','',String.fromCharCode(65+index));letter.setAttribute('aria-hidden','true');
    const label=make('strong','option-label',option);button.append(letter,label);
    button.addEventListener('click',()=>{
      if(state.answered)return;state.selected=index;
      $('answerArea').querySelectorAll('[data-answer]').forEach(el=>el.setAttribute('aria-pressed',String(Number(el.dataset.answer)===index)));updateReady();
    });$('answerArea').append(button);
  });
}
function startMission(index,isReview=false,moveFocus=true) {
  clearMapTrip();stopVideo();state.moduleIndex=index;state.questionIndex=0;state.isReview=isReview;state.reviewMisses.clear();discoveries=[];
  const module=modules[index];
  $('lessonKicker').textContent=isReview?'Uma atividade de cada missão':`Missão ${index+1} de ${modules.length}`;
  $('lessonTitle').textContent=isReview?'Revisão final':module.title;$('lessonNumber').textContent=isReview?'★':module.icon;
  $('conceptIcon').textContent=isReview?'★':module.icon;$('conceptText').textContent=isReview?'Vamos juntar o que você praticou nas cinco missões.':module.concept;
  $('practiceButton').textContent=isReview?'Começar revisão':'Jogar esta missão';
  $('mapHero').style.left=mapPositions[index].x+'%';$('mapHero').style.top=mapPositions[index].y+'%';
  renderModuleList();renderExplanation();renderQuestion();showStage('learn',moveFocus);
  if(moveFocus)$('lesson').scrollIntoView({block:'start'});
}
function showFeedback() {
  const item=currentQuestion();const kind=questionKind(item);
  const correct=kind==='ordering'?state.order.length===item.answer.length&&state.order.every((value,index)=>value===item.answer[index])
    :kind==='matching'?item.pairs.every((_,index)=>state.matches.get(index)===index):state.selected===item.answer;
  state.answered=true;
  $('answerArea').querySelectorAll('button').forEach(button=>{button.disabled=true;
    if(button.dataset.answer!==undefined){const index=Number(button.dataset.answer);button.classList.toggle('correct',index===item.answer);button.classList.toggle('wrong',index===state.selected&&!correct);}
  });
  if(state.isReview&&!correct)state.reviewMisses.add(modules[state.questionIndex].short);
  if(!state.isReview){discoveries[state.questionIndex]=item.icon;renderAdventure();}
  let solution='';
  if(!correct){
    if(kind==='ordering')solution='A sequência é: '+item.answer.map(index=>(item.tokens||item.options)[index]).join(' → ')+'. ';
    else if(kind==='matching')solution='Os pares são: '+item.pairs.map(pair=>pair.left+' → '+pair.right).join('; ')+'. ';
    else solution='A resposta é “'+item.options[item.answer]+'”. ';
  }
  $('feedbackArea').hidden=false;$('feedbackArea').classList.toggle('needs-practice',!correct);
  $('feedbackArea').textContent=(correct?'Isso mesmo! ':'Vamos aprender juntos. ')+solution+item.why;
  $('hintButton').disabled=true;$('retryButton').hidden=correct;
  $('nextButton').disabled=false;$('nextButton').textContent=state.questionIndex+1===questionTotal()?'Terminar missão':'Próxima atividade';
}
function finishMission() {
  $('continueButton').hidden=state.isReview;$('exhibitGallery').hidden=true;
  if(state.isReview){$('finishTitle').textContent='Revisão concluída!';$('finishText').textContent=state.reviewMisses.size?'Você terminou! Se quiser praticar mais, visite: '+[...state.reviewMisses].join(', ')+'.':'Você acertou todas as atividades desta rodada.';}
  else{
    state.completed.add(modules[state.moduleIndex].id);saveCompleted();renderProgress();renderModuleList();
    $('finishTitle').textContent='Bravo! Missão concluída!';$('finishText').textContent='Você chegou ao fim desta prática. Pode seguir, rever o vídeo ou fazer uma pausa.';
    $('continueButton').textContent=state.moduleIndex+1===modules.length?'Ir para a revisão final':'Próxima missão';
  }
  showStage('finish');
}
function nextQuestion() {
  if(!state.answered){if(!$('nextButton').disabled)showFeedback();}
  else if(state.questionIndex+1<questionTotal()){state.questionIndex++;renderQuestion();showStage('play');}
  else finishMission();
}
$('moduleList').addEventListener('click',event=>{
  const button=event.target.closest('[data-module]');if(!button)return;
  clearMapTrip();stopVideo();const index=Number(button.dataset.module);mapDestination=index;
  $('mapHero').style.left=mapPositions[index].x+'%';$('mapHero').style.top=mapPositions[index].y+'%';
  if(state.reducedMotion)enterMapDestination();else{$('skipWalk').hidden=false;mapTimer=setTimeout(enterMapDestination,1800);}
});
$('skipWalk').addEventListener('click',enterMapDestination);
$('startButton').addEventListener('click',()=>{const index=modules.findIndex(module=>!state.completed.has(module.id));startMission(index<0?0:index,index<0);});
$('finalReviewButton').addEventListener('click',()=>startMission(0,true));
$('replayButton').addEventListener('click',()=>startMission(state.moduleIndex,state.isReview));
$('continueButton').addEventListener('click',()=>{const next=state.moduleIndex+1;startMission(next===modules.length?0:next,next===modules.length);});
$('resetButton').addEventListener('click',()=>{if(!state.completed.size||!window.confirm('Apagar o progresso de Francês e começar de novo?'))return;state.completed.clear();saveCompleted();renderProgress();startMission(0,false,false);});
$('pauseButton').addEventListener('click',()=>{videoWasActive=!!$('lessonVideo')&&$('lessonVideo').src!=='about:blank';stopVideo();clearMapTrip();$('pauseDialog').showModal();});
$('pauseDialog').addEventListener('close',()=>{if(videoWasActive&&!$('learningCard').hidden)activateVideo();videoWasActive=false;});
$('practiceButton').addEventListener('click',()=>showStage('play'));
$('explanationButton').addEventListener('click',()=>{renderExplanation(state.isReview);$('practiceButton').textContent='Voltar à atividade';showStage('learn');});
$('hintButton').addEventListener('click',()=>{$('hintArea').hidden=false;});
$('retryButton').addEventListener('click',()=>{renderQuestion();showStage('play');});
$('nextButton').addEventListener('click',nextQuestion);
function renderMotion(){document.body.classList.toggle('reduce-motion',state.reducedMotion);$('motionButton').setAttribute('aria-pressed',String(state.reducedMotion));$('motionButton').textContent=state.reducedMotion?'Movimento: reduzido':'Movimento: normal';}
$('motionButton').addEventListener('click',()=>{state.reducedMotion=!state.reducedMotion;renderMotion();if(state.reducedMotion&&mapDestination!==null)enterMapDestination();});
renderMotion();startMission(0,false,false);renderProgress();
