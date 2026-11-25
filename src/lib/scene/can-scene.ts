// 📖 Docs: obsidian/frontend/webgl-scenes.md

/**
 * The Fizzo 3D can. A studio-lit procedural can: a printed label wrap with a
 * wet condensation layer, a rolled aluminium lid and base, fruit that tumbles
 * around it (a different fruit per flavor) and rising bubbles. Everything is
 * built at runtime — no model files.
 *
 * Scene rules: one frame clock in seconds, `damp()` for every ease, resize only
 * on a real change, never stop drawing a visible canvas, context loss handled
 * by `keepSceneAlive` in the caller.
 */

import * as THREE from "three";

import type { FlavorId } from "@/data/flavors";
import { drawCondensation, drawLabel } from "@/lib/scene/can-art";
import { buildFruit, type Fruit } from "@/lib/scene/can-fruit";
import { createFrameClock, damp } from "@/lib/scene/per-frame";

export interface CanPose {
  /** −1…1 of the visible half-width / half-height. */
  x: number;
  y: number;
  scale: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  /** 0 = whole can, 1 = fully exploded. */
  explode: number;
}

export const DEFAULT_POSE: CanPose = {
  x: 0,
  y: 0,
  scale: 1,
  rotX: 0,
  rotY: 0,
  rotZ: -0.32,
  explode: 0,
};

export interface CanSceneOptions {
  container: HTMLElement;
  flavor: FlavorId;
  fruit: number;
  still: boolean;
  pose?: Partial<CanPose>;
}

export interface CanSceneHandle {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext | WebGL2RenderingContext;
  isBroken(): boolean;
  frames(): number;
  setFlavor(flavor: FlavorId): void;
  setPose(pose: Partial<CanPose>): void;
  setPointer(x: number, y: number): void;
  dispose(): void;
}

const CAN_RADIUS = 1;
const CAN_HEIGHT = 3.3;
const CAM_Z = 14;
const FOV = 28;

const SEEDS: readonly [number, number, number, number][] = [
  [-2.6, 1.5, -0.6, 0.62],
  [-3.4, -0.7, 0.6, 0.8],
  [2.9, 1.9, -1.1, 0.46],
  [3.2, -1.2, 0.5, 0.86],
  [-1.9, -2.3, 0.9, 0.38],
  [1.7, -2.5, 0.3, 0.34],
  [0.5, 2.8, -1.6, 0.3],
  [-4.0, 2.4, -2.0, 0.38],
  [4.2, 0.4, -1.8, 0.54],
  [-1.0, -3.1, -0.8, 0.5],
  [2.3, 3.0, -2.0, 0.28],
  [-2.4, 0.4, -2.2, 0.44],
];

/** Top-of-can profile (revolved): a rolled rim, a recessed deck. */
const lidProfile = (): THREE.Vector2[] => {
  const top = CAN_HEIGHT / 2 - 0.05;
  const raw: [number, number][] = [
    [1.0, 0.0],
    [1.0, 0.03],
    [0.98, 0.09],
    [0.92, 0.15],
    [0.86, 0.19],
    [0.83, 0.24],
    [0.81, 0.275],
    [0.78, 0.295],
    [0.75, 0.285],
    [0.735, 0.245],
    [0.7, 0.2],
    [0.66, 0.17],
    [0, 0.17],
  ];
  return raw.map(([x, y]) => new THREE.Vector2(x, y + top));
};

/** A studio: dark room with long soft-box strips — gives the can its hard highlights. */
const studio = (): THREE.Scene => {
  const room = new THREE.Scene();
  room.background = new THREE.Color(0x0a0a0c);
  const panel = (w: number, h: number, intensity: number, x: number, y: number, z: number) => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(intensity, intensity, intensity),
        side: THREE.DoubleSide,
      }),
    );
    mesh.position.set(x, y, z);
    mesh.lookAt(0, 0, 0);
    room.add(mesh);
  };
  panel(1.6, 14, 9, -6, 1, 3);
  panel(1.2, 14, 7, 6.5, 0, 2);
  panel(12, 2, 6, 0, 7, 2);
  panel(8, 8, 1.6, 0, 0, 9);
  panel(2, 12, 5, 0, 0, -8);
  return room;
};

