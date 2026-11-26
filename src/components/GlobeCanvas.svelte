<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';
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

  function latLngToVec3(lat: number, lng: number, radius: number): THREE.Vector3 {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }

  function computeTargetAngles(lat: number, lng: number): { rx: number; ry: number } {
    const v = latLngToVec3(lat, lng, 1);
    const ry = Math.atan2(-v.x, v.z);
    const rx = Math.max(-0.78, Math.min(0.78, Math.asin(Math.max(-0.98, Math.min(0.98, v.y))) * 0.72));
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

  const EARTH_FRAG = `
    uniform sampler2D uDayMap;
    uniform sampler2D uNormalMap;
    uniform sampler2D uSpecularMap;
    uniform sampler2D uLightsMap;
    uniform vec3 uSunDir;
    uniform float uTexReady;

    varying vec2 vUv;
    varying vec3 vWorldNormal;
    varying vec3 vWorldTangent;
    varying vec3 vWorldBitangent;
    varying vec3 vWorldPos;

    void main() {
      vec3 sunDir = normalize(uSunDir);
      vec3 viewDir = normalize(cameraPosition - vWorldPos);
      vec3 geoN = normalize(vWorldNormal);

      vec3 dayRaw = vec3(0.05, 0.14, 0.34);
      vec3 specSample = vec3(0.35);
      vec3 lightsRaw = vec3(0.0);
      vec3 N = geoN;

      if (uTexReady > 0.5) {
        dayRaw = pow(texture2D(uDayMap, vUv).rgb, vec3(2.2));
        vec3 nMap = texture2D(uNormalMap, vUv).xyz * 2.0 - 1.0;
        nMap.xy *= 0.85;
        mat3 tbn = mat3(normalize(vWorldTangent), normalize(vWorldBitangent), geoN);
        N = normalize(tbn * nMap);
        specSample = texture2D(uSpecularMap, vUv).rgb;
        lightsRaw = pow(texture2D(uLightsMap, vUv).rgb, vec3(2.1));
      }

      float geoNdL = dot(geoN, sunDir);
      float bumpNdL = max(dot(N, sunDir), 0.0);
      float dayBlend = smoothstep(-0.18, 0.28, geoNdL);

      // Day illumination with subtle ambient blue earthshine
      vec3 earthshine = dayRaw * vec3(0.06, 0.10, 0.22);
      vec3 dayLit = dayRaw * (bumpNdL * 1.38 + 0.05) + earthshine;

      // Crisp specular sun reflection masked exclusively on ocean surfaces
      vec3 halfVec = normalize(sunDir + viewDir);
      float ndh = max(dot(N, halfVec), 0.0);
      float oceanGlint = pow(ndh, 42.0) * specSample.r * dayBlend * 0.72;
      dayLit += vec3(0.55, 0.80, 1.0) * oceanGlint;

      // Golden city lights gleaming on the night hemisphere
      float nightMask = smoothstep(0.08, -0.32, geoNdL);
      vec3 nightLights = lightsRaw * vec3(1.18, 0.86, 0.48) * nightMask * 1.55;

      // Warm twilight horizon scattering near the solar terminator
      float twilight = exp(-pow((geoNdL + 0.02) * 5.2, 2.0));
      vec3 twilightColor = vec3(0.18, 0.34, 0.72) * twilight * 0.22;

      // Surface Rayleigh blue rim glow
      float fresnel = pow(1.0 - max(dot(viewDir, geoN), 0.0), 3.3);
      float sunSide = smoothstep(-0.45, 0.65, geoNdL);
      vec3 rimGlow = mix(vec3(0.04, 0.22, 0.68), vec3(0.22, 0.74, 0.98), sunSide) * fresnel * 0.92;

      vec3 color = mix(dayRaw * 0.025 + earthshine * 0.55, dayLit, dayBlend) + nightLights + twilightColor + rimGlow;

      // Soft tone compression & sRGB encode
      color = color / (color + vec3(0.85));
      color = pow(clamp(color, 0.0, 1.0), vec3(1.0 / 2.2));

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const CLOUDS_VERT = `
    varying vec2 vUv;
    varying vec3 vWorldNormal;
    varying vec3 vWorldPos;

    void main() {
      vUv = uv;
      vWorldNormal = normalize(mat3(modelMatrix) * normal);
      vec4 wp = modelMatrix * vec4(position, 1.0);
      vWorldPos = wp.xyz;
      gl_Position = projectionMatrix * viewMatrix * wp;
    }
  `;

  const CLOUDS_FRAG = `
    uniform sampler2D uCloudsMap;
    uniform vec3 uSunDir;
    uniform float uCloudsReady;

    varying vec2 vUv;
    varying vec3 vWorldNormal;
    varying vec3 vWorldPos;

    void main() {
      if (uCloudsReady < 0.5) discard;
      vec4 tex = texture2D(uCloudsMap, vUv);
      float cloudDensity = tex.r;
      if (cloudDensity < 0.04) discard;

      float ndl = smoothstep(-0.25, 0.55, dot(normalize(vWorldNormal), normalize(uSunDir)));
      vec3 col = mix(vec3(0.08, 0.14, 0.28), vec3(0.95, 0.98, 1.0), ndl);
      float alpha = cloudDensity * mix(0.14, 0.52, ndl);
      gl_FragColor = vec4(col, alpha);
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
      float intensity = pow(0.64 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.2);
      vec3 atmoColor = mix(vec3(0.004, 0.416, 0.831), vec3(0.22, 0.74, 0.98), clamp(intensity, 0.0, 1.0));
      gl_FragColor = vec4(atmoColor, 1.0) * intensity * 1.15;
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

    const initial = computeTargetAngles(activeRegion.lat, activeRegion.lng);
    targetRotX = initial.rx;
    targetRotY = initial.ry;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
    camera.position.set(0, 0.12, 4.45);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    hostEl.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    globeGroup.rotation.set(initial.rx, initial.ry, 0);
    scene.add(globeGroup);

    const RADIUS = 1.48;
    const sunDir = new THREE.Vector3(5.0, 2.2, 4.2).normalize();

    const loader = new THREE.TextureLoader();
    let loadedCount = 0;

    const earthUniforms = {
      uDayMap: { value: null as THREE.Texture | null },
      uNormalMap: { value: null as THREE.Texture | null },
      uSpecularMap: { value: null as THREE.Texture | null },
      uLightsMap: { value: null as THREE.Texture | null },
      uSunDir: { value: sunDir },
      uTexReady: { value: 0 },
    };

    const cloudsUniforms = {
      uCloudsMap: { value: null as THREE.Texture | null },
      uSunDir: { value: sunDir },
      uCloudsReady: { value: 0 },
    };

    const markSurfaceTex = () => {
      loadedCount += 1;
      if (loadedCount >= 4) {
        earthUniforms.uTexReady.value = 1;
        texturesLoaded = true;
      }
    };

    const configureTex = (tex: THREE.Texture) => {
      tex.colorSpace = THREE.NoColorSpace;
      tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      return tex;
    };

    const texDay = loader.load('/media/earth/earth_atmos_2048.jpg', (t) => {
      earthUniforms.uDayMap.value = configureTex(t);
      markSurfaceTex();
    });
    const texNormal = loader.load('/media/earth/earth_normal_2048.jpg', (t) => {
      earthUniforms.uNormalMap.value = configureTex(t);
      markSurfaceTex();
    });
    const texSpec = loader.load('/media/earth/earth_specular_2048.jpg', (t) => {
      earthUniforms.uSpecularMap.value = configureTex(t);
      markSurfaceTex();
    });
    const texLights = loader.load('/media/earth/earth_lights_2048.png', (t) => {
      earthUniforms.uLightsMap.value = configureTex(t);
      markSurfaceTex();
    });
    const texClouds = loader.load('/media/earth/earth_clouds_1024.png', (t) => {
      cloudsUniforms.uCloudsMap.value = configureTex(t);
      cloudsUniforms.uCloudsReady.value = 1;
    });

    // 1. Photorealistic NASA Planet Earth sphere
    const earthGeo = new THREE.SphereGeometry(RADIUS, 96, 96);
    const earthMat = new THREE.ShaderMaterial({
      uniforms: earthUniforms,
      vertexShader: EARTH_VERT,
      fragmentShader: EARTH_FRAG,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    globeGroup.add(earthMesh);

    // 2. Drifting animated cloud sphere
    const cloudsGeo = new THREE.SphereGeometry(RADIUS * 1.015, 72, 72);
    const cloudsMat = new THREE.ShaderMaterial({
      uniforms: cloudsUniforms,
      vertexShader: CLOUDS_VERT,
      fragmentShader: CLOUDS_FRAG,
      transparent: true,
      depthWrite: false,
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    globeGroup.add(cloudsMesh);

    // 3. Volumetric outer Rayleigh blue atmosphere halo
    const atmoGeo = new THREE.SphereGeometry(RADIUS * 1.15, 72, 72);
    const atmoMat = new THREE.ShaderMaterial({
      vertexShader: ATMO_VERT,
      fragmentShader: ATMO_FRAG,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    scene.add(atmoMesh);

    // 4. Interactive 3D pins, tangent pulse rings & geodesic routes from Sydney HQ
    const sydney = latLngToVec3(-33.8688, 151.2093, RADIUS * 1.018);
    const pinGeo = new THREE.SphereGeometry(0.032, 16, 16);
    const ringGeo = new THREE.RingGeometry(0.044, 0.072, 28);

    const hitMeshes: THREE.Mesh[] = [];
    const pinRecords: Array<{
      code: string;
      pin: THREE.Mesh;
      pinMat: THREE.MeshBasicMaterial;
      ring: THREE.Mesh;
      ringMat: THREE.MeshBasicMaterial;
    }> = [];
    const disposables: Array<{ dispose(): void }> = [
      earthGeo,
      earthMat,
      cloudsGeo,
      cloudsMat,
      atmoGeo,
      atmoMat,
      pinGeo,
      ringGeo,
      texDay,
      texNormal,
      texSpec,
      texLights,
      texClouds,
    ];

    for (const reg of GLOBAL_REGIONS) {
      const pos = latLngToVec3(reg.lat, reg.lng, RADIUS * 1.018);

      const pinMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(reg.code === selectedCode ? '#ffffff' : '#38bdf8'),
      });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.copy(pos);
      pin.userData.code = reg.code;
      globeGroup.add(pin);
      hitMeshes.push(pin);

      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#38bdf8'),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.72,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos).multiplyScalar(1.002);
      ring.lookAt(pos.clone().multiplyScalar(2));
      ring.userData.code = reg.code;
      globeGroup.add(ring);
      hitMeshes.push(ring);

      pinRecords.push({ code: reg.code, pin, pinMat, ring, ringMat });
      disposables.push(pinMat, ringMat);

      if (reg.code !== 'AU') {
        const mid = sydney.clone().add(pos).multiplyScalar(0.5);
        const dist = sydney.distanceTo(pos);
        mid.normalize().multiplyScalar(RADIUS * 1.02 + dist * 0.34);

        const curve = new THREE.QuadraticBezierCurve3(sydney, mid, pos);
        const arcGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(48));
        const arcMat = new THREE.LineBasicMaterial({
          color: new THREE.Color('#84b5e6'),
          transparent: true,
          opacity: 0.42,
        });
        globeGroup.add(new THREE.Line(arcGeo, arcMat));
        disposables.push(arcGeo, arcMat);
      }
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
      const w = hostEl.clientWidth || 380;
      const h = hostEl.clientHeight || 380;
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

      cloudsMesh.rotation.y += 0.00045;

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

      const pulse = 1 + 0.36 * (0.5 + 0.5 * Math.sin(now * 0.0042));
      for (const rec of pinRecords) {
        const isActive = rec.code === selectedCode;
        rec.pin.scale.setScalar(isActive ? 1.45 : 0.92);
        rec.pinMat.color.set(isActive ? '#ffffff' : '#38bdf8');
        rec.ring.scale.setScalar(isActive ? pulse * 1.45 : 0.95);
        rec.ringMat.opacity = isActive ? 0.85 : 0.38;
        rec.ringMat.color.set(isActive ? '#84b5e6' : '#016ad4');
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

<div class="globe-stage">
  <div
    class="globe-wrap"
    class:ready={texturesLoaded}
    bind:this={hostEl}
    role="img"
    aria-label="Interactive 3D photorealistic Planet Earth connecting Digital World AU in Sydney with 7 global markets"
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

    <span class="globe-drag-hint">Drag Earth or click pins to inspect markets</span>
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
    height: 440px;
    cursor: grab;
    background: transparent;
    border: none;
    box-shadow: none;
    overflow: visible;

    @include respond-up(lg) {
      height: 540px;
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
    background: $accent-cobalt;
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
