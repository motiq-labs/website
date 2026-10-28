// Open one green surface as the visitor scrolls; keep native page scrolling.
(() => {
  const surface = document.querySelector('.service-band');
  if (!surface) return;
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame;
  const paint = () => {
    frame = undefined;
    if (preference.matches || document.documentElement.dataset.motionPaused === "true") {
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
  addEventListener('motiq:motionchange', schedule);
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


(() => {
  const story = document.querySelector('[data-name-story]');
  const button = document.querySelector('[data-motion-toggle]');
  if (!story || !button) return;
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = false;
  const sync = () => {
    button.hidden = preference.matches;
    document.documentElement.dataset.motionPaused = String(paused || preference.matches);
    button.textContent = paused ? 'Resume motion' : 'Pause motion';
    dispatchEvent(new Event('motiq:motionchange'));
  };
  button.addEventListener('click', () => { paused = !paused; sync(); });
  preference.addEventListener('change', sync);
  document.addEventListener('click', event => {
    if (story.open && !story.contains(event.target)) story.open = false;
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && story.open) {
      story.open = false;
      story.querySelector('summary').focus();
    }
  });
  sync();
})();
