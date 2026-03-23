/* ─── ENTRY POINT ─── */
/* All logic lives in modules/. Import order = execution order. */
import './modules/data.js';          // PROJECT data + renderManifest + boot flag
import './modules/scroll-reveal.js'; // IntersectionObserver scroll reveals
import './modules/terminal.js';      // Terminal engine + Konami code + red-dot reset
import './modules/cursor.js';        // Particle trail cursor
import './modules/count-up.js';      // Count-up animation (exposes observeCountUps)
import './modules/dossier.js';       // Dossier overlay system
import './modules/nav.js';           // Mobile drawer + nav scroll + footer year
import './modules/scrollbar.js';     // Section-aware scrollbar color
import './modules/delights.js';      // Console egg, toast, glitch, earlier-work, clock, spec-tag
import './modules/ambient.js';       // Ambient node canvas
import './modules/graph.js';         // Capability graph canvas
import './modules/radar.js';         // Intel radar canvas
import './modules/shatter.js';       // Shatter/reveal transition
import './modules/webgl.js';         // Hero voxel WebGL
import './modules/boot.js';          // Hero cinematic boot sequence
