// modules/main.js
import { $, $$, state, goToStep, stepBack, showApp } from './helpers.js';
import { initChat } from './chat.js';
import { initDraw } from './draw.js';
import { initCamera } from './camera.js';

window.addEventListener('DOMContentLoaded', () => {
  // Voice toggle
  const muteBtn = $('#muteBtn');
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      state.speakingEnabled = !state.speakingEnabled;
      muteBtn.textContent = state.speakingEnabled ? '🔊 Voice On' : '🔇 Voice Off';
    });
  }

  // Step 1 -> 2
  $('#toStep2')?.addEventListener('click', () => {
    const name = $('#kidName').value.trim();
    if (!name) { $('#kidName').focus(); return; }
    state.name = name;
    goToStep(2);
  });

  // Back buttons
  $$('[data-back]').forEach(b => b.addEventListener('click', stepBack));

  // Step 2 -> 3
  $$('.age-card').forEach(card => {
    card.addEventListener('click', () => {
      state.age = card.dataset.age;
      goToStep(3);
    });
  });

  // Choose activity
  $$('.activity-card').forEach(card => {
    card.addEventListener('click', () => {
      state.activity = card.dataset.activity;
      document.querySelector('#onboarding').classList.add('hidden');
      showApp(state.activity);
      // Lazy-init modules
      if (state.activity === 'talk' && !state.inited.chat) { initChat(); state.inited.chat = true; }
      if (state.activity === 'draw' && !state.inited.draw) { initDraw(); state.inited.draw = true; }
      if (state.activity === 'photo' && !state.inited.cam) { initCamera(); state.inited.cam = true; }
    });
  });

  // Change selection
  $('#changeChoice')?.addEventListener('click', () => {
    document.querySelector('#appRoot').classList.add('hidden');
    document.querySelector('#onboarding').classList.remove('hidden');
    goToStep(3);
  });
});
