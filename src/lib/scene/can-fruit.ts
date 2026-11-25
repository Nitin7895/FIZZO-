// 📖 Docs: obsidian/frontend/webgl-scenes.md

/**
 * The fruit that orbits the can — a different, recognisable fruit per flavor
 * (blueberries with crowns, lime wheels, cherry pairs, mangoes, grape bunches)
 * instead of identical spheres.
 */

import * as THREE from "three";

import type { FlavorId } from "@/data/flavors";
import { drawLimeFace, drawSkin } from "@/lib/scene/can-art";

export interface Fruit {
  object: THREE.Object3D;
  dispose(): void;
}

const sphere = new THREE.SphereGeometry(1, 48, 48);

const star = (() => {
  const shape = new THREE.Shape();
  for (let i = 0; i < 10; i += 1) {
    const r = i % 2 === 0 ? 1 : 0.42;
    const a = (i / 10) * Math.PI * 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return new THREE.ShapeGeometry(shape);
})();

export const buildFruit = (id: FlavorId, baseSize: number, index: number): Fruit => {
  const size = baseSize * 0.85;
  const owned: { dispose(): void }[] = [];
  const own = <T extends { dispose(): void }>(item: T): T => {
    owned.push(item);
    return item;
  };
  const group = new THREE.Group();

  switch (id) {
    case "blueberry": {
      const skin = own(drawSkin("#3a4bbb", "#141c66", "#9aa8ff"));
      const material = own(
        new THREE.MeshPhysicalMaterial({
          map: skin,
          roughness: 0.55,
          sheen: 0.4,
          sheenColor: new THREE.Color("#6f80ff"),
          clearcoat: 0.15,
          envMapIntensity: 0.55,
          bumpMap: skin,
          bumpScale: 0.4,
        }),
      );
      const berry = new THREE.Mesh(sphere, material);
      berry.scale.set(1, 0.9, 1);
      const crownMat = own(new THREE.MeshStandardMaterial({ color: "#0f1650", roughness: 0.8 }));
      const crown = new THREE.Mesh(star, crownMat);
      crown.scale.setScalar(0.3);
      crown.rotation.x = -Math.PI / 2;
      crown.position.y = 0.9 * 0.99;
      group.add(berry, crown);
      group.scale.setScalar(size * 0.78);
      break;
    }
    case "lime": {
      const face = own(drawLimeFace());
      const peel = own(new THREE.MeshStandardMaterial({ color: "#2f8f2a", roughness: 0.45 }));
      const cut = own(new THREE.MeshPhysicalMaterial({ map: face, roughness: 0.5, clearcoat: 0.5, envMapIntensity: 0.6 }));
      const geo = own(new THREE.CylinderGeometry(1, 1, 0.16, 56));
      const wheel = new THREE.Mesh(geo, [peel, cut, cut]);
      group.add(wheel);
      group.scale.setScalar(size * 1.05);
      break;
    }
    case "cherry": {
      const skin = own(drawSkin("#e0243f", "#7a0719", "#ff9aa8"));
      const material = own(
        new THREE.MeshPhysicalMaterial({ map: skin, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.1, envMapIntensity: 0.8 }),
      );
      const a = new THREE.Mesh(sphere, material);
      const b = new THREE.Mesh(sphere, material);
      a.position.set(-0.85, -0.5, 0);
      b.position.set(0.8, -0.65, 0.1);
      a.scale.setScalar(0.85);
      b.scale.setScalar(0.92);
      const stemMat = own(new THREE.MeshStandardMaterial({ color: "#5a7a2a", roughness: 0.7 }));
      const curveA = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-0.85, 0.3, 0),
        new THREE.Vector3(-0.5, 1.4, 0),
        new THREE.Vector3(0, 1.7, 0),
      );
      const curveB = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0.8, 0.2, 0.1),
        new THREE.Vector3(0.6, 1.3, 0),
        new THREE.Vector3(0, 1.7, 0),
      );
      const tubeA = own(new THREE.TubeGeometry(curveA, 20, 0.05, 8));
      const tubeB = own(new THREE.TubeGeometry(curveB, 20, 0.05, 8));
      group.add(a, b, new THREE.Mesh(tubeA, stemMat), new THREE.Mesh(tubeB, stemMat));
      group.scale.setScalar(size * 0.7);
      break;
    }
    case "mango": {
      const skin = own(drawSkin("#ffc23a", "#e8501a", "#fff1a8"));
      const material = own(new THREE.MeshPhysicalMaterial({ map: skin, roughness: 0.45, clearcoat: 0.4, envMapIntensity: 0.6 }));
      const mango = new THREE.Mesh(sphere, material);
      mango.scale.set(1, 1.25, 0.85);
      mango.rotation.z = -0.35;
      group.add(mango);
      group.scale.setScalar(size * 0.85);
      break;
    }
    case "grape": {
      const skin = own(drawSkin("#8a4bd8", "#2c0e63", "#d9b8ff"));
      const material = own(
        new THREE.MeshPhysicalMaterial({ map: skin, roughness: 0.35, clearcoat: 0.6, sheen: 0.3, envMapIntensity: 0.6 }),
      );
      const spots: [number, number, number][] = [
        [0, 0.9, 0], [-0.75, 0.2, 0.1], [0.75, 0.2, -0.1], [-0.4, -0.55, 0.4],
        [0.45, -0.5, -0.3], [0, -1.15, 0.1], [0, 0.05, 0.7],
      ];
      for (const [x, y, z] of spots) {
        const g = new THREE.Mesh(sphere, material);
        g.position.set(x, y, z);
        g.scale.setScalar(0.52);
        group.add(g);
      }
      group.scale.setScalar(size * 0.9);
      break;
    }
    default:
      break;
  }

  group.rotation.set(index * 1.3, index * 0.7, index * 0.4);
  return {
    object: group,
    dispose: () => owned.forEach((item) => item.dispose()),
  };
};
