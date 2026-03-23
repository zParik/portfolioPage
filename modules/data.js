/* ─── PROJECT DATA ─── */
import { prefersReducedMotion } from './utils.js';

const PROJECTS = [
  {
    id: 'FILE-001', active: true, cat: 'security',
    ariaLabel: 'PaleGuard: Vision-based EDR, active research. Press Enter to view details.',
    codename: 'PaleGuard', domain: 'CyberSec · CV', metric: '88% detection',
    dossier: {
      clearance: 'ACTIVE RESEARCH', name: 'PaleGuard',
      badge: 'Active — Present | CyberSecurity — Computer Vision',
      role: 'Sole Architect & Researcher', status: 'ONGOING', unredacted: true,
      overview: 'Proactive malware detection: PE binaries mapped into 6-channel 3D volumetric tensors, classified by a 3D ResNet-18.||Trained on ~58,000 samples (VirusShare + clean Windows PEs). Paper under review at Scientific Reports.||Inference: 3.3ms per sample.',
      architecture: 'Stack: 3D ResNet-18 + SE attention + Morton Z-order encoding||6 PE sections (.text, .code, .rdata, .idata, .data, .edata) mapped into a 64³ voxel grid via Morton Z-curve for locality preservation.||Each voxel: 6 channels — raw byte value, local entropy, code mask, import density, string density, data-presence mask.||Masked global average pooling + SE attention resolves density shortcut-learning.',
      contribution: 'Conceived the research hypothesis and designed the Morton-curve volumetric encoding scheme.||Identified and resolved density shortcut-learning via masking + SE attention — the key technical insight.||Ran all experiments and drafted the manuscript.',
      outcome: '88% accuracy on family-disjoint held-out evaluation (TheZoo vs VirusShare) with 11% FNR — designed to test generalization to unseen malware families. 99% accuracy / 0.9971 ROC-AUC on random split for comparison.',
      stat: '88%', statLabel: 'new family detection', statCount: '88', statSuffix: '%',
      stat2: '3.3ms', stat2Label: 'inference time',
    },
  },
  {
    id: 'FILE-002', active: true, cat: 'security',
    ariaLabel: 'NotBigBrother: Privacy-preserving age verification, active research. Press Enter to view details.',
    codename: 'NotBigBrother', domain: 'Privacy · Crypto', metric: 'Zero PII',
    dossier: {
      clearance: 'ACTIVE RESEARCH', name: 'NotBigBrother',
      badge: 'Active — Present | Privacy — Cryptography',
      role: 'Sole Designer & Implementer', status: 'ONGOING', unredacted: true,
      overview: 'PoC: privacy-preserving age verification using RSA blind signatures (Chaum scheme).||The verifier never knows where a token is used; the website never learns who the user is.||Zero server callbacks. Zero PII stored.',
      architecture: 'Stack: Node/Express + InsightFace (SCRFD, ONNX) + RSA blind signatures||Three-party flow: Issuer analyzes face and issues blinded token -> User blinds token before submission -> Issuer signs without seeing final form.||Website verifies locally against issuer public key — no round-trip required.',
      contribution: 'Designed the full cryptographic protocol (blind signature flow end-to-end).||Integrated InsightFace/SCRFD via ONNX for age estimation.||Built the Node/Express issuer service.',
      outcome: 'Working PoC demonstrating unlinkable, zero-knowledge age verification. Novel application of Chaum blind signatures to identity verification.',
      stat: 'Zero PII', statLabel: 'stored or transmitted',
      stat2: 'Untraceable', stat2Label: 'by design',
      github: 'https://github.com/zParik/NotBigBrother',
    },
  },
  {
    id: 'FILE-003', cat: 'security',
    ariaLabel: 'ARCHON — Anonymous distributed messaging system. Press Enter to view details.',
    codename: 'ARCHON', domain: 'Privacy', metric: 'AES-256',
    dossier: {
      clearance: 'DECLASSIFIED', name: 'ARCHON',
      badge: 'Privacy', role: 'Full-Stack Developer', status: 'COMPLETE', unredacted: true,
      overview: 'Tor-inspired anonymous distributed messaging. Users identified by cryptographic hash-derived codenames — no email, no real name.||Messages AES-256 encrypted client-side; the relay stores only ciphertext, never plaintext.||Full contact system: bidirectional friend requests, encrypted profiles, read receipts, 7-day message TTL.',
      architecture: 'Stack: Node.js/Express + MongoDB + React 19 + TailwindCSS 4 + Tanstack Router||Three-tier: main server (relay registry + heartbeat) -> independently deployable relay nodes -> React frontend.||Conversation keys via SHA256 of both user hashes; message content, sender hash, receiver hash all AES-encrypted client-side.||Profile fields (username, bio, status) also encrypted. Multi-hop onion routing stubbed for next phase.',
      contribution: 'Sole developer — designed the full distributed architecture from scratch.||Built: relay registration/heartbeat system, anonymous identity generation, JWT auth flow, bidirectional contact system, client-side encryption, entire React frontend.',
      outcome: 'Fully functional 1-to-1 anonymous messaging system. Relay network, encrypted auth, contact management, profile privacy, and end-to-end encrypted messaging all operational. Multi-hop onion routing and perfect forward secrecy are planned next phases.',
      stat: 'AES-256', statLabel: 'end-to-end encrypted',
      stat2: '7-day TTL', stat2Label: 'message lifetime',
      github: 'https://github.com/zParik/ARCHON',
    },
  },
  {
    id: 'FILE-004', cat: 'access',
    ariaLabel: 'VisionAid - YOLOv8x + Depth Anything V2 indoor navigation for visually impaired users. Press Enter to view details.',
    codename: 'VisionAid', domain: 'Accessibility · CV', metric: '16 FPS GPU',
    dossier: {
      clearance: 'DECLASSIFIED', name: 'VisionAid',
      badge: 'Accessibility · Computer Vision', role: 'Lead Developer & Team Lead', status: 'COMPLETE', unredacted: true,
      overview: 'Real-time indoor navigation assistant for the visually impaired. Built for UCSC316L Computer Vision (Fall 2025–26).||Detects 600+ object classes (Open Images V7) via YOLOv8x; monocular depth via Depth Anything V2 Small (14ms GPU).||DeepSORT + MobileNetV2 re-ID tracks objects across frames.||Reactive navigation engine issues directional audio cues (Web Speech API) every 500ms — no fixed depth assumptions.||Hands-free voice command input; gyroscope-based frame rotation correction for phone orientation.',
      architecture: 'Stack: Flask + YOLOv8x + Depth Anything V2 + DeepSORT + TensorRT (NVIDIA RTX)||Mobile browser streams JPEG frames to GPU-accelerated Flask backend. Detection and depth pipelines run async and decoupled.||Reactive navigation engine (replaces classical A*): perspective-aware movement analysis + 500+ object heights DB for motion-based depth calibration.||Request ID tracking eliminates stale-response race conditions. Vanilla JS frontend with Web Speech API for audio I/O.',
      contribution: 'Role: Lead developer in a 3-person team (under Dr. Shunmuga Perumal).||Architected the full CV pipeline: YOLOv8x inference, Depth Anything V2 integration, DeepSORT tracking, async depth pipeline, reactive navigation engine, JSON-safe serialization.||Designed spatial reasoning heuristics: perspective-aware movement analysis and motion-based depth calibration.||Built the Flask API and the entire vanilla JS frontend — Web Speech API, gyroscope correction, voice commands.',
      outcome: '25–40× speedup over the initial CPU prototype (1–3 FPS CPU -> 10–16 FPS GPU with TensorRT). 60–100ms total end-to-end latency on GPU. Manually collected and annotated dataset of 4,226 images expanded to 21,126 via augmentation with YOLO OBB annotations. 43 bugs resolved (13 critical, 17 high, 13 medium) across coordinate systems, threading, CUDA/TensorRT, stale data, and navigation logic. Demonstrated live as assistive AI research at VIT with all three demo scenarios.',
      stat: '16 FPS', statLabel: 'GPU inference', statCount: '16', statSuffix: ' FPS',
      stat2: '60ms', stat2Label: 'end-to-end latency',
      demo: 'https://youtu.be/nBjYTFXBpWY,https://youtu.be/QXU4xU__s2Y,https://youtu.be/PZpLDPnhvVg',
    },
  },
  {
    id: 'FILE-005', cat: 'access',
    ariaLabel: 'ASL Transcription System: Real-time sign language recognition. Press Enter to view details.',
    codename: 'ASL Transcription', domain: 'Accessibility · CV', metric: '96% mAP',
    dossier: {
      clearance: 'DECLASSIFIED', name: 'ASL Transcription System',
      badge: 'Accessibility - Deep Learning - Computer Vision', role: 'Lead Developer', status: 'COMPLETE', unredacted: true,
      overview: 'Real-time ASL fingerspelling recognition — single-stage detection and classification via YOLOv11x.||Browser-native: WebRTC camera input -> Flask API backend.||Recognizes 26 letters + SPACE and DELETE for live text composition.',
      architecture: 'Stack: YOLOv11x (56.8M params, 194.6 GFLOPs) + Flask + WebRTC||Fine-tuned on 2,614 augmented ASL images. Inference at 640×640, conf=0.25, IoU=0.45.||Dual-mode async pipeline: frame submission at 500ms, prediction polling at 200ms — decoupled to prevent blocking.||2s debounce + 40% confidence gating prevents duplicate character accumulation.',
      contribution: 'Ablation study across YOLOv8L, YOLOv8X, and YOLOv11x — YOLOv11x won (better FLOPs/param ratio, no overfitting).||Built the full-stack pipeline: WebRTC frontend, Flask inference API, and state-based word/sentence logic.',
      outcome: '96% mAP@0.5, 95% precision, 97% recall on ASL letter detection. Converges in ~50 epochs vs 200 for CNN-LSTM approaches. Matches YOLOv8 accuracy with a more efficient architecture.',
      stat: '96%', statLabel: 'mAP@0.5', statCount: '96', statSuffix: '%',
      stat2: '97%', stat2Label: 'recall',
    },
  },
  {
    id: 'FILE-006', cat: 'hack',
    ariaLabel: 'Plant Disease and Pest Detection: YOLOv8-seg and YOLO11n with TabNet fusion. Press Enter to view details.',
    codename: 'Plant Disease Detection', domain: 'Hackathon · CV', metric: '99.97%',
    dossier: {
      clearance: 'DECLASSIFIED', name: 'Plant Disease & Pest Detection',
      badge: 'Hackathon', role: 'Fullstack & CV Dev', status: 'COMPLETE', unredacted: true,
      overview: 'Multimodal AI for Indian sugarcane farming — fuses computer vision with structured questionnaire data.||YOLOv8s-seg for dead heart disease (99.5% mAP@0.5); YOLO11n for tiller damage pest detection (99.4% mAP@0.5).||Fusion layer: 99.97% accuracy, 67% error reduction over questionnaire-only baseline.||Field-validated across 500 farmers in 5 Indian states.',
      architecture: 'Stack: YOLOv8s-seg + YOLO11n + TabNet + Flask + mobile JS frontend||YOLOv8s-seg: 0.942 mean IoU, 0.968 Dice score for dead heart instance segmentation.||YOLO11n: 3M params, 6.2MB, 12.3ms GPU inference for tiller damage detection.||TabNet: attention-based model on structured farmer questionnaires (~96% accuracy). Fusion layer combines vision + questionnaire confidence scores.',
      contribution: 'Trained YOLOv8s-seg, YOLO11n, and TabNet models.||Built the frontend UI and assisted with backend development. 5-person team.',
      outcome: 'Hackathon submission. 99.97% fused model accuracy. 89.3% early detection rate before visible symptoms. Validated by 500 farmers across 5 states with 94.2% farmer agreement and 97.8% expert verification.',
      stat: '99.97%', statLabel: 'fusion accuracy',
      stat2: '89.3%', stat2Label: 'early detection rate',
      github: 'https://github.com/zParik/CodeCultivators---Agrithon',
    },
  },
  {
    id: 'FILE-007', cat: 'hack',
    ariaLabel: 'Uni P2P Rental Marketplace: React + Supabase rental platform, awarded Best UI/UX. Press Enter to view details.',
    codename: 'P2P Rental Marketplace', domain: 'Hackathon', metric: 'Best UI/UX',
    dossier: {
      clearance: 'DECLASSIFIED', name: 'Uni P2P Rental Marketplace',
      badge: 'Hackathon - Best UI/UX', role: 'Team Lead & Full-Stack Developer', status: 'COMPLETE', unredacted: true,
      overview: 'University peer-to-peer rental marketplace where students list and rent items from each other. Built pre-AI at a hackathon. Led a 3-person team: two full-stack devs (me and Chetak) and a dedicated UI/UX designer (Aayush, Figma). Awarded Best UI/UX.',
      architecture: 'Stack: React 18 + Vite + Redux Toolkit + Supabase (Postgres + auth + storage) + CSS Modules||Redux slices: auth and product state. Supabase handles auth, DB, and file storage.||Pages: landing, listings, product detail, cart, rentals, KYC, account management, create listing.',
      contribution: 'Team lead and full-stack developer alongside Chetak. Owned the frontend architecture, Redux store design, Supabase integration, and core pages. Aayush handled Figma design; we implemented it.',
      outcome: 'Awarded Best UI/UX at the hackathon. Built entirely without AI assistance.',
      stat: 'Best UI/UX', statLabel: 'hackathon award',
      stat2: 'Built', stat2Label: 'without AI assistance',
      github: 'https://github.com/zParik/Devjams',
    },
  },
  {
    id: 'FILE-008', cat: 'sys',
    ariaLabel: 'Tic-Tac-Toe Minimax AI: Unbeatable AI via plain Minimax. Press Enter to view details.',
    codename: 'Minimax AI', domain: 'AI · Web', metric: '255K nodes',
    dossier: {
      clearance: 'DECLASSIFIED', name: 'Tic-Tac-Toe: Minimax AI',
      badge: 'AI - Web', role: 'Developer', status: 'COMPLETE', unredacted: true,
      overview: 'Browser-based Tic-Tac-Toe with an unbeatable AI opponent powered by plain Minimax. Personal project built to explore Flask and game-tree search.',
      architecture: 'Stack: Flask + Vanilla JS + jQuery||Flask API: /getmethod/ receives board state, runs Minimax over full 9-ply game tree, returns optimal move as JSON.||Frontend manages board state and renders moves client-side.',
      contribution: 'Implemented the Minimax algorithm from scratch. Built all Flask routes, the board encoding/decoding logic, and the interactive JS frontend.',
      outcome: 'Personal project. Provably unbeatable: evaluates 255,168 nodes per opening move.',
      stat: '255K', statLabel: 'nodes per move', statCount: '255', statSuffix: 'K',
      stat2: 'Provably', stat2Label: 'unbeatable',
      github: 'https://github.com/zParik/Python-Project-Red/tree/main/Maasive%20website%20prj',
    },
  },
  {
    id: 'FILE-009', cat: 'sys',
    ariaLabel: 'Ashram Management Portal: PHP/MySQL portal with room bookings, course enrollment, and staff dashboard. Press Enter to view details.',
    codename: 'Ashram Management', domain: 'Web', metric: '3 Roles',
    dossier: {
      clearance: 'DECLASSIFIED', name: 'Ashram Management Portal',
      badge: 'Web', role: 'Full-Stack Developer', status: 'COMPLETE', unredacted: true,
      overview: 'Full-stack web app for a wellness ashram. Public visitors can book rooms and enroll in courses; staff get an internal dashboard with participant management and attendance tracking.',
      architecture: 'Stack: PHP + PDO/MySQL + Vanilla JS||Session-based auth with 3 roles: user / employee / admin.||REST-style endpoints: room bookings (availability stored proc), course enrollment, participant CRUD, attendance.||\'.htaccess routes all protected pages through a central guard.',
      contribution: 'Sole developer. Designed the database schema, built all PHP API endpoints, implemented role-based access control, and built the frontend from scratch.',
      outcome: 'Submitted as a university web development course project.',
      stat: '3 Roles', statLabel: 'access levels', statCount: '3', statSuffix: ' Roles',
      stat2: 'REST', stat2Label: 'API design',
      github: 'https://github.com/zParik/refactored-fortnight',
    },
  },
  {
    id: 'FILE-010', cat: 'hack',
    ariaLabel: 'GapEdit: C terminal gap-buffer editor. Press Enter to view details.',
    codename: 'GapEdit', domain: 'Codeathon · C', metric: '8 hrs build',
    dossier: {
      clearance: 'DECLASSIFIED', name: 'GapEdit',
      badge: 'Codeathon - Systems', role: 'Systems Developer', status: 'COMPLETE', unredacted: true,
      overview: 'Gap-buffer text editor written in C. Handles cursor movement, insert, and delete operations via a two-stack structure.',
      architecture: 'Gap buffer implemented as two character stacks (left/right of cursor). Supports text insertion, deletion, and cursor movement in both directions.',
      contribution: 'Sole author. Implemented the gap buffer, cursor operations, and a menu-driven CLI interface.',
      outcome: 'Built at a codeathon in ~8 hours. Reviewer recognized it as a functional CLI editor and suggested polishing it further.',
      stat: '8 hrs', statLabel: 'codeathon build',
      stat2: 'Gap Buffer', stat2Label: 'in pure C',
    },
  },
  {
    id: 'FILE-011', cat: 'hack',
    ariaLabel: 'SWITCHBOARD: Networking hackathon: Cisco Packet Tracer topology and concurrent Java socket server. Press Enter to view details.',
    codename: 'SWITCHBOARD', domain: 'Hackathon', metric: 'Top 3',
    dossier: {
      clearance: 'DECLASSIFIED', name: 'SWITCHBOARD',
      badge: 'Hackathon - Networking & IPC', role: 'Team Lead & Sole Socket Developer', status: 'COMPLETE', unredacted: true,
      overview: 'Networking hackathon (Nov 2024): Cisco Packet Tracer enterprise network + concurrent Java socket bank — two parallel tracks.||Packet Tracer: online education platform with AWS cluster, MongoDB servers, ACL-segmented HQ network.||Socket track: live multi-client bank — clients credit/debit each other in real time with consistent shared state.||Top 3 teams; selected to present to external evaluator.',
      architecture: 'Stack: Java sockets + Cisco Packet Tracer (ACL subnetting + core router backbone)||Packet Tracer: 4 ACL-segmented departments (R&D, IT, HR, Dev) — 64 IPs each, strict per-department access policies.||Socket server: dual HashMaps (username -> PrintWriter for routing; username -> balance for state). Each client spawns a ClientHandler thread.||Clients run async MessageReceiver thread — server pushes don\'t block user input. Active client list broadcast after every transaction.',
      contribution: 'Team lead across both tracks.||Sole architect and developer of the Java socket server: concurrent client handling, hashmap routing, balance state, async receiver.||Directed the Packet Tracer topology; Megha and Chetak handled Cisco configuration.',
      outcome: 'Top 3 out of all competing teams, selected to present to the external evaluator. Demonstrated 4 simultaneous clients performing concurrent transactions with consistent shared state: no race conditions, no dropped messages.',
      stat: 'Top 3', statLabel: 'hackathon placement',
      stat2: '4 clients', stat2Label: 'concurrent, zero races',
      github: 'https://github.com/zParik/College-Code-Stuff',
    },
  },
  {
    id: 'FILE-012', cat: 'sys',
    ariaLabel: 'Linux Tutorial Blog: AI-assisted technical blog on Linux fundamentals. Press Enter to view details.',
    codename: 'Linux Tutorial Blog', domain: 'Technical Writing', metric: 'Published',
    dossier: {
      clearance: 'DECLASSIFIED', name: 'Linux Tutorial Blog',
      badge: 'Technical Writing', role: 'Author', status: 'COMPLETE', unredacted: true,
      overview: 'AI-assisted technical blog covering Linux fundamentals, built as an educational resource for a club event introducing students to the Linux ecosystem.',
      architecture: 'Static blog site generated with AI tooling. Content covers core Linux concepts: terminal basics, file system navigation, package management, and shell scripting, structured as progressive tutorials.',
      contribution: 'Authored all tutorial content and structured the learning progression. Used AI tooling to accelerate site generation while curating the technical material.',
      outcome: 'Delivered as part of a club event. Served as a hands-on reference for attendees learning Linux for the first time.',
      stat: 'Published', statLabel: 'club event resource',
      stat2: 'Linux', stat2Label: 'fundamentals',
      github: 'https://github.com/zParik/Scribble-AI-blog',
    },
  },
  {
    id: 'FILE-013', cat: 'sys', earlier: true,
    ariaLabel: 'Python Practice Launcher: Tkinter app with 29 exercises. Press Enter to view details.',
    codename: 'Python Practice Launcher', domain: 'High School', metric: '29 exercises',
    dossier: {
      clearance: 'DECLASSIFIED', name: 'Python Practice Launcher',
      badge: 'High School', role: 'Developer', status: 'COMPLETE', unredacted: true,
      overview: 'Built a Tkinter desktop app to help classmates learn Python: a menu-driven launcher with 29 exercises covering sorting, searching, recursion, and data structures. Iterated through 4 versions: plain CLI, refactored with functions, Tkinter GUI, and a Django web port.',
      architecture: 'Stack: Python + Tkinter + Django (web port) + Numba||3 modules: File1.py (exercise source strings), Python.py (29 runnable functions), KeyIndexAssigner.py (functools.partial dispatch registry).||Final version: all 29 functions decorated with Numba @jit(nopython=True). Deeply unnecessary. Completely intentional.',
      contribution: 'Sole developer. Designed the modular architecture and progressively iterated the interface across 4 versions. FastStartup variant auto-launched Google Meet links for online classes.',
      outcome: 'Used informally by ~15 classmates during high school. The origin of this portfolio: the first project that felt genuinely useful.',
      stat: '29 exercises', statLabel: 'Python problems',
      stat2: '4 versions', stat2Label: 'iterated',
    },
  },
  {
    id: 'FILE-014', cat: 'sys', earlier: true,
    ariaLabel: 'Faculty Substitution Manager: Django web app automating sub assignment. Press Enter to view details.',
    codename: 'Faculty Substitution Manager', domain: 'High School', metric: 'Deployed',
    dossier: {
      clearance: 'DECLASSIFIED', name: 'Faculty Substitution Manager',
      badge: 'High School', role: 'Full-Stack Developer', status: 'COMPLETE', unredacted: true,
      overview: 'Built a Django web app during high school to automate faculty absence tracking and substitute assignment. Admin marks absent teachers; the system cross-references timetables for 6 classes across 5 days and auto-assigns available subs with a cap of 2 periods each.',
      architecture: 'Stack: Django + MongoDB (djongo) + custom greedy scheduler||Models: teachers (name, subject, attendance, sub count), per-teacher weekly schedules (Teach2), daily reports.||Greedy algorithm checks availability, current load cap, and subject-class conflicts before assigning subs.||Reports saved to disk and tracked in DB per session.',
      contribution: 'Sole developer. Designed the data model, the substitution algorithm, and the Django views end-to-end. Also built the timetable config layer (tables.py) for all 6 classes.',
      outcome: 'Deployed and actively used at school. Automated a manual coordination task that previously required admin overhead every morning. Daily reports generated and archived per session.',
      stat: 'Deployed', statLabel: 'used at school',
      stat2: 'Greedy', stat2Label: 'scheduler algorithm',
    },
  },
];

