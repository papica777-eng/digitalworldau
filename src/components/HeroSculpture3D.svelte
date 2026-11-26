<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

  let hostEl: HTMLDivElement | undefined = $state();
  let isInteracting = $state(false);

  interface ProceduralMetalMaps {
    bumpMap: THREE.CanvasTexture;
    roughnessMap: THREE.CanvasTexture;
  }

  function createBrushedMetalMaps(
    seed: number,
    contrast: number,
    streakDensity: number,
    rotation = 0
  ): ProceduralMetalMaps {
    const w = 1024;
    const h = 512;

    const bumpCanvas = document.createElement('canvas');
    bumpCanvas.width = w;
    bumpCanvas.height = h;
    const bCtx = bumpCanvas.getContext('2d')!;

    const roughCanvas = document.createElement('canvas');
    roughCanvas.width = w;
    roughCanvas.height = h;
    const rCtx = roughCanvas.getContext('2d')!;

    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, w, h);
    rCtx.fillStyle = '#484848';
    rCtx.fillRect(0, 0, w, h);

    let s = seed >>> 0;
    const rand = () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };

    for (let i = 0; i < streakDensity; i++) {
      const y = rand() * h;
      const len = 160 + rand() * 860;
      const x = rand() * w;
      const thick = 0.55 + rand() * 1.65;
      const v = Math.floor(128 + (rand() - 0.5) * 255 * contrast);
      const rv = Math.floor(42 + rand() * 88 * contrast);

      bCtx.strokeStyle = `rgba(${v},${v},${v},0.36)`;
      bCtx.lineWidth = thick;
      bCtx.beginPath();
      bCtx.moveTo(x, y);
      bCtx.lineTo(x + len, y + (rand() - 0.5) * 2.0);
      bCtx.stroke();
      if (x + len > w) {
        bCtx.beginPath();
        bCtx.moveTo(x - w, y);
        bCtx.lineTo(x + len - w, y);
        bCtx.stroke();
      }

      rCtx.strokeStyle = `rgba(${rv},${rv},${rv},0.28)`;
      rCtx.lineWidth = thick;
      rCtx.beginPath();
      rCtx.moveTo(x, y);
      rCtx.lineTo(x + len, y);
      rCtx.stroke();
    }

    const bumpMap = new THREE.CanvasTexture(bumpCanvas);
    bumpMap.wrapS = THREE.RepeatWrapping;
    bumpMap.wrapT = THREE.RepeatWrapping;
    bumpMap.repeat.set(2, 10);
    bumpMap.rotation = rotation;
    bumpMap.anisotropy = 8;

    const roughnessMap = new THREE.CanvasTexture(roughCanvas);
    roughnessMap.wrapS = THREE.RepeatWrapping;
    roughnessMap.wrapT = THREE.RepeatWrapping;
    roughnessMap.repeat.set(2, 10);
    roughnessMap.rotation = rotation;
    roughnessMap.anisotropy = 8;

    return { bumpMap, roughnessMap };
  }

  function createStudioCycloramaEnv(renderer: THREE.WebGLRenderer): THREE.Texture {
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x020308);

    const addPanel = (
      color: number,
      intensity: number,
      w: number,
      h: number,
      pos: [number, number, number]
    ) => {
      const col = new THREE.Color(color).multiplyScalar(intensity);
      const mat = new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
      mesh.position.set(pos[0], pos[1], pos[2]);
      mesh.lookAt(0, 0, 0);
      envScene.add(mesh);
    };

    // Calibrated dark-studio cyclorama softboxes (crisp white, ice-blue, cobalt & orchid-violet)
    addPanel(0xffffff, 3.2, 9.5, 2.2, [3.2, 6.4, 4.8]);
    addPanel(0xdcecff, 2.8, 1.8, 10.5, [-6.8, 1.4, 4.6]);
    addPanel(0x38bdf8, 2.6, 2.0, 10.5, [7.0, 0.9, 3.8]);
    addPanel(0xc898ff, 2.4, 6.2, 1.8, [0.0, -6.2, 3.2]);
    addPanel(0xffffff, 2.4, 5.2, 1.2, [0.0, 7.6, -3.8]);

    const rt = pmrem.fromScene(envScene, 0.032);
    pmrem.dispose();
    return rt.texture;
  }

  function buildSculptedTitaniumHelix(
    phase: number,
    radius: number,
    height: number,
    turns: number
  ): THREE.BufferGeometry {
    const segs = 192;
    const profilePts = 20;
    const halfW = 0.076;
    const halfT = 0.029;

    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      const y = (t - 0.5) * height;
      const ang = t * Math.PI * 2 * turns + phase;

      const endDist = Math.min(t, 1 - t);
      const capScale =
        endDist < 0.04 ? Math.sin((endDist / 0.04) * (Math.PI / 2)) * 0.68 + 0.32 : 1.0;
      const waist = 0.94 + 0.06 * Math.sin(t * Math.PI);
      const r = radius * waist;

      const cx = Math.cos(ang) * r;
      const cz = Math.sin(ang) * r;
      const rx = Math.cos(ang);
      const rz = Math.sin(ang);

      for (let j = 0; j <= profilePts; j++) {
        const a = (j / profilePts) * Math.PI * 2;
        const ca = Math.cos(a);
        const sa = Math.sin(a);
        const superX = Math.sign(ca) * Math.pow(Math.abs(ca), 0.62);
        const superY = Math.sign(sa) * Math.pow(Math.abs(sa), 0.56);
        const groove = ca > 0.4 ? -0.004 * Math.cos(sa * Math.PI * 0.5) : 0;

        const dr = (superX * halfT + groove) * capScale;
        const dy = superY * halfW * capScale;

        positions.push(cx + rx * dr, y + dy, cz + rz * dr);
        uvs.push(j / profilePts, t * 4.0);
      }
    }

    const stride = profilePts + 1;
    for (let i = 0; i < segs; i++) {
      for (let j = 0; j < profilePts; j++) {
        const a = i * stride + j;
        const b = a + 1;
        const c = (i + 1) * stride + j;
        const d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }

  function makeEllipseCurve(rx: number, ry: number): THREE.CatmullRomCurve3 {
    const pts: THREE.Vector3[] = [];
    const segs = 200;
    for (let i = 0; i < segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * rx, Math.sin(a) * ry, 0));
    }
    return new THREE.CatmullRomCurve3(pts, true);
  }

  function buildDashedOrbit(
    rx: number,
    ry: number,
    dashCount: number,
    tubeRadius: number,
    mat: THREE.Material
  ): THREE.Group {
    const group = new THREE.Group();
    const dashArc = (Math.PI * 2) / dashCount;
    const fillFraction = 0.46;
    const subSegs = 6;

    for (let i = 0; i < dashCount; i++) {
      const a0 = i * dashArc;
      const pts: THREE.Vector3[] = [];
      for (let s = 0; s <= subSegs; s++) {
        const a = a0 + (s / subSegs) * dashArc * fillFraction;
        pts.push(new THREE.Vector3(Math.cos(a) * rx, Math.sin(a) * ry, 0));
      }
      const curve = new THREE.CatmullRomCurve3(pts);
      const geo = new THREE.TubeGeometry(curve, 6, tubeRadius, 8, false);
      group.add(new THREE.Mesh(geo, mat));
    }
    return group;
  }

  onMount(() => {
    if (!hostEl) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    hostEl.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = null;
    const envTex = createStudioCycloramaEnv(renderer);
    scene.environment = envTex;

    const camera = new THREE.PerspectiveCamera(34, 16 / 10.5, 0.1, 80);
    camera.position.set(0, 0.08, 5.2);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.enableZoom = false;

    // Calibrated directional studio lights
    const keyLight = new THREE.DirectionalLight(0xdcecff, 2.2);
    keyLight.position.set(4.2, 5.6, 5.2);
    const rimLeft = new THREE.DirectionalLight(0x38bdf8, 1.5);
    rimLeft.position.set(-5.2, 2.0, 2.8);
    const violetBack = new THREE.DirectionalLight(0xc898ff, 1.3);
    violetBack.position.set(0.0, -3.4, -4.8);
    scene.add(new THREE.AmbientLight(0x161828, 0.55), keyLight, rimLeft, violetBack);

    const root = new THREE.Group();
    scene.add(root);

    const tiMaps = createBrushedMetalMaps(1337, 0.88, 2200, 0.38);
    const silverMaps = createBrushedMetalMaps(7919, 0.34, 850, 0.0);

    // 1. CNC-Brushed Obsidian Black Titanium Helix Material
    const titaniumMat = new THREE.MeshPhysicalMaterial({
      color: 0x1b2232,
      metalness: 0.94,
      roughness: 0.3,
      roughnessMap: tiMaps.roughnessMap,
      bumpMap: tiMaps.bumpMap,
      bumpScale: 0.018,
      clearcoat: 0.34,
      clearcoatRoughness: 0.2,
      envMapIntensity: 1.8,
    });

    const pinMetalMat = new THREE.MeshPhysicalMaterial({
      color: 0x334155,
      metalness: 0.96,
      roughness: 0.2,
      clearcoat: 0.45,
      envMapIntensity: 1.7,
    });

    // 2. Hairline Satin Silver-Cobalt Orbit Material
    const silverCobaltMat = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      emissive: 0x0b2a5b,
      emissiveIntensity: 0.2,
      metalness: 0.98,
      roughness: 0.16,
      roughnessMap: silverMaps.roughnessMap,
      bumpMap: silverMaps.bumpMap,
      bumpScale: 0.003,
      clearcoat: 0.6,
      clearcoatRoughness: 0.12,
      envMapIntensity: 1.9,
    });

    const dashedOrbitMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      emissive: 0x00f5a0,
      emissiveIntensity: 0.28,
      metalness: 0.94,
      roughness: 0.2,
      transparent: true,
      opacity: 0.84,
      envMapIntensity: 1.6,
    });

    // 3. Translucent Faceted Sapphire-Violet Crystal Cage
    const crystalFaceMat = new THREE.MeshPhysicalMaterial({
      color: 0x3b1d8e,
      emissive: 0x140b44,
      emissiveIntensity: 0.38,
      metalness: 0.08,
      roughness: 0.06,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      transparent: true,
      opacity: 0.14,
      depthWrite: false,
      side: THREE.DoubleSide,
      envMapIntensity: 1.55,
    });

    const crystalEdgeMat = new THREE.MeshPhysicalMaterial({
      color: 0xcba0ff,
      emissive: 0x7c3aed,
      emissiveIntensity: 0.78,
      metalness: 0.38,
      roughness: 0.14,
      clearcoat: 0.9,
      transparent: true,
      opacity: 0.86,
    });

    const vertexNodeMat = new THREE.MeshPhysicalMaterial({
      color: 0xe2e8f0,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.95,
      roughness: 0.12,
      metalness: 0.45,
    });

    // Build inner Obsidian Titanium Double-Helix DNA
    const dnaGroup = new THREE.Group();
    root.add(dnaGroup);

    const helixRadius = 0.29;
    const helixHeight = 1.72;
    const helixTurns = 1.52;
    dnaGroup.add(
      new THREE.Mesh(buildSculptedTitaniumHelix(0, helixRadius, helixHeight, helixTurns), titaniumMat),
      new THREE.Mesh(buildSculptedTitaniumHelix(Math.PI, helixRadius, helixHeight, helixTurns), titaniumMat)
    );

    const innerLights: THREE.PointLight[] = [];
    [-0.56, 0.0, 0.56].forEach((yPos, idx) => {
      const col = idx === 1 ? 0x00f5a0 : 0x38bdf8;
      const pl = new THREE.PointLight(col, 0.65, 1.05, 2.4);
      pl.position.set(0, yPos, 0);
      dnaGroup.add(pl);
      innerLights.push(pl);
    });

    const rungCount = 13; // 12 rungs inside helix
    const pinGeo = new THREE.CylinderGeometry(0.012, 0.012, 1.0, 14);
    pinGeo.rotateZ(Math.PI / 2);
    const collarGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.016, 16);
    collarGeo.rotateZ(Math.PI / 2);
    const coreGeo = new THREE.CylinderGeometry(0.021, 0.021, 0.095, 16);
    coreGeo.rotateZ(Math.PI / 2);

    interface CapsuleNode {
      coreMat: THREE.MeshPhysicalMaterial;
      normY: number;
    }
    const capsules: CapsuleNode[] = [];

    for (let i = 1; i < rungCount; i++) {
      const t = i / rungCount;
      const y = (t - 0.5) * helixHeight;
      const ang = t * Math.PI * 2 * helixTurns;
      const waist = 0.94 + 0.06 * Math.sin(t * Math.PI);
      const r = helixRadius * waist;

      const pair = new THREE.Group();
      pair.position.y = y;
      pair.rotation.y = -ang;

      const rodLen = Math.max(0.06, r - 0.056);
      const leftPin = new THREE.Mesh(pinGeo, pinMetalMat);
      leftPin.scale.x = rodLen;
      leftPin.position.x = -(0.056 + rodLen * 0.5);

      const rightPin = new THREE.Mesh(pinGeo, pinMetalMat);
      rightPin.scale.x = rodLen;
      rightPin.position.x = 0.056 + rodLen * 0.5;

      const collarL = new THREE.Mesh(collarGeo, pinMetalMat);
      collarL.position.x = -0.056;
      const collarR = new THREE.Mesh(collarGeo, pinMetalMat);
      collarR.position.x = 0.056;

      const coreMat = new THREE.MeshPhysicalMaterial({
        color: 0xe6ffff,
        emissive: i % 2 === 0 ? 0x00f5a0 : 0x38bdf8,
        emissiveIntensity: 1.25,
        roughness: 0.1,
        metalness: 0.05,
        clearcoat: 1.0,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);

      pair.add(leftPin, rightPin, collarL, collarR, coreMesh);
      dnaGroup.add(pair);
      capsules.push({ coreMat, normY: t });
    }

    // Build Outer Translucent Faceted Sapphire-Violet Crystal Icosahedron Cage
    const crystalGroup = new THREE.Group();
    crystalGroup.rotation.set(0.22, 0.34, 0.08);
    root.add(crystalGroup);

    const icoRadius = 1.36;
    const icoGeo = new THREE.IcosahedronGeometry(icoRadius, 0);
    const facetMesh = new THREE.Mesh(icoGeo, crystalFaceMat);
    facetMesh.renderOrder = 2;
    crystalGroup.add(facetMesh);

    const edgesGeo = new THREE.EdgesGeometry(icoGeo);
    const posAttr = edgesGeo.attributes.position;
    const edgeRadius = 0.0052;
    const up = new THREE.Vector3(0, 1, 0);
    const uniqueVerts = new Map<string, THREE.Vector3>();

    for (let i = 0; i < posAttr.count; i += 2) {
      const a = new THREE.Vector3().fromBufferAttribute(posAttr, i);
      const b = new THREE.Vector3().fromBufferAttribute(posAttr, i + 1);
      uniqueVerts.set(`${a.x.toFixed(3)},${a.y.toFixed(3)},${a.z.toFixed(3)}`, a);
      uniqueVerts.set(`${b.x.toFixed(3)},${b.y.toFixed(3)},${b.z.toFixed(3)}`, b);

      const dir = new THREE.Vector3().subVectors(b, a);
      const len = dir.length();
      const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);

      const strutGeo = new THREE.CylinderGeometry(edgeRadius, edgeRadius, len, 10, 1);
      const strut = new THREE.Mesh(strutGeo, crystalEdgeMat);
      strut.position.copy(mid);
      strut.quaternion.setFromUnitVectors(up, dir.normalize());
      crystalGroup.add(strut);
    }
    edgesGeo.dispose();

    const nodeGeo = new THREE.OctahedronGeometry(0.017, 0);
    uniqueVerts.forEach((v) => {
      const node = new THREE.Mesh(nodeGeo, vertexNodeMat);
      node.position.copy(v);
      crystalGroup.add(node);
    });

    // Build Sweeping Satin Silver-Cobalt Ellipses + Precision-Dashed Equatorial Orbit
    const orbitGroup = new THREE.Group();
    root.add(orbitGroup);

    const orbitA = new THREE.Mesh(
      new THREE.TubeGeometry(makeEllipseCurve(1.98, 0.96), 200, 0.011, 16, true),
      silverCobaltMat
    );
    const holderA = new THREE.Group();
    holderA.rotation.set(0.24, -0.18, 0.58);
    holderA.add(orbitA);

    const orbitB = new THREE.Mesh(
      new THREE.TubeGeometry(makeEllipseCurve(1.94, 0.92), 200, 0.01, 16, true),
      silverCobaltMat
    );
    const holderB = new THREE.Group();
    holderB.rotation.set(-0.22, 0.22, -0.62);
    holderB.add(orbitB);

    const dashedRing = buildDashedOrbit(2.08, 2.08, 64, 0.0072, dashedOrbitMat);
    dashedRing.rotation.x = Math.PI / 2;
    const holderEq = new THREE.Group();
    holderEq.rotation.set(0.24, 0.0, 0.04);
    holderEq.add(dashedRing);

    orbitGroup.add(holderA, holderB, holderEq);

    // Subtle ambient starlight motes
    const starCount = 72;
    const starPos = new Float32Array(starCount * 3);
    const starCol = new Float32Array(starCount * 3);
    const c1 = new THREE.Color(0x00f5a0);
    const c2 = new THREE.Color(0x38bdf8);
    const c3 = new THREE.Color(0xfcc1f4);
    for (let i = 0; i < starCount; i++) {
      const r = 2.4 + Math.random() * 2.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.cos(phi);
      starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) - 0.6;
      const pick = i % 3 === 0 ? c1 : i % 3 === 1 ? c2 : c3;
      starCol[i * 3] = pick.r;
      starCol[i * 3 + 1] = pick.g;
      starCol[i * 3 + 2] = pick.b;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starCol, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.026,
      vertexColors: true,
      transparent: true,
      opacity: 0.58,
      depthWrite: false,
    });
    const starField = new THREE.Points(starGeo, starMat);
    root.add(starField);

    let pointerX = 0;
    let pointerY = 0;
    let visible = true;
    let rafId = 0;

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

    const onDown = () => {
      isInteracting = true;
    };
    const onUp = () => {
      isInteracting = false;
    };
    const onMove = (e: PointerEvent) => {
      const rect = hostEl?.getBoundingClientRect();
      if (!rect) return;
      pointerX = THREE.MathUtils.clamp(((e.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1);
      pointerY = THREE.MathUtils.clamp(-((e.clientY - rect.top) / rect.height - 0.5) * 2, -1, 1);
    };

    hostEl.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointermove', onMove, { passive: true });

    const t0 = performance.now();
    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      if (!visible) return;

      const t = (now - t0) * 0.001;
      if (!reducedMotion) {
        // Inner titanium helix rotates gracefully
        dnaGroup.rotation.y = t * 0.26;
        dnaGroup.rotation.x = pointerY * 0.08;

        // Outer translucent sapphire-violet crystal cage counter-rotates smoothly
        crystalGroup.rotation.y = 0.34 - t * 0.16 + pointerX * 0.14;
        crystalGroup.rotation.x = 0.22 + Math.sin(t * 0.24) * 0.08 + pointerY * 0.1;

        // Sweeping satin orbits + dashed equatorial ring
        orbitA.rotation.y = t * 0.14;
        orbitB.rotation.y = -t * 0.12;
        dashedRing.rotation.y = t * 0.18;

        // Subtle pulse wave up the 12 quantum core capsules
        const pulseY = ((t * 0.45) % 1.4) - 0.2;
        for (let i = 0; i < capsules.length; i++) {
          const cap = capsules[i];
          const dist = Math.abs(cap.normY - pulseY);
          const wave = Math.exp(-dist * dist * 22);
          cap.coreMat.emissiveIntensity = 1.15 + 0.18 * Math.sin(t * 2.2 + i * 0.5) + wave * 1.1;
        }

        starField.rotation.y = t * 0.025;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      hostEl?.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointermove', onMove);
      ro.disconnect();
      io.disconnect();
      controls.dispose();
      envTex.dispose();
      tiMaps.bumpMap.dispose();
      tiMaps.roughnessMap.dispose();
      silverMaps.bumpMap.dispose();
      silverMaps.roughnessMap.dispose();
      root.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          if (Array.isArray(mesh.material)) mesh.material.forEach((m) => m.dispose());
          else mesh.material.dispose();
        }
      });
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
  aria-label="Interactive 360-degree watchmaker PBR 3D titanium helix inside faceted sapphire crystal cage"
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
    width: 68%;
    height: 60%;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(1, 106, 212, 0.24) 0%,
      rgba(124, 58, 237, 0.16) 44%,
      rgba(0, 245, 160, 0.08) 68%,
      transparent 82%
    );
    filter: blur(46px);
    pointer-events: none;
    z-index: 1;
  }
</style>
