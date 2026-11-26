<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { getAgencyWasm } from '../lib/wasm';

  let hostEl: HTMLDivElement | undefined = $state();
  let isInteracting = $state(false);

  /**
   * Generates a silky-smooth closed 3D infinity curve (CatmullRomCurve3)
   * with zero pinching or polygon creases, braided smoothly around the figure-8 spine.
   */
  function createSmoothInfinityCurve(opts: {
    samples: number;
    offsetRadius: number;
    phaseOffset: number;
    twistTurns: number;
    scaleX?: number;
    scaleY?: number;
    scaleZ?: number;
  }): THREE.CatmullRomCurve3 {
    const {
      samples,
      offsetRadius,
      phaseOffset,
      twistTurns,
      scaleX = 2.05,
      scaleY = 0.92,
      scaleZ = 0.72,
    } = opts;

    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < samples; i++) {
      const u = i / samples;
      const t = u * Math.PI * 2;

      // Smooth 3D figure-8 infinity spine
      const denom = 1 + 0.32 * Math.sin(t) * Math.sin(t);
      const sx = (scaleX * Math.cos(t)) / denom;
      const sy = (scaleY * Math.sin(2 * t)) / denom;
      const sz = scaleZ * Math.sin(t) * Math.cos(t) * 1.35;

      // Helical braid offset around the infinity spine
      const braidAngle = t * twistTurns + phaseOffset;
      const pinch = 0.78 + 0.28 * Math.abs(Math.cos(t));
      const r = offsetRadius * pinch;

      const ox = r * Math.cos(braidAngle) * 0.45;
      const oy = r * Math.sin(braidAngle);
      const oz = r * Math.cos(braidAngle) * 0.88;

      pts.push(new THREE.Vector3(sx + ox, sy + oy, sz + oz));
    }

    return new THREE.CatmullRomCurve3(pts, true, 'centripetal', 0.5);
  }

  onMount(() => {
    if (!hostEl) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 100% TRUE TRANSPARENT SCENE — zero background rectangle, blends natively into black canvas
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(32, 16 / 11, 0.1, 60);
    camera.position.set(0, 0.0, 6.35);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      premultipliedAlpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    hostEl.appendChild(renderer.domElement);

    // Load the actual photorealistic hero-sculpture.webp as an equirectangular reflection/refraction map
    const texLoader = new THREE.TextureLoader();
    const envTex = texLoader.load('/media/hero-sculpture.webp');
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    envTex.colorSpace = THREE.SRGBColorSpace;

    const sculptureGroup = new THREE.Group();
    sculptureGroup.rotation.set(0.16, -0.22, 0.18);
    scene.add(sculptureGroup);

    const disposables: Array<{ dispose(): void }> = [envTex];

    /**
     * Custom Photorealistic Liquid-Glass & Chromatic Dispersion GLSL Shader:
     * Samples the real hero-sculpture.webp reflection/refraction map with separate R/G/B indices of refraction
     * (true chromatic aberration prism caustics), Fresnel glass rim glow, and razor studio specular highlights.
     */
    const createLiquidGlassShader = (tint: [number, number, number], phaseShift: number, isObsidianChrome = false) =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: true,
        side: THREE.DoubleSide,
        uniforms: {
          uEnvMap: { value: envTex },
          uTime: { value: 0 },
          uTint: { value: new THREE.Vector3(tint[0], tint[1], tint[2]) },
          uPhase: { value: phaseShift },
          uChrome: { value: isObsidianChrome ? 1.0 : 0.0 },
        },
        vertexShader: `
          uniform float uTime;
          uniform float uPhase;
          varying vec3 vNormalW;
          varying vec3 vViewDir;
          varying vec2 vUv;
          varying vec3 vWorldPos;

          void main() {
            vUv = uv;
            // Subtle organic liquid pulse along the glass tube
            float pulse = 0.008 * sin(uv.x * 18.8495 - uTime * 2.4 + uPhase);
            vec3 pos = position + normal * pulse;
            vec4 worldPos = modelMatrix * vec4(pos, 1.0);
            vWorldPos = worldPos.xyz;
            vNormalW = normalize(mat3(modelMatrix) * normal);
            vViewDir = normalize(cameraPosition - worldPos.xyz);
            gl_Position = projectionMatrix * viewMatrix * worldPos;
          }
        `,
        fragmentShader: `
          uniform sampler2D uEnvMap;
          uniform float uTime;
          uniform vec3 uTint;
          uniform float uPhase;
          uniform float uChrome;

          varying vec3 vNormalW;
          varying vec3 vViewDir;
          varying vec2 vUv;
          varying vec3 vWorldPos;

          const float PI = 3.14159265359;

          vec2 dirToEquirect(vec3 dir) {
            vec3 d = normalize(dir);
            float u = atan(d.z, d.x) / (2.0 * PI) + 0.5;
            float v = asin(clamp(d.y, -1.0, 1.0)) / PI + 0.5;
            return vec2(u, v);
          }

          vec3 cosineIridescence(float t) {
            vec3 a = vec3(0.46, 0.54, 0.78);
            vec3 b = vec3(0.52, 0.46, 0.48);
            vec3 c = vec3(1.0, 1.0, 1.0);
            vec3 d = vec3(0.55, 0.25, 0.05);
            return a + b * cos(6.28318 * (c * t + d));
          }

          void main() {
            vec3 N = normalize(vNormalW);
            vec3 V = normalize(vViewDir);
            float ndotv = clamp(abs(dot(N, V)), 0.0, 1.0);
            float fresnel = pow(1.0 - ndotv, 2.4);

            // Dynamic reflection & RGB chromatic dispersion refraction vectors
            vec3 R = reflect(-V, N);
            vec3 T_r = refract(-V, N, 1.0 / 1.48);
            vec3 T_g = refract(-V, N, 1.0 / 1.53);
            vec3 T_b = refract(-V, N, 1.0 / 1.59);

            float flowShift = uTime * 0.035 + uPhase * 0.1;
            vec3 reflCol = texture2D(uEnvMap, fract(dirToEquirect(R) + vec2(flowShift, 0.0))).rgb;
            float refrR = texture2D(uEnvMap, fract(dirToEquirect(T_r) + vec2(-flowShift, 0.02))).r;
            float refrG = texture2D(uEnvMap, fract(dirToEquirect(T_g) + vec2(-flowShift, 0.0))).g;
            float refrB = texture2D(uEnvMap, fract(dirToEquirect(T_b) + vec2(-flowShift, -0.02))).b;
            vec3 dispCol = vec3(refrR, refrG, refrB) * 1.45;

            // Physical thin-film rainbow caustics
            float iridPhase = ndotv * 1.35 + vUv.x * 0.5 - uTime * 0.18 + uPhase;
            vec3 irid = cosineIridescence(iridPhase) * uTint;

            // Studio softbox razor specular highlights
            vec3 L1 = normalize(vec3(-0.65, 0.78, 0.72));
            vec3 L2 = normalize(vec3(0.75, 0.52, 0.62));
            vec3 L3 = normalize(vec3(0.2, -0.85, 0.55));
            vec3 H1 = normalize(L1 + V);
            vec3 H2 = normalize(L2 + V);
            vec3 H3 = normalize(L3 + V);

            float spec1 = pow(max(dot(N, H1), 0.0), 96.0);
            float spec2 = pow(max(dot(N, H2), 0.0), 64.0);
            float spec3 = pow(max(dot(N, H3), 0.0), 48.0);
            float broadSheen = pow(max(dot(N, H1), 0.0), 14.0);

            vec3 finalCol;
            float alpha;

            if (uChrome > 0.5) {
              // Jet-black liquid obsidian chrome strand (like the dark metal outer band in the photo)
              vec3 darkCore = vec3(0.015, 0.022, 0.045);
              finalCol = mix(darkCore, reflCol * 0.85, fresnel * 0.75);
              finalCol += vec3(0.0, 0.96, 0.66) * pow(fresnel, 3.2) * 0.95;
              finalCol += vec3(0.55, 0.78, 1.0) * broadSheen * 0.35;
              finalCol += vec3(1.0) * spec1 * 1.9 + vec3(0.98, 0.75, 0.96) * spec2 * 1.2;
              alpha = 0.96;
            } else {
              // Translucent iridescent liquid-glass strand with chromatic dispersion
              vec3 glassBody = mix(dispCol * 0.85 + irid * 0.55, reflCol * 1.2 + irid * 0.9, 0.28 + fresnel * 0.72);
              glassBody += vec3(0.05, 0.45, 0.96) * broadSheen * 0.48;
              glassBody += vec3(0.98, 0.72, 0.96) * spec2 * 1.55;
              glassBody += vec3(0.0, 0.96, 0.68) * spec3 * 1.15;
              glassBody += vec3(1.0, 1.0, 1.0) * spec1 * 2.2;
              finalCol = glassBody;
              // Glassmorphic translucency: crystal clear in center, luminous opaque at Fresnel edges
              alpha = clamp(0.64 + fresnel * 0.36 + (spec1 + spec2) * 0.5, 0.0, 0.98);
            }

            gl_FragColor = vec4(finalCol, alpha);
          }
        `,
      });

    // 7 silky-smooth Catmull-Rom braided infinity tubes (320 tubular x 56 radial segments = zero polygon creases!)
    const strandConfigs: Array<{
      radius: number;
      offset: number;
      phase: number;
      turns: number;
      tint: [number, number, number];
      chrome?: boolean;
    }> = [
      // Core glowing cobalt-orchid liquid glass ribbons
      { radius: 0.21, offset: 0.22, phase: 0.0, turns: 2, tint: [0.65, 0.88, 1.15] },
      { radius: 0.185, offset: 0.26, phase: 1.55, turns: 2, tint: [1.12, 0.76, 1.15] },
      { radius: 0.165, offset: 0.3, phase: 3.1, turns: 3, tint: [0.55, 0.95, 1.1] },
      { radius: 0.15, offset: 0.24, phase: 4.5, turns: 3, tint: [1.05, 0.82, 1.18] },
      { radius: 0.125, offset: 0.34, phase: 2.3, turns: 3, tint: [0.45, 1.1, 0.95] },
      // Jet-black liquid obsidian chrome outer coils
      { radius: 0.135, offset: 0.36, phase: 0.75, turns: 2, tint: [1.0, 1.0, 1.0], chrome: true },
      { radius: 0.105, offset: 0.34, phase: 3.9, turns: 2, tint: [1.0, 1.0, 1.0], chrome: true },
    ];

    const shaderMats: THREE.ShaderMaterial[] = [];
    const meshes: THREE.Mesh[] = [];

    for (const cfg of strandConfigs) {
      const curve = createSmoothInfinityCurve({
        samples: 96,
        offsetRadius: cfg.offset,
        phaseOffset: cfg.phase,
        twistTurns: cfg.turns,
      });
      const geo = new THREE.TubeGeometry(curve, 280, cfg.radius, 48, true);
      const mat = createLiquidGlassShader(cfg.tint, cfg.phase, !!cfg.chrome);
      disposables.push(geo, mat);
      shaderMats.push(mat);

      const mesh = new THREE.Mesh(geo, mat);
      sculptureGroup.add(mesh);
      meshes.push(mesh);
    }

    let rotY = -0.22;
    let rotX = 0.16;
    let velY = 0;
    let velX = 0;
    let pointerDown = false;
    let lastPx = 0;
    let lastPy = 0;
    let visible = true;
    let rafId = 0;

    let wasmMod: Awaited<ReturnType<typeof getAgencyWasm>> = null;
    void getAgencyWasm().then((w) => {
      wasmMod = w;
    });

    const resize = () => {
      if (!hostEl) return;
      const w = Math.max(hostEl.clientWidth, 320);
      const h = Math.max(hostEl.clientHeight, 260);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(hostEl);

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    io.observe(hostEl);

    const onDown = (e: PointerEvent) => {
      pointerDown = true;
      isInteracting = true;
      lastPx = e.clientX;
      lastPy = e.clientY;
    };

    const onMove = (e: PointerEvent) => {
      if (pointerDown) {
        const dx = e.clientX - lastPx;
        const dy = e.clientY - lastPy;
        lastPx = e.clientX;
        lastPy = e.clientY;
        velY = dx * 0.01;
        velX = dy * 0.008;
        rotY += velY;
        rotX = THREE.MathUtils.clamp(rotX + velX, -1.1, 1.1);
      } else {
        const rect = hostEl?.getBoundingClientRect();
        if (!rect) return;
        const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        if (Math.abs(nx) <= 1.2 && Math.abs(ny) <= 1.2) {
          velY += nx * 0.0008;
          rotX += (ny * 0.25 + 0.16 - rotX) * 0.03;
        }
      }
    };

    const onUp = () => {
      pointerDown = false;
      isInteracting = false;
    };

    hostEl.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onUp);

    const t0 = performance.now();
    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      if (!visible) return;

      const sec = (now - t0) * 0.001;
      for (const m of shaderMats) {
        m.uniforms.uTime.value = sec;
      }

      if (!reducedMotion) {
        const wave = wasmMod
          ? wasmMod.compute_wave_displacement(240, -180, Math.floor(sec * 1000)) / 1000
          : Math.sin(sec * 1.15);

        if (!pointerDown) {
          velY *= 0.94;
          velX *= 0.94;
          // Continuous smooth realistic 3D rotation on the black canvas
          rotY += 0.0065 + velY;
          rotX = THREE.MathUtils.clamp(rotX + velX, -0.95, 0.95);
        }

        sculptureGroup.rotation.y = rotY;
        sculptureGroup.rotation.x = rotX + Math.sin(sec * 0.7) * 0.11;
        sculptureGroup.rotation.z = 0.18 + Math.cos(sec * 0.55) * 0.09;
        sculptureGroup.position.y = wave * 0.07;

        for (let i = 0; i < meshes.length; i++) {
          const breathe = 1 + 0.015 * Math.sin(sec * 1.6 + i * 0.85);
          meshes[i].scale.setScalar(breathe);
        }
      }

      renderer.render(scene, camera);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      hostEl?.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      ro.disconnect();
      io.disconnect();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  });
</script>

<div
  class="sculpture-stage"
  class:interacting={isInteracting}
  bind:this={hostEl}
  role="img"
  aria-label="Interactive 3D iridescent liquid-glass and obsidian-chrome infinity sculpture rotating on black canvas"
>
  <div class="glass-aura" aria-hidden="true"></div>
</div>

<style lang="scss">
  .sculpture-stage {
    position: relative;
    width: 100%;
    height: 100%;
    aspect-ratio: 16 / 11;
    background: transparent;
    cursor: grab;
    user-select: none;
    touch-action: pan-y;
    display: grid;
    place-items: center;

    &.interacting {
      cursor: grabbing;
    }

    :global(canvas) {
      position: relative;
      z-index: 2;
      width: 100% !important;
      height: 100% !important;
      display: block;
      background: transparent !important;
    }
  }

  // Soft ambient glassmorphism halo blending seamlessly into the black background
  .glass-aura {
    position: absolute;
    width: 68%;
    height: 62%;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(1, 106, 212, 0.22) 0%,
      rgba(252, 193, 244, 0.12) 42%,
      rgba(0, 245, 160, 0.06) 65%,
      transparent 80%
    );
    filter: blur(42px);
    pointer-events: none;
    z-index: 1;
  }
</style>
