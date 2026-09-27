const canvas = document.querySelector<HTMLCanvasElement>('#smoke');
const ctx = canvas?.getContext('2d');

if (canvas && ctx) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const N = 420;

  const sprite = document.createElement('canvas');
  sprite.width = sprite.height = 64;
  const s = sprite.getContext('2d')!;
  const rgb = getComputedStyle(canvas).getPropertyValue('--smoke-color').trim() || '240, 232, 214';
  const g = s.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, `rgba(${rgb}, 1)`);
  g.addColorStop(0.4, `rgba(${rgb}, .5)`);
  g.addColorStop(1, `rgba(${rgb}, 0)`);
  s.fillStyle = g;
  s.fillRect(0, 0, 64, 64);

  const ps = Array.from({ length: N }, () => {
    const rad = Math.sqrt(-2 * Math.log(1 - Math.random()));
    return {
      rad,
      dir: Math.random() < 0.75 ? 1 : -1,
      ang: Math.random() * Math.PI * 2,
      w: (0.06 + Math.random() * 0.12) / (0.6 + rad),
      x: 0, y: 0, vx: 0, vy: 0, hoverX: 0, hoverY: 0,
      r: 0.035 + Math.random() * 0.06,
      a: 0.03 + Math.random() * 0.05,
      ph: Math.random() * Math.PI * 2,
      sp: 0.15 + Math.random() * 0.35,
    };
  });
  type P = (typeof ps)[number];

  let W = 0, H = 0, S = 0, t = 0;

  const home = (p: P): [number, number] => {
    const ang = p.ang + t * p.w * p.dir;
    const rad = p.rad * (1 + Math.sin(t * p.sp + p.ph) * 0.08);
    return [W / 2 + Math.cos(ang) * rad * S * 0.13, H / 2 + Math.sin(ang) * rad * S * 0.10];
  };

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const rect = canvas!.getBoundingClientRect();
    const first = !W;
    W = rect.width; H = rect.height; S = Math.min(W, H);
    canvas!.width = W * dpr;
    canvas!.height = H * dpr;
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (first) for (const p of ps) [p.x, p.y] = home(p);
  }

  function grasp(px: number, py: number, strength = 1) {
    for (const p of ps) {
      const dx = p.x - px, dy = p.y - py;
      const d = Math.hypot(dx, dy) + 1;
      const f = strength * S * 0.022 * Math.exp(-d / (S * 0.28));
      const swirl = (Math.random() - 0.5) * 1.2;
      p.vx += (dx / d - (dy / d) * swirl) * f;
      p.vy += (dy / d + (dx / d) * swirl) * f;
    }
  }

  function draw() {
    ctx!.clearRect(0, 0, W, H);
    for (const p of ps) {
      const [hx, hy] = home(p);
      const spread = Math.hypot(p.x - hx, p.y - hy) / S;
      const r = p.r * S * (1 + spread * 3);
      ctx!.globalAlpha = p.a / (1 + spread * 6);
      ctx!.drawImage(sprite, p.x - r, p.y - r, r * 2, r * 2);
    }
    ctx!.globalAlpha = 1;
  }

  let last = 0, running = false, raf = 0;
  const hover = { active: false, x: 0, y: 0 };

  function frame(now: number) {
    const k = Math.min((now - last) / 16.67, 3) || 1;
    last = now;
    t += 0.016 * k;
    const damp = Math.pow(0.95, k);
    const hoverBlend = 1 - Math.exp(-0.01667 * k / 0.45);
    for (const p of ps) {
      const [hx, hy] = home(p);
      let offsetX = 0, offsetY = 0;
      if (hover.active && !down && S > 0) {
        const dx = hx - hover.x, dy = hy - hover.y;
        const distance = Math.hypot(dx, dy);
        const reach = S * 0.19;
        const amount = S * 0.075 * Math.exp(-distance * distance / (2 * reach * reach));
        const softDistance = Math.hypot(distance, S * 0.015);
        const turn = 0.30 * Math.sin(t * 0.7);
        const normalizer = softDistance * Math.hypot(1, turn);
        offsetX = (dx - dy * turn) / normalizer * amount;
        offsetY = (dy + dx * turn) / normalizer * amount;
      }
      // A bounded moving target keeps a stationary pointer gentle, without accumulating impulses.
      p.hoverX += (offsetX - p.hoverX) * hoverBlend;
      p.hoverY += (offsetY - p.hoverY) * hoverBlend;
      p.vx = (p.vx + (hx + p.hoverX - p.x) * 0.006 * k) * damp;
      p.vy = (p.vy + (hy + p.hoverY - p.y) * 0.006 * k) * damp;
      p.x += p.vx * k;
      p.y += p.vy * k;
    }
    draw();
    raf = requestAnimationFrame(frame);
  }

  const start = () => {
    if (running || reduce) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  let down = false;
  const pos = (e: PointerEvent): [number, number] => {
    const r = canvas.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  };
  const endGrasp = (e: PointerEvent) => {
    down = false;
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
  };
  const updateHover = (e: PointerEvent) => {
    const [x, y] = pos(e);
    hover.active = (e.pointerType === 'mouse' || e.pointerType === 'pen')
      && x >= 0 && x <= W && y >= 0 && y <= H;
    hover.x = x;
    hover.y = y;
  };
  canvas.addEventListener('pointerenter', updateHover);
  canvas.addEventListener('pointerdown', e => {
    updateHover(e);
    down = true;
    canvas.setPointerCapture(e.pointerId);
    grasp(...pos(e));
  });
  canvas.addEventListener('pointermove', e => {
    updateHover(e);
    if (!down) return;
    const [x, y] = pos(e);
    if (x < 0 || x > W || y < 0 || y > H) return endGrasp(e);
    grasp(x, y, 0.15);
  });
  canvas.addEventListener('pointerup', endGrasp);
  canvas.addEventListener('pointercancel', e => { hover.active = false; endGrasp(e); });
  canvas.addEventListener('pointerleave', e => { hover.active = false; endGrasp(e); });
  canvas.addEventListener('lostpointercapture', () => { down = false; });
  window.addEventListener('blur', () => { hover.active = false; down = false; });

  resize();
  draw();
  new ResizeObserver(() => { resize(); if (!running) draw(); }).observe(canvas);
  let inView = false;
  const sync = () => (inView && !document.hidden ? start() : stop());
  new IntersectionObserver(([e]) => { inView = e.isIntersecting; sync(); }).observe(canvas);
  document.addEventListener('visibilitychange', sync);
}
