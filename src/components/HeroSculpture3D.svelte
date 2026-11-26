<script lang="ts">
  import { onMount } from 'svelte';

  type PaletteKey = 'cyanOrchid' | 'sovereignGold' | 'prism5d';

  interface PaletteSpec {
    id: PaletteKey;
    label: string;
    a: [number, number, number];
    b: [number, number, number];
    vein: [number, number, number];
    base: [number, number, number];
    rough: number;
    dimBoost: number;
  }

  const PALETTES: PaletteSpec[] = [
    {
      id: 'cyanOrchid',
      label: 'Cyan / Orchid',
      a: [0.0, 0.94, 1.0],
      b: [0.95, 0.24, 0.78],
      vein: [1.0, 0.76, 0.28],
      base: [0.016, 0.02, 0.032],
      rough: 0.24,
      dimBoost: 0.38,
    },
    {
      id: 'sovereignGold',
      label: 'Sovereign 24K Gold',
      a: [1.0, 0.74, 0.2],
      b: [0.0, 0.9, 1.0],
      vein: [1.0, 0.82, 0.34],
      base: [0.012, 0.012, 0.018],
      rough: 0.19,
      dimBoost: 0.3,
    },
    {
      id: 'prism5d',
      label: '5D Prism',
      a: [0.0, 0.96, 0.65],
      b: [0.22, 0.75, 1.0],
      vein: [1.0, 0.68, 0.24],
      base: [0.025, 0.06, 0.11],
      rough: 0.14,
      dimBoost: 0.92,
    },
  ];

  let canvasEl: HTMLCanvasElement | undefined = $state();
  let stageEl: HTMLDivElement | undefined = $state();
  let activePalette = $state<PaletteKey>('cyanOrchid');
  let useVideoFallback = $state(false);
  let isDragging = $state(false);
  let pulseLevel = 0.0;

  function triggerPulse() {
    pulseLevel = 1.0;
  }

  onMount(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || !canvasEl || !stageEl) {
      useVideoFallback = true;
      return;
    }

    const gl = canvasEl.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      powerPreference: 'high-performance',
    });

    if (!gl) {
      useVideoFallback = true;
      return;
    }

    const VS = `#version 300 es
in vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

    const FS = `#version 300 es
precision highp float;
out vec4 fragColor;

uniform vec2  uRes;
uniform float uTime;
uniform float uAngle;
uniform float uTilt;
uniform vec2  uOrbit;
uniform float uZoom;
uniform vec2  uPointer;
uniform float uPulse;
uniform float uDimMode;
uniform int   uSteps;
uniform vec3  uColA;
uniform vec3  uColB;
uniform vec3  uVeinCol;
uniform vec3  uBaseCol;
uniform float uBaseRough;

#define PI 3.14159265359
const float HR   = 0.96;
const float HC   = 0.50;
const float TUBE = 0.165;
const float RSP  = 0.39;
const float RR   = 0.052;

mat2 rot(float a) {
  float c = cos(a), s = sin(a);
  return mat2(c, -s, s, c);
}

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
  vec3 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - r;
}

float sdTorus(vec3 p, vec2 t) {
  vec2 q = vec2(length(p.xz) - t.x, p.y);
  return length(q) - t.y;
}

vec3 toLocal(vec3 p) {
  p.xy = rot(uTilt + uPointer.y * 0.06) * p.xy;
  p.xz = rot(uAngle) * p.xz;
  return p;
}

float sdStrand(vec3 p, float ph) {
  float r = length(p.xz);
  float a = atan(p.z, p.x);
  float per = 2.0 * PI * HC;
  float dy = p.y - HC * (a + ph);
  dy = mod(dy + 0.5 * per, per) - 0.5 * per;
  float k = HR / sqrt(HR * HR + HC * HC);
  return length(vec2(r - HR, dy * k)) - TUBE;
}

vec3 sdRungs(vec3 p) {
  float best = 1e5, side = 1.0, idx = 0.0;
  float yc = floor(p.y / RSP + 0.5);
  for (int j = -1; j <= 1; j++) {
    float id = yc + float(j);
    float yi = id * RSP;
    float a = yi / HC;
    vec3 d = vec3(cos(a), 0.0, sin(a));
    vec3 c = vec3(0.0, yi, 0.0);
    float ds = sdCapsule(p, c - d * HR, c + d * HR, RR);
    ds = smin(ds, length(p - c) - RR * 1.55, 0.04);
    if (ds < best) {
      best = ds;
      side = dot(p - c, d) > 0.0 ? 1.0 : -1.0;
      idx = id;
    }
  }
  return vec3(best, side, idx);
}

