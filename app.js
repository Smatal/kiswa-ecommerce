/**
 * KISWA DESIGNER STUDIO — Interactive Scripts
 * Features: Minimalist Countdown Timer, VIP Registration, Atelier Drawer,
 * Stardust Canvas & Luxury Web Audio Ambience
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. CONFIGURATION & STATE
  // =========================================================================
  const CONFIG = {
    // Launch Date: 30 days from now by default, or set to a custom Date string
    launchDateOffsetDays: 28,
    storageKey: 'kiswa_vip_registered_email',
    canvasParticleCount: 45,
  };

  // Calculate target date (28 days into the future)
  let targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + CONFIG.launchDateOffsetDays);
  targetDate.setHours(18, 0, 0, 0); // 6:00 PM Atelier Grand Opening

  // =========================================================================
  // 2. MINIMALIST COUNTDOWN TIMER
  // =========================================================================
  const elDays = document.getElementById('timer-days');
  const elHours = document.getElementById('timer-hours');
  const elMinutes = document.getElementById('timer-minutes');
  const elSeconds = document.getElementById('timer-seconds');
  let prevSeconds = null;

  function pad(num) {
    return String(Math.max(0, num)).padStart(2, '0');
  }

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance <= 0) {
      if (elDays) elDays.textContent = '00';
      if (elHours) elHours.textContent = '00';
      if (elMinutes) elMinutes.textContent = '00';
      if (elSeconds) elSeconds.textContent = '00';
      const note = document.querySelector('.countdown-note');
      if (note) note.textContent = 'The digital atelier is now unveiled.';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (elDays) elDays.textContent = pad(days);
    if (elHours) elHours.textContent = pad(hours);
    if (elMinutes) elMinutes.textContent = pad(minutes);
    
    if (elSeconds) {
      const formattedSec = pad(seconds);
      if (formattedSec !== prevSeconds) {
        elSeconds.textContent = formattedSec;
        elSeconds.classList.add('tick');
        setTimeout(() => elSeconds.classList.remove('tick'), 250);
        prevSeconds = formattedSec;
      }
    }
  }

  // Initialize countdown
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // =========================================================================
  // 3. VIP SUBSCRIPTION HANDLING
  // =========================================================================
  const vipForm = document.getElementById('vip-subscribe-form');
  const vipEmailInput = document.getElementById('vip-email-input');
  const vipSubmitBtn = document.getElementById('vip-submit-btn');
  const submitSpinner = document.getElementById('submit-spinner');
  const formFeedback = document.getElementById('form-feedback');

  // Check if previously registered
  const savedEmail = localStorage.getItem(CONFIG.storageKey);
  if (savedEmail && vipEmailInput) {
    vipEmailInput.value = savedEmail;
    vipEmailInput.disabled = true;
    if (vipSubmitBtn) {
      vipSubmitBtn.innerHTML = '<span class="btn-text">VIP Reserved ✓</span>';
      vipSubmitBtn.disabled = true;
      vipSubmitBtn.style.opacity = '0.75';
    }
    if (formFeedback) {
      formFeedback.textContent = 'Your VIP invitation is already confirmed.';
      formFeedback.className = 'form-feedback success';
    }
  }

  if (vipForm) {
    vipForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = vipEmailInput.value.trim();

      // Email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        formFeedback.textContent = 'Please provide a valid email address.';
        formFeedback.className = 'form-feedback error';
        vipEmailInput.focus();
        return;
      }

      // UI Loading state
      formFeedback.textContent = '';
      if (submitSpinner) submitSpinner.classList.remove('hidden');
      vipSubmitBtn.disabled = true;

      setTimeout(() => {
        if (submitSpinner) submitSpinner.classList.add('hidden');
        localStorage.setItem(CONFIG.storageKey, email);

        formFeedback.textContent = 'Invitation requested. We look forward to welcoming you.';
        formFeedback.className = 'form-feedback success';

        vipSubmitBtn.innerHTML = '<span class="btn-text">VIP Reserved ✓</span>';
        vipEmailInput.disabled = true;

        showToast('Private Invitation Reserved', 'You have been granted priority preview access for KISWA.');
      }, 700);
    });
  }

  // =========================================================================
  // 4. CRAFT PHILOSOPHY DRAWER / MODAL
  // =========================================================================
  const openPhilosophyBtn = document.getElementById('open-philosophy-btn');
  const craftQuickTrigger = document.getElementById('craft-quick-trigger');
  const closePhilosophyBtn = document.getElementById('close-philosophy-btn');
  const philosophyBackdrop = document.getElementById('philosophy-backdrop');
  const philosophyDrawer = document.getElementById('philosophy-drawer');

  function openPhilosophy() {
    if (!philosophyBackdrop) return;
    philosophyBackdrop.classList.add('active');
    philosophyBackdrop.setAttribute('aria-hidden', 'false');
    if (openPhilosophyBtn) openPhilosophyBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (closePhilosophyBtn) closePhilosophyBtn.focus();
  }

  function closePhilosophy() {
    if (!philosophyBackdrop) return;
    philosophyBackdrop.classList.remove('active');
    philosophyBackdrop.setAttribute('aria-hidden', 'true');
    if (openPhilosophyBtn) openPhilosophyBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (openPhilosophyBtn) openPhilosophyBtn.focus();
  }

  if (openPhilosophyBtn) openPhilosophyBtn.addEventListener('click', openPhilosophy);
  if (craftQuickTrigger) craftQuickTrigger.addEventListener('click', openPhilosophy);
  if (closePhilosophyBtn) closePhilosophyBtn.addEventListener('click', closePhilosophy);

  if (philosophyBackdrop) {
    philosophyBackdrop.addEventListener('click', function (e) {
      if (e.target === philosophyBackdrop) {
        closePhilosophy();
      }
    });
  }

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && philosophyBackdrop && philosophyBackdrop.classList.contains('active')) {
      closePhilosophy();
    }
  });

  // =========================================================================
  // 5. TOAST NOTIFICATION
  // =========================================================================
  const toast = document.getElementById('toast-notification');
  const toastTitle = document.getElementById('toast-title');
  const toastDesc = document.getElementById('toast-desc');
  let toastTimer = null;

  function showToast(title, desc) {
    if (!toast) return;
    if (toastTitle) toastTitle.textContent = title;
    if (toastDesc) toastDesc.textContent = desc;

    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  // Share / Copy Link Trigger
  const shareBtn = document.getElementById('share-link-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async function () {
      const shareData = {
        title: 'KISWA Designer Studio',
        text: 'KISWA Designer Studio — Tailored For A Greater You. Bespoke Digital Flagship Arriving Soon.',
        url: window.location.href,
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
          return;
        } catch (err) {
          // Fallback to clipboard
        }
      }

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Link Copied', 'Atelier link copied to your clipboard.');
      } else {
        showToast('KISWA Studio', window.location.href);
      }
    });
  }

  // =========================================================================
  // 6. ATMOSPHERIC AMBIENT CANVAS (Golden Stardust)
  // =========================================================================
  const canvas = document.getElementById('ambient-canvas');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    for (let i = 0; i < CONFIG.canvasParticleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.4,
        alpha: Math.random() * 0.7 + 0.2,
        speedY: -(Math.random() * 0.35 + 0.1),
        speedX: (Math.random() - 0.5) * 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
      });
    }

    let isVisible = true;
    document.addEventListener('visibilitychange', () => {
      isVisible = document.visibilityState === 'visible';
    });

    function renderParticles() {
      if (!isVisible) {
        requestAnimationFrame(renderParticles);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (let p of particles) {
        p.y += p.speedY;
        p.x += p.speedX;
        p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.008;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(223, 186, 115, ${Math.max(0.1, Math.min(0.85, p.alpha))})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(223, 186, 115, 0.4)';
        ctx.fill();
      }

      requestAnimationFrame(renderParticles);
    }

    renderParticles();
  }

  // =========================================================================
  // 7. LUXURY AMBIENT AUDIO SYNTHESIZER (Web Audio API)
  // Soft, warm bespoke harmonic chord drone
  // =========================================================================
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  let audioCtx = null;
  let isPlaying = false;
  let masterGain = null;
  let oscillators = [];

  function initAmbientAudio() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    audioCtx = new AudioContext();

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);

    // Warm low-pass filter for velvety softness
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(420, audioCtx.currentTime);

    masterGain.connect(filter);
    filter.connect(audioCtx.destination);

    // Gentle warm frequencies (F# minor 9th harmonic chord: F#2, C#3, A3, E4)
    const frequencies = [92.5, 138.59, 220.0, 329.63];

    frequencies.forEach((freq) => {
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      oscGain.gain.setValueAtTime(0.04, audioCtx.currentTime);

      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start();
      oscillators.push(osc);
    });
  }

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      if (!audioCtx) {
        initAmbientAudio();
      }

      const iconOff = soundToggleBtn.querySelector('.sound-off');
      const iconOn = soundToggleBtn.querySelector('.sound-on');

      if (!isPlaying) {
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        masterGain.gain.exponentialRampToValueAtTime(0.06, audioCtx.currentTime + 2.5);
        isPlaying = true;
        if (iconOff) iconOff.classList.add('hidden');
        if (iconOn) iconOn.classList.remove('hidden');
        soundToggleBtn.setAttribute('title', 'Mute Ambient Sound');
        showToast('Atelier Ambience', 'Warm acoustic atmosphere enabled.');
      } else {
        masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);
        isPlaying = false;
        if (iconOff) iconOff.classList.remove('hidden');
        if (iconOn) iconOn.classList.add('hidden');
        soundToggleBtn.setAttribute('title', 'Play Ambient Sound');
      }
    });
  }
})();
