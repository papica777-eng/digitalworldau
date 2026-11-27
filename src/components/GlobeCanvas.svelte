<script lang="ts">
  import { onMount } from 'svelte';
  import type * as THREE_NS from 'three';
  import { GLOBAL_REGIONS } from '../data/agencyData';

  let {
    selectedCode = 'AU',
    onSelectRegion,
  }: {
    selectedCode?: string;
    onSelectRegion?: (code: string) => void;
  } = $props();

  let hostEl: HTMLDivElement | undefined = $state();
  let texturesLoaded = $state(false);
  let targetRotY = -1.85;
  let targetRotX = 0.22;
  let flyLockUntil = 0;

  let activeRegion = $derived(
    GLOBAL_REGIONS.find((r) => r.code === selectedCode) ?? GLOBAL_REGIONS[0]
  );

  function latLngToTuple(lat: number, lng: number, radius: number): [number, number, number] {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return [
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta),
    ];
  }

  function computeTargetAngles(lat: number, lng: number): { rx: number; ry: number } {
    const [x, y, z] = latLngToTuple(lat, lng, 1);
    const ry = Math.atan2(-x, z);
    const rx = Math.max(-0.78, Math.min(0.78, Math.asin(Math.max(-0.98, Math.min(0.98, y))) * 0.72));
    return { rx, ry };
  }

  function formatCoord(lat: number, lng: number): string {
    const ns = lat >= 0 ? 'N' : 'S';
    const ew = lng >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(2)}° ${ns}, ${Math.abs(lng).toFixed(2)}° ${ew}`;
  }

  const EARTH_VERT = `
    varying vec2 vUv;
    varying vec3 vWorldNormal;
    varying vec3 vWorldTangent;
    varying vec3 vWorldBitangent;
    varying vec3 vWorldPos;

    void main() {
      vUv = uv;
      vec3 up = abs(normal.y) < 0.995 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
      vec3 localTangent = normalize(cross(up, normal));
      vec3 localBitangent = normalize(cross(normal, localTangent));

      mat3 nMat = mat3(modelMatrix);
      vWorldNormal = normalize(nMat * normal);
      vWorldTangent = normalize(nMat * localTangent);
      vWorldBitangent = normalize(nMat * localBitangent);

      vec4 wp = modelMatrix * vec4(position, 1.0);
      vWorldPos = wp.xyz;
      gl_Position = projectionMatrix * viewMatrix * wp;
    }
  `;

  const BACK_FRAG = `
    uniform sampler2D uSpecularMap;
    uniform float uTexReady;

    varying vec2 vUv;
    varying vec3 vWorldNormal;
    varying vec3 vWorldPos;

    void main() {
      float landMask = 0.25;
      if (uTexReady > 0.5) {
        landMask = 1.0 - smoothstep(0.18, 0.52, texture2D(uSpecularMap, vUv).r);
      }

      vec3 oceanBack = vec3(0.03, 0.05, 0.09);
      vec3 landBack = vec3(0.06, 0.16, 0.30);
      vec3 color = mix(oceanBack, landBack, landMask);
      float alpha = mix(0.16, 0.36, landMask);

      gl_FragColor = vec4(color, alpha);
    }
  `;

  const FRONT_FRAG = `
    uniform sampler2D uSpecularMap;
    uniform sampler2D uNormalMap;
    uniform sampler2D uLightsMap;
    uniform vec3 uKeyDir;
    uniform float uTexReady;

    varying vec2 vUv;
    varying vec3 vWorldNormal;
    varying vec3 vWorldTangent;
    varying vec3 vWorldBitangent;
    varying vec3 vWorldPos;

    void main() {
      vec3 viewDir = normalize(cameraPosition - vWorldPos);
      vec3 geoN = normalize(vWorldNormal);
      vec3 keyDir = normalize(uKeyDir);

      float landMask = 0.0;
      float coast = 0.0;
      float lights = 0.0;
      vec3 N = geoN;

      if (uTexReady > 0.5) {
        float specCenter = texture2D(uSpecularMap, vUv).r;
        landMask = 1.0 - smoothstep(0.18, 0.52, specCenter);

        float du = 1.0 / 2048.0;
        float dv = 1.0 / 1024.0;
        float sL = 1.0 - smoothstep(0.18, 0.52, texture2D(uSpecularMap, vUv - vec2(du, 0.0)).r);
        float sR = 1.0 - smoothstep(0.18, 0.52, texture2D(uSpecularMap, vUv + vec2(du, 0.0)).r);
        float sD = 1.0 - smoothstep(0.18, 0.52, texture2D(uSpecularMap, vUv - vec2(0.0, dv)).r);
        float sU = 1.0 - smoothstep(0.18, 0.52, texture2D(uSpecularMap, vUv + vec2(0.0, dv)).r);
        coast = clamp((abs(sL - sR) + abs(sD - sU)) * 1.4, 0.0, 1.0);

        vec3 nMap = texture2D(uNormalMap, vUv).xyz * 2.0 - 1.0;
        nMap.xy *= 0.9;
        mat3 tbn = mat3(normalize(vWorldTangent), normalize(vWorldBitangent), geoN);
        N = normalize(tbn * nMap);

        lights = dot(texture2D(uLightsMap, vUv).rgb, vec3(0.333));
      }

      float diffuse = clamp(dot(N, keyDir) * 0.55 + 0.52, 0.28, 1.15);
      float rimView = pow(1.0 - max(dot(viewDir, geoN), 0.0), 3.1);

      vec3 landDeep = vec3(0.082, 0.286, 0.494);
      vec3 landBright = vec3(0.114, 0.392, 0.678);
      vec3 landCol = mix(landDeep, landBright, diffuse * 0.82) * diffuse;

      landCol += vec3(0.49, 0.83, 0.99) * pow(lights, 1.4) * 0.38;
      landCol = mix(landCol, vec3(0.043, 0.063, 0.102), coast * 0.72);
      landCol += vec3(0.22, 0.74, 0.98) * rimView * 0.34;

      float latGrid = smoothstep(0.985, 0.998, abs(sin(vUv.y * 12.0 * 3.14159265)));
      float lonGrid = smoothstep(0.988, 0.998, abs(sin(vUv.x * 24.0 * 3.14159265)));
      float gridMask = clamp(latGrid + lonGrid, 0.0, 1.0);

      vec3 oceanCol = vec3(0.04, 0.06, 0.10);
      oceanCol += vec3(0.22, 0.58, 0.96) * rimView * 0.78;
      oceanCol += vec3(0.35, 0.68, 1.0) * gridMask * 0.045;

      vec3 finalCol = mix(oceanCol, landCol, landMask);
      float oceanAlpha = clamp(0.44 + rimView * 0.36 + gridMask * 0.035, 0.42, 0.82);
      float alpha = mix(oceanAlpha, 0.94, landMask);

      gl_FragColor = vec4(finalCol, alpha);
    }
  `;

  const ATMO_VERT = `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const ATMO_FRAG = `
    varying vec3 vNormal;
    void main() {
      float intensity = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.2);
      vec3 atmoColor = mix(vec3(0.004, 0.416, 0.831), vec3(0.22, 0.74, 0.98), clamp(intensity, 0.0, 1.0));
      gl_FragColor = vec4(atmoColor, 1.0) * intensity * 0.58;
    }
  `;

  $effect(() => {
    const reg = GLOBAL_REGIONS.find((r) => r.code === selectedCode);
    if (reg) {
      const next = computeTargetAngles(reg.lat, reg.lng);
      targetRotX = next.rx;
      targetRotY = next.ry;
      flyLockUntil = performance.now() + 2600;
    }
  });

  onMount(() => {
    if (!hostEl) return;

    let destroyed = false;
    let sceneCleanup: (() => void) | null = null;

    const initGlobe = async () => {
      if (!hostEl || destroyed) return;
      const THREE = await import('three');
      if (!hostEl || destroyed) return;

      const initial = computeTargetAngles(activeRegion.lat, activeRegion.lng);
      targetRotX = initial.rx;
      targetRotY = initial.ry;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
      camera.position.set(0, 0.08, 4.75);

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      hostEl.appendChild(renderer.domElement);

      const globeGroup = new THREE.Group();
      globeGroup.rotation.set(initial.rx, initial.ry, 0);
      scene.add(globeGroup);

      const RADIUS = 1.62;
      const keyDir = new THREE.Vector3(3.6, 2.4, 4.4).normalize();

      const loader = new THREE.TextureLoader();
      let loadedCount = 0;

      const backUniforms = {
        uSpecularMap: { value: null as THREE_NS.Texture | null },
        uTexReady: { value: 0 },
      };

      const frontUniforms = {
        uSpecularMap: { value: null as THREE_NS.Texture | null },
        uNormalMap: { value: null as THREE_NS.Texture | null },
        uLightsMap: { value: null as THREE_NS.Texture | null },
        uKeyDir: { value: keyDir },
        uTexReady: { value: 0 },
      };

      const markReady = () => {
        loadedCount += 1;
        if (loadedCount >= 3) {
          backUniforms.uTexReady.value = 1;
          frontUniforms.uTexReady.value = 1;
          texturesLoaded = true;
        }
      };

      const configureTex = (tex: THREE_NS.Texture) => {
        tex.colorSpace = THREE.NoColorSpace;
        tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        return tex;
      };

      const texSpec = loader.load('/media/earth/earth_specular_2048.webp', (t) => {
        const cfg = configureTex(t);
        backUniforms.uSpecularMap.value = cfg;
        frontUniforms.uSpecularMap.value = cfg;
        markReady();
      });
      const texNormal = loader.load('/media/earth/earth_normal_2048.webp', (t) => {
        frontUniforms.uNormalMap.value = configureTex(t);
        markReady();
      });
      const texLights = loader.load('/media/earth/earth_lights_2048.webp', (t) => {
        frontUniforms.uLightsMap.value = configureTex(t);
        markReady();
      });

      const sphereGeo = new THREE.SphereGeometry(RADIUS, 96, 96);

      const backMat = new THREE.ShaderMaterial({
        uniforms: backUniforms,
        vertexShader: EARTH_VERT,
        fragmentShader: BACK_FRAG,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
      });
      globeGroup.add(new THREE.Mesh(sphereGeo, backMat));

      const frontMat = new THREE.ShaderMaterial({
        uniforms: frontUniforms,
        vertexShader: EARTH_VERT,
        fragmentShader: FRONT_FRAG,
        side: THREE.FrontSide,
        transparent: true,
        depthWrite: true,
      });
      globeGroup.add(new THREE.Mesh(sphereGeo, frontMat));

      const atmoGeo = new THREE.SphereGeometry(RADIUS * 1.11, 72, 72);
      const atmoMat = new THREE.ShaderMaterial({
        vertexShader: ATMO_VERT,
        fragmentShader: ATMO_FRAG,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      });
      scene.add(new THREE.Mesh(atmoGeo, atmoMat));

      const dotGeo = new THREE.CircleGeometry(0.024, 20);
      const innerRingGeo = new THREE.RingGeometry(0.04, 0.056, 32);
      const outerRingGeo = new THREE.RingGeometry(0.072, 0.09, 32);

      const hitMeshes: THREE_NS.Mesh[] = [];
      const beaconRecords: Array<{
        code: string;
        dot: THREE_NS.Mesh;
        dotMat: THREE_NS.MeshBasicMaterial;
        innerRing: THREE_NS.Mesh;
        innerMat: THREE_NS.MeshBasicMaterial;
        outerRing: THREE_NS.Mesh;
        outerMat: THREE_NS.MeshBasicMaterial;
      }> = [];

      const disposables: Array<{ dispose(): void }> = [
        sphereGeo,
        backMat,
        frontMat,
        atmoGeo,
        atmoMat,
        dotGeo,
        innerRingGeo,
        outerRingGeo,
        texSpec,
        texNormal,
        texLights,
      ];

      for (let idx = 0; idx < GLOBAL_REGIONS.length; idx++) {
        const reg = GLOBAL_REGIONS[idx];
        const [px, py, pz] = latLngToTuple(reg.lat, reg.lng, RADIUS * 1.012);
        const pos = new THREE.Vector3(px, py, pz);
        const normalOut = pos.clone().multiplyScalar(2);

        const dotMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color('#ffffff'),
          side: THREE.DoubleSide,
        });
        const dot = new THREE.Mesh(dotGeo, dotMat);
        dot.position.copy(pos);
        dot.lookAt(normalOut);
        dot.userData.code = reg.code;
        globeGroup.add(dot);
        hitMeshes.push(dot);

        const innerMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color('#38bdf8'),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.9,
        });
        const innerRing = new THREE.Mesh(innerRingGeo, innerMat);
        innerRing.position.copy(pos).multiplyScalar(1.001);
        innerRing.lookAt(normalOut);
        innerRing.userData.code = reg.code;
        globeGroup.add(innerRing);
        hitMeshes.push(innerRing);

        const outerMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color('#0ea5e9'),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.55,
        });
        const outerRing = new THREE.Mesh(outerRingGeo, outerMat);
        outerRing.position.copy(pos).multiplyScalar(1.002);
        outerRing.lookAt(normalOut);
        outerRing.userData.code = reg.code;
        globeGroup.add(outerRing);
        hitMeshes.push(outerRing);

        beaconRecords.push({
          code: reg.code,
          dot,
          dotMat,
          innerRing,
          innerMat,
          outerRing,
          outerMat,
        });
        disposables.push(dotMat, innerMat, outerMat);
      }

      const raycaster = new THREE.Raycaster();
      const pointerNdc = new THREE.Vector2();

      let isDragging = false;
      let dragDistance = 0;
      let prevX = 0;
      let prevY = 0;
      let velX = 0;
      let velY = 0;
      let visible = true;
      let rafId = 0;

      const resize = () => {
        if (!hostEl) return;
        const w = hostEl.clientWidth || 420;
        const h = hostEl.clientHeight || 420;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      };
      resize();

      const ro = new ResizeObserver(resize);
      ro.observe(hostEl);

      const ioVis = new IntersectionObserver(
        (entries) => {
          visible = entries[0]?.isIntersecting ?? true;
        },
        { threshold: 0.05 }
      );
      ioVis.observe(hostEl);

      const onDown = (e: PointerEvent) => {
        isDragging = true;
        dragDistance = 0;
        prevX = e.clientX;
        prevY = e.clientY;
        velX = 0;
        velY = 0;
        flyLockUntil = 0;
      };

      const onMove = (e: PointerEvent) => {
        if (!isDragging) return;
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;
        dragDistance += Math.abs(dx) + Math.abs(dy);
        prevX = e.clientX;
        prevY = e.clientY;
        velY = dx * 0.0065;
        velX = dy * 0.0055;
        globeGroup.rotation.y += velY;
        globeGroup.rotation.x = Math.max(-0.85, Math.min(0.85, globeGroup.rotation.x + velX));
      };

      const onUp = (e: PointerEvent) => {
        if (!isDragging) return;
        isDragging = false;
        if (dragDistance < 6 && hostEl) {
          const rect = renderer.domElement.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(pointerNdc, camera);
            const hits = raycaster.intersectObjects(hitMeshes, false);
            const code = hits[0]?.object?.userData?.code as string | undefined;
            if (code) {
              onSelectRegion?.(code);
            }
          }
        }
      };

      hostEl.addEventListener('pointerdown', onDown);
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerup', onUp);

      const shortestAngleDiff = (from: number, to: number) => {
        const twoPi = Math.PI * 2;
        return ((((to - from) % twoPi) + twoPi + Math.PI) % twoPi) - Math.PI;
      };

      const tick = (now: number) => {
        rafId = requestAnimationFrame(tick);
        if (!visible) return;

        if (!isDragging) {
          if (now < flyLockUntil) {
            const dY = shortestAngleDiff(globeGroup.rotation.y, targetRotY);
            const dX = targetRotX - globeGroup.rotation.x;
            globeGroup.rotation.y += dY * 0.085;
            globeGroup.rotation.x += dX * 0.085;
          } else {
            if (Math.abs(velY) > 0.0002 || Math.abs(velX) > 0.0002) {
              globeGroup.rotation.y += velY;
              globeGroup.rotation.x = Math.max(-0.85, Math.min(0.85, globeGroup.rotation.x + velX));
              velY *= 0.92;
              velX *= 0.92;
            } else {
              globeGroup.rotation.y += 0.0018;
            }
          }
        }

        for (let i = 0; i < beaconRecords.length; i++) {
          const rec = beaconRecords[i];
          const isActive = rec.code === selectedCode;
          const wave = 0.5 + 0.5 * Math.sin(now * 0.004 + i * 0.9);
          rec.dot.scale.setScalar(isActive ? 1.35 : 0.95);
          rec.dotMat.color.set(isActive ? '#ffffff' : '#bae6fd');

          rec.innerRing.scale.setScalar(isActive ? 1.3 : 0.95);
          rec.innerMat.opacity = isActive ? 0.95 : 0.72;
          rec.innerMat.color.set(isActive ? '#7dd3fc' : '#38bdf8');

          rec.outerRing.scale.setScalar((isActive ? 1.35 : 0.95) * (0.95 + 0.35 * wave));
          rec.outerMat.opacity = (isActive ? 0.85 : 0.5) * (1.0 - 0.45 * wave);
          rec.outerMat.color.set(isActive ? '#38bdf8' : '#0ea5e9');
        }

        renderer.render(scene, camera);
      };
      rafId = requestAnimationFrame(tick);

      sceneCleanup = () => {
        cancelAnimationFrame(rafId);
        hostEl?.removeEventListener('pointerdown', onDown);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        ro.disconnect();
        ioVis.disconnect();
        disposables.forEach((d) => d.dispose());
        renderer.dispose();
        renderer.domElement.remove();
      };
    };

    const bootObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          bootObserver.disconnect();
          void initGlobe();
        }
      },
      { rootMargin: '280px 0px' }
    );
    bootObserver.observe(hostEl);

    return () => {
      destroyed = true;
      bootObserver.disconnect();
      sceneCleanup?.();
    };
  });
