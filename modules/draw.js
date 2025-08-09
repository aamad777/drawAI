// modules/draw.js
import { $, $$, state } from './helpers.js';

const LABEL_MAP = {
  "tabby": "cat", "tiger cat": "cat", "Egyptian cat": "cat", "lynx": "cat",
  "Siamese cat": "cat", "Persian cat": "cat", "kitten": "cat",
  "golden retriever": "dog", "Labrador retriever": "dog", "beagle": "dog", "puppy": "dog",
  "jay": "bird", "magpie": "bird", "hen": "bird", "robin": "bird", "ostrich": "bird",
  "goldfish": "fish", "tench": "fish", "rock beauty": "fish", "puffer": "fish",
  "car": "car", "sports car": "car", "minivan": "car", "jeep": "car",
  "tree": "tree", "palm": "tree", "Christmas tree": "tree",
  "house": "house",
  "daisy": "flower", "sunflower": "flower", "lotus": "flower",
  "apple": "apple",
  "banana": "banana"
};
const PIC_FOR = {
  "cat":"public/cat.svg","dog":"public/dog.svg","bird":"public/bird.svg","fish":"public/fish.svg",
  "car":"public/car.svg","tree":"public/tree.svg","house":"public/house.svg","flower":"public/flower.svg",
  "apple":"public/apple.svg","banana":"public/banana.svg"
};

let model = null;
async function loadMobileNet() {
  if (model) return model;
  try { model = await mobilenet.load(); return model; } catch { return null; }
}

export function initDraw(){
  const canvas = $('#drawCanvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  let drawing=false, brushColor='#1982c4', brushSize=10;
  function setColor(c){ brushColor=c; $$('.swatch').forEach(s=>s.setAttribute('aria-checked', String(s.dataset.color===c))); }
  function start(x,y){ drawing=true; ctx.lineCap='round'; ctx.lineJoin='round'; ctx.strokeStyle=brushColor; ctx.lineWidth=brushSize; ctx.beginPath(); ctx.moveTo(x,y); }
  function move(x,y){ if(!drawing) return; ctx.lineTo(x,y); ctx.stroke(); }
  function end(){ drawing=false; ctx.closePath(); }
  function pos(e){ const r=canvas.getBoundingClientRect(); const x=(e.touches?e.touches[0].clientX:e.clientX)-r.left; const y=(e.touches?e.touches[0].clientY:e.clientY)-r.top; return { x: x*(canvas.width/r.width), y: y*(canvas.height/r.height) }; }

  $$('.swatch').forEach(b=>b.addEventListener('click', ()=>setColor(b.dataset.color)));
  $('#brushSize').addEventListener('input', e=>brushSize=+e.target.value);
  canvas.addEventListener('mousedown', e=>{ const p=pos(e); start(p.x,p.y); });
  canvas.addEventListener('mousemove', e=>{ const p=pos(e); move(p.x,p.y); });
  window.addEventListener('mouseup', end);
  canvas.addEventListener('touchstart', e=>{ const p=pos(e); start(p.x,p.y); }, {passive:false});
  canvas.addEventListener('touchmove', e=>{ e.preventDefault(); const p=pos(e); move(p.x,p.y); }, {passive:false});
  canvas.addEventListener('touchend', end);

  $$('.sticker').forEach(b=>b.addEventListener('click', ()=>{ ctx.font='48px serif'; ctx.fillText(b.textContent, Math.random()*(canvas.width-60)+20, Math.random()*(canvas.height-60)+60); }));
  $('#clearBtn').addEventListener('click', ()=>ctx.clearRect(0,0,canvas.width,canvas.height));
  $('#saveDrawingBtn').addEventListener('click', ()=>{ const a=document.createElement('a'); a.href=canvas.toDataURL('image/png'); a.download='my_drawing.png'; a.click(); });

  $('#aiGuessBtn').addEventListener('click', async ()=>{
    const m = await loadMobileNet();
    if (!m) { $('#aiGuessLabel').textContent = 'Model failed to load.'; return; }
    const tmp=document.createElement('canvas'); tmp.width=224; tmp.height=224;
    const t=tmp.getContext('2d'); t.fillStyle='#fff'; t.fillRect(0,0,224,224); t.drawImage(canvas,0,0,224,224);
    const preds=await m.classify(tmp); if(!preds?.length){ $('#aiGuessLabel').textContent='I cannot tell. Try again!'; return; }
    let best=preds[0].className;
    for (const [k,v] of Object.entries(LABEL_MAP)) if (best.toLowerCase().includes(k.toLowerCase())) { best=v; break; }
    state.lastGuess=String(best).toLowerCase();
    $('#aiGuessLabel').textContent = `I think this is a ${state.lastGuess}!`;
  });
  $('#showPicBtn').addEventListener('click', ()=>{
    const guess=state.lastGuess; const box=$('#aiPicBox');
    if(!guess){ box.textContent='Guess something first!'; box.classList.remove('hidden'); return; }
    const src=PIC_FOR[guess]; if(!src){ box.textContent='No picture for that yet.'; box.classList.remove('hidden'); return; }
    box.innerHTML = `<img alt="${guess}" src="${src}">`; box.classList.remove('hidden');
  });

  // default color
  setColor(brushColor);
}
