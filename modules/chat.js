// modules/chat.js
import { $, state } from './helpers.js';

let voices = [];
function populateVoices() {
  voices = speechSynthesis.getVoices();
  const sel = $('#voiceSelect');
  if (!sel) return;
  sel.innerHTML = '';
  voices.forEach((v, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `${v.name} (${v.lang})`;
    sel.appendChild(opt);
  });
  const idx = voices.findIndex(v => /English|en-/i.test(v.lang));
  if (idx >= 0) sel.value = idx;
}
function speak(text) {
  if (!state.speakingEnabled || !('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  const idx = parseInt($('#voiceSelect')?.value || '0', 10);
  if (voices[idx]) u.voice = voices[idx];
  u.pitch = 1.1; u.rate = 0.95;
  speechSynthesis.cancel(); speechSynthesis.speak(u);
}
function addBubble(text, who='bot') {
  const el = document.createElement('div');
  el.className = `bubble ${who}`;
  el.textContent = text;
  $('#chatLog').appendChild(el);
  $('#chatLog').scrollTop = $('#chatLog').scrollHeight;
}

async function askAI(message) {
  const body = { message, name: state?.name || '', age: state?.age || '5-8' };
  const resp = await fetch('/api/ask', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
  if (!resp.ok) throw new Error('server error');
  const data = await resp.json();
  return data.text || "I’m not sure—try again?";
}

// fallback
const jokes = [
  "Why did the teddy bear say no to dessert? Because it was stuffed!",
  "What do you call cheese that isn’t yours? Nacho cheese!",
  "Why did the math book look sad? It had too many problems!"
];
const rnd = (n) => Math.floor(Math.random()*n);
const pick = (a) => a[rnd(a.length)];
let pendingQuiz = null;
function mathQuiz(age='5-8'){ let a,b,op; if(age==='2-4'){a=rnd(5)+1;b=rnd(5)+1;op='+';} else {a=rnd(10)+1;b=rnd(10)+1;op=Math.random()>0.5?'+':'-';} const ans=op==='+'?a+b:a-b; return {question:`Okay! What is ${a} ${op} ${b}?`, check:x=>Number(x)===ans, answer:ans}; }
function handleLocal(textRaw){
  const msg=(textRaw||'').toLowerCase().trim();
  const name = state.name ? `, ${state.name}` : '';
  if (!msg) return "I didn’t hear anything. Try again?";
  if (pendingQuiz){
    const guess = msg.match(/-?\d+/)?.[0];
    if (guess!==undefined && pendingQuiz.check(guess)){ pendingQuiz=null; return `Yay${name}! ${guess} is correct! 🎉 Want another question or a joke?`; }
    else if (guess!==undefined){ const correct=pendingQuiz.answer; pendingQuiz=null; return `Nice try${name}! The right answer was ${correct}. Want a different question or a joke?`; }
  }
  if (/(hello|hi|hey|good\s*morning|good\s*afternoon)/.test(msg)) return pick([`Hi${name}! 👋 Ready to play, draw, or take a silly photo?`,`Hey${name}! I can tell jokes, do math, or talk about animals!`,`Hello${name}! What shall we do next?`]);
  if (/name/.test(msg)) return `I’m the Kids AI Helper! And you are ${state.name || 'my friend'} 🤝`;
  if (/joke|make me laugh/.test(msg)) return pick(jokes);
  if (/math|quiz|question/.test(msg)) { pendingQuiz = mathQuiz(state.age || '5-8'); return pendingQuiz.question; }
  if (/animal|animals|favorite animal/.test(msg)) return pick(["I love penguins—they wear tiny tuxedos!","Giraffes are amazing—super long necks!","Kittens are so cute and playful! 🐱"]);
  if (/color|favourite colour|favorite color/.test(msg)) return pick(["Rainbow! 🌈","Blue like the sky!","Yellow—like sunshine!"]);
  if (/help|what can you do|menu/.test(msg)) return "Try: 'tell me a joke', 'math quiz', or use the camera and drawing pad!";
  return `That’s cool${name}! You said: “${textRaw}”. Want a joke or a math quiz?`;
}

export function initChat(){
  // voices
  if ('speechSynthesis' in window) {
    populateVoices();
    speechSynthesis.onvoiceschanged = populateVoices;
  }

  // typed flow
  $('#typeBtn')?.addEventListener('click', () => { $('#typeBox').classList.toggle('hidden'); $('#textInput').focus(); });
  $('#sendBtn')?.addEventListener('click', async () => {
    const text = $('#textInput').value.trim(); if (!text) return;
    $('#textInput').value=''; addBubble(text,'user');
    try { const ai = await askAI(text); addBubble(ai,'bot'); speak(ai); }
    catch { const fb = handleLocal(text); addBubble(fb,'bot'); speak(fb); }
  });

  // mic
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { const btn = $('#micBtn'); if (btn){ btn.disabled=true; btn.textContent='🎙️ Not supported'; } }
  else {
    const rec = new SR(); rec.lang='en-US'; rec.continuous=false; rec.interimResults=false;
    let recognizing=false;
    rec.onstart=()=>{ recognizing=true; $('#micBtn').textContent='🛑 Stop'; };
    rec.onend=()=>{ recognizing=false; $('#micBtn').textContent='🎙️ Hold to Talk'; };
    rec.onresult=async e=>{
      const text = Array.from(e.results).map(r=>r[0].transcript).join(' ').trim();
      if (!text) return; addBubble(text,'user');
      try{ const ai = await askAI(text); addBubble(ai,'bot'); speak(ai); }
      catch{ const fb = handleLocal(text); addBubble(fb,'bot'); speak(fb); }
    };
    $('#micBtn')?.addEventListener('mousedown', ()=>{ if(!recognizing) rec.start(); });
    $('#micBtn')?.addEventListener('mouseup',   ()=>{ if(recognizing) rec.stop(); });
    $('#micBtn')?.addEventListener('touchstart', (e)=>{ e.preventDefault(); if(!recognizing) rec.start(); }, {passive:false});
    $('#micBtn')?.addEventListener('touchend',   ()=>{ if(recognizing) rec.stop(); });
  }

  // greet
  const hello = `Hello${state.name ? ', ' + state.name : ''}! Ask me anything, or say "math quiz".`;
  addBubble(hello,'bot'); speak(hello);
}