</script>

<div class="globe-stage">
  <div
    class="globe-wrap"
    class:ready={texturesLoaded}
    bind:this={hostEl}
    role="img"
    aria-label="Interactive holographic 3D Planet Earth showcasing Digital World AU global delivery hubs"
  >
    <div class="globe-hotspot-card">
      <div class="hotspot-meta">
        <span class="hotspot-dot" aria-hidden="true"></span>
        <strong>{activeRegion.name}</strong>
        <span class="hotspot-coords">{formatCoord(activeRegion.lat, activeRegion.lng)}</span>
      </div>
      <div class="hotspot-project">
        <span>{activeRegion.hub} — {activeRegion.projectLabel}</span>
        <a
          href={activeRegion.projectUrl}
          target={activeRegion.projectUrl.startsWith('http') ? '_blank' : undefined}
          rel={activeRegion.projectUrl.startsWith('http') ? 'noopener' : undefined}
        >
          {activeRegion.projectDomain} ↗
        </a>
      </div>
    </div>

    <span class="globe-drag-hint">Drag Earth or click radar pins to inspect markets</span>
  </div>
</div>

<style lang="scss">
  @use '../styles/tokens' as *;
  @use '../styles/mixins' as *;

  .globe-stage {
    position: relative;
    width: 100%;
  }

  .globe-wrap {
    position: relative;
    width: 100%;
    height: 500px;
    cursor: grab;
    background: transparent;
    border: none;
    box-shadow: none;
    overflow: visible;

    @include respond-up(lg) {
      height: 620px;
    }

    &:active {
      cursor: grabbing;
    }

    :global(canvas) {
      width: 100% !important;
      height: 100% !important;
      display: block;
    }
  }

  .globe-hotspot-card {
    @include glass-surface(true);
    @include agma-border($radius-md, 1);
    position: absolute;
    left: 0.75rem;
    bottom: 2.35rem;
    z-index: 4;
    padding: 0.85rem 1.15rem;
    border-radius: $radius-md;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    max-width: min(360px, calc(100% - 1.5rem));
    pointer-events: auto;
  }

  .hotspot-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;

    strong {
      font-family: $font-display;
      font-size: 0.92rem;
      font-weight: 500;
      color: #ffffff;
    }
  }

  .hotspot-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: $accent-cyan;
    box-shadow: 0 0 12px $accent-cyan;
    flex-shrink: 0;
  }

  .hotspot-coords {
    margin-left: auto;
    font-family: $font-mono;
    font-size: 0.68rem;
    color: $accent-blue-light;
  }

  .hotspot-project {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.35rem 0.75rem;
    font-size: 0.78rem;
    color: rgba(255, 255, 255, 0.74);

    a {
      font-family: $font-mono;
      font-size: 0.74rem;
      font-weight: 600;
      color: $accent-blue-light;
      transition: color $transition-fast;

      &:hover {
        color: #ffffff;
      }
    }
  }

  .globe-drag-hint {
    position: absolute;
    bottom: 0.35rem;
    left: 50%;
    transform: translateX(-50%);
    font-family: $font-mono;
    font-size: 0.68rem;
    color: rgba(255, 255, 255, 0.52);
    white-space: nowrap;
    pointer-events: none;
  }
</style>
