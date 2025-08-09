// modules/helpers.js
export const $ = (s) => document.querySelector(s);
export const $$ = (s) => Array.from(document.querySelectorAll(s));

export const state = {
  name: '', age: null, activity: null,
  speakingEnabled: true,
  inited: { chat: false, draw: false, cam: false }
};

let currentStep = 1;
export function goToStep(n) {
  currentStep = n;
  document.querySelectorAll('.step').forEach(s =>
    s.classList.toggle('active', Number(s.dataset.step) === n)
  );
}
export function stepBack() { if (currentStep > 1) goToStep(currentStep - 1); }

export function showApp(activity) {
  const appRoot = $('#appRoot');
  const welcome = $('#welcomeBanner');
  appRoot.classList.remove('hidden');
  document.querySelectorAll('.app-section').forEach(sec =>
    sec.classList.toggle('hidden', sec.dataset.app !== activity)
  );
  const nice = state.name ? `Hi, ${state.name}!` : 'Hi there!';
  const ageMsg = state.age ? ` I’ll use settings for ages ${state.age}.` : '';
  welcome.textContent = `${nice} You chose ${activity.toUpperCase()}.${ageMsg}`;
}
