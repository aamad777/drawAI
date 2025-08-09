import { $, $$, state, goToStep, stepBack, showApp } from './helpers.js';
import { initChat } from './chat.js';
import { initDraw } from './draw.js';
import { initCamera } from './camera.js';
window.addEventListener('DOMContentLoaded',()=>{
  $('#muteBtn')?.addEventListener('click',()=>{ state.speakingEnabled=!state.speakingEnabled; $('#muteBtn').textContent=state.speakingEnabled?'🔊 Voice On':'🔇 Voice Off';});
  $('#toStep2')?.addEventListener('click',()=>{ const name=$('#kidName').value.trim(); if(!name){ $('#kidName').focus(); return;} state.name=name; goToStep(2); });
  $$('[data-back]').forEach(b=>b.addEventListener('click', stepBack));
  $$('.age-card').forEach(c=>c.addEventListener('click',()=>{ state.age=c.dataset.age; goToStep(3);}));
  $$('.activity-card').forEach(c=>c.addEventListener('click',()=>{ state.activity=c.dataset.activity; document.querySelector('#onboarding').classList.add('hidden'); showApp(state.activity); if(state.activity==='talk') initChat(); if(state.activity==='draw') initDraw(); if(state.activity==='photo') initCamera(); }));
  $('#changeChoice')?.addEventListener('click',()=>{ document.querySelector('#appRoot').classList.add('hidden'); document.querySelector('#onboarding').classList.remove('hidden'); goToStep(3); });
});