export const $ = s => document.querySelector(s);
export const $$ = s => Array.from(document.querySelectorAll(s));
export const state = { name:'', age:null, activity:null, speakingEnabled:true };
let currentStep = 1;
export function goToStep(n){ currentStep=n; document.querySelectorAll('.step').forEach(s=>s.classList.toggle('active', Number(s.dataset.step)===n)); }
export function stepBack(){ if(currentStep>1) goToStep(currentStep-1); }
export function showApp(activity){ const app=document.querySelector('#appRoot'); app.classList.remove('hidden'); document.querySelectorAll('.app-section').forEach(sec=>sec.classList.toggle('hidden', sec.dataset.app!==activity)); const w=document.querySelector('#welcomeBanner'); const nice=state.name?`Hi, ${state.name}!`:'Hi there!'; const age=state.age?` I’ll use settings for ages ${state.age}.`:''; w.textContent=`${nice} You chose ${activity.toUpperCase()}.${age}`; }