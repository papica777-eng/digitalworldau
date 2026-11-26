<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
  import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
  import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
  import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
  import { getAgencyWasm } from '../lib/wasm';

  let hostEl: HTMLDivElement | undefined = $state();
  let isInteracting = $state(false);

  /**
   * Builds a custom closed-loop parametric tube/ribbon mesh with fluted cross-section
   * twisting smoothly around a 3D Figure-8 infinity spine using a Bishop parallel-transport frame.
   */
  function createBraidedRibbonGeometry(opts: {
    segments: number;
    radialSegments: number;
    radiusA: number;
    radiusB: number;
    offsetRadius: number;
    phaseOffset: number;
    twistTurns: number;
    fluteCount: number;
    fluteDepth: number;
    scaleX?: number;
    scaleY?: number;
    scaleZ?: number;
  }): THREE.BufferGeometry {
    const {
      segments,
      radialSegments,
      radiusA,
      radiusB,
      offsetRadius,
      phaseOffset,
      twistTurns,
      fluteCount,
      fluteDepth,
      scaleX = 2.08,
      scaleY = 0.94,
      scaleZ = 0.68,
    } = opts;

    const spinePoint = (u: number): THREE.Vector3 => {
      const t = u * Math.PI * 2;
      // Sculpted 3D infinity lemniscate matching the diagonal twisted figure-8 composition
      const denom = 1 + 0.34 * Math.sin(t) * Math.sin(t);
      const x = (scaleX * Math.cos(t)) / denom;
      const y = (scaleY * Math.sin(2 * t)) / (1 + 0.18 * Math.sin(t) * Math.sin(t)) + 0.14 * Math.sin(t);
      const z = scaleZ * Math.sin(t) - 0.24 * Math.cos(3 * t);
      return new THREE.Vector3(x, y, z);
    };

    const centers: THREE.Vector3[] = [];
    const tangents: THREE.Vector3[] = [];
    const normals: THREE.Vector3[] = [];
    const binormals: THREE.Vector3[] = [];

    const eps = 1e-4;
    for (let i = 0; i <= segments; i++) {
      const u = i / segments;
      const p = spinePoint(u);
      const pNext = spinePoint((u + eps) % 1);
      const pPrev = spinePoint((u - eps + 1) % 1);
      centers.push(p);
      tangents.push(pNext.sub(pPrev).normalize());
    }

    // Parallel-transport (Bishop) frame so the closed loop has zero sudden flips
    const initUp = new THREE.Vector3(0, 1, 0.25).normalize();
    const n0 = new THREE.Vector3().crossVectors(tangents[0], initUp).normalize();
    const b0 = new THREE.Vector3().crossVectors(tangents[0], n0).normalize();
    normals.push(n0);
    binormals.push(b0);

    for (let i = 1; i <= segments; i++) {
      const prevT = tangents[i - 1];
      const currT = tangents[i];
      const axis = new THREE.Vector3().crossVectors(prevT, currT);
      const prevN = normals[i - 1].clone();
      if (axis.lengthSq() > 1e-10) {
        axis.normalize();
        const angle = Math.acos(THREE.MathUtils.clamp(prevT.dot(currT), -1, 1));
        prevN.applyAxisAngle(axis, angle);
      }
      prevN.normalize();
      const currB = new THREE.Vector3().crossVectors(currT, prevN).normalize();
      normals.push(prevN);
      binormals.push(currB);
    }

    // Seamless frame closure twist compensation
    const closingDot = THREE.MathUtils.clamp(normals[0].dot(normals[segments]), -1, 1);
    let closingAngle = Math.acos(closingDot);
    if (binormals[0].dot(normals[segments]) < 0) closingAngle = -closingAngle;

    const vertices: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    const tmpCenter = new THREE.Vector3();
    const tmpPos = new THREE.Vector3();
    const localN = new THREE.Vector3();
    const localB = new THREE.Vector3();

    for (let i = 0; i <= segments; i++) {
      const u = i / segments;
      const compAngle = -closingAngle * u;
      const twistAngle = u * Math.PI * 2 * twistTurns + phaseOffset + compAngle;
      const cosTw = Math.cos(twistAngle);
      const sinTw = Math.sin(twistAngle);

      // Rotated frame for this braided strand
      localN.copy(normals[i]).multiplyScalar(cosTw).addScaledVector(binormals[i], sinTw);
      localB.copy(binormals[i]).multiplyScalar(cosTw).addScaledVector(normals[i], -sinTw);

      // Modulate braid breath slightly so the bundle pinches elegantly at the infinity crossover
      const pinch = 0.84 + 0.24 * Math.abs(Math.cos(u * Math.PI * 2));
      const effOffset = offsetRadius * pinch;
      tmpCenter.copy(centers[i]).addScaledVector(localN, effOffset);

      const sectionTwist = u * Math.PI * 2 * 2;
      const cosSec = Math.cos(sectionTwist);
      const sinSec = Math.sin(sectionTwist);

      for (let j = 0; j <= radialSegments; j++) {
        const v = j / radialSegments;
        const theta = v * Math.PI * 2;
        const flute = 1 + fluteDepth * Math.cos(theta * fluteCount);
        const rx = radiusA * flute * Math.cos(theta);
        const ry = radiusB * flute * Math.sin(theta);

        const rnx = rx * cosSec - ry * sinSec;
        const rny = rx * sinSec + ry * cosSec;

        tmpPos
          .copy(tmpCenter)
          .addScaledVector(localN, rnx)
          .addScaledVector(localB, rny);

        vertices.push(tmpPos.x, tmpPos.y, tmpPos.z);
        uvs.push(u * 4, v);
      }
    }

    const row = radialSegments + 1;
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < radialSegments; j++) {
        const a = i * row + j;
        const b = (i + 1) * row + j;
        const c = (i + 1) * row + (j + 1);
        const d = i * row + (j + 1);
        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }

  /**
   * Builds a custom HDR Studio Softbox environment scene and bakes it with PMREMGenerator.
   * This gives glass & obsidian chrome razor-sharp studio strip reflections identical to Octane/Cycles.
   */
  function buildStudioHDRI(renderer: THREE.WebGLRenderer): THREE.Texture {
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color('#020308');

    const addStrip = (
      colorHex: string,
      intensity: number,
      size: [number, number, number],
      pos: [number, number, number],
      lookAt: [number, number, number] = [0, 0, 0]
    ) => {
      const col = new THREE.Color(colorHex).multiplyScalar(intensity);
      const geo = new THREE.BoxGeometry(size[0], size[1], size[2]);
      const mat = new THREE.MeshBasicMaterial({ color: col });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(pos[0], pos[1], pos[2]);
      mesh.lookAt(lookAt[0], lookAt[1], lookAt[2]);
      envScene.add(mesh);
    };

    // Pure white razor overhead studio softboxes (for crisp specular glass lines)
    addStrip('#ffffff', 16, [18, 1.4, 0.3], [0, 9.5, 3]);
    addStrip('#e8f4ff', 12, [14, 0.9, 0.3], [-2, -8.5, 4]);
    addStrip('#ffffff', 18, [1.0, 12, 0.3], [10, 2, 5]);

    // Deep cobalt & electric cyan softboxes on the left hemisphere
    addStrip('#0070ff', 14, [11, 6, 0.4], [-9.5, 3.5, 2.5]);
    addStrip('#00d4ff', 10, [9, 3.5, 0.4], [-8.5, -4.5, 4.5]);

    // Luminous orchid-pink & violet softboxes on the right/upper crest
    addStrip('#ff84f4', 15, [11, 5.5, 0.4], [8.5, 4.8, 3.2]);
    addStrip('#8c38ff', 11, [10, 4.5, 0.4], [6.5, -5.5, -2.5]);

    // Electric emerald rim highlights kissing the obsidian chrome outer edges
    addStrip('#00ffaa', 13, [8, 2.2, 0.4], [9.5, -1.2, 6.2]);
    addStrip('#00f5a0', 9, [7, 1.8, 0.4], [-9.2, -2.2, 6.5]);

    // Subtle warm rainbow accent glint
    addStrip('#ffd479', 7, [4, 1.2, 0.3], [-4.5, 6.5, 7.5]);

    const envRT = pmrem.fromScene(envScene, 0.018);
    pmrem.dispose();
    return envRT.texture;
  }

  onMount(() => {
    if (!hostEl) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#020308');

    const camera = new THREE.PerspectiveCamera(33, 16 / 11, 0.1, 60);
    camera.position.set(0, 0.05, 6.25);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    hostEl.appendChild(renderer.domElement);

    const envTex = buildStudioHDRI(renderer);
    scene.environment = envTex;

    // Subtle volumetric dark-sapphire studio backdrop aura plane behind sculpture
    const bgGeo = new THREE.PlaneGeometry(18, 12);
    const bgMat = new THREE.ShaderMaterial({
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        void main() {
          vec2 p = vUv - 0.5;
          float d1 = length(p - vec2(-0.22 + 0.04 * sin(uTime * 0.4), 0.05));
          float d2 = length(p - vec2(0.24, 0.1 + 0.04 * cos(uTime * 0.35)));
          float d3 = length(p - vec2(0.08, -0.18));
          vec3 col = vec3(0.012, 0.018, 0.042);
          col += vec3(0.01, 0.14, 0.42) * smoothstep(0.55, 0.0, d1) * 0.55;
          col += vec3(0.32, 0.08, 0.36) * smoothstep(0.52, 0.0, d2) * 0.45;
          col += vec3(0.0, 0.28, 0.22) * smoothstep(0.45, 0.0, d3) * 0.28;
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    const bgPlane = new THREE.Mesh(bgGeo, bgMat);
    bgPlane.position.z = -4.2;
    scene.add(bgPlane);

    const sculptureGroup = new THREE.Group();
    sculptureGroup.rotation.set(0.14, -0.18, 0.22);
    scene.add(sculptureGroup);

    const disposables: Array<{ dispose(): void }> = [envTex, bgGeo, bgMat];

    // 1. Custom GLSL Thin-Film Iridescent Prism Caustic Core Shader (refracted through outer glass)
    const prismShaderMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        uniform float uTime;
        varying vec3 vNormalW;
        varying vec3 vViewDir;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          // Subtle living liquid ripple along the fiber
          float wave = 0.018 * sin(uv.x * 10.0 - uTime * 2.2) * cos(uv.y * 6.2831 + uTime * 1.1);
          vec3 displaced = position + normal * wave;
          vec4 worldPos = modelMatrix * vec4(displaced, 1.0);
          vNormalW = normalize(mat3(modelMatrix) * normal);
          vViewDir = normalize(cameraPosition - worldPos.xyz);
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec3 vNormalW;
        varying vec3 vViewDir;
        varying vec2 vUv;

        // Cosine spectral iridescence matching physical thin-film interference
        vec3 thinFilm(float phase) {
          vec3 a = vec3(0.45, 0.52, 0.72);
          vec3 b = vec3(0.55, 0.48, 0.48);
          vec3 c = vec3(1.0, 1.0, 1.0);
          vec3 d = vec3(0.58, 0.24, 0.06); // cobalt -> cyan -> orchid -> emerald
          return a + b * cos(6.28318 * (c * phase + d));
        }

        void main() {
          vec3 N = normalize(vNormalW);
          vec3 V = normalize(vViewDir);
          float ndotv = clamp(abs(dot(N, V)), 0.0, 1.0);
          float fresnel = pow(1.0 - ndotv, 2.3);
          float flow = vUv.x * 0.45 - uTime * 0.22 + ndotv * 1.15;
          vec3 irid = thinFilm(flow);

          // Razor specular sheen bands
          vec3 L1 = normalize(vec3(0.6, 0.85, 0.7));
          vec3 L2 = normalize(vec3(-0.75, 0.35, 0.65));
          float spec1 = pow(max(dot(reflect(-L1, N), V), 0.0), 42.0);
          float spec2 = pow(max(dot(reflect(-L2, N), V), 0.0), 28.0);

          vec3 baseDark = vec3(0.02, 0.05, 0.16);
          vec3 col = mix(baseDark, irid * 1.25, 0.35 + fresnel * 0.95);
          col += vec3(0.95, 0.85, 1.0) * spec1 * 1.45;
          col += vec3(0.1, 0.75, 1.0) * spec2 * 0.95;
          col += vec3(0.0, 0.96, 0.68) * pow(fresnel, 4.0) * 0.85;
          gl_FragColor = vec4(col, 0.95);
        }
      `,
      transparent: true,
    });
    disposables.push(prismShaderMat);

    // 2. Jet-Black Liquid Obsidian Chrome material (outer dark sculptural bands in the photo)
    const obsidianChromeMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#04060c'),
      metalness: 1.0,
      roughness: 0.038,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      iridescence: 0.35,
      iridescenceIOR: 1.6,
      iridescenceThicknessRange: [120, 420],
      envMapIntensity: 3.1,
    });
    disposables.push(obsidianChromeMat);

    // 3. Crystal Liquid-Glass PBR Material with REAL Chromatic Dispersion + Thin-Film Iridescence
    const crystalGlassMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#f4f9ff'),
      transmission: 0.98,
      opacity: 1,
      transparent: false,
      roughness: 0.022,
      metalness: 0.03,
      ior: 1.54,
      thickness: 1.9,
      dispersion: 7.5,
      iridescence: 1.0,
      iridescenceIOR: 1.46,
      iridescenceThicknessRange: [190, 720],
      specularIntensity: 1.6,
      specularColor: new THREE.Color('#ffffff'),
      clearcoat: 1.0,
      clearcoatRoughness: 0.015,
      attenuationColor: new THREE.Color('#7ec8ff'),
      attenuationDistance: 2.4,
      envMapIntensity: 2.75,
    });
    disposables.push(crystalGlassMat);

    // 4. Secondary Orchid-Tinted Liquid Crystal Glass Strand
    const orchidGlassMat = crystalGlassMat.clone();
    orchidGlassMat.attenuationColor = new THREE.Color('#f5a8ff');
    orchidGlassMat.iridescenceThicknessRange = [260, 820];
    orchidGlassMat.dispersion = 8.5;
    disposables.push(orchidGlassMat);

    // Assemble the 9 tightly braided strands matching the reference photo's fluted sculpture
    const strandSpecs = [
      // Outer sculpted dark liquid-obsidian chrome bands (front-left & upper-right arcs)
      { mat: obsidianChromeMat, radiusA: 0.145, radiusB: 0.095, offset: 0.32, phase: 0.15, turns: 2, flute: 2, depth: 0.06 },
      { mat: obsidianChromeMat, radiusA: 0.11, radiusB: 0.072, offset: 0.28, phase: Math.PI + 0.35, turns: 2, flute: 2, depth: 0.05 },

      // Primary fluted crystal liquid-glass ribbons (high dispersion + iridescence)
      { mat: crystalGlassMat, radiusA: 0.22, radiusB: 0.125, offset: 0.22, phase: 0.95, turns: 3, flute: 4, depth: 0.11 },
      { mat: orchidGlassMat, radiusA: 0.195, radiusB: 0.115, offset: 0.25, phase: 2.25, turns: 3, flute: 3, depth: 0.12 },
      { mat: crystalGlassMat, radiusA: 0.165, radiusB: 0.095, offset: 0.34, phase: 3.85, turns: 3, flute: 5, depth: 0.09 },
      { mat: orchidGlassMat, radiusA: 0.14, radiusB: 0.088, offset: 0.18, phase: 5.05, turns: 2, flute: 3, depth: 0.1 },

      // Inner glowing spectral caustic glass fibers (visible refracted through the crystal outer strands)
      { mat: prismShaderMat, radiusA: 0.135, radiusB: 0.085, offset: 0.12, phase: 0.55, turns: 3, flute: 4, depth: 0.1 },
      { mat: prismShaderMat, radiusA: 0.115, radiusB: 0.075, offset: 0.16, phase: 3.1, turns: 4, flute: 3, depth: 0.09 },
      { mat: crystalGlassMat, radiusA: 0.082, radiusB: 0.058, offset: 0.38, phase: 1.7, turns: 4, flute: 2, depth: 0.07 },
    ];

    const strandMeshes: THREE.Mesh[] = [];
    for (const s of strandSpecs) {
      const geo = createBraidedRibbonGeometry({
        segments: 240,
        radialSegments: 22,
        radiusA: s.radiusA,
        radiusB: s.radiusB,
        offsetRadius: s.offset,
        phaseOffset: s.phase,
        twistTurns: s.turns,
        fluteCount: s.flute,
        fluteDepth: s.depth,
      });
      disposables.push(geo);
      const mesh = new THREE.Mesh(geo, s.mat);
      sculptureGroup.add(mesh);
      strandMeshes.push(mesh);
    }

    // Orbiting dynamic studio rim lights so reflections sweep like liquid light across the chrome & glass
    const keyLight = new THREE.PointLight('#7ec8ff', 28, 18);
    keyLight.position.set(-4.2, 2.4, 4.5);
    const orchidLight = new THREE.PointLight('#ff98f8', 26, 18);
    orchidLight.position.set(4.1, 2.8, 4.0);
    const emeraldRim = new THREE.PointLight('#00ffaa', 22, 16);
    emeraldRim.position.set(3.8, -2.5, 4.2);
    const whiteSpec = new THREE.DirectionalLight('#ffffff', 2.4);
    whiteSpec.position.set(1.5, 6.0, 5.5);
    scene.add(keyLight, orchidLight, emeraldRim, whiteSpec);

    // Subtle cinema lens bloom post-processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(800, 520), 0.34, 0.58, 0.78);
    const outputPass = new OutputPass();
    composer.addPass(renderPass);
    composer.addPass(bloomPass);
    composer.addPass(outputPass);

    let targetRotY = -0.18;
    let targetRotX = 0.14;
    let dragVelocityY = 0;
    let dragVelocityX = 0;
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
      const h = Math.max(hostEl.clientHeight, 240);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      composer.setSize(w, h);
      bloomPass.resolution.set(w, h);
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
        dragVelocityY = dx * 0.009;
        dragVelocityX = dy * 0.007;
        targetRotY += dragVelocityY;
        targetRotX = THREE.MathUtils.clamp(targetRotX + dragVelocityX, -0.9, 0.9);
      } else {
        const rect = hostEl?.getBoundingClientRect();
        if (!rect) return;
        const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        if (Math.abs(nx) <= 1.2 && Math.abs(ny) <= 1.2) {
          targetRotY += (nx * 0.38 - targetRotY) * 0.03;
          targetRotX += (ny * 0.26 + 0.14 - targetRotX) * 0.03;
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
      prismShaderMat.uniforms.uTime.value = sec;
      bgMat.uniforms.uTime.value = sec;

      if (!reducedMotion) {
        // Organic weightless sculpture rotation & Rust/Wasm harmonic float
        const wave = wasmMod
          ? wasmMod.compute_wave_displacement(240, -180, Math.floor(sec * 1000)) / 1000
          : Math.sin(sec * 1.15);

        if (!pointerDown) {
          dragVelocityY *= 0.94;
          dragVelocityX *= 0.94;
          targetRotY += 0.0042 + dragVelocityY;
          targetRotX = THREE.MathUtils.clamp(targetRotX + dragVelocityX, -0.85, 0.85);
        }

        sculptureGroup.rotation.y += (targetRotY - sculptureGroup.rotation.y) * 0.08;
        sculptureGroup.rotation.x += (targetRotX + Math.sin(sec * 0.65) * 0.08 - sculptureGroup.rotation.x) * 0.08;
        sculptureGroup.rotation.z = 0.22 + Math.cos(sec * 0.52) * 0.06;
        sculptureGroup.position.y = wave * 0.075;

        // Subtle counter-breathing between glass and chrome layers
        for (let i = 0; i < strandMeshes.length; i++) {
          const s = 1 + 0.014 * Math.sin(sec * 1.35 + i * 0.72);
          strandMeshes[i].scale.setScalar(s);
        }

        // Sweep studio lights subtly so reflections shimmer continuously over chrome & crystal
        keyLight.position.x = -4.2 + Math.sin(sec * 0.7) * 1.3;
        keyLight.position.y = 2.2 + Math.cos(sec * 0.55) * 1.1;
        orchidLight.position.x = 4.0 + Math.cos(sec * 0.62) * 1.2;
        emeraldRim.position.y = -2.3 + Math.sin(sec * 0.85) * 1.15;
      }

      composer.render();
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      hostEl?.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      ro.disconnect();
      io.disconnect();
      composer.dispose();
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
  aria-label="Interactive photorealistic 3D iridescent liquid-glass and obsidian-chrome infinity sculpture"
></div>

<style lang="scss">
  .sculpture-stage {
    position: relative;
    width: 100%;
    height: 100%;
    aspect-ratio: 16 / 11;
    overflow: hidden;
    background: transparent;
    cursor: grab;
    user-select: none;
    touch-action: pan-y;
    // Feather edges seamlessly into the pure obsidian background — zero visible box or frame
    -webkit-mask-image: radial-gradient(ellipse 74% 72% at 50% 50%, #000 56%, transparent 98%);
    mask-image: radial-gradient(ellipse 74% 72% at 50% 50%, #000 56%, transparent 98%);

    &.interacting {
      cursor: grabbing;
    }

    :global(canvas) {
      width: 100% !important;
      height: 100% !important;
      display: block;
    }
  }
</style>
