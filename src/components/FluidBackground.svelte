<script lang="ts">
  import { onMount } from 'svelte';

  let mountEl: HTMLDivElement | undefined = $state();
  let sheenEl: HTMLDivElement | undefined = $state();
  let ringEl: HTMLDivElement | undefined = $state();
  let cursorActive = $state(false);
  let hoveringInteractive = $state(false);

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
    let targetX = lastX;
    let targetY = lastY;
    let ringX = lastX;
    let ringY = lastY;
    let hasLast = false;
    let rafId = 0;

    const clampDelta = (v: number) => Math.max(-90, Math.min(90, v));

    const updateRingLoop = () => {
      if (disposed) return;
      if (!document.hidden && ringEl && cursorActive) {
        ringX += (targetX - ringX) * 0.18;
        ringY += (targetY - ringY) * 0.18;
        ringEl.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      rafId = window.requestAnimationFrame(updateRingLoop);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (disposed) return;
      targetX = e.clientX;
      targetY = e.clientY;
      if (!cursorActive) {
        ringX = targetX;
        ringY = targetY;
        cursorActive = true;
      }

      if (sheenEl) {
        sheenEl.style.setProperty('--cx', `${e.clientX}px`);
        sheenEl.style.setProperty('--cy', `${e.clientY}px`);
      }

      const target = e.target as HTMLElement | null;
      hoveringInteractive = Boolean(target?.closest?.('a, button, [data-glow-card], input, select, textarea'));

      if (!simulation || !mountEl) return;
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

    const onMouseDown = (e: MouseEvent) => {
      if (disposed || !simulation || !mountEl) return;
      const canvas = mountEl.querySelector('canvas');
      if (!canvas) return;
      const ratioX = canvas.width / Math.max(1, canvas.clientWidth);
      const cx = e.clientX * ratioX;
      const cy = e.clientY;
      simulation.splatAtLocation(cx, cy, 180, 140, '#00e5ff');
      simulation.splatAtLocation(cx, cy, -180, -140, '#7c3aed');
    };

    const onMouseLeave = () => {
      cursorActive = false;
      hoveringInteractive = false;
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
        cursorActive = false;
      }
    };

    void (async () => {
      const mod = await import('webgl-fluid-enhanced');
      if (disposed || !mountEl) return;

      const WebGLFluidEnhanced = mod.default;
      const sim = new WebGLFluidEnhanced(mountEl);
      sim.setConfig({
        simResolution: 128,
        dyeResolution: 768,
        densityDissipation: 1.5,
        velocityDissipation: 0.26,
        pressure: 0.8,
        pressureIterations: 18,
        curl: 24,
        splatRadius: 0.19,
        splatForce: 5400,
        shading: true,
        colorful: true,
        colorUpdateSpeed: 9,
        colorPalette: ['#0066ff', '#00e5ff', '#7c3aed', '#00f5a0', '#e0aaff'],
        hover: false,
        backgroundColor: '#03040a',
        transparent: true,
        brightness: 0.24,
        bloom: true,
        bloomIterations: 6,
        bloomResolution: 256,
        bloomIntensity: 0.42,
        bloomThreshold: 0.42,
        sunrays: false,
      });

      sim.start();
      sim.multipleSplats(4);
      simulation = sim;

      window.addEventListener('mousemove', onMouseMove, { passive: true });
      window.addEventListener('mousedown', onMouseDown, { passive: true });
      document.addEventListener('mouseleave', onMouseLeave);
      document.addEventListener('visibilitychange', onVisibilityChange);
      window.addEventListener('resize', onResize, { passive: true });
      rafId = window.requestAnimationFrame(updateRingLoop);
    })();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseleave', onMouseLeave);
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
<div
  class="cursor-sheen"
  class:is-visible={cursorActive}
  bind:this={sheenEl}
  aria-hidden="true"
></div>
<div
  class="cursor-ring"
  class:is-visible={cursorActive}
  class:is-hover={hoveringInteractive}
  bind:this={ringEl}
  aria-hidden="true"
></div>

<style lang="scss">
  .fluid-bg {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
    opacity: 0.96;

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

  .cursor-sheen {
    position: fixed;
    inset: 0;
    z-index: 45;
    pointer-events: none;
    mix-blend-mode: screen;
    opacity: 0;
    transition: opacity 260ms ease;
    background: radial-gradient(
      240px circle at var(--cx, 50%) var(--cy, 50%),
      rgba(0, 229, 255, 0.11),
      rgba(124, 58, 237, 0.05) 45%,
      transparent 72%
    );

    &.is-visible {
      opacity: 1;
    }

    @media (max-width: 768px), (prefers-reduced-motion: reduce), (pointer: coarse) {
      display: none;
    }
  }

  .cursor-ring {
    position: fixed;
    top: 0;
    left: 0;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.28);
    background: radial-gradient(circle, rgba(0, 229, 255, 0.08), transparent 70%);
    box-shadow: 0 0 18px rgba(0, 229, 255, 0.16);
    mix-blend-mode: screen;
    pointer-events: none;
    z-index: 95;
    opacity: 0;
    transition:
      width 220ms cubic-bezier(0.22, 1, 0.36, 1),
      height 220ms cubic-bezier(0.22, 1, 0.36, 1),
      border-color 220ms ease,
      box-shadow 220ms ease,
      opacity 220ms ease;

    &.is-visible {
      opacity: 1;
    }

    &.is-hover {
      width: 52px;
      height: 52px;
      border-color: rgba(0, 245, 160, 0.72);
      box-shadow: 0 0 26px rgba(0, 229, 255, 0.34);
    }

    @media (max-width: 768px), (prefers-reduced-motion: reduce), (pointer: coarse) {
      display: none;
    }
  }
</style>
