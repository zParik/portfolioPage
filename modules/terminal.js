/* ─── TERMINAL ENGINE ─── */
import { prefersReducedMotion, sleep } from './utils.js';

const SESSIONS = [
  [
    { type: 'cmd', text: 'python paleguard.py --scan /proc/net' },
    { type: 'out', cls: 'warn', text: '[*] PaleGuard EDR initialising...' },
    { type: 'out', cls: 'ok', text: '[✓] Loaded 3D volumetric model  (epoch 312)' },
    { type: 'out', cls: 'ok', text: '[✓] Scanning process memory map' },
    { type: 'out', cls: 'ok', text: '[✓] No anomalies detected. Score: 0.003' },
  ],
  [
    { type: 'cmd', text: 'git clone https://github.com/zParik/ARCHON && cd ARCHON' },
    { type: 'out', cls: '', text: "Cloning into 'ARCHON'..." },
    { type: 'out', cls: 'ok', text: 'done.' },
    { type: 'cmd', text: 'npm install && npm run build' },
    { type: 'out', cls: 'ok', text: '✓ Built in 1.4s  →  dist/bundle.js' },
  ],
  [
    { type: 'cmd', text: 'python indoor_nav.py --camera 0 --mode assist' },
    { type: 'out', cls: 'warn', text: '[*] Loading YOLOv8x + Depth Anything V2...' },
    { type: 'out', cls: 'ok', text: '[✓] TensorRT engine ready  (RTX 3060)' },
    { type: 'out', cls: 'ok', text: '[✓] DeepSORT tracker initialised' },
    { type: 'out', cls: '', text: 'Inference: 14ms/frame  ·  Latency: 62ms' },
  ],
  [
    { type: 'cmd', text: 'openssl genrsa -out issuer.pem 2048' },
    { type: 'out', cls: '', text: 'Generating RSA private key, 2048 bit...' },
    { type: 'cmd', text: 'node issuer.js --verify-age 18' },
    { type: 'out', cls: 'ok', text: '[✓] Blind signature verified — token unlinkable' },
    { type: 'out', cls: 'ok', text: '[✓] Zero PII transmitted or stored' },
  ],
  [
    { type: 'cmd', text: 'python train.py --model yolov11x --epochs 50' },
    { type: 'out', cls: 'warn', text: '[*] Training on 2,614 augmented ASL frames...' },
    { type: 'out', cls: 'ok', text: 'Epoch 50/50  mAP@0.5: 0.96  precision: 0.95' },
    { type: 'out', cls: 'ok', text: '[✓] Model saved → asl_v11x_best.pt' },
  ],
  [
    { type: 'cmd', text: 'ssh parik@site-82.vit.ac.in' },
    { type: 'out', cls: '', text: 'Welcome to VIT Research Grid' },
    { type: 'cmd', text: 'ls -la research/' },
    { type: 'out', cls: '', text: 'paleguard/   notbigbrother/   visionaid/' },
    { type: 'out', cls: 'ok', text: '[✓] All systems nominal' },
  ],
  [
    { type: 'cmd', text: 'nmap -sV localhost --open' },
    { type: 'out', cls: 'warn', text: '[*] hint: ↑↑↓↓←→←→BA' },
    { type: 'out', cls: '', text: 'Try it. I dare you.' },
  ],
];

const termBody = document.getElementById('terminal-body');
let sessionIdx = 0;
let termGeneration = 0; // incremented to cancel in-flight sessions

async function typeText(el, text, speed = 38) {
  if (prefersReducedMotion) { el.textContent += text; return; }
  for (const ch of text) {
    el.textContent += ch;
    await sleep(speed + Math.random() * 22);
  }
}

function makeLine() {
  const line = document.createElement('div');
  line.className = 't-line';
  return line;
}

async function runSession(lines, gen) {
  termBody.innerHTML = '';
  for (const item of lines) {
    if (termGeneration !== gen) return; // session was interrupted
    const line = makeLine();

    if (item.type === 'cmd') {
      const prompt = document.createElement('span');
      prompt.className = 't-prompt';
      prompt.textContent = '❯';
      const cmd = document.createElement('span');
      cmd.className = 't-cmd';
      line.appendChild(prompt);
      line.appendChild(cmd);
      termBody.appendChild(line);
      termBody.scrollTop = termBody.scrollHeight;
      await typeText(cmd, item.text, 42);
      await sleep(180);
    } else {
      const out = document.createElement('span');
      out.className = 't-out' + (item.cls ? ' ' + item.cls : '');
      out.textContent = item.text;
      line.appendChild(out);
      termBody.appendChild(line);
      termBody.scrollTop = termBody.scrollHeight;
      await sleep(60);
    }
  }

  if (termGeneration !== gen) return;
  // trailing cursor on a new prompt line
  const cursorLine = makeLine();
  const prompt = document.createElement('span');
  prompt.className = 't-prompt';
  prompt.textContent = '❯';
  const cur = document.createElement('span');
  cur.className = 't-cursor';
  cursorLine.appendChild(prompt);
  cursorLine.appendChild(cur);
  termBody.appendChild(cursorLine);
  termBody.scrollTop = termBody.scrollHeight;
}

