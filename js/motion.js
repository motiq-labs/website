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
      return;
    }
    const bounds = surface.getBoundingClientRect();
    const maximumScroll = Math.max(0, document.documentElement.scrollHeight - innerHeight);
    const distance = Math.min(maximumScroll, Math.max(120, bounds.top + scrollY - innerHeight * .28));
    const progress = distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0;
    surface.style.setProperty('--service-bleed', `${(bounds.left * progress).toFixed(2)}px`);
    surface.style.setProperty('--service-radius', `${(15 * (1 - progress)).toFixed(2)}px`);
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


// Hands stay on the handle and feet stay planted through three strokes and a rest.
(() => {
  const scene = document.querySelector('[data-digging-scene]');
  if (!scene) return;
  const story = scene.closest('details');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const part = name => scene.querySelector(`[data-${name}]`);
  const body = part('robot-body'), hoe = part('hoe');
  const arms = [part('arm-back'), part('arm-front')];
  const legs = [part('leg-back'), part('leg-front')];
  const grips = [part('grip-back'), part('grip-front')];
  const earth = part('earth'), particles = [...earth.children];
  const mix = (a, b, t) => a + (b - a) * t;
  const smooth = t => t * t * (3 - 2 * t);
  const keys = [[0,1,.35],[.16,.25,.12],[.32,0,0],[.50,1,1],[.58,1,1],[.74,.98,.7],[1,1,.35]];
  const poseAt = phase => {
    for (let i = 1; i < keys.length; i++) {
      if (phase <= keys[i][0]) {
        const a = keys[i-1], b = keys[i], t = smooth((phase-a[0])/(b[0]-a[0]));
        return [mix(a[1],b[1],t), mix(a[2],b[2],t)];
      }
    }
    return [1,.35];
  };
  // Two-bone inverse kinematics makes each elbow and knee follow its endpoints.
  const chain = (node, a, b, length1, length2, bend) => {
    const dx = b[0]-a[0], dy = b[1]-a[1], raw = Math.hypot(dx,dy);
    const distance = Math.max(.001, Math.min(raw, length1+length2-.001));
    const x = (length1*length1-length2*length2+distance*distance)/(2*distance);
    const y = Math.sqrt(Math.max(0,length1*length1-x*x))*bend;
    const ux = dx/(raw||1), uy = dy/(raw||1);
    node.setAttribute('d', `M${a[0]} ${a[1]}L${a[0]+x*ux-y*uy} ${a[1]+x*uy+y*ux}L${b[0]} ${b[1]}`);
  };
  const paint = elapsed => {
    const cycle = elapsed % 3200, working = cycle < 1650;
    const phase = working ? (cycle % 550)/550 : 1;
    const [dig, lean] = working ? poseAt(phase) : [1,.35];
    const pull = working && phase>.58 && phase<.90 ? Math.sin((phase-.58)/.32*Math.PI)*4 : 0;
    const angle = mix(82,26,dig), rad = angle*Math.PI/180;
    const upper = [mix(123,117,dig)-pull, mix(68,73,dig)];
    const lower = [upper[0]-Math.sin(rad)*32, upper[1]+Math.cos(rad)*32];
    const rotation = -10*lean, r = rotation*Math.PI/180;
    const transform = ([x,y]) => [164+(x-164)*Math.cos(r)-(y-104)*Math.sin(r)-lean*2,104+(x-164)*Math.sin(r)+(y-104)*Math.cos(r)+lean*2];
    body.setAttribute('transform',`translate(${-lean*2} ${lean*2}) rotate(${rotation} 164 104)`);
    hoe.setAttribute('transform',`translate(${upper[0]} ${upper[1]}) rotate(${angle})`);
    chain(arms[0],transform([158,59]),upper,28,29,1);
    chain(arms[1],transform([151,59]),lower,34,34,1);
    chain(legs[0],transform([170,102]),[185,160],31,32,-1);
    chain(legs[1],transform([158,102]),[143,160],33,32,1);
    grips.forEach((node,i) => { const point=i?lower:upper; node.setAttribute('cx',point[0]); node.setAttribute('cy',point[1]); });
    const flight = (phase-.50)/.39;
    const visible = working && flight>0 && flight<1;
    earth.style.opacity = visible ? String((1-flight)*.85) : '0';
    if (visible) particles.forEach((node,i) => {
      const x = 66-(16+i*10)*flight, y = 163-(26+i*5)*4*flight*(1-flight);
      node.setAttribute('transform',`translate(${x} ${y}) rotate(${-80*flight+i*27})`);
    });
  };
  let elapsed = 1900, previous, frame, visible = true;
  const active = () => visible && !document.hidden && !reduced.matches && document.documentElement.dataset.motionPaused!=='true' && !story.open;
  const tick = now => {
    frame = undefined;
    if (!active()) { previous=undefined; return; }
    if (previous!==undefined) elapsed += Math.min(64,now-previous);
    previous=now;
    paint(elapsed);
    frame=requestAnimationFrame(tick);
  };
  const sync = () => {
    if (frame!==undefined) cancelAnimationFrame(frame);
    frame=undefined; previous=undefined;
    if (reduced.matches) paint(1900);
    if (active()) frame=requestAnimationFrame(tick);
  };
  paint(elapsed);
  new IntersectionObserver(entries => { visible=entries[0].isIntersecting; sync(); }).observe(scene);
  reduced.addEventListener('change',sync);
  document.addEventListener('visibilitychange',sync);
  addEventListener('motiq:motionchange',sync);
  story.addEventListener('toggle',sync);
  sync();
})();
