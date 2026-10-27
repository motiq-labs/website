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
