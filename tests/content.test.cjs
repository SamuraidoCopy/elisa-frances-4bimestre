const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const context = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(root, 'missoes.js'), 'utf8')+'\nglobalThis.bank=modules;', context);
const bank=JSON.parse(JSON.stringify(context.bank));
test('cinco temas com os vídeos solicitados e revisão própria',()=>{
  assert.deepEqual(bank.map(m=>m.video.id), ['WNOZLPK7-g8','jy1o3HHWc8I','gRpfi3B1dy4','lwmrMVsU3uU','L6ycq_IRUY8']);
  assert.equal(new Set(bank.map(m=>m.id)).size,5);
  for(const m of bank){assert.ok(m.questions.length>=5);assert.ok(m.review);assert.equal(m.video.url,'https://www.youtube.com/watch?v='+m.video.id);}
});
test('atividades têm enunciado, pistas e gabaritos válidos sem pares ambíguos',()=>{
  const types=new Set();
  for(const m of bank) for(const q of [...m.questions,m.review]){
    const type=q.type||'choice';types.add(type);
    for(const k of ['text','hint','why']) assert.ok(q[k]?.trim(),m.id+' '+k);
    if(type==='matching'){
      assert.ok(q.pairs.length>=2);
      for(const side of ['left','right']) assert.equal(new Set(q.pairs.map(p=>p[side])).size,q.pairs.length);
    } else if(type==='ordering'){
      assert.equal(q.tokens.length,q.answer.length);
      assert.deepEqual([...q.answer].sort((a,b)=>a-b),q.tokens.map((_,i)=>i));
    } else {
      assert.ok(q.options.length>=2); assert.equal(new Set(q.options).size,q.options.length);
      assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length);
    }
  }
  assert.deepEqual([...types].sort(),['choice','matching','ordering']);
});
test('progresso próprio e recursos locais presentes',()=>{
  const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
  assert.ok(app.includes('elisa-frances-4b-concluidas-v1'));
  assert.ok(!app.includes('elisa-ciencias-4b-concluidas'));
  for(const f of ['index.html','style.css','app.js','missoes.js','assets/map-bg.jpg','assets/hero.png']) assert.ok(fs.statSync(path.join(root,f)).size>0);
});
