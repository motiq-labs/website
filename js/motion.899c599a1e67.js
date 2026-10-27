(() => {
  const demo = document.querySelector('[data-motion]');
  if (!demo) return;
  const replay = demo.querySelector('.motion-replay');
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let hasStarted = false;
  let frame;

  const play = () => {
    if (preference.matches) return;
    hasStarted = true;
    cancelAnimationFrame(frame);
    demo.classList.remove('is-playing');
    replay.disabled = true;
    // Commit the resting frame before replaying the single illustration.
    void demo.offsetWidth;
    frame = requestAnimationFrame(() => demo.classList.add('is-playing'));
  };
  const syncPreference = () => {
    replay.hidden = preference.matches;
    if (preference.matches) {
      cancelAnimationFrame(frame);
      demo.classList.remove('is-playing');
      replay.disabled = false;
    }
  };
  demo.addEventListener('animationend', event => {
    if (event.animationName === 'gripper-travel') replay.disabled = false;
  });
  replay.addEventListener('click', play);
  preference.addEventListener('change', syncPreference);
  syncPreference();
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting) && !hasStarted && !preference.matches) {
        play();
        observer.disconnect();
      }
    }, { threshold: 0.6 });
    observer.observe(demo);
  } else if (!preference.matches) play();
})();

// Open one green surface as the visitor scrolls; keep native page scrolling.
(() => {
  const surface = document.querySelector('.service-band');
  if (!surface) return;
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame;
  const paint = () => {
    frame = undefined;
    if (preference.matches) {
      surface.style.removeProperty('--service-bleed');
      surface.style.removeProperty('--service-radius');
      surface.style.removeProperty('--tool-turn');
      return;
    }
    const bounds = surface.getBoundingClientRect();
    const maximumScroll = Math.max(0, document.documentElement.scrollHeight - innerHeight);
    const distance = Math.min(maximumScroll, Math.max(120, bounds.top + scrollY - innerHeight * .28));
    const progress = distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0;
    surface.style.setProperty('--service-bleed', `${(bounds.left * progress).toFixed(2)}px`);
    surface.style.setProperty('--service-radius', `${(15 * (1 - progress)).toFixed(2)}px`);
    surface.style.setProperty('--tool-turn', `${(-12 + 24 * progress).toFixed(2)}deg`);
  };
  const schedule = () => {
    if (frame === undefined) frame = requestAnimationFrame(paint);
  };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  preference.addEventListener('change', schedule);
  document.fonts?.ready.then(schedule);
  paint();
})();

(() => {
  const button = document.querySelector('[data-copy-email]');
  if (!button || !navigator.clipboard?.writeText) return;
  const status = document.querySelector('.copy-status');
  let reset;
  button.hidden = false;
  button.addEventListener('click', async () => {
    clearTimeout(reset);
    try {
      await navigator.clipboard.writeText('info@motiq.hr');
      button.textContent = 'Copied';
      status.textContent = 'Email address copied.';
    } catch {
      button.textContent = 'Copy manually';
      status.textContent = 'Please copy info@motiq.hr directly.';
    }
    reset = setTimeout(() => {
      button.textContent = 'Copy email';
      status.textContent = '';
    }, 3000);
  });
})();
