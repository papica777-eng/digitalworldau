<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { getAgencyWasm } from '../lib/wasm';

  let hostEl: HTMLDivElement | undefined = $state();
  let isInteracting = $state(false);

  onMount(() => {
    if (!hostEl) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(30, 16 / 11, 0.1, 50);
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    hostEl.appendChild(renderer.domElement);

    const texLoader = new THREE.TextureLoader();
    const sculptureTex = texLoader.load('/media/hero-sculpture.webp');
    sculptureTex.colorSpace = THREE.SRGBColorSpace;
    sculptureTex.minFilter = THREE.LinearFilter;
    sculptureTex.magFilter = THREE.LinearFilter;

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // High-density 3D relief mesh extruded from the photorealistic liquid-glass sculpture
    const planeGeo = new THREE.PlaneGeometry(4.55, 2.85, 180, 114);

    const glassReliefMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTex: { value: sculptureTex },
        uTime: { value: 0 },
        uPointer: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: `
        uniform sampler2D uTex;
        uniform float uTime;
        uniform vec2 uPointer;
        varying vec2 vUv;
        varying float vElev;

        void main() {
          vUv = uv;
          vec3 sampleCol = texture2D(uTex, uv).rgb;
          float luma = dot(sampleCol, vec3(0.299, 0.587, 0.114));
          float mask = smoothstep(0.04, 0.18, luma);

          // Organic 3D wave twist & breathing across the infinity ribbon
          float waveX = sin(uv.x * 6.2831 - uTime * 1.45) * 0.085;
          float waveY = cos(uv.y * 6.2831 + uTime * 1.15) * 0.065;
          float twist = sin((uv.x - 0.5) * 4.5 + uTime * 1.1) * (uv.y - 0.5) * 0.24;

          // Extrude the ribbon forward in 3D space based on its optical luminance
          float zDepth = mask * (0.38 + luma * 0.34) + (waveX + waveY + twist) * mask;
          vElev = luma * mask;

          vec3 pos = position;
          pos.z += zDepth;
          // Subtle organic infinity flow expansion
          pos.x += sin(uTime * 0.9 + uv.y * 3.14) * 0.035 * mask;
          pos.y += cos(uTime * 1.1 + uv.x * 3.14) * 0.035 * mask;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTex;
        uniform float uTime;
        uniform vec2 uPointer;
        varying vec2 vUv;
        varying float vElev;

        vec3 spectrum(float t) {
          return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
        }

        void main() {
          // Soft edge vignette so canvas borders never clip
          vec2 edge = smoothstep(vec2(0.0), vec2(0.08), vUv) * smoothstep(vec2(0.0), vec2(0.08), 1.0 - vUv);
          float vignette = edge.x * edge.y;

          // Subtle internal liquid-crystal flow refraction along the glass strands
          vec2 flowOffset = vec2(
            sin(vUv.y * 14.0 + uTime * 1.8) * 0.0032,
            cos(vUv.x * 12.0 - uTime * 1.5) * 0.0032
          );

          // Chromatic dispersion sampling (slight RGB prism separation on flowing waves)
          vec2 uvR = vUv + flowOffset * 1.35 + uPointer * 0.004;
          vec2 uvG = vUv + flowOffset;
          vec2 uvB = vUv + flowOffset * 0.65 - uPointer * 0.004;

          float r = texture2D(uTex, uvR).r;
          float g = texture2D(uTex, uvG).g;
          float b = texture2D(uTex, uvB).b;
          vec3 baseCol = vec3(r, g, b);

          float luma = dot(baseCol, vec3(0.299, 0.587, 0.114));
          float maxCh = max(max(baseCol.r, baseCol.g), baseCol.b);

          // Key out the dark studio background cleanly into 100% transparent alpha
          float alpha = smoothstep(0.045, 0.19, maxCh * 0.75 + luma * 0.45) * vignette;
          if (alpha < 0.005) discard;

          // Estimate local surface normal from neighbor luminance for live moving studio light sweep
          float eps = 0.0035;
          float lx = dot(texture2D(uTex, vUv + vec2(eps, 0.0)).rgb, vec3(0.333)) - luma;
          float ly = dot(texture2D(uTex, vUv + vec2(0.0, eps)).rgb, vec3(0.333)) - luma;
          vec3 N = normalize(vec3(-lx * 14.0, -ly * 14.0, 1.0));

          // Orbiting virtual studio key light + cursor light
          vec3 lightPos = normalize(vec3(
            sin(uTime * 1.15) * 0.75 + uPointer.x * 0.85,
            cos(uTime * 0.9) * 0.65 + uPointer.y * 0.85,
            0.9
          ));
          float spec = pow(max(dot(N, lightPos), 0.0), 28.0);
          float rimSweep = pow(max(dot(N, normalize(vec3(-lightPos.x, -lightPos.y, 0.7))), 0.0), 16.0);

          // Traveling iridescent caustic wave along the glass ribbon
          float causticWave = sin((vUv.x * 5.5 - vUv.y * 3.0) - uTime * 1.65) * 0.5 + 0.5;
          vec3 iridGlow = spectrum(vUv.x * 0.8 - uTime * 0.22 + luma) * vec3(0.45, 0.85, 1.25);

          vec3 col = baseCol * 1.08;
          col += iridGlow * pow(causticWave, 3.0) * 0.22 * smoothstep(0.15, 0.7, luma);
          col += vec3(0.88, 0.95, 1.0) * spec * 0.55 * smoothstep(0.12, 0.6, maxCh);
          col += vec3(0.0, 0.96, 0.68) * rimSweep * 0.24 * smoothstep(0.1, 0.5, maxCh);

          gl_FragColor = vec4(col, alpha);
        }
      `,
    });

    const sculptureMesh = new THREE.Mesh(planeGeo, glassReliefMat);
    rootGroup.add(sculptureMesh);

    // Subtle orbiting glassmorphic micro-caustic motes around the sculpture
    const moteCount = 42;
    const motePos = new Float32Array(moteCount * 3);
    for (let i = 0; i < moteCount; i++) {
      const a = (i / moteCount) * Math.PI * 2;
      motePos[i * 3] = Math.cos(a) * (1.4 + Math.random() * 0.9);
      motePos[i * 3 + 1] = Math.sin(a * 2) * (0.55 + Math.random() * 0.45);
      motePos[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
    }
    const moteGeo = new THREE.BufferGeometry();
    moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
    const moteMat = new THREE.PointsMaterial({
      color: new THREE.Color('#84b5e6'),
      size: 0.032,
      transparent: true,
      opacity: 0.45,
    });
    const motes = new THREE.Points(moteGeo, moteMat);
    rootGroup.add(motes);

    let targetRotY = 0;
    let targetRotX = 0;
    let pointerX = 0;
    let pointerY = 0;
    let pointerDown = false;
    let lastPx = 0;
    let lastPy = 0;
    let userYaw = 0;
    let userPitch = 0;
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
      const rect = hostEl?.getBoundingClientRect();
      if (rect) {
        pointerX = THREE.MathUtils.clamp(((e.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1);
        pointerY = THREE.MathUtils.clamp(-((e.clientY - rect.top) / rect.height - 0.5) * 2, -1, 1);
      }
      if (pointerDown) {
        const dx = e.clientX - lastPx;
        const dy = e.clientY - lastPy;
        lastPx = e.clientX;
        lastPy = e.clientY;
        userYaw = THREE.MathUtils.clamp(userYaw + dx * 0.006, -0.55, 0.55);
        userPitch = THREE.MathUtils.clamp(userPitch + dy * 0.005, -0.42, 0.42);
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
      glassReliefMat.uniforms.uTime.value = sec;
      glassReliefMat.uniforms.uPointer.value.set(pointerX, pointerY);

      if (!reducedMotion) {
        const wave = wasmMod
          ? wasmMod.compute_wave_displacement(240, -180, Math.floor(sec * 1000)) / 1000
          : Math.sin(sec * 1.15);

        if (!pointerDown) {
          userYaw *= 0.96;
          userPitch *= 0.96;
        }

        // Smooth figure-8 3D sculptural rotation & tilt that keeps the full photorealistic silhouette natural
        const autoYaw = Math.sin(sec * 0.75) * 0.24 + pointerX * 0.18 + userYaw;
        const autoPitch = Math.cos(sec * 0.6) * 0.15 - pointerY * 0.14 + userPitch;
        const autoRoll = Math.sin(sec * 0.45) * 0.065;

        targetRotY += (autoYaw - targetRotY) * 0.07;
        targetRotX += (autoPitch - targetRotX) * 0.07;

        rootGroup.rotation.y = targetRotY;
        rootGroup.rotation.x = targetRotX;
        rootGroup.rotation.z = autoRoll;
        rootGroup.position.y = wave * 0.065;

        motes.rotation.z = sec * 0.12;
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
      planeGeo.dispose();
      glassReliefMat.dispose();
      moteGeo.dispose();
      moteMat.dispose();
      sculptureTex.dispose();
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
  aria-label="Interactive photorealistic 3D iridescent liquid-glass infinity sculpture floating on black background"
>
  <div class="glass-aura" aria-hidden="true"></div>
</div>

<style lang="scss">
  .sculpture-stage {
    position: relative;
    width: 100%;
    height: 100%;
    aspect-ratio: 16 / 10.5;
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

  .glass-aura {
    position: absolute;
    width: 66%;
    height: 58%;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(1, 106, 212, 0.24) 0%,
      rgba(252, 193, 244, 0.14) 44%,
      rgba(0, 245, 160, 0.07) 68%,
      transparent 82%
    );
    filter: blur(46px);
    pointer-events: none;
    z-index: 1;
  }
</style>
