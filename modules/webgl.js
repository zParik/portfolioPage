/* ─── HERO VOXEL WebGL ─── */
/* Raymarched volumetric field — conceptually tied to PaleGuard's 3D voxel encoding */
import { prefersReducedMotion } from './utils.js';

(function () {
  if (prefersReducedMotion) return;
  if (!window.matchMedia('(min-width: 900px)').matches) return;

  const wrap   = document.querySelector('.hero-voxel-bg');
  const canvas = document.getElementById('voxel-canvas');
  if (!wrap || !canvas) return;

  const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: false, antialias: false });
  if (!gl) return;

  /* ── Shaders ── */
  const VS = '#version 300 es\nin vec2 a_pos;\nvoid main(){gl_Position=vec4(a_pos,0,1);}';

  // Gradient noise → FBM → volumetric march → purple/teal voxel clusters
  const FS = [
    '#version 300 es',
    'precision mediump float;',
    'uniform float u_time;',
    'uniform vec2 u_res;',
    'uniform vec2 u_mouse;',
    'out vec4 fragColor;',
    // IQ-style gradient noise hash
    'vec3 g3(vec3 p){p=fract(p*vec3(.1031,.1030,.0973));p+=dot(p,p.yxz+33.33);return -1.+2.*fract((p.xxy+p.yxx)*p.zyx);}',
    // Quintic-interpolated gradient noise
    'float gn(vec3 p){vec3 i=floor(p),f=fract(p),u=f*f*f*(f*(f*6.-15.)+10.);return mix(mix(mix(dot(g3(i),f),dot(g3(i+vec3(1,0,0)),f-vec3(1,0,0)),u.x),mix(dot(g3(i+vec3(0,1,0)),f-vec3(0,1,0)),dot(g3(i+vec3(1,1,0)),f-vec3(1,1,0)),u.x),u.y),mix(mix(dot(g3(i+vec3(0,0,1)),f-vec3(0,0,1)),dot(g3(i+vec3(1,0,1)),f-vec3(1,0,1)),u.x),mix(dot(g3(i+vec3(0,1,1)),f-vec3(0,1,1)),dot(g3(i+vec3(1,1,1)),f-vec3(1,1,1)),u.x),u.y),u.z);}',
    // 3-octave FBM — creates multi-scale cluster structure
    'float fbm(vec3 p){return .5*gn(p)+.25*gn(p*2.03+vec3(.3,.7,.1))+.125*gn(p*4.07+vec3(.6,.2,.8));}',
    'mat3 rY(float a){float c=cos(a),s=sin(a);return mat3(c,0,s,0,1,0,-s,0,c);}',
    'mat3 rX(float a){float c=cos(a),s=sin(a);return mat3(1,0,0,0,c,-s,0,s,c);}',
    'void main(){',
    '  vec2 uv=(gl_FragCoord.xy-.5*u_res)/u_res.y;',
    '  float t=u_time*.055;',
    // Camera
    '  vec3 ro=vec3(0.,.15,-2.7);',
    '  vec3 rd=normalize(vec3(uv+u_mouse*.12,1.75));',
    // Scene rotation: slow Y-axis + subtle mouse tilt
    '  mat3 rot=rY(t)*rX(.27+u_mouse.y*.1+sin(t*.31)*.08);',
    '  vec3 col=vec3(0.);float acc=0.;',
    // 32-step volumetric march
    '  for(int i=0;i<32;i++){',
    '    vec3 rp=rot*(ro+rd*(float(i)*.15+.15));',
    // FBM output is roughly centred at 0, range ≈ [-0.4,0.4] for this hash
    // smoothstep threshold tuned to that real distribution → ~20% fill → discrete glowing clusters
    '    float d=fbm(rp*2.2+vec3(0.,0.,u_time*.022));',
    '    d=smoothstep(.58,.72,d*.5+.5);',
    '    if(d>.003){',
    // Accumulate faster → voxels become substantially opaque (acc→0.7-0.85)
    '      float sa=d*.18*(1.-acc);',
    '      float ht=clamp((rp.y+1.3)/2.6,0.,1.);',
    // Color: deep purple (#7c3aed) → accent purple (#a78bfa) → bright (#c4b5fd) → teal (#2dd4bf) at top
    '      vec3 c=mix(vec3(.486,.227,.929),vec3(.655,.545,.980),d*.8);',
    '      c=mix(c,vec3(.769,.714,.992),d*d*.5);',
    '      c=mix(c,vec3(.176,.831,.749),ht*d*.35);',
    '      col+=sa*c*4.5;acc+=sa;',
    '      if(acc>.90)break;',
    '    }',
    '  }',
    // Radial vignette: strongest glow in centre, fades to transparent at edges
    '  float vig=1.-smoothstep(.22,1.05,dot(uv,uv)*2.4);',
    '  fragColor=vec4(col*vig,acc*vig);',
    '}',
  ].join('\n');

  /* ── Compile & link ── */
  function mkShader(type, src) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.warn('[voxel] shader:', gl.getShaderInfoLog(sh));
      return null;
    }
    return sh;
  }

  const vs = mkShader(gl.VERTEX_SHADER, VS);
  const fs = mkShader(gl.FRAGMENT_SHADER, FS);
  if (!vs || !fs) return;

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn('[voxel] link:', gl.getProgramInfoLog(prog));
    return;
  }
  gl.useProgram(prog);

  /* ── Full-screen quad ── */
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uTime  = gl.getUniformLocation(prog, 'u_time');
  const uRes   = gl.getUniformLocation(prog, 'u_res');
  const uMouse = gl.getUniformLocation(prog, 'u_mouse');

  gl.disable(gl.DEPTH_TEST);

  /* ── State ── */
  let W = 0, H = 0;
  let mx = 0, my = 0, tmx = 0, tmy = 0;
  let rafId = null;
  let active = false;
  let startT = null;
  let lastRender = 0;
  let firstFrame = true;
  const TARGET_MS = 1000 / 30; // cap at 30fps — effect is ambient, looks identical to 60fps

  /* ── Resize: render at 50% resolution, CSS scales it up ── */
  function resize() {
    const cssW = wrap.offsetWidth || 600;
    W = Math.max(1, Math.round(cssW * 0.5));
    H = W; // parent is square (aspect-ratio: 1/1)
    canvas.width = W;
    canvas.height = H;
    gl.viewport(0, 0, W, H);
  }

  /* ── Mouse ── */
  document.addEventListener('mousemove', e => {
    tmx =  (e.clientX / window.innerWidth)  - 0.5;
    tmy = -((e.clientY / window.innerHeight) - 0.5);
  }, { passive: true });

  /* ── Render loop ── */
  function tick(ts) {
    if (!active) { rafId = null; return; }
    if (ts - lastRender < TARGET_MS) { rafId = requestAnimationFrame(tick); return; }
    lastRender = ts;
    if (startT === null) startT = ts;
    const t = (ts - startT) * 0.001;

    // Smooth mouse lerp
    mx += (tmx - mx) * 0.04;
    my += (tmy - my) * 0.04;

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uTime, t);
    gl.uniform2f(uRes, W, H);
    gl.uniform2f(uMouse, mx, my);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    if (firstFrame) {
      firstFrame = false;
      wrap.classList.add('has-webgl');
      canvas.classList.add('voxel-ready');
    }

    rafId = requestAnimationFrame(tick);
  }

  /* ── Pause when off-screen ── */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !active) {
        active = true; startT = null;
        rafId = requestAnimationFrame(tick);
      } else if (!e.isIntersecting && active) {
        active = false;
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      }
    });
  }, { threshold: 0.01 });

  resize();
  window.addEventListener('resize', resize, { passive: true });
  io.observe(wrap);
}());