function renderManifest() {
  const list = document.getElementById('manifest-list');
  const earlierList = document.getElementById('earlier-work-list');

  PROJECTS.forEach(p => {
    const el = document.createElement('div');
    const classes = ['manifest-row', 'dossier-trigger', `cat-${p.cat}`];
    if (p.active) classes.push('manifest-row--active');
    if (!p.earlier) classes.push('reveal');
    el.className = classes.join(' ');
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', p.ariaLabel);

    const d = p.dossier;
    el.dataset.dossierUnredacted = String(d.unredacted !== false);
    el.dataset.dossierClearance = d.clearance;
    el.dataset.dossierName = d.name;
    el.dataset.dossierBadge = d.badge;
    el.dataset.dossierRole = d.role;
    el.dataset.dossierStatus = d.status;
    el.dataset.dossierOverview = d.overview;
    el.dataset.dossierArchitecture = d.architecture;
    el.dataset.dossierContribution = d.contribution;
    el.dataset.dossierOutcome = d.outcome;
    if (d.stat) el.dataset.dossierStat = d.stat;
    if (d.statLabel) el.dataset.dossierStatLabel = d.statLabel;
    if (d.statCount) el.dataset.dossierStatCount = d.statCount;
    if (d.statSuffix !== undefined) el.dataset.dossierStatSuffix = d.statSuffix;
    if (d.stat2) el.dataset.dossierStat2 = d.stat2;
    if (d.stat2Label) el.dataset.dossierStat2Label = d.stat2Label;
    if (d.github) el.dataset.dossierGithub = d.github;
    if (d.link) el.dataset.dossierLink = d.link;
    if (d.demo) el.dataset.dossierDemo = d.demo;

    if (p.active) {
      el.innerHTML =
        `<span class="manifest-active-dot" aria-hidden="true"></span>` +
        `<span class="manifest-filenum">${p.id}</span>` +
        `<span class="manifest-codename">${p.codename}</span>` +
        `<span class="manifest-domain">${p.domain}</span>` +
        `<span class="manifest-metric">${p.metric}</span>` +
        `<span class="manifest-status-tag manifest-status-tag--active">ACTIVE</span>`;
    } else {
      el.innerHTML =
        `<span class="manifest-arrow" aria-hidden="true">▶</span>` +
        `<span class="manifest-filenum">${p.id}</span>` +
        `<span class="manifest-codename">${p.codename}</span>` +
        `<span class="manifest-domain">${p.domain}</span>` +
        `<span class="manifest-metric">${p.metric}</span>` +
        `<span class="manifest-status-tag">COMPLETE</span>`;
    }

    (p.earlier ? earlierList : list).appendChild(el);
  });
}

renderManifest();

// Boot sequence: flag body so hero elements stay hidden until sequence reveals them
if (!prefersReducedMotion) document.body.setAttribute('data-boot', 'running');