// 4D Stereographic Clifford / Tesseract orbital projection rings
float sdHyperRings(vec3 wp, float t) {
  vec3 q = wp;
  q.xy = rot(0.32 + uPointer.y * 0.14) * q.xy;
  q.xz = rot(-t * 0.24 + uPointer.x * 0.22) * q.xz;

  // 4D W-coordinate projection modulation
  float w1 = sin(t * 0.65);
  float w2 = cos(t * 0.48 + 1.2);
  float proj1 = 2.15 / (2.05 - w1 * 0.32);
  float proj2 = 2.25 / (2.05 - w2 * 0.34);

  vec3 q1 = q;
  q1.yz = rot(0.92 + w1 * 0.22) * q1.yz;
  float r1 = sdTorus(q1, vec2(1.42 * proj1, 0.011));

  vec3 q2 = q;
  q2.xy = rot(-0.88 - w2 * 0.24) * q2.xy;
  q2.yz = rot(0.55) * q2.yz;
  float r2 = sdTorus(q2, vec2(1.52 * proj2, 0.010));

  return min(r1, r2);
}

// x = distance, y = material (1=strand, 2/3=rungs, 4=4D rings), z = rungDist, w = rungSide
vec4 map(vec3 wp) {
  vec3 p = toLocal(wp);
  float s1 = sdStrand(p, 0.0);
  float s2 = sdStrand(p, PI);
  vec3 rg = sdRungs(p);
  float d = min(s1, s2);
  float m = 1.0;
  if (rg.x < d) {
    d = rg.x;
    m = rg.y > 0.0 ? 2.0 : 3.0;
  }
  float hr = sdHyperRings(wp, uTime);
  if (hr < d) {
    d = hr;
    m = 4.0;
  }
  return vec4(d * 0.82, m, rg.x, rg.y);
}

vec3 calcNormal(vec3 p) {
  const vec2 k = vec2(1.0, -1.0);
  const float e = 0.0016;
  return normalize(
    k.xyy * map(p + k.xyy * e).x +
    k.yyx * map(p + k.yyx * e).x +
    k.yxy * map(p + k.yxy * e).x +
    k.xxx * map(p + k.xxx * e).x
  );
}

float calcAO(vec3 p, vec3 n) {
  float o = 0.0, s = 1.0;
  for (int i = 1; i <= 4; i++) {
    float h = 0.045 * float(i);
    o += (h - map(p + n * h).x) * s;
    s *= 0.6;
  }
  return clamp(1.0 - 2.3 * o, 0.0, 1.0);
}

vec3 hash3(vec3 p) {
  p = vec3(
    dot(p, vec3(127.1, 311.7, 74.7)),
    dot(p, vec3(269.5, 183.3, 246.1)),
    dot(p, vec3(113.5, 271.9, 124.6))
  );
  return fract(sin(p) * 43758.5453123);
}

// Voronoi F2 - F1 : Kintsugi molten gold seams
float veins(vec3 p) {
  vec3 i = floor(p), f = fract(p);
  float f1 = 8.0, f2 = 8.0;
  for (int z = -1; z <= 1; z++)
  for (int y = -1; y <= 1; y++)
  for (int x = -1; x <= 1; x++) {
    vec3 g = vec3(float(x), float(y), float(z));
    vec3 r = g + hash3(i + g) - f;
    float d = dot(r, r);
    if (d < f1) { f2 = f1; f1 = d; }
    else if (d < f2) { f2 = d; }
  }
  return sqrt(f2) - sqrt(f1);
}

vec3 envColor(vec3 r) {
  float t = r.y;
  vec3 c = mix(vec3(0.014, 0.02, 0.036), vec3(0.03, 0.09, 0.16), smoothstep(-0.2, 0.6, t));
  c += vec3(1.0, 0.88, 0.68) * 3.0 * smoothstep(0.8, 0.98, t);
  c += uColA * 0.95 * exp(-abs(t) * 14.0) * (0.55 + 0.45 * r.x);
  c += uColB * 0.72 * smoothstep(0.74, 0.97, -r.x);
  return c;
}

