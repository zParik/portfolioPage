/* ─── CAPABILITY GRAPH ─── */
import { prefersReducedMotion } from './utils.js';

const canvas = document.getElementById('threat-map');
if (canvas) {
  const ctx = canvas.getContext('2d');

  const COL_CV = [167, 139, 250];
  const COL_SEC = [45, 212, 191];
  const COL_SYS = [148, 163, 184];

  // ── Nodes: lon/lat used purely as spread coordinates, no geographic meaning ──
  // Chosen manually to avoid overlaps and distribute across the canvas.
  const NODES = [
    { label: 'PARIKSHIETH', sub: 'RESEARCHER', lon: 10, lat: -8, domain: 'cv', primary: true, red: true },
    { label: 'ASSISTIVE AI', sub: 'APPLIED', lon: -20, lat: 55, domain: 'cv' },
    { label: 'ENDPOINT SECURITY', sub: 'PRIMARY', lon: 35, lat: 40, domain: 'sec' },
    { label: 'CRYPTOGRAPHY', sub: 'PRIMARY', lon: -65, lat: 35, domain: 'sec' },
    { label: 'DEEP LEARNING', sub: 'PRIMARY', lon: 82, lat: 13, domain: 'cv' },
    { label: 'SYSTEMS / C++', sub: 'PROFICIENT', lon: 115, lat: -41, domain: 'sys' },
    { label: 'NETWORKING', sub: 'PROFICIENT', lon: -95, lat: 60, domain: 'sys' },
    { label: 'COMPUTER VISION', sub: 'PRIMARY', lon: -60, lat: -50, domain: 'cv' },
    { label: 'BACKEND / DATA', sub: 'APPLIED', lon: 40, lat: 65, domain: 'sys' },
    { label: 'MALWARE ANALYSIS', sub: 'APPLIED', lon: -120, lat: -28, domain: 'sec' },
    { label: 'FRONTEND / MOBILE', sub: 'APPLIED', lon: 20, lat: -45, domain: 'sys' },
    { label: 'DATABASES', sub: 'APPLIED', lon: -95, lat: 10, domain: 'sys' },
    { label: 'ML RESEARCH', sub: 'APPLIED', lon: 105, lat: 55, domain: 'cv' },
  ];

  const ROUTES = [
    [0, 1, 'cv'], [0, 2, 'sec'], [0, 3, 'sec'],
    [0, 4, 'cv'], [0, 5, 'sys'], [0, 6, 'sys'],
    [0, 7, 'cv'], [0, 8, 'sec'], [0, 9, 'sys'],
    [0, 10, 'sys'], [0, 11, 'sys'], [0, 12, 'cv'],
    [1, 4, 'cv'], [1, 12, 'cv'], [2, 8, 'sec'],
    [3, 8, 'sec'], [3, 11, 'sys'], [4, 5, 'sys'],
    [7, 3, 'sec'], [9, 11, 'sys'], [6, 5, 'sys'],
  ];

  // ── Land bounding boxes for dot grid ──
  const LAND_BOXES = [
    [-168, 25, -52, 72], [-82, -55, -34, 12],
    [-10, 36, 40, 71], [-18, -35, 52, 38],
    [26, 15, 80, 75], [75, 10, 150, 75],
    [95, -10, 141, 28], [113, -40, 154, -10],
    [124, 30, 146, 46], [-10, 50, 2, 59],
    [-58, 59, -15, 84], [4, 56, 32, 72],
    [43, -26, 51, -12], [166, -47, 179, -34],
  ];

  function isLand(lon, lat) {
    for (const [a, b, c, d] of LAND_BOXES)
      if (lon >= a && lon <= c && lat >= b && lat <= d) return true;
    return false;
  }

  // ── Equirectangular projection ──
  function project(lon, lat) {
    const PX = W * 0.03, PY = H * 0.06;
    const mW = W - PX * 2, mH = H - PY * 2;
    return {
      x: PX + ((lon + 180) / 360) * mW,
      y: PY + ((90 - lat) / 180) * mH,
    };
  }

  // ── Great-circle arc: lift toward midpoint perpendicular ──
  function arcCP(x1, y1, x2, y2, seed) {
    const midX = (x1 + x2) / 2, midY = (y1 + y2) / 2;
    const dx = x2 - x1, dy = y2 - y1;
    const dist = Math.hypot(dx, dy);
    const lift = Math.min(dist * 0.30, H * 0.28);
    const px = -dy / (dist || 1), py = dx / (dist || 1);
    const sign = (seed % 2 === 0) ? 1 : -1;
    return { cx: midX + px * lift * sign, cy: midY + py * lift * sign };
  }

  function colForDomain(d) {
    return d === 'cv' ? COL_CV : d === 'sec' ? COL_SEC : COL_SYS;
  }

  // Label anchor: derive from screen position relative to canvas centre
  function anchorFor(p) {
    const cx = W / 2, cy = H / 2;
    const dx = p.x - cx, dy = p.y - cy;
    if (Math.abs(dx) > Math.abs(dy) * 1.4) return dx > 0 ? 'right' : 'left';
    return dy > 0 ? 'below' : 'above';
  }

  let W = 0, H = 0;
  let dotGrid = [], arcStates = [];
  let active = false, frameId = null, startT = null;

  const ARC_TRAVEL = 1300, ARC_STAGGER = 200, ARC_HOLD = 800, ARC_FADE = 550;
  const LOOP_PERIOD = 7000;

  function resize() {
    const wrap = canvas.parentElement;
    W = wrap.clientWidth;
    H = Math.round(W * 0.38);
    H = Math.max(H, 200); H = Math.min(H, 440);
    canvas.width = W; canvas.height = H;
    canvas.style.height = H + 'px';

    dotGrid = [];
    for (let lon = -178; lon <= 178; lon += 8)
      for (let lat = -80; lat <= 82; lat += 7)
        if (isLand(lon, lat)) dotGrid.push(project(lon, lat));

    initArcs();
  }

  function initArcs() {
    arcStates = ROUTES.map(([ai, bi, domain], i) => {
      const pa = project(NODES[ai].lon, NODES[ai].lat);
      const pb = project(NODES[bi].lon, NODES[bi].lat);
      const cp = arcCP(pa.x, pa.y, pb.x, pb.y, i);
      return {
        x1: pa.x, y1: pa.y, x2: pb.x, y2: pb.y,
        cx: cp.cx, cy: cp.cy, color: colForDomain(domain),
        startOffset: i * ARC_STAGGER, phase: 0, progress: 0, alpha: 0
      };
    });
  }

  function updateArcs(e) {
    for (const arc of arcStates) {
      const t = (e + LOOP_PERIOD - arc.startOffset) % LOOP_PERIOD;
      if (t < ARC_TRAVEL) { arc.phase = 0; arc.progress = t / ARC_TRAVEL; arc.alpha = Math.min(arc.progress * 4, 1); }
      else if (t < ARC_TRAVEL + ARC_HOLD) { arc.phase = 1; arc.progress = 1; arc.alpha = 1; }
      else if (t < ARC_TRAVEL + ARC_HOLD + ARC_FADE) { arc.phase = 2; arc.progress = 1; arc.alpha = 1 - (t - ARC_TRAVEL - ARC_HOLD) / ARC_FADE; }
      else { arc.phase = 3; arc.progress = 0; arc.alpha = 0; }
    }
  }

  function bezierPt(x1, y1, cx, cy, x2, y2, t) {
    const m = 1 - t;
    return { x: m * m * x1 + 2 * m * t * cx + t * t * x2, y: m * m * y1 + 2 * m * t * cy + t * t * y2 };
  }

  function draw(ts) {
    if (!active && !prefersReducedMotion) { frameId = null; return; }
    if (startT === null) startT = ts;
    const elapsed = ts - startT;

    ctx.clearRect(0, 0, W, H);

    // 1. Land dots
    const DR = Math.max(1, W / 900);
    ctx.fillStyle = 'rgba(255,255,255,0.055)';
    for (const d of dotGrid) {
      ctx.beginPath(); ctx.arc(d.x, d.y, DR, 0, Math.PI * 2); ctx.fill();
    }

    // 2. Latitude grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.02)';
    ctx.lineWidth = 0.5;
    for (const lat of [-60, -30, 0, 30, 60]) {
      const p0 = project(-180, lat), p1 = project(180, lat);
      ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke();
    }

    // 3. Arcs
    if (!prefersReducedMotion) updateArcs(elapsed);
    const SEGS = 48;
    for (const arc of arcStates) {
      const alpha = prefersReducedMotion ? 0.5 : arc.alpha;
      if (alpha <= 0.005) continue;
      const [r, g, b] = arc.color;
      const endT = prefersReducedMotion ? 1 : arc.progress;

      ctx.beginPath();
      ctx.moveTo(arc.x1, arc.y1);
      for (let s = 1; s <= Math.ceil(SEGS * endT); s++) {
        const p = bezierPt(arc.x1, arc.y1, arc.cx, arc.cy, arc.x2, arc.y2, (s / SEGS) * endT);
        ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.14})`; ctx.lineWidth = 5; ctx.stroke();
      ctx.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.7})`; ctx.lineWidth = 1; ctx.stroke();

      if (!prefersReducedMotion && arc.phase === 0 && arc.progress > 0.02) {
        const h = bezierPt(arc.x1, arc.y1, arc.cx, arc.cy, arc.x2, arc.y2, arc.progress);
        ctx.beginPath(); ctx.arc(h.x, h.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`; ctx.fill();
        ctx.beginPath(); ctx.arc(h.x, h.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.2})`; ctx.fill();
      }
    }

    // 4. Nodes
    const fontSize = Math.max(11, Math.min(13, W * 0.0082 + 3));
    const subSize = Math.max(9.5, fontSize - 1.5);

    for (let ni = 0; ni < NODES.length; ni++) {
      const node = NODES[ni];
      const p = project(node.lon, node.lat);
      const [r, g, b] = node.red ? [255, 75, 75] : colForDomain(node.domain);

      if (!prefersReducedMotion) {
        const pt = ((elapsed * 0.00065) + ni * 0.41) % 1;
        const pr = (node.primary ? 7 : 5) + pt * 16, pa = (1 - pt) * (node.primary ? 0.35 : 0.22);
        ctx.beginPath(); ctx.arc(p.x, p.y, pr, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${r},${g},${b},${pa})`; ctx.lineWidth = node.primary ? 1.5 : 1; ctx.stroke();
      }

      const coreR = node.primary ? 6 : 3.5;
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, coreR * 2.5);
      grad.addColorStop(0, `rgba(${r},${g},${b},0.25)`); grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.beginPath(); ctx.arc(p.x, p.y, coreR * 2.5, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill();
      ctx.beginPath(); ctx.arc(p.x, p.y, coreR, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},0.95)`; ctx.fill();
      ctx.beginPath(); ctx.arc(p.x, p.y, coreR * 0.42, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.fill();

      if (W < 480) continue;

      const anchor = anchorFor(p);
      const GAP = coreR + 7;
      let lx = p.x, ly = p.y, align = 'center';
      switch (anchor) {
        case 'above': ly = p.y - GAP; align = 'center'; break;
        case 'below': ly = p.y + GAP + fontSize; align = 'center'; break;
        case 'right': lx = p.x + GAP; ly = p.y + 3; align = 'left'; break;
        case 'left': lx = p.x - GAP; ly = p.y + 3; align = 'right'; break;
      }
      ctx.textAlign = align;
      ctx.font = `500 ${fontSize}px 'IBM Plex Mono',monospace`;
      ctx.fillStyle = `rgba(${r},${g},${b},${node.primary ? 0.95 : 0.78})`;
      ctx.fillText(node.label, lx, ly);
      if (node.sub) {
        const subYFinal = anchor === 'above' ? ly - subSize - 1 : anchor === 'below' ? ly + subSize + 1 : ly + subSize + 2;
        ctx.font = `${subSize}px 'IBM Plex Mono',monospace`;
        ctx.fillStyle = `rgba(${r},${g},${b},0.38)`;
        ctx.fillText(node.sub, lx, subYFinal);
      }
    }

    // 5. HUD (set once)
    const arcEl = document.getElementById('threat-arc-count');
    const nodeEl = document.getElementById('threat-node-count');
    if (arcEl && arcEl.textContent === 'LINKS: --') arcEl.textContent = 'LINKS: ' + ROUTES.length;
    if (nodeEl && nodeEl.textContent === 'DOMAINS: --') nodeEl.textContent = 'DOMAINS: ' + NODES.length;

    if (!prefersReducedMotion) frameId = requestAnimationFrame(draw);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !active) {
        active = true; startT = null; frameId = requestAnimationFrame(draw);
      } else if (!e.isIntersecting && active) {
        active = false; if (frameId) { cancelAnimationFrame(frameId); frameId = null; }
      }
    });
  }, { threshold: 0.1 });

  io.observe(canvas);
  resize();
  if (prefersReducedMotion) requestAnimationFrame(ts => draw(ts));
  window.addEventListener('resize', () => {
    resize();
    if (!active && !prefersReducedMotion) ctx.clearRect(0, 0, W, H);
  }, { passive: true });
}
