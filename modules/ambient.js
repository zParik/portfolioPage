/* ─── AMBIENT BACKGROUND CANVAS ─── */
import { prefersReducedMotion } from './utils.js';

if (!prefersReducedMotion) {
  const canvas = document.getElementById('ambient-bg');
  if (canvas) {
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Node configuration
    const NODE_COUNT = 22;
    const ACCENT_V = [167, 139, 250]; // --accent
    const ACCENT_T = [45, 212, 191];  // --cat-security (teal)

    // Generate nodes scattered across full viewport, weighted toward sides
    function makeNode() {
      // Bias x toward edges (left 0-20% or right 80-100%) for side-ambient feel
      const side = Math.random() < 0.5 ? 'left' : 'right';
      const x = side === 'left'
        ? Math.random() * 0.22 * window.innerWidth
        : (0.78 + Math.random() * 0.22) * window.innerWidth;
      return {
        x, y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        r: 1 + Math.random() * 1.2,
        baseOpacity: 0.04 + Math.random() * 0.08,
        pingTimer: 400 + Math.random() * 1200,  // frames until first ping (staggered start)
        pingAge: -1,                              // -1 = no ping active
        PING_DURATION: 240,                       // ~4s at 60fps, very slow fade
        color: Math.random() < 0.7 ? ACCENT_V : ACCENT_T,
      };
    }

    let nodes = Array.from({ length: NODE_COUNT }, makeNode);

    // Connection edges: pairs of nearby nodes get a faint line
    function getEdges() {
      const MAX_DIST = 160;
      const edges = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) edges.push({ i, j, dist, maxDist: MAX_DIST });
        }
      }
      return edges;
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update node positions (slow drift)
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        // Wrap around
        if (n.x < -20) n.x = canvas.width + 20;
        if (n.x > canvas.width + 20) n.x = -20;
        if (n.y < -20) n.y = canvas.height + 20;
        if (n.y > canvas.height + 20) n.y = -20;

        // Ping countdown
        if (n.pingAge >= 0) {
          n.pingAge++;
          if (n.pingAge > n.PING_DURATION) n.pingAge = -1;
        } else {
          n.pingTimer--;
          if (n.pingTimer <= 0) {
            n.pingAge = 0;
            n.pingTimer = 800 + Math.random() * 1600; // 13–40s between pings per node
          }
        }
      }

      // Draw edges
      const edges = getEdges();
      for (const e of edges) {
        const a = nodes[e.i];
        const b = nodes[e.j];
        const fade = 1 - e.dist / e.maxDist;
        const [r, g, bl] = a.color;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(${r},${g},${bl},${fade * 0.045})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Draw nodes + pings
      for (const n of nodes) {
        const [r, g, b] = n.color;

        // Base dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${n.baseOpacity})`;
        ctx.fill();

        // Radar ping ring
        if (n.pingAge >= 0) {
          const t = n.pingAge / n.PING_DURATION;   // 0→1
          const pingR = n.r + t * 18;
          const pingO = (1 - t) * 0.22;
          ctx.beginPath();
          ctx.arc(n.x, n.y, pingR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${r},${g},${b},${pingO})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Inner bright flash at start of ping
          if (t < 0.15) {
            const flash = (0.15 - t) / 0.15;
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r},${g},${b},${flash * 0.35})`;
            ctx.fill();
          }
        }
      }

      requestAnimationFrame(draw);
    }
    draw();
  }
}