vec3 lightGGX(vec3 n, vec3 v, vec3 l, vec3 lc, vec3 alb, float metal, float rough, vec3 F0) {
  vec3 h = normalize(l + v);
  float NdL = max(dot(n, l), 0.0);
  float NdV = max(dot(n, v), 1e-3);
  float NdH = max(dot(n, h), 0.0);
  float VdH = max(dot(v, h), 0.0);
  float a = rough * rough;
  float a2 = a * a;
  float dn = NdH * NdH * (a2 - 1.0) + 1.0;
  float D = a2 / (PI * dn * dn);
  float k = (rough + 1.0) * (rough + 1.0) / 8.0;
  float G = (NdL / (NdL * (1.0 - k) + k)) * (NdV / (NdV * (1.0 - k) + k));
  vec3 F = F0 + (1.0 - F0) * pow(1.0 - VdH, 5.0);
  vec3 spec = D * G * F / (4.0 * NdL * NdV + 1e-3);
  vec3 kd = (1.0 - F) * (1.0 - metal);
  return (kd * alb / PI + spec) * lc * NdL;
}

vec3 shadePBR(vec3 n, vec3 v, vec3 alb, float metal, float rough) {
  vec3 F0 = mix(vec3(0.04), alb, metal);
  vec3 col = vec3(0.0);
  col += lightGGX(n, v, normalize(vec3(0.6, 0.85, 0.55)),  vec3(1.0, 0.94, 0.85) * 3.5, alb, metal, rough, F0);
  col += lightGGX(n, v, normalize(vec3(-0.75, 0.25, -0.55)), vec3(0.25, 0.86, 1.0) * 2.5, alb, metal, rough, F0);
  col += lightGGX(n, v, normalize(vec3(-0.35, -0.55, 0.7)),  vec3(0.95, 0.35, 0.82) * 1.15, alb, metal, rough, F0);
  float NdV = max(dot(n, v), 0.0);
  vec3 Fv = F0 + (1.0 - F0) * pow(1.0 - NdV, 5.0);
  col += envColor(reflect(-v, n)) * Fv * (1.0 - rough * 0.65);
  return col;
}

vec3 aces(vec3 x) {
  const float a = 2.51, b = 0.03, c = 2.43, d = 0.59, e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
}

