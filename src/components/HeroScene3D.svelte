<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { getAgencyWasm } from '../lib/wasm';

  let hostEl: HTMLDivElement | undefined = $state();

  onMount(() => {
    if (!hostEl) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    hostEl.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Chromatic wireframe + translucent inner sculpture inspired by agma.bg 3D ribbons
    const knotGeo = new THREE.TorusKnotGeometry(1.45, 0.42, 160, 24, 2, 3);
    const knotMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#020932'),
      emissive: new THREE.Color('#016ad4'),
      emissiveIntensity: 0.35,
      metalness: 0.85,
      roughness: 0.15,
      clearcoat: 1.0,
      wireframe: false,
      transparent: true,
      opacity: 0.82,
    });
    const knotMesh = new THREE.Mesh(knotGeo, knotMat);
    group.add(knotMesh);

    const wireMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#fcc1f4'),
      wireframe: true,
      transparent: true,
      opacity: 0.16,
    });
    const wireMesh = new THREE.Mesh(knotGeo, wireMat);
    wireMesh.scale.setScalar(1.015);
    group.add(wireMesh);

    // Ambient orbital starfield particles
    const particleCount = 180;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 2.4 + Math.random() * 2.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: new THREE.Color('#00f5a0'),
      size: 0.045,
      transparent: true,
      opacity: 0.75,
    });
    const points = new THREE.Points(pGeo, pMat);
    group.add(points);

    const lightA = new THREE.PointLight('#00f5a0', 18, 14);
    lightA.position.set(3.5, 2.8, 4);
    const lightB = new THREE.PointLight('#fcc1f4', 16, 14);
    lightB.position.set(-3.5, -2.2, 3.5);
    const lightC = new THREE.PointLight('#016ad4', 22, 16);
    lightC.position.set(0, 3.5, -3);
    scene.add(lightA, lightB, lightC);

    let targetX = 0;
    let targetY = 0;
    let visible = true;
    let rafId = 0;
    let wasmMod: Awaited<ReturnType<typeof getAgencyWasm>> = null;
    void getAgencyWasm().then((w) => {
      wasmMod = w;
    });

    const resize = () => {
      if (!hostEl) return;
      const w = hostEl.clientWidth || 400;
      const h = hostEl.clientHeight || 400;
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

    const onMove = (e: PointerEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 0.8;
      targetY = (e.clientY / window.innerHeight - 0.5) * 0.6;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const start = performance.now();
    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      if (!visible) return;

      const elapsed = Math.floor(now - start);
      const wave = wasmMod
        ? wasmMod.compute_wave_displacement(Math.round(targetX * 1000), Math.round(targetY * 1000), elapsed) / 1000
        : Math.sin(elapsed * 0.0015) * 0.2;

      knotMesh.rotation.x += 0.0035;
      knotMesh.rotation.y += 0.0052;
      wireMesh.rotation.copy(knotMesh.rotation);
      points.rotation.y -= 0.0018;

      group.rotation.y += (targetX - group.rotation.y) * 0.05;
      group.rotation.x += (-targetY - group.rotation.x) * 0.05;
      group.position.y = wave * 0.14;

      renderer.render(scene, camera);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onMove);
      ro.disconnect();
      io.disconnect();
      knotGeo.dispose();
      knotMat.dispose();
      wireMat.dispose();
      pGeo.dispose();
      pMat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  });
</script>

<div class="hero-3d-canvas" bind:this={hostEl} aria-hidden="true"></div>

<style lang="scss">
  .hero-3d-canvas {
    position: absolute;
    inset: -4% -6% -4% 34%;
    pointer-events: none;
    z-index: 0;
    opacity: 0.52;
    filter: saturate(1.18);

    @media (max-width: 1023px) {
      inset: 0;
      opacity: 0.26;
    }

    :global(canvas) {
      width: 100% !important;
      height: 100% !important;
      display: block;
    }
  }
</style>
