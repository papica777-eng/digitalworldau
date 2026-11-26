<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { GLOBAL_REGIONS } from '../data/agencyData';

  let hostEl: HTMLDivElement | undefined = $state();

  function latLngToVec3(lat: number, lng: number, radius: number): THREE.Vector3 {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }

  onMount(() => {
    if (!hostEl) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
    camera.position.set(0, 0.35, 4.35);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    hostEl.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    // Initial angle showcasing Australia -> Europe arcs
    globeGroup.rotation.y = -1.85;
    globeGroup.rotation.x = 0.22;
    scene.add(globeGroup);

    const RADIUS = 1.38;

    // Core dark sapphire sphere
    const sphereGeo = new THREE.SphereGeometry(RADIUS * 0.985, 48, 48);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#040a24'),
      transparent: true,
      opacity: 0.9,
    });
    globeGroup.add(new THREE.Mesh(sphereGeo, sphereMat));

    // Fibonacci dotted surface lattice
    const dotCount = 1100;
    const dotPos = new Float32Array(dotCount * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < dotCount; i++) {
      const y = 1 - (i / (dotCount - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      dotPos[i * 3] = Math.cos(theta) * r * RADIUS;
      dotPos[i * 3 + 1] = y * RADIUS;
      dotPos[i * 3 + 2] = Math.sin(theta) * r * RADIUS;
    }
    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', new THREE.BufferAttribute(dotPos, 3));
    const dotMat = new THREE.PointsMaterial({
      color: new THREE.Color('#84b5e6'),
      size: 0.022,
      transparent: true,
      opacity: 0.55,
    });
    globeGroup.add(new THREE.Points(dotGeo, dotMat));

    // Sydney HQ origin + glowing bezier arcs to every global hub
    const sydney = latLngToVec3(-33.8688, 151.2093, RADIUS);
    const markerGeo = new THREE.SphereGeometry(0.036, 12, 12);
    const hqMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#00f5a0') });
    const nodeMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#fcc1f4') });

    const sydneyMesh = new THREE.Mesh(markerGeo, hqMat);
    sydneyMesh.position.copy(sydney);
    globeGroup.add(sydneyMesh);

    const disposables: Array<{ dispose(): void }> = [sphereGeo, sphereMat, dotGeo, dotMat, markerGeo, hqMat, nodeMat];

    for (const reg of GLOBAL_REGIONS) {
      if (reg.code === 'AU') continue;
      const dest = latLngToVec3(reg.lat, reg.lng, RADIUS);
      const node = new THREE.Mesh(markerGeo, nodeMat);
      node.position.copy(dest);
      node.scale.setScalar(0.8);
      globeGroup.add(node);

      const mid = sydney.clone().add(dest).multiplyScalar(0.5);
      const dist = sydney.distanceTo(dest);
      mid.normalize().multiplyScalar(RADIUS + dist * 0.36);

      const curve = new THREE.QuadraticBezierCurve3(sydney, mid, dest);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(44));
      const arcMat = new THREE.LineBasicMaterial({
        color: new THREE.Color('#00f5a0'),
        transparent: true,
        opacity: 0.72,
      });
      globeGroup.add(new THREE.Line(arcGeo, arcMat));
      disposables.push(arcGeo, arcMat);
    }

    let isDragging = false;
    let prevX = 0;
    let visible = true;
    let rafId = 0;

    const resize = () => {
      if (!hostEl) return;
      const w = hostEl.clientWidth || 320;
      const h = hostEl.clientHeight || 320;
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
      isDragging = true;
      prevX = e.clientX;
    };
    const onMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      prevX = e.clientX;
      globeGroup.rotation.y += dx * 0.008;
    };
    const onUp = () => {
      isDragging = false;
    };

    hostEl.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onUp);

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      if (!visible) return;
      if (!isDragging) {
        globeGroup.rotation.y += 0.0028;
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

<div class="globe-wrap" bind:this={hostEl} role="img" aria-label="Interactive 3D globe connecting Digital World AU in Sydney with clients across Europe and North America">
  <span class="globe-hint">Drag to rotate • Sydney HQ → 7 Global Markets</span>
</div>

<style lang="scss">
  @use '../styles/tokens' as *;

  .globe-wrap {
    position: relative;
    width: 100%;
    height: 310px;
    cursor: grab;
    border-radius: $radius-lg;
    background: radial-gradient(circle at 50% 50%, rgba(0, 102, 255, 0.14), transparent 72%);
    overflow: hidden;

    &:active {
      cursor: grabbing;
    }

    :global(canvas) {
      width: 100% !important;
      height: 100% !important;
    }
  }

  .globe-hint {
    position: absolute;
    bottom: 0.75rem;
    left: 50%;
    transform: translateX(-50%);
    font-family: $font-mono;
    font-size: 0.68rem;
    color: $accent-blue-light;
    background: rgba(4, 7, 15, 0.45);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.12);
    padding: 0.25rem 0.7rem;
    border-radius: $radius-pill;
    white-space: nowrap;
    pointer-events: none;
  }
</style>