interface Orbiter {
  fruit: Fruit;
  home: THREE.Vector3;
  offset: THREE.Vector3;
  phase: number;
  radius: number;
  born: number;
  grow: number;
}

export const createCanScene = ({
  container,
  flavor: initialFlavor,
  fruit: fruitCount,
  still,
  pose: initialPose,
}: CanSceneOptions): CanSceneHandle => {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  const canvas = renderer.domElement;
  canvas.className = "size-full block";
  container.appendChild(canvas);
  const gl = renderer.getContext();

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = studio();
  const envMap = pmrem.fromScene(room, 0.02).texture;
  scene.environment = envMap;

  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 60);
  camera.position.set(0, 0, CAM_Z);
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(4, 6, 7);
  scene.add(key);

  // ---- can ----------------------------------------------------------------
  const rig = new THREE.Group();
  const spin = new THREE.Group();
  rig.add(spin);
  scene.add(rig);

  let labelTexture = drawLabel(initialFlavor);
  const { bump, rough } = drawCondensation();
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    map: labelTexture,
    metalness: 0.75,
    roughness: 1,
    roughnessMap: rough,
    bumpMap: bump,
    bumpScale: 1.6,
    clearcoat: 0.5,
    clearcoatRoughness: 0.18,
    envMapIntensity: 1.5,
  });
  const bodyGeometry = new THREE.CylinderGeometry(
    CAN_RADIUS,
    CAN_RADIUS,
    CAN_HEIGHT - 0.1,
    128,
    1,
    true,
  );
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.rotation.y = Math.PI;
  spin.add(body);

  const metal = new THREE.MeshStandardMaterial({
    color: 0xdfe3e8,
    metalness: 1,
    roughness: 0.24,
    envMapIntensity: 1.6,
  });
  const lidGeometry = new THREE.LatheGeometry(lidProfile(), 128);
  const lid = new THREE.Mesh(lidGeometry, metal);
  const base = new THREE.Mesh(lidGeometry, metal);
  base.rotation.x = Math.PI;
  spin.add(lid, base);

  // Pull tab: ring with a finger hole, plus a rivet and the opening score.
  const tabShape = new THREE.Shape();
  tabShape.absellipse(0, 0, 0.36, 0.2, 0, Math.PI * 2, false, 0);
  const hole = new THREE.Path();
  hole.absellipse(0.14, 0, 0.13, 0.085, 0, Math.PI * 2, true, 0);
  tabShape.holes.push(hole);
  const tabGeometry = new THREE.ExtrudeGeometry(tabShape, {
    depth: 0.025,
    bevelEnabled: true,
    bevelSize: 0.015,
    bevelThickness: 0.015,
    bevelSegments: 2,
  });
  const tab = new THREE.Mesh(tabGeometry, metal);
  tab.rotation.x = -Math.PI / 2;
  tab.position.set(-0.05, CAN_HEIGHT / 2 - 0.05 + 0.2, 0);
  lid.add(tab);
  const scoreGeometry = new THREE.TorusGeometry(0.3, 0.012, 8, 40, Math.PI * 1.5);
  const scoreMaterial = new THREE.MeshStandardMaterial({ color: 0x6b7077, metalness: 1, roughness: 0.5 });
  const score = new THREE.Mesh(scoreGeometry, scoreMaterial);
  score.rotation.x = -Math.PI / 2;
  score.position.set(0.28, CAN_HEIGHT / 2 - 0.05 + 0.175, 0);
  lid.add(score);

  // ---- fruit ---------------------------------------------------------------
  let sceneT = 0;
  const orbit = new THREE.Group();
  scene.add(orbit);
  const orbiters: Orbiter[] = [];
  let currentFlavor = initialFlavor;
  const spawnFruit = (id: FlavorId): void => {
    for (const o of orbiters) {
      orbit.remove(o.fruit.object);
      o.fruit.dispose();
    }
    orbiters.length = 0;
    for (let i = 0; i < Math.min(fruitCount, SEEDS.length); i += 1) {
      const [x, y, z, radius] = SEEDS[i];
      const fruit = buildFruit(id, radius, i);
      const finalScale = fruit.object.scale.x;
      fruit.object.userData.finalScale = finalScale;
      fruit.object.scale.setScalar(0.0001);
      fruit.object.position.set(x, y, z);
      orbit.add(fruit.object);
      orbiters.push({
        fruit,
        home: new THREE.Vector3(x, y, z),
        offset: new THREE.Vector3(),
        phase: i * 1.7,
        radius,
        born: sceneT + i * 0.05,
        grow: 0,
      });
    }
  };
  spawnFruit(initialFlavor);

  // ---- bubbles -------------------------------------------------------------
  const BUBBLES = 46;
  const bubbleGeometry = new THREE.SphereGeometry(1, 12, 12);
  const bubbleMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
  });
  const bubbles = new THREE.InstancedMesh(bubbleGeometry, bubbleMaterial, BUBBLES);
  const bubbleState = Array.from({ length: BUBBLES }, (_, i) => ({
    x: Math.sin(i * 12.9898) * 1.6,
    y: ((i * 37) % 100) / 100 * 7 - 3.5,
    z: Math.cos(i * 4.1) * 1.4,
    speed: 0.5 + ((i * 13) % 10) / 12,
    size: 0.03 + ((i * 7) % 10) / 140,
  }));
  rig.add(bubbles);
  const dummy = new THREE.Object3D();

  // ---- state ---------------------------------------------------------------
  const pose: CanPose = { ...DEFAULT_POSE, ...initialPose };
  const target: CanPose = { ...pose };
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  let pulse = 0;
  let frameCount = 0;
  let width = 0;
  let height = 0;
  let dpr = 0;
  const pointerWorld = new THREE.Vector3();
  const clock = createFrameClock();
  let raf = 0;
  let visible = true;
  let disposed = false;

  const resize = (): void => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    if (w === width && h === height && ratio === dpr) return;
    width = w;
    height = h;
    dpr = ratio;
    renderer.setPixelRatio(ratio);
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(h, 1);
    camera.fov = camera.aspect < 0.9 ? FOV / Math.max(camera.aspect, 0.45) ** 0.7 : FOV;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  };

  const draw = (now: number): void => {
    if (disposed) return;
    raf = requestAnimationFrame(draw);
    if (!visible) return;
    resize();
    const { dt, t } = clock.tick(now);
    frameCount += 1;
    sceneT = t;

    pointer.sx = damp(pointer.sx, pointer.x, 5, dt);
    pointer.sy = damp(pointer.sy, pointer.y, 5, dt);
    pulse = damp(pulse, 0, 4, dt);
    (Object.keys(pose) as (keyof CanPose)[]).forEach((k) => {
      pose[k] = damp(pose[k], target[k], k === "explode" ? 5 : 4.2, dt);
    });

    const halfH = Math.tan((camera.fov * Math.PI) / 360) * CAM_Z;
    const halfW = halfH * camera.aspect;
    const bob = still ? 0 : Math.sin(t * 1.1) * 0.12;
    rig.position.set(pose.x * halfW, pose.y * halfH + bob * (1 - pose.explode), 0);
    orbit.position.copy(rig.position);
    rig.rotation.z = pose.rotZ - pointer.sx * 0.1 + pose.explode * 0.35;
    rig.rotation.x = pose.rotX - pointer.sy * 0.3 + pose.explode * 0.2;
    const sway = still ? 0 : Math.sin(t * 0.5) * 0.45;
    spin.rotation.y = pose.rotY + pointer.sx * 0.8 + sway * (1 - pose.explode);
    rig.scale.setScalar(pose.scale * (1 + pulse * 0.1));

    lid.position.y = pose.explode * 1.8;
    lid.rotation.y = pose.explode * 0.6;
    base.position.y = -pose.explode * 1.8;

    // pointer in the fruit's plane, relative to the orbit
    pointerWorld.set(pointer.sx, pointer.sy, 0.5).unproject(camera);
    pointerWorld.sub(camera.position).normalize();
    pointerWorld.multiplyScalar(-camera.position.z / pointerWorld.z).add(camera.position);
    pointerWorld.sub(orbit.position);

    const drift = still ? 0 : 1;
    const spread = 1 + pose.explode * 0.5;
    for (const o of orbiters) {
      o.grow = damp(o.grow, t > o.born ? 1 : 0, 6, dt);
      const finalScale = (o.fruit.object.userData.finalScale as number) ?? 1;
      o.fruit.object.scale.setScalar(Math.max(0.0001, finalScale * o.grow));
      const tx = o.home.x * spread * pose.scale + Math.sin(t * 0.6 + o.phase) * 0.22 * drift;
      const ty = o.home.y * pose.scale + Math.cos(t * 0.8 + o.phase) * 0.3 * drift;
      const p = o.fruit.object.position;
      const dx = p.x - pointerWorld.x;
      const dy = p.y - pointerWorld.y;
      const dist = Math.hypot(dx, dy);
      const reach = 1.6 + o.radius;
      if (dist < reach && dist > 0.001) {
        const push = ((reach - dist) / reach) * 1.8;
        o.offset.x += (dx / dist) * push * dt * 12;
        o.offset.y += (dy / dist) * push * dt * 12;
      }
      o.offset.x = damp(o.offset.x, 0, 2.2, dt);
      o.offset.y = damp(o.offset.y, 0, 2.2, dt);
      p.x = damp(p.x, tx + o.offset.x, 8, dt);
      p.y = damp(p.y, ty + o.offset.y, 8, dt);
      o.fruit.object.rotation.x += dt * 0.35 * drift;
      o.fruit.object.rotation.y += dt * 0.45 * drift;
    }

    for (let i = 0; i < BUBBLES; i += 1) {
      const b = bubbleState[i];
      if (!still) b.y += b.speed * dt * 0.6;
      if (b.y > 3.6) b.y = -3.6;
      dummy.position.set(b.x * 1.5, b.y, b.z + 1.1);
      dummy.scale.setScalar(b.size * (1 + Math.sin(t * 2 + i) * 0.1));
      dummy.updateMatrix();
      bubbles.setMatrixAt(i, dummy.matrix);
    }
    bubbles.instanceMatrix.needsUpdate = true;

    renderer.render(scene, camera);
  };

  resize();
  raf = requestAnimationFrame(draw);

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) clock.reset();
  });
  observer.observe(container);

  return {
    canvas,
    gl,
    isBroken: () => gl.isContextLost(),
    frames: () => frameCount,
    setFlavor(next) {
      if (next === currentFlavor) return;
      currentFlavor = next;
      const old = labelTexture;
      labelTexture = drawLabel(next);
      bodyMaterial.map = labelTexture;
      bodyMaterial.needsUpdate = true;
      old.dispose();
      spawnFruit(next);
      pulse = 1;
    },
    setPose(next) {
      Object.assign(target, next);
    },
    setPointer(x, y) {
      pointer.x = x;
      pointer.y = y;
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      labelTexture.dispose();
      bump.dispose();
      rough.dispose();
      bodyMaterial.dispose();
      metal.dispose();
      scoreMaterial.dispose();
      bodyGeometry.dispose();
      lidGeometry.dispose();
      tabGeometry.dispose();
      scoreGeometry.dispose();
      bubbleGeometry.dispose();
      bubbleMaterial.dispose();
      for (const o of orbiters) o.fruit.dispose();
      envMap.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (!gl.isContextLost()) gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    },
  };
};
