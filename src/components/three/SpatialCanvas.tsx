import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SubjectId } from '../../types/resource';
import { DeviceTier } from '../../types/theme';

interface SpatialCanvasProps {
  activeSubject: SubjectId | 'all';
  isDark: boolean;
  tier: DeviceTier;
  prefersReducedMotion?: boolean;
}

export const SpatialCanvas: React.FC<SpatialCanvasProps> = ({
  activeSubject,
  isDark,
  tier,
  prefersReducedMotion: propPrefersReducedMotion,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const cellGroupRef = useRef<THREE.Group | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  // Active state for prefers-reduced-motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (propPrefersReducedMotion !== undefined) return propPrefersReducedMotion;
    return typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;
  });

  useEffect(() => {
    if (propPrefersReducedMotion !== undefined) {
      setPrefersReducedMotion(propPrefersReducedMotion);
      return;
    }
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [propPrefersReducedMotion]);

  // Animated organelle references for life-like micro-motion
  const nucleusRef = useRef<THREE.Group | null>(null);
  const golgiGroupRef = useRef<THREE.Group | null>(null);
  const membraneGroupRef = useRef<THREE.Group | null>(null);
  const mitochondriaRef = useRef<{ group: THREE.Group; baseRot: THREE.Euler; speed: number }[]>([]);
  const vesiclesRef = useRef<{ mesh: THREE.Object3D; basePos: THREE.Vector3; speed: number; phase: number }[]>([]);

  // Initialize Scene, Camera, Renderer, and Controls
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera: Balanced 34-degree vertical FOV with dynamic distance calculation
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    cameraRef.current = camera;

    // 3. WebGL Renderer with crisp pixel-ratio handling across all Android & desktop displays
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isDark ? 1.15 : 1.05;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Responsive Framing calculation: guarantees full containment on any screen/aspect ratio
    const updateFraming = (w: number, h: number) => {
      if (!cameraRef.current || !rendererRef.current) return;
      const safeH = Math.max(h, 1);
      const aspect = w / safeH;
      cameraRef.current.aspect = aspect;

      // Target fit radius covers the membrane (radius ~2.35 + perturbation ~0.1)
      // plus outer Golgi stacks, vesicles, dynamic breathing expansion, and tilt margin
      const targetFitRadius = 2.58;
      const halfFovRad = (cameraRef.current.fov / 2) * (Math.PI / 180);
      const tanHalfFov = Math.tan(halfFovRad);

      // Distance required to fit the full vertical extent with comfortable breathing room
      const distY = (targetFitRadius * 1.12) / tanHalfFov;
      // Distance required to fit the full horizontal extent (especially on narrow Android portrait viewports)
      const distX = (targetFitRadius * 1.12) / (tanHalfFov * aspect);

      const optimalDist = Math.max(distY, distX);
      cameraRef.current.position.set(0, 0, optimalDist);
      cameraRef.current.updateProjectionMatrix();

      rendererRef.current.setSize(w, safeH, false);
    };

    updateFraming(width, height);

    // 4. Studio Scientific Lighting Setup
    // Soft ambient light
    const ambientLight = new THREE.AmbientLight(
      isDark ? 0xF0EDE6 : 0xFFFFFF,
      isDark ? 1.1 : 1.35
    );
    scene.add(ambientLight);

    // Key directional light for crisp highlight modeling on folds & membranes
    const keyLight = new THREE.DirectionalLight(0xFFFFFF, isDark ? 2.6 : 2.2);
    keyLight.position.set(4.5, 5.5, 6.0);
    scene.add(keyLight);

    // Cool fill light for subtle shadow softening
    const fillLight = new THREE.DirectionalLight(
      isDark ? 0x9CB0C4 : 0x8A9BAB,
      isDark ? 1.0 : 1.1
    );
    fillLight.position.set(-5.0, -3.5, 4.0);
    scene.add(fillLight);

    // Warm coral interior point light centered in nucleus for translucent scatter
    const nucleusInnerLight = new THREE.PointLight(0xFF6B6B, isDark ? 3.5 : 2.8, 8);
    nucleusInnerLight.position.set(-0.1, 0.05, 0.3);
    scene.add(nucleusInnerLight);

    // Soft rim backlight for translucent membrane rim contours
    const rimLight = new THREE.DirectionalLight(0xFFFFFF, isDark ? 1.2 : 0.9);
    rimLight.position.set(0, -4.0, -5.0);
    scene.add(rimLight);

    // 5. Root Cell Group
    const rootCellGroup = new THREE.Group();
    // Default gentle biological tilt matching the reference illustration
    rootCellGroup.rotation.x = 0.14;
    rootCellGroup.rotation.y = -0.18;
    scene.add(rootCellGroup);
    cellGroupRef.current = rootCellGroup;

    // IntersectionObserver to pause rendering when offscreen
    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Smooth Interactive Parallax Tracking
    let targetRotX = 0;
    let targetRotY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      if (tier === 'mobile' || prefersReducedMotion) return;
      const rect = container.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotX = ny * 0.38;
      targetRotY = nx * 0.48;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleTouchMove = (e: TouchEvent) => {
      if (prefersReducedMotion || e.touches.length === 0) return;
      const rect = container.getBoundingClientRect();
      const touch = e.touches[0];
      const nx = (touch.clientX - rect.left) / rect.width - 0.5;
      const ny = (touch.clientY - rect.top) / rect.height - 0.5;
      targetRotX = ny * 0.22;
      targetRotY = nx * 0.32;
    };
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Animation Render Loop
    const clock = new THREE.Clock();
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      if (!isVisible) return;

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Continuous majestic living rotation
      const baseRotSpeed = prefersReducedMotion ? 0 : 0.065;
      if (rootCellGroup) {
        rootCellGroup.rotation.y += delta * baseRotSpeed;

        // Damped interactive tilt
        if (!prefersReducedMotion) {
          rootCellGroup.rotation.x += (0.14 + targetRotX - rootCellGroup.rotation.x) * 0.045;
          rootCellGroup.rotation.z += (-0.06 + targetRotY * 0.32 - rootCellGroup.rotation.z) * 0.045;
        }

        // 1. HOLISTIC BREATHING EFFECT:
        // Subtle, elegant expansion and contraction of the entire cellular architecture
        // ~5.8s natural respiratory cycle, smooth ease-in/out, no bouncing or pulsing.
        // Disabled when prefersReducedMotion is true.
        const breathScale = prefersReducedMotion
          ? 1.0
          : 1.0 + Math.sin(elapsedTime * 1.08) * 0.016;
        rootCellGroup.scale.set(breathScale, breathScale, breathScale);

        // Nucleus gentle internal chromatin micro-respiration
        if (nucleusRef.current && !prefersReducedMotion) {
          const nScale = 1.0 + Math.sin(elapsedTime * 1.2) * 0.012;
          nucleusRef.current.scale.set(nScale, nScale, nScale);
        }

        // Cell membrane subtle fluid ripple
        if (membraneGroupRef.current && !prefersReducedMotion) {
          const mPulse = 1.0 + Math.sin(elapsedTime * 0.8) * 0.008;
          membraneGroupRef.current.scale.set(mPulse, 1.0 + Math.cos(elapsedTime * 0.75) * 0.006, mPulse);
        }

        // Golgi stacks subtle living flex
        if (golgiGroupRef.current && !prefersReducedMotion) {
          golgiGroupRef.current.rotation.z = Math.sin(elapsedTime * 0.9) * 0.02;
        }

        // Mitochondria subtle independent suspension drift
        if (!prefersReducedMotion) {
          mitochondriaRef.current.forEach((mito) => {
            mito.group.rotation.x = mito.baseRot.x + Math.sin(elapsedTime * mito.speed) * 0.04;
            mito.group.rotation.y = mito.baseRot.y + Math.cos(elapsedTime * (mito.speed * 0.8)) * 0.05;
          });
        }

        // Vesicles and micro-granules harmonic floating
        if (!prefersReducedMotion) {
          vesiclesRef.current.forEach((v) => {
            v.mesh.position.y = v.basePos.y + Math.sin(elapsedTime * v.speed + v.phase) * 0.035;
            v.mesh.position.x = v.basePos.x + Math.cos(elapsedTime * (v.speed * 0.7) + v.phase) * 0.02;
          });
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // ResizeObserver ensures instant responsive framing when container size changes
    // on Android phones, orientation flip, tablet, or desktop
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: nw, height: nh } = entry.contentRect;
        if (nw > 0 && nh > 0) {
          updateFraming(nw, nh);
        }
      }
    });
    resizeObserver.observe(container);

    const handleWindowResize = () => {
      if (!container) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      if (nw > 0 && nh > 0) {
        updateFraming(nw, nh);
      }
    };
    window.addEventListener('resize', handleWindowResize);
    window.addEventListener('orientationchange', handleWindowResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleWindowResize);
      window.removeEventListener('orientationchange', handleWindowResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();

      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      if (renderer) {
        renderer.dispose();
      }
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [tier, isDark, prefersReducedMotion]);

  // Construct Cellular Architecture Procedural Geometries & Materials
  useEffect(() => {
    const root = cellGroupRef.current;
    if (!root) return;

    // Thorough cleanup of existing children, geometries, and materials
    while (root.children.length > 0) {
      const child = root.children[0] as THREE.Mesh | THREE.LineSegments | THREE.Points | THREE.Group;
      if ('geometry' in child && child.geometry) {
        child.geometry.dispose();
      }
      if ('material' in child && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose());
        } else {
          child.material.dispose();
        }
      }
      root.remove(child);
    }
    vesiclesRef.current = [];
    mitochondriaRef.current = [];

    // Aesthetic Palette calibrated to the scientific reference illustration & NEET NOTES ink tone
    const inkColor = isDark ? 0xFDFBF7 : 0x2C2B2A;
    const inkWireColor = isDark ? 0xDCD8D0 : 0x333130;
    const coralPrimary = 0xFF6B6B;
    const coralSoft = 0xFFA09B;
    const coralDeep = 0xE05252;
    const slateDark = 0x25282D;
    const slateMid = 0x363B42;
    const cristaeWhite = isDark ? 0xF8F6F0 : 0xFFFFFF;

    // Optional discipline accent touch
    let disciplineAccent = coralPrimary;
    if (activeSubject === 'biology') disciplineAccent = 0x4ECDC4;
    else if (activeSubject === 'physics') disciplineAccent = 0x45B7D1;
    else if (activeSubject === 'chemistry') disciplineAccent = 0xFF9F43;

    // =========================================================================
    // 1. CELL MEMBRANE & CYTOSKELETON (Translucent Shell with Biological Mesh)
    // =========================================================================
    const membraneGroup = new THREE.Group();
    membraneGroupRef.current = membraneGroup;

    // Organic perturbed spherical geometry
    const membraneSubdivisions = tier === 'mobile' ? 2 : 3;
    const membraneGeo = new THREE.IcosahedronGeometry(2.35, membraneSubdivisions);
    const mPos = membraneGeo.attributes.position;
    const vTemp = new THREE.Vector3();

    for (let i = 0; i < mPos.count; i++) {
      vTemp.fromBufferAttribute(mPos, i);
      const originalLen = vTemp.length();
      vTemp.normalize();
      const theta = Math.atan2(vTemp.y, vTemp.x);
      const phi = Math.acos(vTemp.z);
      // Soft organic harmonics mimicking fluid lipid bilayer tension
      const ripple =
        Math.sin(theta * 3.0 + phi * 2.0) * 0.1 +
        Math.cos(theta * 4.0 - phi * 3.0) * 0.06 +
        Math.sin(phi * 5.0) * 0.04;
      vTemp.multiplyScalar(originalLen + ripple);
      mPos.setXYZ(i, vTemp.x, vTemp.y, vTemp.z);
    }
    membraneGeo.computeVertexNormals();

    // 1A. Translucent Optical Cytoplasmic Envelope
    const membraneShellMat = new THREE.MeshPhysicalMaterial({
      color: isDark ? 0x2A2927 : 0xFCFCF9,
      roughness: 0.28,
      metalness: 0.08,
      transmission: 0.88,
      transparent: true,
      opacity: isDark ? 0.24 : 0.14,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const membraneShell = new THREE.Mesh(membraneGeo, membraneShellMat);
    membraneGroup.add(membraneShell);

    // 1B. Biological Cortical Wireframe Network (Matching the intricate sketch lines)
    const wireframeGeo = new THREE.WireframeGeometry(membraneGeo);
    const wireframeMat = new THREE.LineBasicMaterial({
      color: inkWireColor,
      transparent: true,
      opacity: isDark ? 0.35 : 0.24,
    });
    const wireframeMesh = new THREE.LineSegments(wireframeGeo, wireframeMat);
    membraneGroup.add(wireframeMesh);

    // 1C. Junction Nodes & Micro-Junctions
    const nodeGeo = new THREE.BufferGeometry();
    const nodePositions: number[] = [];
    for (let i = 0; i < mPos.count; i += tier === 'mobile' ? 3 : 2) {
      vTemp.fromBufferAttribute(mPos, i);
      nodePositions.push(vTemp.x, vTemp.y, vTemp.z);
    }
    nodeGeo.setAttribute('position', new THREE.Float32BufferAttribute(nodePositions, 3));
    const nodeMat = new THREE.PointsMaterial({
      color: inkColor,
      size: tier === 'mobile' ? 0.04 : 0.05,
      transparent: true,
      opacity: isDark ? 0.6 : 0.45,
    });
    membraneGroup.add(new THREE.Points(nodeGeo, nodeMat));

    // 1D. Subtle Cytoskeletal Filaments connecting internal anchoring points
    const filamentPoints: THREE.Vector3[] = [];
    const filamentStep = tier === 'mobile' ? 14 : 9;
    for (let i = 0; i < mPos.count; i += filamentStep) {
      vTemp.fromBufferAttribute(mPos, i);
      // Span a delicate internal spoke towards the cytoplasmic interior
      const innerTarget = vTemp.clone().multiplyScalar(0.42 + (i % 5) * 0.08);
      filamentPoints.push(vTemp.clone(), innerTarget);
    }
    const filamentGeo = new THREE.BufferGeometry().setFromPoints(filamentPoints);
    const filamentMat = new THREE.LineBasicMaterial({
      color: inkWireColor,
      transparent: true,
      opacity: isDark ? 0.16 : 0.12,
    });
    membraneGroup.add(new THREE.LineSegments(filamentGeo, filamentMat));

    root.add(membraneGroup);

    // =========================================================================
    // 2. CENTRAL PROMINENT NUCLEUS (The Visual Anchor)
    // =========================================================================
    // Prominent position near center, slightly offset to the left (-0.05, 0.04, 0.2)
    const nucleusGroup = new THREE.Group();
    nucleusGroup.position.set(-0.06, 0.04, 0.2);
    nucleusRef.current = nucleusGroup;

    // 2A. Deep Velvet Graphite/Charcoal Volumetric Core Sphere
    const nRadius = 0.88;
    const nucleusCoreGeo = new THREE.SphereGeometry(nRadius, tier === 'mobile' ? 28 : 44, tier === 'mobile' ? 24 : 36);
    const nucleusCoreMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x1E1E1E : 0x282726,
      roughness: 0.42,
      metalness: 0.22,
    });
    const nucleusCoreMesh = new THREE.Mesh(nucleusCoreGeo, nucleusCoreMat);
    nucleusGroup.add(nucleusCoreMesh);

    // 2B. Dense Inner Dark Nucleolus
    const nucleolusGeo = new THREE.SphereGeometry(0.34, 18, 18);
    const nucleolusMat = new THREE.MeshStandardMaterial({
      color: 0x141414,
      roughness: 0.65,
      metalness: 0.1,
    });
    const nucleolusMesh = new THREE.Mesh(nucleolusGeo, nucleolusMat);
    nucleolusMesh.position.set(0.08, 0.06, 0.12);
    nucleusGroup.add(nucleolusMesh);

    // 2C. Glowing Geometric Geodesic Lattice (Nuclear Envelope / Chromatin)
    // As seen in the reference illustration: intricate red/coral triangular mesh
    const nMeshGeo = new THREE.IcosahedronGeometry(nRadius * 1.035, 3);
    const nWireframeGeo = new THREE.WireframeGeometry(nMeshGeo);
    const nWireMat = new THREE.LineBasicMaterial({
      color: coralPrimary,
      transparent: true,
      opacity: isDark ? 0.95 : 0.88,
    });
    const nWireMesh = new THREE.LineSegments(nWireframeGeo, nWireMat);
    nucleusGroup.add(nWireMesh);

    // Secondary subtle rotated inner lattice for volumetric moiré depth
    const nInnerWireGeo = new THREE.IcosahedronGeometry(nRadius * 1.015, 2);
    const nInnerWireframe = new THREE.WireframeGeometry(nInnerWireGeo);
    const nInnerWireMat = new THREE.LineBasicMaterial({
      color: coralDeep,
      transparent: true,
      opacity: 0.6,
    });
    const nInnerWireMesh = new THREE.LineSegments(nInnerWireframe, nInnerWireMat);
    nInnerWireMesh.rotation.set(0.4, 0.3, 0.5);
    nucleusGroup.add(nInnerWireMesh);

    // 2D. Glowing Nuclear Pore Vertices at the lattice intersections
    const porePositions: number[] = [];
    const nPosAttr = nMeshGeo.attributes.position;
    for (let i = 0; i < nPosAttr.count; i += 2) {
      vTemp.fromBufferAttribute(nPosAttr, i);
      porePositions.push(vTemp.x, vTemp.y, vTemp.z);
    }
    const poreGeo = new THREE.BufferGeometry();
    poreGeo.setAttribute('position', new THREE.Float32BufferAttribute(porePositions, 3));
    const poreMat = new THREE.PointsMaterial({
      color: coralSoft,
      size: tier === 'mobile' ? 0.042 : 0.052,
      transparent: true,
      opacity: 0.95,
    });
    nucleusGroup.add(new THREE.Points(poreGeo, poreMat));

    root.add(nucleusGroup);

    // =========================================================================
    // 3. MITOCHONDRIA (2-3 Organelles with Curved Bean Hull & Cutaway Cristae)
    // =========================================================================
    // Helper function to build a sophisticated mitochondrion with bean curvature,
    // smooth dark shell, cutaway cavity, and clear transverse serpentine cristae.
    const createMitochondrion = (
      position: THREE.Vector3,
      rotation: THREE.Euler,
      scale = 1.0,
      speed = 1.0
    ) => {
      const mitoGroup = new THREE.Group();
      mitoGroup.position.copy(position);
      mitoGroup.rotation.copy(rotation);
      mitoGroup.scale.set(scale, scale, scale);

      const capsuleR = 0.28;
      const capsuleL = 0.62;

      // 3A. Smooth Dark Charcoal Outer Membrane
      const outerGeo = new THREE.CapsuleGeometry(
        capsuleR,
        capsuleL,
        tier === 'mobile' ? 8 : 12,
        tier === 'mobile' ? 14 : 20
      );
      const outerMat = new THREE.MeshStandardMaterial({
        color: slateDark,
        roughness: 0.38,
        metalness: 0.32,
      });
      const outerMesh = new THREE.Mesh(outerGeo, outerMat);
      mitoGroup.add(outerMesh);

      // 3B. Internal Cutaway Recessed Cavity Face
      // In the reference illustration, the front face has an open cutaway window
      // revealing the inner cavity and luminous white cristae folds.
      const cavityGeo = new THREE.CapsuleGeometry(
        capsuleR * 0.88,
        capsuleL * 0.94,
        tier === 'mobile' ? 8 : 10,
        tier === 'mobile' ? 12 : 16
      );
      const cavityMat = new THREE.MeshStandardMaterial({
        color: 0x18191B,
        roughness: 0.55,
        metalness: 0.15,
      });
      const cavityMesh = new THREE.Mesh(cavityGeo, cavityMat);
      cavityMesh.position.z = 0.07;
      mitoGroup.add(cavityMesh);

      // 3C. Clearly Visible Internal Cristae Folds
      // Alternating transverse folded serpentine loops extending inward
      const numCristae = tier === 'mobile' ? 5 : 7;
      const stepDist = capsuleL / (numCristae + 1);

      for (let i = 0; i < numCristae; i++) {
        const yPos = -capsuleL / 2 + (i + 1) * stepDist;
        const isEven = i % 2 === 0;

        const foldWidth = capsuleR * 1.4;
        const xStart = isEven ? -foldWidth * 0.45 : -foldWidth * 0.2;
        const xPeak = isEven ? 0.05 : -0.05;
        const xEnd = isEven ? foldWidth * 0.2 : foldWidth * 0.45;

        // Curved crista fold
        const cristaCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(xStart, yPos, 0.13),
          new THREE.Vector3(xPeak, yPos + (isEven ? 0.04 : -0.04), 0.21),
          new THREE.Vector3(xEnd, yPos, 0.14),
        ]);

        const cristaTubeGeo = new THREE.TubeGeometry(
          cristaCurve,
          14,
          0.026,
          tier === 'mobile' ? 6 : 8,
          false
        );
        const cristaMat = new THREE.MeshStandardMaterial({
          color: cristaeWhite,
          roughness: 0.25,
          metalness: 0.12,
        });
        mitoGroup.add(new THREE.Mesh(cristaTubeGeo, cristaMat));
      }

      // 3D. Crisp Sectional Rim Contour Line
      const rimPoints: THREE.Vector3[] = [];
      const rimSteps = 28;
      for (let i = 0; i <= rimSteps; i++) {
        const theta = (i / rimSteps) * Math.PI * 2;
        const rx = Math.cos(theta) * (capsuleR * 1.02);
        const ry = Math.sin(theta) * (capsuleL * 0.5 + capsuleR * 0.98);
        rimPoints.push(new THREE.Vector3(rx, ry, 0.02));
      }
      const rimGeo = new THREE.BufferGeometry().setFromPoints(rimPoints);
      const rimMat = new THREE.LineBasicMaterial({
        color: inkWireColor,
        transparent: true,
        opacity: 0.42,
      });
      mitoGroup.add(new THREE.Line(rimGeo, rimMat));

      root.add(mitoGroup);
      mitochondriaRef.current.push({
        group: mitoGroup,
        baseRot: rotation.clone(),
        speed,
      });
    };

    // Mitochondrion 1: Top-Middle (Tilted horizontally above nucleus, as in reference)
    createMitochondrion(
      new THREE.Vector3(0.08, 1.42, 0.25),
      new THREE.Euler(0.2, 0.15, -1.45),
      1.04,
      0.9
    );

    // Mitochondrion 2: Lower-Left (Diagonal posture below nucleus, as in reference)
    createMitochondrion(
      new THREE.Vector3(-1.22, -0.78, 0.35),
      new THREE.Euler(-0.15, -0.22, 0.55),
      1.08,
      1.1
    );

    // Mitochondrion 3: Mid-Left Organelle (Kidney/bean-like organelle at mid-left)
    createMitochondrion(
      new THREE.Vector3(-1.24, 0.42, 0.12),
      new THREE.Euler(0.25, 0.38, -0.4),
      0.82,
      0.8
    );

    // =========================================================================
    // 4. GOLGI APPARATUS (Curved Stacked Cisternae Ribbons with Organic Depth)
    // =========================================================================
    // Positioned gracefully to the right of the nucleus, with upper and lower stacks
    const golgiGroup = new THREE.Group();
    golgiGroupRef.current = golgiGroup;

    // Helper to generate a curved, organic undulating ribbon layer
    const createGolgiCisterna = (
      baseRadius: number,
      startAngle: number,
      endAngle: number,
      zOffset: number,
      tubeRadius: number,
      color: number,
      radialOffset = 0
    ) => {
      const curvePoints: THREE.Vector3[] = [];
      const numSteps = tier === 'mobile' ? 24 : 36;

      for (let i = 0; i <= numSteps; i++) {
        const t = i / numSteps;
        const angle = startAngle + (endAngle - startAngle) * t;
        // Organic biological undulating radius modulation (flared bulbous ends)
        const endFlare = Math.sin(t * Math.PI) * 0.08;
        const waviness = Math.sin(t * Math.PI * 2.8) * 0.07;
        const r = baseRadius + waviness + endFlare;

        // Center origin offset slightly so cisternae hug the nucleus
        const cx = 0.08 + Math.cos(angle) * r;
        const cy = 0.04 + Math.sin(angle) * r;
        const cz = zOffset + Math.cos(t * Math.PI * 2.2) * 0.05;

        curvePoints.push(new THREE.Vector3(cx, cy, cz));
      }

      const spline = new THREE.CatmullRomCurve3(curvePoints);
      const tubeGeo = new THREE.TubeGeometry(
        spline,
        tier === 'mobile' ? 28 : 42,
        tubeRadius,
        tier === 'mobile' ? 7 : 9,
        false
      );
      const tubeMat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.34,
        metalness: 0.16,
      });
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);

      // Add bulbous secretory vesicles at both tips (characteristic Golgi anatomy!)
      const startPt = curvePoints[0];
      const endPt = curvePoints[curvePoints.length - 1];

      const tipGeo = new THREE.SphereGeometry(tubeRadius * 1.35, 10, 10);
      const tipMat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.3,
        metalness: 0.18,
      });

      const tipStart = new THREE.Mesh(tipGeo, tipMat);
      tipStart.position.copy(startPt);
      golgiGroup.add(tipStart);

      const tipEnd = new THREE.Mesh(tipGeo, tipMat);
      tipEnd.position.copy(endPt);
      golgiGroup.add(tipEnd);

      return tubeMesh;
    };

    // Upper Golgi Cisternae Stack (Top-Right of nucleus)
    const upperStackConfig = [
      { r: 1.18, start: 0.18, end: 1.32, z: 0.22, tube: 0.058, color: coralDeep },
      { r: 1.36, start: 0.15, end: 1.38, z: 0.28, tube: 0.062, color: coralPrimary },
      { r: 1.54, start: 0.12, end: 1.44, z: 0.33, tube: 0.066, color: coralPrimary },
      { r: 1.72, start: 0.10, end: 1.48, z: 0.37, tube: 0.058, color: coralSoft },
    ];
    upperStackConfig.forEach((cfg) => {
      golgiGroup.add(createGolgiCisterna(cfg.r, cfg.start, cfg.end, cfg.z, cfg.tube, cfg.color));
    });

    // Lower Golgi Cisternae Stack (Bottom-Right of nucleus)
    const lowerStackConfig = [
      { r: 1.20, start: -1.32, end: -0.18, z: 0.25, tube: 0.060, color: coralDeep },
      { r: 1.40, start: -1.40, end: -0.12, z: 0.31, tube: 0.064, color: coralPrimary },
      { r: 1.60, start: -1.48, end: -0.06, z: 0.36, tube: 0.068, color: coralPrimary },
      { r: 1.78, start: -1.52, end: 0.0, z: 0.40, tube: 0.058, color: coralSoft },
    ];
    lowerStackConfig.forEach((cfg) => {
      golgiGroup.add(createGolgiCisterna(cfg.r, cfg.start, cfg.end, cfg.z, cfg.tube, cfg.color));
    });

    // Small budding secretory transport vesicles clustered around Golgi trans-face
    const golgiVesicleSpecs = [
      { pos: new THREE.Vector3(1.85, 0.45, 0.38), r: 0.085, color: coralSoft },
      { pos: new THREE.Vector3(1.92, -0.35, 0.42), r: 0.095, color: coralPrimary },
      { pos: new THREE.Vector3(1.78, 0.85, 0.34), r: 0.075, color: coralPrimary },
      { pos: new THREE.Vector3(1.82, -0.75, 0.36), r: 0.08, color: coralSoft },
    ];
    golgiVesicleSpecs.forEach((gv) => {
      const gvGeo = new THREE.SphereGeometry(gv.r, 12, 12);
      const gvMat = new THREE.MeshStandardMaterial({
        color: gv.color,
        roughness: 0.3,
        metalness: 0.2,
      });
      const gvMesh = new THREE.Mesh(gvGeo, gvMat);
      gvMesh.position.copy(gv.pos);
      golgiGroup.add(gvMesh);
    });

    root.add(golgiGroup);

    // =========================================================================
    // 5. SMALL ORGANELLES, VESICLES & LYSOSOMES (Depth Distribution)
    // =========================================================================
    // A curated, elegant constellation matching the reference illustration
    const organelleSpecs = [
      // Upper Right Translucent Coral Vesicles
      { pos: new THREE.Vector3(0.85, 1.25, 0.18), r: 0.21, color: coralPrimary, translucent: true, speed: 1.1, phase: 0.0 },
      { pos: new THREE.Vector3(1.22, 1.05, -0.05), r: 0.15, color: coralSoft, translucent: true, speed: 1.4, phase: 1.2 },
      // Top Dark Centrosome / Granule
      { pos: new THREE.Vector3(-0.46, 1.22, 0.14), r: 0.18, color: slateMid, translucent: false, speed: 0.9, phase: 2.1 },
      // Mid-Left Vesicle (between nucleus and mitochondria)
      { pos: new THREE.Vector3(-0.65, -0.15, 0.36), r: 0.16, color: isDark ? 0x484440 : 0xE4DED4, translucent: true, speed: 1.2, phase: 3.4 },
      // Bottom Coral Vesicles
      { pos: new THREE.Vector3(-0.35, -1.18, 0.24), r: 0.19, color: coralPrimary, translucent: true, speed: 1.1, phase: 4.2 },
      { pos: new THREE.Vector3(-0.14, -1.38, 0.12), r: 0.13, color: coralSoft, translucent: true, speed: 1.5, phase: 5.0 },
      // Peripheral Secretory Granules
      { pos: new THREE.Vector3(1.45, -0.32, 0.24), r: 0.12, color: slateDark, translucent: false, speed: 1.3, phase: 0.8 },
      { pos: new THREE.Vector3(1.36, 0.25, 0.28), r: 0.14, color: disciplineAccent, translucent: true, speed: 1.1, phase: 2.7 },
      { pos: new THREE.Vector3(0.64, 1.52, 0.14), r: 0.11, color: coralPrimary, translucent: true, speed: 1.6, phase: 3.9 },
      // Subtle background depth vesicles
      { pos: new THREE.Vector3(-0.85, 0.95, -0.35), r: 0.14, color: isDark ? 0x333130 : 0xD5D0C6, translucent: true, speed: 0.9, phase: 1.8 },
      { pos: new THREE.Vector3(0.95, -1.05, -0.28), r: 0.13, color: coralSoft, translucent: true, speed: 1.2, phase: 4.8 },
    ];

    organelleSpecs.forEach((spec) => {
      const oGeo = new THREE.SphereGeometry(
        spec.r,
        tier === 'mobile' ? 14 : 20,
        tier === 'mobile' ? 12 : 18
      );
      let oMat: THREE.Material;

      if (spec.translucent) {
        oMat = new THREE.MeshPhysicalMaterial({
          color: spec.color,
          roughness: 0.22,
          metalness: 0.12,
          transmission: 0.72,
          transparent: true,
          opacity: isDark ? 0.82 : 0.72,
        });
      } else {
        oMat = new THREE.MeshStandardMaterial({
          color: spec.color,
          roughness: 0.42,
          metalness: 0.35,
        });
      }

      const oMesh = new THREE.Mesh(oGeo, oMat);
      oMesh.position.copy(spec.pos);
      root.add(oMesh);

      vesiclesRef.current.push({
        mesh: oMesh,
        basePos: spec.pos.clone(),
        speed: spec.speed,
        phase: spec.phase,
      });

      // Internal dark condensation core for the larger translucent vesicles
      if (spec.r >= 0.18) {
        const coreG = new THREE.SphereGeometry(spec.r * 0.45, 10, 10);
        const coreM = new THREE.MeshStandardMaterial({
          color: slateDark,
          roughness: 0.5,
        });
        const cMesh = new THREE.Mesh(coreG, coreM);
        oMesh.add(cMesh);
      }
    });

    // =========================================================================
    // 6. CYTOPLASMIC MICRO-PARTICLES & RIBOSOMES
    // Clean, lightweight suspended granules drifting in the cellular fluid
    // =========================================================================
    const particleCount = tier === 'mobile' ? 45 : 85;
    const pPositions: number[] = [];
    const pColors: number[] = [];

    const colorInk = new THREE.Color(inkColor);
    const colorCoral = new THREE.Color(coralPrimary);
    const colorSoft = new THREE.Color(coralSoft);

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const rad = 0.96 + Math.random() * 1.25;

      const px = rad * Math.sin(phi) * Math.cos(theta);
      const py = rad * Math.sin(phi) * Math.sin(theta);
      const pz = rad * Math.cos(phi) * 0.65;

      pPositions.push(px, py, pz);

      const r = Math.random();
      if (r < 0.48) {
        pColors.push(colorCoral.r, colorCoral.g, colorCoral.b);
      } else if (r < 0.72) {
        pColors.push(colorSoft.r, colorSoft.g, colorSoft.b);
      } else {
        pColors.push(colorInk.r, colorInk.g, colorInk.b);
      }
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pPositions, 3));
    pGeo.setAttribute('color', new THREE.Float32BufferAttribute(pColors, 3));

    const pMat = new THREE.PointsMaterial({
      size: tier === 'mobile' ? 0.034 : 0.044,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.7 : 0.52,
    });
    root.add(new THREE.Points(pGeo, pMat));

  }, [activeSubject, isDark, tier]);

  // Clean Scientific SVG Fallback if WebGL is unavailable
  if (!webglSupported) {
    return (
      <div className="relative w-full h-full flex items-center justify-center pointer-events-none opacity-80">
        <svg viewBox="0 0 240 240" className="w-64 h-64 text-[var(--ink)]">
          {/* Outer Membrane */}
          <circle cx="120" cy="120" r="95" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />
          <circle cx="120" cy="120" r="90" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
          {/* Nucleus */}
          <circle cx="120" cy="120" r="38" fill="currentColor" opacity="0.15" />
          <circle cx="120" cy="120" r="38" fill="none" stroke="#FF6B6B" strokeWidth="2" />
          <circle cx="120" cy="120" r="14" fill="#FF6B6B" opacity="0.8" />
          {/* Golgi folds */}
          <path d="M165,95 Q175,120 165,145" fill="none" stroke="#FF6B6B" strokeWidth="4" strokeLinecap="round" />
          <path d="M175,90 Q188,120 175,150" fill="none" stroke="#FF6B6B" strokeWidth="3.5" strokeLinecap="round" />
          {/* Mitochondria */}
          <ellipse cx="72" cy="85" rx="18" ry="10" transform="rotate(-30 72 85)" fill="currentColor" opacity="0.7" />
          <ellipse cx="68" cy="155" rx="20" ry="11" transform="rotate(25 68 155)" fill="currentColor" opacity="0.7" />
        </svg>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      id="spatial-canvas-viewport"
      aria-label="Interactive 3D living cellular architecture visualization"
      className="w-full h-full select-none pointer-events-auto cursor-grab active:cursor-grabbing"
    />
  );
};
