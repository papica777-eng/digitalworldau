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

    const clampDelta = (v: number) => Math.max(-90, Math.min(90, v));

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
        dx * 5.2,
        -dy * 5.2
      );
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
        dyeResolution: 512,
        densityDissipation: 1.35,
        velocityDissipation: 0.25,
        pressure: 0.8,
        pressureIterations: 18,
        curl: 28,
        splatRadius: 0.22,
        splatForce: 4800,
        shading: true,
        colorful: true,
        colorUpdateSpeed: 8,
        colorPalette: ['#00f0ff', '#016ad4', '#9d00ff', '#fcc1f4', '#d4af37'],
        hover: false,
        backgroundColor: '#020308',
        transparent: true,
        brightness: 0.12,
        bloom: true,
        bloomIterations: 6,
        bloomResolution: 256,
        bloomIntensity: 0.32,
        bloomThreshold: 0.48,
        sunrays: false,
      });

      sim.start();
      sim.multipleSplats(3);
      simulation = sim;

      window.addEventListener('mousemove', onMouseMove, { passive: true });
      document.addEventListener('visibilitychange', onVisibilityChange);
      window.addEventListener('resize', onResize, { passive: true });
    })();

    return () => {
      disposed = true;
      window.removeEventListener('mousemove', onMouseMove);
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
    opacity: 0.82;

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
