import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Sparkles, Coffee, RefreshCw } from 'lucide-react';

export type DrinkFlavor = 'latte' | 'cappuccino' | 'caramel' | 'matcha' | 'espresso';
export type CameraPreset = 'orbit' | 'latte-art' | 'side';

interface CoffeeCup3DProps {
  className?: string;
}

// Procedural high-resolution Canvas texture for authentic barista latte art
function createLatteArtTexture(flavor: DrinkFlavor): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const cx = 512;
  const cy = 512;
  const radius = 500;

  // 1. Base espresso crema radial gradient
  const cremaGrad = ctx.createRadialGradient(cx, cy, 50, cx, cy, radius);
  if (flavor === 'matcha') {
    cremaGrad.addColorStop(0, '#7EA672');
    cremaGrad.addColorStop(0.5, '#4B7340');
    cremaGrad.addColorStop(0.85, '#2D4E24');
    cremaGrad.addColorStop(1, '#1E3817');
  } else if (flavor === 'caramel') {
    cremaGrad.addColorStop(0, '#C27C38');
    cremaGrad.addColorStop(0.45, '#8A4A1C');
    cremaGrad.addColorStop(0.85, '#4A210A');
    cremaGrad.addColorStop(1, '#281005');
  } else if (flavor === 'espresso') {
    cremaGrad.addColorStop(0, '#9E5B26');
    cremaGrad.addColorStop(0.5, '#5C2D0C');
    cremaGrad.addColorStop(0.85, '#2E1305');
    cremaGrad.addColorStop(1, '#160802');
  } else if (flavor === 'cappuccino') {
    cremaGrad.addColorStop(0, '#B37842');
    cremaGrad.addColorStop(0.55, '#6C3915');
    cremaGrad.addColorStop(0.85, '#3D1C08');
    cremaGrad.addColorStop(1, '#220E04');
  } else {
    // Classic Latte
    cremaGrad.addColorStop(0, '#A66832');
    cremaGrad.addColorStop(0.5, '#693714');
    cremaGrad.addColorStop(0.85, '#3B1B08');
    cremaGrad.addColorStop(1, '#220D04');
  }

  ctx.fillStyle = cremaGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  // 2. Subtle micro-foam marbled swirls
  ctx.save();
  for (let i = 0; i < 48; i++) {
    const angle = (i / 48) * Math.PI * 2;
    const r1 = 120 + Math.sin(i * 3.5) * 80;
    const r2 = 320 + Math.cos(i * 2.1) * 110;
    const px1 = cx + Math.cos(angle) * r1;
    const py1 = cy + Math.sin(angle) * r1;
    const px2 = cx + Math.cos(angle + 0.3) * r2;
    const py2 = cy + Math.sin(angle + 0.3) * r2;

    const swirlGrad = ctx.createLinearGradient(px1, py1, px2, py2);
    swirlGrad.addColorStop(0, 'rgba(255, 245, 230, 0.25)');
    swirlGrad.addColorStop(0.5, 'rgba(220, 180, 140, 0.15)');
    swirlGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.strokeStyle = swirlGrad;
    ctx.lineWidth = 14 + Math.sin(i) * 8;
    ctx.beginPath();
    ctx.moveTo(px1, py1);
    ctx.quadraticCurveTo(cx + Math.cos(angle + 0.5) * 220, cy + Math.sin(angle + 0.5) * 220, px2, py2);
    ctx.stroke();
  }
  ctx.restore();

  // 3. Iconic Barista Latte Art: Heart / Rosette
  if (flavor !== 'espresso') {
    ctx.save();
    const milkColor = flavor === 'matcha' ? 'rgba(240, 252, 235, 0.95)' : 'rgba(255, 250, 242, 0.95)';
    const milkShadow = flavor === 'matcha' ? 'rgba(50, 80, 40, 0.4)' : 'rgba(80, 35, 10, 0.4)';

    ctx.shadowColor = milkShadow;
    ctx.shadowBlur = 12;

    // Outer leaf heart lobes
    for (let layer = 7; layer >= 1; layer--) {
      const scale = layer / 7;
      const yOffset = cy - 30 + (7 - layer) * 26;
      const lobeWidth = 140 * scale;
      const lobeHeight = 110 * scale;

      ctx.fillStyle = milkColor;
      ctx.beginPath();
      // Left lobe
      ctx.bezierCurveTo(
        cx - lobeWidth * 1.5,
        yOffset - lobeHeight * 0.8,
        cx - lobeWidth * 1.8,
        yOffset + lobeHeight * 0.5,
        cx,
        yOffset + lobeHeight
      );
      // Right lobe
      ctx.bezierCurveTo(
        cx + lobeWidth * 1.8,
        yOffset + lobeHeight * 0.5,
        cx + lobeWidth * 1.5,
        yOffset - lobeHeight * 0.8,
        cx,
        yOffset - lobeHeight * 0.2
      );
      ctx.fill();
    }

    // Central heart pull-through stroke (barista needle drag)
    const dragGrad = ctx.createLinearGradient(cx, cy - 180, cx, cy + 220);
    dragGrad.addColorStop(0, flavor === 'matcha' ? '#2D4E24' : '#3B1B08');
    dragGrad.addColorStop(0.5, flavor === 'matcha' ? '#4B7340' : '#693714');
    dragGrad.addColorStop(1, milkColor);

    ctx.strokeStyle = dragGrad;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx, cy - 150);
    ctx.lineTo(cx, cy + 180);
    ctx.stroke();

    // Top heart crown drop
    ctx.fillStyle = milkColor;
    ctx.beginPath();
    ctx.arc(cx, cy - 155, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // 4. Flavor-specific topping garnishes
  if (flavor === 'cappuccino') {
    // Dusted organic cocoa powder specks
    ctx.save();
    for (let i = 0; i < 900; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.pow(Math.random(), 0.6) * 320;
      const px = cx + Math.cos(angle) * dist;
      const py = cy + Math.sin(angle) * dist;
      const size = Math.random() * 2.8 + 0.6;
      ctx.fillStyle = Math.random() > 0.4 ? 'rgba(40, 16, 8, 0.88)' : 'rgba(85, 38, 16, 0.7)';
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  } else if (flavor === 'caramel') {
    // Caramel crosshatch syrup drizzle ribbons
    ctx.save();
    ctx.strokeStyle = 'rgba(215, 128, 38, 0.85)';
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.shadowColor = 'rgba(60, 20, 4, 0.5)';
    ctx.shadowBlur = 8;

    for (let d = -3; d <= 3; d++) {
      ctx.beginPath();
      const offset = d * 65;
      ctx.moveTo(cx - 240, cy + offset - 40);
      ctx.bezierCurveTo(cx - 80, cy + offset + 40, cx + 80, cy + offset - 40, cx + 240, cy + offset + 40);
      ctx.stroke();
    }
    ctx.restore();
  }

  // 5. Cup rim crema meniscus shadow
  const rimGrad = ctx.createRadialGradient(cx, cy, radius - 60, cx, cy, radius);
  rimGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  rimGrad.addColorStop(1, 'rgba(25, 8, 2, 0.6)');
  ctx.fillStyle = rimGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  return texture;
}

export const CoffeeCup3D: React.FC<CoffeeCup3DProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [flavor, setFlavor] = useState<DrinkFlavor>('latte');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('orbit');
  const [isRotating, setIsRotating] = useState(true);
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  const isRotatingRef = useRef(isRotating);
  isRotatingRef.current = isRotating;

  const cameraPresetRef = useRef(cameraPreset);
  cameraPresetRef.current = cameraPreset;

  const liquidMeshRef = useRef<THREE.Mesh | null>(null);
  const steamGroupRef = useRef<THREE.Group | null>(null);
  const cupGroupRef = useRef<THREE.Group | null>(null);
  const spin360ActionRef = useRef<() => void>(() => {});

  // Update drink liquid texture dynamically on flavor change
  useEffect(() => {
    if (liquidMeshRef.current) {
      const newTexture = createLatteArtTexture(flavor);
      const mat = liquidMeshRef.current.material as THREE.MeshStandardMaterial;
      if (mat.map) mat.map.dispose();
      mat.map = newTexture;
      mat.needsUpdate = true;
    }
  }, [flavor]);

  useEffect(() => {
    if (steamGroupRef.current) {
      steamGroupRef.current.visible = !isLowPowerMode;
    }
  }, [isLowPowerMode]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglSupported(false);
      return;
    }

    const initialWidth = container.clientWidth || 360;
    const initialHeight = container.clientHeight || 360;
    let currentAspectRatio = initialWidth / initialHeight;

    const scene = new THREE.Scene();

    const initialFov = currentAspectRatio < 1 ? 48 : 42;
    const camera = new THREE.PerspectiveCamera(initialFov, currentAspectRatio, 0.1, 100);
    camera.position.set(0, 2.4, currentAspectRatio < 1 ? 5.4 : 4.6);
    camera.lookAt(0, 0.65, 0);

    renderer.setSize(initialWidth, initialHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Master cup group (rotatable by user)
    const cupGroup = new THREE.Group();
    cupGroup.scale.set(0.72, 0.72, 0.72);
    cupGroupRef.current = cupGroup;
    scene.add(cupGroup);

    // --- 1. TWO-TONE CERAMIC MATERIALS ---
    // Outer Shell: Premium dark-roast espresso satin ceramic with clearcoat
    const outerCeramicMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e100a,
      roughness: 0.18,
      metalness: 0.05,
      clearcoat: 0.88,
      clearcoatRoughness: 0.08,
      reflectivity: 0.6,
    });

    // Inner Shell: Lustrous warm cream/ivory porcelain
    const innerCeramicMat = new THREE.MeshPhysicalMaterial({
      color: 0xfaf5ec,
      roughness: 0.12,
      metalness: 0.02,
      clearcoat: 0.95,
      clearcoatRoughness: 0.04,
    });

    // Gold trim accent material
    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xd49a6a,
      roughness: 0.25,
      metalness: 0.85,
    });

    // --- 2. CERAMIC CUP GEOMETRY (Lathe) ---
    // Outer Cup Body Profile
    const outerPoints: THREE.Vector2[] = [];
    outerPoints.push(new THREE.Vector2(0, 0.08));
    outerPoints.push(new THREE.Vector2(0.72, 0.08)); // Foot base
    outerPoints.push(new THREE.Vector2(0.78, 0.14));
    outerPoints.push(new THREE.Vector2(0.85, 0.45));
    outerPoints.push(new THREE.Vector2(1.02, 1.05));
    outerPoints.push(new THREE.Vector2(1.22, 1.62));
    outerPoints.push(new THREE.Vector2(1.36, 1.96)); // Flared lip
    outerPoints.push(new THREE.Vector2(1.34, 1.99)); // Rounded rim top
    outerPoints.push(new THREE.Vector2(1.31, 1.98));

    const outerGeo = new THREE.LatheGeometry(outerPoints, 52);
    const outerMesh = new THREE.Mesh(outerGeo, outerCeramicMat);
    outerMesh.castShadow = true;
    outerMesh.receiveShadow = true;
    cupGroup.add(outerMesh);

    // Inner Cup Porcelain Lining Profile
    const innerPoints: THREE.Vector2[] = [];
    innerPoints.push(new THREE.Vector2(0, 0.18));
    innerPoints.push(new THREE.Vector2(0.64, 0.18));
    innerPoints.push(new THREE.Vector2(0.75, 0.45));
    innerPoints.push(new THREE.Vector2(0.92, 1.05));
    innerPoints.push(new THREE.Vector2(1.12, 1.62));
    innerPoints.push(new THREE.Vector2(1.28, 1.95));
    innerPoints.push(new THREE.Vector2(1.31, 1.98));

    const innerGeo = new THREE.LatheGeometry(innerPoints, 52);
    const innerMesh = new THREE.Mesh(innerGeo, innerCeramicMat);
    innerMesh.receiveShadow = true;
    cupGroup.add(innerMesh);

    // --- 3. BARISTA CUP HANDLE ---
    const handleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.14, 1.62, 0),
      new THREE.Vector3(1.68, 1.52, 0),
      new THREE.Vector3(1.78, 1.08, 0),
      new THREE.Vector3(1.48, 0.65, 0),
      new THREE.Vector3(0.92, 0.58, 0),
    ]);
    const handleGeo = new THREE.TubeGeometry(handleCurve, 42, 0.088, 16, false);
    const handleMesh = new THREE.Mesh(handleGeo, outerCeramicMat);
    handleMesh.castShadow = true;
    cupGroup.add(handleMesh);

    // --- 4. LIQUID COFFEE WITH LATTE ART ---
    const liquidGeo = new THREE.CircleGeometry(1.24, 48);
    const liquidTex = createLatteArtTexture(flavor);
    const liquidMat = new THREE.MeshStandardMaterial({
      map: liquidTex,
      roughness: 0.32,
      metalness: 0.04,
    });
    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    liquidMesh.rotation.x = -Math.PI / 2;
    liquidMesh.position.y = 1.88;
    liquidMesh.receiveShadow = true;
    liquidMeshRef.current = liquidMesh;
    cupGroup.add(liquidMesh);

    // Subtle liquid surface meniscus ring
    const meniscusGeo = new THREE.TorusGeometry(1.23, 0.022, 12, 48);
    const meniscusMat = new THREE.MeshStandardMaterial({
      color: 0x42200e,
      roughness: 0.2,
      metalness: 0.1,
    });
    const meniscusMesh = new THREE.Mesh(meniscusGeo, meniscusMat);
    meniscusMesh.rotation.x = Math.PI / 2;
    meniscusMesh.position.y = 1.885;
    cupGroup.add(meniscusMesh);

    // --- 5. MATCHING CERAMIC SAUCER PLATE WITH GOLD TRIM ---
    const saucerPoints: THREE.Vector2[] = [];
    saucerPoints.push(new THREE.Vector2(0, 0.0));
    saucerPoints.push(new THREE.Vector2(1.1, 0.0));
    saucerPoints.push(new THREE.Vector2(1.85, 0.06));
    saucerPoints.push(new THREE.Vector2(2.18, 0.24));
    saucerPoints.push(new THREE.Vector2(2.26, 0.28)); // Saucer rim peak
    saucerPoints.push(new THREE.Vector2(2.24, 0.25));
    saucerPoints.push(new THREE.Vector2(1.78, 0.045));
    saucerPoints.push(new THREE.Vector2(0.85, 0.045)); // Cup center well
    saucerPoints.push(new THREE.Vector2(0, 0.045));

    const saucerGeo = new THREE.LatheGeometry(saucerPoints, 52);
    const saucerMesh = new THREE.Mesh(saucerGeo, outerCeramicMat);
    saucerMesh.castShadow = true;
    saucerMesh.receiveShadow = true;
    saucerMesh.position.y = 0.035;
    cupGroup.add(saucerMesh);

    // Saucer Gold Trim Ring
    const goldRingGeo = new THREE.TorusGeometry(1.98, 0.015, 12, 52);
    const goldRingMesh = new THREE.Mesh(goldRingGeo, goldTrimMat);
    goldRingMesh.rotation.x = Math.PI / 2;
    goldRingMesh.position.y = 0.175;
    cupGroup.add(goldRingMesh);

    // --- 6. BILLOWING STEAM PARTICLES ---
    const steamGroup = new THREE.Group();
    steamGroupRef.current = steamGroup;
    cupGroup.add(steamGroup);

    const STEAM_COUNT = 18;
    const steamPositions = new Float32Array(STEAM_COUNT * 3);
    const steamVels: { x: number; y: number; z: number; phase: number }[] = [];

    for (let i = 0; i < STEAM_COUNT; i++) {
      steamPositions[i * 3] = (Math.random() - 0.5) * 0.7;
      steamPositions[i * 3 + 1] = 1.9 + Math.random() * 1.5;
      steamPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.7;

      steamVels.push({
        x: (Math.random() - 0.5) * 0.003,
        y: 0.006 + Math.random() * 0.005,
        z: (Math.random() - 0.5) * 0.003,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const steamGeo = new THREE.BufferGeometry();
    steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPositions, 3));

    const steamCanvas = document.createElement('canvas');
    steamCanvas.width = 64;
    steamCanvas.height = 64;
    const sCtx = steamCanvas.getContext('2d')!;
    const sGrad = sCtx.createRadialGradient(32, 32, 0, 32, 32, 30);
    sGrad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
    sGrad.addColorStop(0.5, 'rgba(255, 245, 230, 0.2)');
    sGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 64, 64);

    const steamTexture = new THREE.CanvasTexture(steamCanvas);
    const steamMat = new THREE.PointsMaterial({
      size: 0.6,
      map: steamTexture,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const steamParticles = new THREE.Points(steamGeo, steamMat);
    steamGroup.add(steamParticles);

    // --- 8. SOFT DROP SHADOW FLOOR PLANE ---
    const shadowGeo = new THREE.PlaneGeometry(5.8, 5.8);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const shCtx = shadowCanvas.getContext('2d')!;
    const shGrad = shCtx.createRadialGradient(64, 64, 15, 64, 64, 62);
    shGrad.addColorStop(0, 'rgba(20, 8, 4, 0.65)');
    shGrad.addColorStop(0.5, 'rgba(20, 8, 4, 0.25)');
    shGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    shCtx.fillStyle = shGrad;
    shCtx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.01;
    scene.add(shadowPlane);

    // --- 9. STUDIO LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff0dd, 3.2);
    keyLight.position.set(4.5, 7.5, 4.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xe88a38, 2.2);
    rimLight.position.set(-4.5, 3.5, -3.5);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xd4752b, 1.4, 8);
    fillLight.position.set(0, 0.8, 2.2);
    scene.add(fillLight);

    // --- 9. INTERACTIVE DRAG & ROTATE WITH FULL 360° FREEDOM & INERTIA ---
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let velX = 0;
    let velY = 0;

    // Trigger full 360-degree hero spin programmatically
    spin360ActionRef.current = () => {
      velX = 0.18;
      velY = 0.03;
      if (cupGroupRef.current) {
        cupGroupRef.current.rotation.y += Math.PI * 0.25;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
      velX = 0;
      velY = 0;

      if (mountRef.current) {
        mountRef.current.style.cursor = 'grabbing';
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;

      if (cupGroupRef.current) {
        // True 360-degree rotation without clamped pitch barriers
        velX = dx * 0.009;
        velY = dy * 0.007;

        cupGroupRef.current.rotation.y += velX;
        // Allows full 360° tilt while keeping view comfortable
        cupGroupRef.current.rotation.x = Math.max(-1.1, Math.min(1.1, cupGroupRef.current.rotation.x + velY));
      }

      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
      if (mountRef.current) {
        mountRef.current.style.cursor = 'grab';
      }
    };

    const dom = renderer.domElement;
    dom.style.touchAction = 'none';
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    // Resize Observer
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const newW = entry.contentRect.width;
          const newH = entry.contentRect.height;
          if (newW > 0 && newH > 0) {
            currentAspectRatio = newW / newH;
            camera.aspect = currentAspectRatio;
            camera.fov = currentAspectRatio < 1 ? 48 : 42;
            camera.updateProjectionMatrix();
            renderer.setSize(newW, newH);
          }
        }
      });
      resizeObserver.observe(container);
    }

    // Viewport-aware visibility observer
    let isVisible = true;
    let intersectionObserver: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;
        },
        { threshold: 0.05 }
      );
      intersectionObserver.observe(container);
    }

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // --- 11. ANIMATION LOOP ---
    let animId: number;
    const clock = new THREE.Clock();
    const targetCameraPos = new THREE.Vector3();
    const targetLookAt = new THREE.Vector3(0, 0.65, 0);

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const time = clock.getElapsedTime();

      // Camera preset transitions
      if (cameraPresetRef.current === 'latte-art') {
        targetCameraPos.set(0, 3.4, 0.05);
        targetLookAt.set(0, 1.35, 0);
      } else if (cameraPresetRef.current === 'side') {
        targetCameraPos.set(0, 1.0, currentAspectRatio < 1 ? 5.0 : 4.4);
        targetLookAt.set(0, 0.7, 0);
      } else {
        targetCameraPos.set(0, 2.4, currentAspectRatio < 1 ? 5.4 : 4.6);
        targetLookAt.set(0, 0.65, 0);
      }

      camera.position.lerp(targetCameraPos, 0.05);
      camera.lookAt(targetLookAt);

      // Auto-rotation & inertia damping
      if (cupGroupRef.current) {
        if (!isDragging && isRotatingRef.current) {
          cupGroupRef.current.rotation.y += 0.007;
          cupGroupRef.current.rotation.x = THREE.MathUtils.lerp(cupGroupRef.current.rotation.x, 0.06, 0.03);
        } else if (!isDragging) {
          velX *= 0.94;
          velY *= 0.94;
          cupGroupRef.current.rotation.y += velX;
          cupGroupRef.current.rotation.x += velY;
        }
      }

      // Steam particle animation
      if (steamGroupRef.current && steamGroupRef.current.visible) {
        const posAttr = steamGeo.attributes.position as THREE.BufferAttribute;
        const posArr = posAttr.array as Float32Array;

        for (let i = 0; i < STEAM_COUNT; i++) {
          const vel = steamVels[i];
          posArr[i * 3 + 1] += vel.y;
          posArr[i * 3] += Math.sin(time * 1.5 + vel.phase) * 0.002;

          if (posArr[i * 3 + 1] > 3.8) {
            posArr[i * 3 + 1] = 1.9;
            posArr[i * 3] = (Math.random() - 0.5) * 0.7;
            posArr[i * 3 + 2] = (Math.random() - 0.5) * 0.7;
          }
        }
        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      if (resizeObserver && container) {
        resizeObserver.unobserve(container);
      }
      if (intersectionObserver && container) {
        intersectionObserver.unobserve(container);
      }

      // Memory and GPU Resource Disposal
      outerGeo.dispose();
      innerGeo.dispose();
      handleGeo.dispose();
      liquidGeo.dispose();
      meniscusGeo.dispose();
      saucerGeo.dispose();
      goldRingGeo.dispose();
      shadowGeo.dispose();
      steamGeo.dispose();

      outerCeramicMat.dispose();
      innerCeramicMat.dispose();
      goldTrimMat.dispose();
      if (liquidMat.map) liquidMat.map.dispose();
      liquidMat.dispose();
      meniscusMat.dispose();
      shadowMat.dispose();
      shadowTex.dispose();
      steamMat.dispose();
      steamTexture.dispose();

      renderer.dispose();
      if (container.contains(dom)) {
        container.removeChild(dom);
      }
    };
  }, []);

  const handleSpin360 = () => {
    spin360ActionRef.current();
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* 3D Canvas Mount Point */}
      {webglSupported ? (
        <div
          ref={mountRef}
          className="relative w-full h-80 sm:h-[400px] cursor-grab active:cursor-grabbing touch-none flex items-center justify-center overflow-hidden rounded-3xl"
          title="Interactive 3D Coffee Cup: Drag 360° to inspect drink &amp; latte art"
        >
          {/* Subtle warm glow accent under cup */}
          <div className="absolute w-56 sm:w-64 h-56 sm:h-64 rounded-full bg-roast-amber/15 dark:bg-roast-amber/10 blur-3xl pointer-events-none -bottom-8" />

          {/* Quick 360 Floating Badge */}
          <button
            onClick={handleSpin360}
            className="absolute top-4 right-4 z-20 px-2.5 py-1 rounded-full bg-coffee-900/80 hover:bg-coffee-900 text-white dark:bg-coffee-950/80 dark:hover:bg-coffee-950 border border-coffee-700/60 backdrop-blur-md text-[11px] font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-transform"
            title="Perform 360° rotation spin"
          >
            <RefreshCw className="w-3 h-3 text-roast-amber animate-spin" style={{ animationDuration: '8s' }} />
            <span>360° Spin</span>
          </button>
        </div>
      ) : (
        <div className="w-full h-80 flex flex-col items-center justify-center bg-coffee-100/50 dark:bg-coffee-900/30 rounded-3xl p-6 border border-coffee-200/50 dark:border-coffee-800">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-coffee-800 via-coffee-600 to-roast-amber flex items-center justify-center shadow-xl mb-3">
            <span className="text-4xl sm:text-5xl">☕</span>
          </div>
          <p className="text-sm font-semibold text-coffee-800 dark:text-coffee-200">
            Artisanal Ceramic Brew Preview
          </p>
        </div>
      )}

      {/* Floating Interactive 3D Experience Controls */}
      <div className="w-full max-w-md px-2 mt-2 space-y-2 z-10">
        {/* Row 1: Drink Selection - Full Width, No Horizontal Scroll */}
        <div className="grid grid-cols-5 gap-1 p-1 rounded-2xl bg-white/80 dark:bg-coffee-950/80 backdrop-blur-md border border-coffee-200/70 dark:border-coffee-800/80 shadow-sm text-[11px] font-medium">
          {(
            [
              { id: 'latte', label: 'Latte' },
              { id: 'cappuccino', label: 'Cappuccino' },
              { id: 'caramel', label: 'Caramel' },
              { id: 'matcha', label: 'Matcha' },
              { id: 'espresso', label: 'Espresso' },
            ] as { id: DrinkFlavor; label: string }[]
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setFlavor(item.id)}
              className={`py-1.5 px-1 rounded-xl capitalize transition-all duration-200 text-center truncate ${
                flavor === item.id
                  ? 'bg-coffee-900 text-white dark:bg-roast-amber dark:text-coffee-950 font-bold shadow-sm'
                  : 'text-coffee-700 dark:text-coffee-300 hover:bg-coffee-100 dark:hover:bg-coffee-900/60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Row 2: 3D Camera Angles & Controls */}
        <div className="flex items-center justify-between gap-2 px-1">
          {/* Camera View Angle Selector */}
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-white/70 dark:bg-coffee-950/70 border border-coffee-200 dark:border-coffee-800 text-[11px] font-semibold">
            <button
              onClick={() => setCameraPreset('orbit')}
              className={`px-2 py-1 rounded-lg transition-all ${
                cameraPreset === 'orbit'
                  ? 'bg-coffee-900 text-white dark:bg-roast-amber dark:text-coffee-950 font-bold'
                  : 'text-coffee-600 dark:text-coffee-400 hover:text-coffee-900'
              }`}
              title="3D Perspective: 360° ceramic cup and saucer"
            >
              3D Orbit
            </button>
            <button
              onClick={() => setCameraPreset('latte-art')}
              className={`px-2 py-1 rounded-lg transition-all ${
                cameraPreset === 'latte-art'
                  ? 'bg-coffee-900 text-white dark:bg-roast-amber dark:text-coffee-950 font-bold'
                  : 'text-coffee-600 dark:text-coffee-400 hover:text-coffee-900'
              }`}
              title="Top View: Inspect barista latte art rosette/heart"
            >
              Latte Art
            </button>
            <button
              onClick={() => setCameraPreset('side')}
              className={`px-2 py-1 rounded-lg transition-all ${
                cameraPreset === 'side'
                  ? 'bg-coffee-900 text-white dark:bg-roast-amber dark:text-coffee-950 font-bold'
                  : 'text-coffee-600 dark:text-coffee-400 hover:text-coffee-900'
              }`}
              title="Side View: Inspect cup profile and handle"
            >
              Side View
            </button>
          </div>

          {/* 360 Spin, Auto-Rotation & Steam Toggles */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* 360 Spin Button */}
            <button
              onClick={handleSpin360}
              className="px-2 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1 shadow-sm active:scale-95 bg-white/80 dark:bg-coffee-950 text-coffee-800 dark:text-cream-100 hover:bg-coffee-100 dark:hover:bg-coffee-900 border-coffee-200 dark:border-coffee-800"
              title="Spin cup full 360°"
            >
              <RefreshCw className="w-3.5 h-3.5 text-roast-amber" />
              <span className="text-[11px]">360°</span>
            </button>

            {/* Auto-Rotation Toggle */}
            <button
              onClick={() => setIsRotating(!isRotating)}
              className={`p-1.5 rounded-xl text-xs transition-colors border ${
                isRotating
                  ? 'bg-coffee-100 dark:bg-coffee-900/60 text-coffee-800 dark:text-coffee-200 border-coffee-300/60 dark:border-coffee-700'
                  : 'bg-white/80 dark:bg-coffee-950 text-coffee-500 border-coffee-200 dark:border-coffee-800'
              }`}
              title={isRotating ? 'Pause auto-rotation' : 'Resume auto-rotation'}
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            </button>

            {/* Steam Particles Toggle */}
            <button
              onClick={() => setIsLowPowerMode(!isLowPowerMode)}
              className={`p-1.5 rounded-xl text-xs transition-colors border ${
                isLowPowerMode
                  ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200'
                  : 'bg-white/80 dark:bg-coffee-950 text-coffee-600 dark:text-coffee-400 border-coffee-200 dark:border-coffee-800'
              }`}
              title="Toggle aroma steam"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