vec3 spectral5d(float phase) {
  return 0.5 + 0.5 * cos(6.28318 * (phase + vec3(0.0, 0.33, 0.67)));
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.x, uRes.y);
  vec2 suv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;

  float yaw = uOrbit.x + uPointer.x * 0.22;
  float pitch = uOrbit.y - uPointer.y * 0.14;
  vec3 ro = vec3(sin(yaw) * cos(pitch), sin(pitch), cos(yaw) * cos(pitch)) * uZoom;
  vec3 ww = normalize(-ro);
  vec3 uu = normalize(cross(ww, vec3(0.0, 1.0, 0.0)));
  vec3 vv = cross(uu, ww);
  vec3 rd = normalize(uv.x * uu + uv.y * vv + 2.05 * ww);

  float t = 0.0;
  float hit = 0.0;
  vec4 h = vec4(0.0);
  float gA = 0.0, gB = 0.0, gRing = 0.0;

  for (int i = 0; i < 120; i++) {
    if (i >= uSteps) break;
    vec3 p = ro + rd * t;
    h = map(p);
    float gw = exp(-max(h.z, 0.0) * 15.0) * 0.024;
    if (h.w > 0.0) gA += gw; else gB += gw;
    float rw = sdHyperRings(p, uTime);
    gRing += exp(-max(rw, 0.0) * 28.0) * 0.015;
    if (h.x < 0.0014 * t) { hit = 1.0; break; }
    t += max(h.x, 0.004);
    if (t > 24.0) break;
  }

  vec3 c = vec3(0.0);
  float fogA = 0.0;

  if (hit > 0.5) {
    vec3 p = ro + rd * t;
    vec3 n = calcNormal(p);
    vec3 v = -rd;
    vec3 lp = toLocal(p);
    vec3 col;
    float fr = pow(1.0 - max(dot(n, v), 0.0), 2.8);
    vec3 iri5d = spectral5d(dot(n, v) * 1.3 + lp.y * 0.35 - uTime * 0.42);
    float shock = uPulse * exp(-abs(lp.y - (1.0 - uPulse) * 4.5 + 2.2) * 2.2);

    if (h.y < 1.5) {
      float e = veins(lp * 3.15);
      float vein = 1.0 - smoothstep(0.0, 0.078, e);
      vec3 alb = mix(uBaseCol, uVeinCol, vein);
      float metal = mix(0.28, 1.0, vein);
      float rough = mix(uBaseRough, 0.14, vein);
      col = shadePBR(n, v, alb, metal, rough) * calcAO(p, n);
      col += uVeinCol * vein * (0.48 + uPulse * 1.4) * (0.72 + 0.28 * sin(uTime * 1.8 + lp.y * 2.1));
      vec3 rimGrad = mix(uColA, uColB, 0.5 + 0.5 * sin(lp.y * 0.8));
      rimGrad = mix(rimGrad, iri5d, 0.32 * uDimMode + 0.45 * uPulse);
      col += rimGrad * fr * (0.55 + shock * 2.2);
    } else if (h.y < 3.5) {
      vec3 base = h.y < 2.5 ? uColA : uColB;
      base = mix(base, iri5d, 0.28 * uDimMode + 0.4 * shock);
      float id = floor(lp.y / RSP + 0.5);
      float pulse = 0.58 + 0.42 * sin(id * 0.9 - uTime * 2.6);
      col = base * (1.75 + 2.35 * pulse + shock * 3.0) * (0.62 + 0.38 * fr)
          + vec3(1.0) * 0.3 * pow(max(dot(n, v), 0.0), 8.0) * pulse;
    } else {
      vec3 ringCol = mix(uColA, uVeinCol, 0.5 + 0.5 * sin(uTime * 0.9 + p.x));
      ringCol = mix(ringCol, iri5d, 0.45 * uDimMode + 0.5 * uPulse);
      col = ringCol * (1.85 + uPulse * 2.6) * (0.7 + 0.5 * fr);
    }

    fogA = exp(-0.0022 * t * t);
    c = col * fogA;
  }

  vec3 iriGlow = spectral5d(uTime * 0.25 + length(suv));
  vec3 hyperRingCol = mix(mix(uColA, uVeinCol, 0.55), iriGlow, 0.38 * uDimMode);
  c += (uColA * gA + uColB * gB) * (1.35 + uPulse * 1.4);
  c += hyperRingCol * gRing * (1.1 + uPulse * 1.6);

  c = aces(c * 1.08);
  c = pow(c, vec3(1.0 / 2.2));

  float lum = max(c.r, max(c.g, c.b));
  float radial = 1.0 - smoothstep(0.46, 0.72, length(suv));
  float alpha = clamp(max(hit > 0.5 ? fogA : 0.0, lum * 1.35) * radial, 0.0, 1.0);
  fragColor = vec4(c, alpha);
}`;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type);
      if (!sh) throw new Error('Shader alloc failed');
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        const log = gl.getShaderInfoLog(sh) || 'Shader error';
        gl.deleteShader(sh);
        throw new Error(log);
      }
      return sh;
    };

    let prog: WebGLProgram;
    try {
      const p = gl.createProgram();
      if (!p) throw new Error('Program alloc failed');
      const vs = compile(gl.VERTEX_SHADER, VS);
      const fs = compile(gl.FRAGMENT_SHADER, FS);
      gl.attachShader(p, vs);
      gl.attachShader(p, fs);
      gl.bindAttribLocation(p, 0, 'aPos');
      gl.linkProgram(p);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(p) || 'Link error');
      }
      prog = p;
    } catch {
      useVideoFallback = true;
      return;
    }

    const vao = gl.createVertexArray();
    const vbo = gl.createBuffer();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const uni = (name: string) => gl.getUniformLocation(prog, name);
    const U = {
      uRes: uni('uRes'),
      uTime: uni('uTime'),
      uAngle: uni('uAngle'),
      uTilt: uni('uTilt'),
      uOrbit: uni('uOrbit'),
      uZoom: uni('uZoom'),
      uPointer: uni('uPointer'),
      uPulse: uni('uPulse'),
      uDimMode: uni('uDimMode'),
      uSteps: uni('uSteps'),
      uColA: uni('uColA'),
      uColB: uni('uColB'),
      uVeinCol: uni('uVeinCol'),
      uBaseCol: uni('uBaseCol'),
      uBaseRough: uni('uBaseRough'),
    };

    let angle = 0;
    let yaw = 0.35;
    let pitch = 0.08;
    let ptrX = 0;
    let ptrY = 0;
    let smoothPtrX = 0;
    let smoothPtrY = 0;
    let visible = true;
    let steps = window.innerWidth < 768 ? 92 : 120;
    let lastPt: { id: number; x: number; y: number } | null = null;
    let movedDist = 0;

    const resize = () => {
      if (!stageEl || !canvasEl) return;
      const cw = Math.max(stageEl.clientWidth, 300);
      const ch = Math.max(stageEl.clientHeight, 260);
      const cap = window.innerWidth < 768 ? 1.25 : 2.0;
      const dpr = Math.min(window.devicePixelRatio || 1, cap, Math.sqrt(2.2e6 / Math.max(1, cw * ch)));
      const w = Math.max(1, Math.floor(cw * dpr));
      const h = Math.max(1, Math.floor(ch * dpr));
      steps = window.innerWidth < 768 ? 92 : 120;
      if (canvasEl.width !== w || canvasEl.height !== h) {
        canvasEl.width = w;
        canvasEl.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(stageEl);

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.04 }
    );
    io.observe(stageEl);

    const onDown = (e: PointerEvent) => {
      canvasEl?.setPointerCapture(e.pointerId);
      lastPt = { id: e.pointerId, x: e.clientX, y: e.clientY };
      movedDist = 0;
      isDragging = true;
    };

    const onMove = (e: PointerEvent) => {
      const rect = stageEl?.getBoundingClientRect();
      if (rect) {
        ptrX = Math.max(-1, Math.min(1, ((e.clientX - rect.left) / rect.width - 0.5) * 2));
        ptrY = Math.max(-1, Math.min(1, ((e.clientY - rect.top) / rect.height - 0.5) * 2));
      }
      if (lastPt && lastPt.id === e.pointerId) {
        const dx = e.clientX - lastPt.x;
        const dy = e.clientY - lastPt.y;
        movedDist += Math.hypot(dx, dy);
        yaw -= dx * 0.007;
        pitch = Math.max(-1.05, Math.min(1.05, pitch + dy * 0.005));
        lastPt = { id: e.pointerId, x: e.clientX, y: e.clientY };
      }
    };

    const onUp = (e: PointerEvent) => {
      if (lastPt && lastPt.id === e.pointerId) {
        if (movedDist < 6) {
          triggerPulse();
        }
        lastPt = null;
        isDragging = false;
      }
    };

    const onContextLost = (e: Event) => {
      e.preventDefault();
      useVideoFallback = true;
    };

    canvasEl.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    canvasEl.addEventListener('webglcontextlost', onContextLost);

    const t0 = performance.now();
    let last = t0;
    let rafId = 0;

    const frame = (now: number) => {
      rafId = requestAnimationFrame(frame);
      if (!visible || !canvasEl) return;

      const dt = Math.min(0.05, (now - last) * 0.001);
      last = now;
      angle += dt * 0.72;
      pulseLevel = Math.max(0, pulseLevel - dt * 0.85);
      smoothPtrX += (ptrX - smoothPtrX) * 0.07;
      smoothPtrY += (ptrY - smoothPtrY) * 0.07;

      const pal = PALETTES.find((p) => p.id === activePalette) ?? PALETTES[0];

      gl.useProgram(prog);
      gl.bindVertexArray(vao);
      gl.uniform2f(U.uRes, canvasEl.width, canvasEl.height);
      gl.uniform1f(U.uTime, (now - t0) * 0.001);
      gl.uniform1f(U.uAngle, angle);
      gl.uniform1f(U.uTilt, -0.38);
      gl.uniform2f(U.uOrbit, yaw, pitch);
      gl.uniform1f(U.uZoom, 6.85);
      gl.uniform2f(U.uPointer, smoothPtrX, smoothPtrY);
      gl.uniform1f(U.uPulse, pulseLevel);
      gl.uniform1f(U.uDimMode, pal.dimBoost);
      gl.uniform1i(U.uSteps, steps);
      gl.uniform3fv(U.uColA, pal.a);
      gl.uniform3fv(U.uColB, pal.b);
      gl.uniform3fv(U.uVeinCol, pal.vein);
      gl.uniform3fv(U.uBaseCol, pal.base);
      gl.uniform1f(U.uBaseRough, pal.rough);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
      canvasEl?.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      canvasEl?.removeEventListener('webglcontextlost', onContextLost);
      gl.deleteBuffer(vbo);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(prog);
    };
  });
</script>

<div class="dna-wrapper">
  {#if useVideoFallback}
    <div class="fallback-wrap">
      <video
        src="/videos/hero-showreel.mp4"
        poster="/media/mockup-anchialo.webp"
        autoplay
        loop
        muted
        playsinline
      ></video>
    </div>
  {:else}
    <div
      class="sculpture-stage"
      class:dragging={isDragging}
      bind:this={stageEl}
      role="img"
      aria-label="Interactive real-time WebGL2 4D/5D Kintsugi DNA double helix — drag to rotate or click to trigger a 5D pulse"
    >
      <div class="obsidian-aura" aria-hidden="true"></div>
      <canvas bind:this={canvasEl}></canvas>
    </div>

    <div class="dna-microbar" role="toolbar" aria-label="4D/5D DNA visual controls">
      <div class="palette-pills">
        {#each PALETTES as pal}
          <button
            type="button"
            class:active={activePalette === pal.id}
            onclick={() => (activePalette = pal.id)}
          >
            {pal.label}
          </button>
        {/each}
      </div>
      <button type="button" class="pulse-btn" onclick={triggerPulse}>
        ✦ 5D Pulse
      </button>
    </div>
  {/if}
</div>

<style lang="scss">
  @use '../styles/tokens' as *;

  .dna-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .sculpture-stage {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 11;
    background: transparent;
    cursor: grab;
    user-select: none;
    touch-action: pan-y;
    display: grid;
    place-items: center;
    -webkit-mask-image: radial-gradient(ellipse 84% 84% at 50% 50%, #000 66%, transparent 100%);
    mask-image: radial-gradient(ellipse 84% 84% at 50% 50%, #000 66%, transparent 100%);

    &.dragging {
      cursor: grabbing;
    }

    canvas {
      position: relative;
      z-index: 2;
      width: 100%;
      height: 100%;
      display: block;
      background: transparent;
    }
  }

  .obsidian-aura {
    position: absolute;
    width: 66%;
    height: 62%;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(1, 106, 212, 0.28) 0%,
      rgba(232, 121, 249, 0.14) 44%,
      rgba(0, 245, 160, 0.08) 70%,
      transparent 84%
    );
    filter: blur(48px);
    pointer-events: none;
    z-index: 1;
  }

  .dna-microbar {
    margin-top: 0.35rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 0.45rem 0.75rem;
  }

  .palette-pills {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 0.35rem;

    button {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: $radius-pill;
      padding: 0.3rem 0.72rem;
      font-family: $font-mono;
      font-size: 0.7rem;
      color: rgba(255, 255, 255, 0.62);
      cursor: pointer;
      transition: all $transition-fast;

      &:hover,
      &.active {
        color: #ffffff;
        border-color: rgba(0, 245, 160, 0.52);
        background: rgba(1, 106, 212, 0.25);
      }
    }
  }

  .pulse-btn {
    background: linear-gradient(135deg, rgba(0, 245, 160, 0.18), rgba(232, 121, 249, 0.24));
    border: 1px solid rgba(0, 245, 160, 0.48);
    border-radius: $radius-pill;
    padding: 0.32rem 0.82rem;
    font-family: $font-mono;
    font-size: 0.7rem;
    font-weight: 700;
    color: $accent-emerald;
    cursor: pointer;
    transition: transform $transition-fast, background $transition-fast;

    &:hover {
      transform: translateY(-1px);
      background: linear-gradient(135deg, rgba(0, 245, 160, 0.32), rgba(232, 121, 249, 0.36));
      color: #ffffff;
    }
  }

  .fallback-wrap {
    width: 100%;
    border-radius: $radius-lg;
    overflow: hidden;
    -webkit-mask-image: radial-gradient(ellipse 88% 88% at 50% 50%, #000 72%, transparent 100%);
    mask-image: radial-gradient(ellipse 88% 88% at 50% 50%, #000 72%, transparent 100%);

    video {
      width: 100%;
      aspect-ratio: 16 / 11;
      object-fit: cover;
    }
  }
</style>