async function loop() {
  const gen = termGeneration;
  while (termGeneration === gen) {
    await runSession(SESSIONS[sessionIdx % SESSIONS.length], gen);
    if (termGeneration !== gen) return;
    sessionIdx++;
    await sleep(3200);
  }
}

setTimeout(loop, 800);

/* ─── KONAMI CODE — HACKERMAN MODE ─── */
{
  const SEQ = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let pos = 0;
  let hacking = false;

  document.addEventListener('keydown', e => {
    if (e.key === SEQ[pos]) {
      pos++;
      if (pos === SEQ.length) { pos = 0; triggerHackerman(); }
    } else {
      pos = e.key === SEQ[0] ? 1 : 0;
    }
  });

  const HACK_LINES = [
    { type: 'cmd', text: 'sudo nmap -sS -O --script vuln 0.0.0.0/0' },
    { type: 'out', text: 'Starting Nmap 7.94 ( https://nmap.org )' },
    { type: 'out', text: 'Initiating SYN Stealth Scan...' },
    { type: 'out', text: 'Discovered open port 22/tcp on 192.168.0.1' },
    { type: 'out', text: 'Discovered open port 443/tcp on 10.0.0.254' },
    { type: 'cmd', text: 'python3 exploit.py --target mainframe --payload r00t' },
    { type: 'out', text: '[*] Sending stage (175686 bytes) to target...' },
    { type: 'out', text: '[*] Meterpreter session 1 opened' },
    { type: 'out', text: '[!] SYSTEM BREACH DETECTED' },
    { type: 'cmd', text: 'whoami' },
    { type: 'out', text: 'root@PARIK-MAINFRAME' },
    { type: 'cmd', text: 'cat /etc/shadow | hashcat --mode 1800' },
    { type: 'out', text: '[+] Hash cracked: hunter2' },
    { type: 'out', text: '[+] All your base are belong to us.' },
    { type: 'cmd', text: 'echo "jk lol - Parik was here 😈"' },
    { type: 'out', text: 'jk lol - Parik was here 😈' },
  ];

  async function triggerHackerman() {
    if (hacking) return;
    hacking = true;

    // Glitch the page
    document.body.classList.add('hackerman');

    // Scroll terminal into view
    const term = document.getElementById('terminal');
    if (term) term.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Interrupt normal loop, take over the terminal
    termGeneration++;

    // Run the fake hack session
    termBody.innerHTML = '';
    for (const item of HACK_LINES) {
      const line = makeLine();
      if (item.type === 'cmd') {
        const prompt = document.createElement('span');
        prompt.className = 't-prompt';
        prompt.textContent = '#';          // root prompt
        const cmd = document.createElement('span');
        cmd.className = 't-cmd';
        line.appendChild(prompt);
        line.appendChild(cmd);
        termBody.appendChild(line);
        await typeText(cmd, item.text, 18);
        await sleep(80);
      } else {
        const out = document.createElement('span');
        out.className = 't-out hack-out';
        out.textContent = item.text;
        line.appendChild(out);
        termBody.appendChild(line);
        await sleep(35);
      }
    }

    // Hold for a moment then restore
    await sleep(3500);
    document.body.classList.remove('hackerman');
    hacking = false;
    // Resume normal terminal loop
    loop();
  }
}

/* ─── DELIGHT: TERMINAL RED DOT RESETS SESSION ─── */
{
  const redDot = document.querySelector('.terminal-dot.red');
  if (redDot) {
    redDot.title = 'Clear session';
    redDot.addEventListener('click', () => {
      // Interrupt current session, show blank prompt, restart loop
      termGeneration++;
      termBody.innerHTML = '';
      const cursorLine = makeLine();
      const prompt = document.createElement('span');
      prompt.className = 't-prompt';
      prompt.textContent = '❯';
      const cur = document.createElement('span');
      cur.className = 't-cursor';
      cursorLine.appendChild(prompt);
      cursorLine.appendChild(cur);
      termBody.appendChild(cursorLine);
      setTimeout(loop, 900);
    });
  }
}
