<script lang="ts">
  import { onMount } from 'svelte';

  let mountEl: HTMLDivElement | undefined = $state();

  onMount(() => {
    if (typeof window === 'undefined' || !mountEl) return;

    const isDesktop = () =>
      window.innerWidth > 768 &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      !window.matchMedia('(pointer: coarse)').matches;

    if (!isDesktop()) return;

    let disposed = false;
    let simulation: import('webgl-fluid-enhanced').default | null = null;
    let lastX = window.innerWidth * 0.5;
    let lastY = window.innerHeight * 0.5;
    let hasLast = false;

    const clampDelta = (v: number) => Math.max(-95, Math.min(95, v));

    const onMouseMove = (e: MouseEvent) => {
      if (disposed || !simulation || !mountEl) return;
      if (!hasLast) {
        lastX = e.clientX;
        lastY = e.clientY;
        hasLast = true;
        return;
      }
      const dx = clampDelta(e.clientX - lastX);
      const dy = clampDelta(e.clientY - lastY);
      lastX = e.clientX;
      lastY = e.clientY;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;

      const canvas = mountEl.querySelector('canvas');
      if (!canvas) return;
      const ratioX = canvas.width / Math.max(1, canvas.clientWidth);
      simulation.splatAtLocation(
        e.clientX * ratioX,
        e.clientY,
        dx * 5.8,
        -dy * 5.8
      );
    };

    const onMouseDown = (e: MouseEvent) => {
      if (disposed || !simulation || !mountEl) return;
      const canvas = mountEl.querySelector('canvas');
      if (!canvas) return;
      const ratioX = canvas.width / Math.max(1, canvas.clientWidth);
      const cx = e.clientX * ratioX;
      const cy = e.clientY;
      simulation.splatAtLocation(cx, cy, 175, 135, '#016ad4');
      simulation.splatAtLocation(cx, cy, -175, -135, '#b83280');
    };

    const onVisibilityChange = () => {
      if (!simulation) return;
      if (document.hidden) {
        simulation.stop();
      } else if (isDesktop()) {
        simulation.start();
      }
    };

    const onResize = () => {
      if (!simulation) return;
      if (isDesktop() && !document.hidden) {
        simulation.start();
      } else {
        simulation.stop();
      }
    };

    void (async () => {
      const mod = await import('webgl-fluid-enhanced');
      if (disposed || !mountEl) return;

      const WebGLFluidEnhanced = mod.default;
      const sim = new WebGLFluidEnhanced(mountEl);
      sim.setConfig({
        simResolution: 128,
        dyeResolution: 1024,
        densityDissipation: 2.5,
        velocityDissipation: 0.2,
        pressure: 0.8,
        pressureIterations: 20,
        curl: 30,
        splatRadius: 0.25,
        splatForce: 6000,
        shading: false,
        colorful: true,
        colorUpdateSpeed: 10,
        colorPalette: ['#016ad4', '#5f1f57', '#7c3aed', '#b83280', '#3b82f6', '#9333ea', '#e11d74'],
        hover: false,
        backgroundColor: '#000000',
        transparent: false,
        brightness: 0.17,
        bloom: false,
        sunrays: false,
      });

      sim.start();
      sim.multipleSplats(3);
      simulation = sim;

      window.addEventListener('mousemove', onMouseMove, { passive: true });
      window.addEventListener('mousedown', onMouseDown, { passive: true });
      document.addEventListener('visibilitychange', onVisibilityChange);
      window.addEventListener('resize', onResize, { passive: true });
    })();

    return () => {
      disposed = true;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('resize', onResize);
      if (simulation) {
        simulation.stop();
        simulation = null;
      }
    };
  });
</script>

<div class="fluid-bg" aria-hidden="true">
  <div class="fluid-mount" bind:this={mountEl}></div>
</div>

<style lang="scss">
  .fluid-bg {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
    opacity: 1;
    background: #000000;

    @media (max-width: 768px), (prefers-reduced-motion: reduce), (pointer: coarse) {
      display: none;
    }
  }

  .fluid-mount {
    width: 100%;
    height: 100%;
    pointer-events: none;

    :global(canvas) {
      width: 100% !important;
      height: 100% !important;
      display: block;
      pointer-events: none !important;
    }
  }
</style>
