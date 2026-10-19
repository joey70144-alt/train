import * as THREE from 'three';

// Procedural materials cache
const materials = {
  steelRail: new THREE.MeshStandardMaterial({
    color: 0x9099a2,
    metalness: 0.85,
    roughness: 0.25,
  }),
  woodTie: new THREE.MeshStandardMaterial({
    color: 0x3d2b1f,
    metalness: 0.05,
    roughness: 0.85,
  }),
  ballast: new THREE.MeshStandardMaterial({
    color: 0x484848,
    roughness: 0.95,
  }),
  ground: new THREE.MeshStandardMaterial({
    color: 0x222a28,
    roughness: 0.9,
  }),
  trainDarkMetal: new THREE.MeshStandardMaterial({
    color: 0x1f2429,
    metalness: 0.8,
    roughness: 0.35,
  }),
  trainRedBody: new THREE.MeshStandardMaterial({
    color: 0x9b2c2c,
    metalness: 0.4,
    roughness: 0.4,
  }),
  trainOrangeStripe: new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.2,
    roughness: 0.5,
  }),
  trainWheel: new THREE.MeshStandardMaterial({
    color: 0x333b42,
    metalness: 0.9,
    roughness: 0.2,
  }),
  trainGlass: new THREE.MeshStandardMaterial({
    color: 0x88ccff,
    metalness: 0.1,
    roughness: 0.1,
    transparent: true,
    opacity: 0.7,
  }),
  headlightLens: new THREE.MeshBasicMaterial({
    color: 0xfff0aa,
  }),
  leverBase: new THREE.MeshStandardMaterial({
    color: 0x2b2b2b,
    metalness: 0.7,
    roughness: 0.4,
  }),
  leverHandle: new THREE.MeshStandardMaterial({
    color: 0xd97706, // vibrant warning handle
    metalness: 0.5,
    roughness: 0.3,
  }),
  signalRed: new THREE.MeshBasicMaterial({ color: 0xff2222 }),
  signalGreen: new THREE.MeshBasicMaterial({ color: 0x22ff44 }),
  signalYellow: new THREE.MeshBasicMaterial({ color: 0xffaa00 }),
  signalOff: new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 }),
  workerVest: new THREE.MeshStandardMaterial({
    color: 0xf97316, // neon orange safety vest
    roughness: 0.6,
  }),
  workerPants: new THREE.MeshStandardMaterial({
    color: 0x1e3a8a,
    roughness: 0.8,
  }),
  workerHelmet: new THREE.MeshStandardMaterial({
    color: 0xfacc15, // yellow helmet
    roughness: 0.4,
  }),
  workerSkin: new THREE.MeshStandardMaterial({
    color: 0xe0ac69,
    roughness: 0.7,
  }),
  pineLeaves: new THREE.MeshStandardMaterial({
    color: 0x1b382b,
    roughness: 0.85,
  }),
  treeTrunk: new THREE.MeshStandardMaterial({
    color: 0x422d20,
    roughness: 0.9,
  }),
  rock: new THREE.MeshStandardMaterial({
    color: 0x4a5568,
    roughness: 0.85,
    flatShading: true,
  }),
  tunnelWall: new THREE.MeshStandardMaterial({
    color: 0x27272a,
    roughness: 0.9,
  }),
};

/**
 * Creates a low-poly locomotive engine + tender + cars (Multi-part THREE.Group)
 */
export function createTrainModel(): { group: THREE.Group; wheels: THREE.Mesh[]; headlampLight: THREE.SpotLight } {
  const train = new THREE.Group();
  const wheels: THREE.Mesh[] = [];

  // 1. Locomotive Main Chassis & Boiler
  const chassisGeom = new THREE.BoxGeometry(2.4, 0.6, 9.0);
  const chassis = new THREE.Mesh(chassisGeom, materials.trainDarkMetal);
  chassis.position.y = 0.9;
  chassis.castShadow = true;
  train.add(chassis);

  // Boiler / Engine Hood
  const boilerGeom = new THREE.CylinderGeometry(1.0, 1.0, 5.8, 12);
  boilerGeom.rotateX(Math.PI / 2);
  const boiler = new THREE.Mesh(boilerGeom, materials.trainRedBody);
  boiler.position.set(0, 1.8, -1.2);
  boiler.castShadow = true;
  train.add(boiler);

  // Boiler Accent stripe
  const stripeGeom = new THREE.BoxGeometry(2.1, 0.15, 5.6);
  const stripe = new THREE.Mesh(stripeGeom, materials.trainOrangeStripe);
  stripe.position.set(0, 1.8, -1.2);
  train.add(stripe);

  // Cabin
  const cabinGeom = new THREE.BoxGeometry(2.3, 2.0, 2.6);
  const cabin = new THREE.Mesh(cabinGeom, materials.trainRedBody);
  cabin.position.set(0, 2.2, 2.6);
  cabin.castShadow = true;
  train.add(cabin);

  // Cabin Roof
  const roofGeom = new THREE.BoxGeometry(2.5, 0.2, 2.9);
  const roof = new THREE.Mesh(roofGeom, materials.trainDarkMetal);
  roof.position.set(0, 3.25, 2.6);
  train.add(roof);

  // Cabin Windows (Front & Sides)
  const fWindowGeom = new THREE.PlaneGeometry(0.8, 0.6);
  const fWin1 = new THREE.Mesh(fWindowGeom, materials.trainGlass);
  fWin1.position.set(-0.6, 2.4, 1.28);
  fWin1.rotation.y = Math.PI;
  train.add(fWin1);
  const fWin2 = fWin1.clone();
  fWin2.position.set(0.6, 2.4, 1.28);
  train.add(fWin2);

  // Smokestack & Domes
  const stackGeom = new THREE.CylinderGeometry(0.3, 0.22, 1.0, 8);
  const stack = new THREE.Mesh(stackGeom, materials.trainDarkMetal);
  stack.position.set(0, 2.9, -3.2);
  stack.castShadow = true;
  train.add(stack);

  const domeGeom = new THREE.SphereGeometry(0.4, 8, 8);
  const dome1 = new THREE.Mesh(domeGeom, materials.trainDarkMetal);
  dome1.position.set(0, 2.7, -1.8);
  train.add(dome1);

  // Cowcatcher (Front wedge)
  const cowcatcherGeom = new THREE.ConeGeometry(1.3, 1.0, 4);
  cowcatcherGeom.rotateY(Math.PI / 4);
  cowcatcherGeom.rotateX(-Math.PI / 2);
  const cowcatcher = new THREE.Mesh(cowcatcherGeom, materials.trainDarkMetal);
  cowcatcher.position.set(0, 0.6, -4.7);
  cowcatcher.castShadow = true;
  train.add(cowcatcher);

  // Headlight Housing & Beam
  const lampHousingGeom = new THREE.CylinderGeometry(0.35, 0.35, 0.5, 10);
  lampHousingGeom.rotateX(Math.PI / 2);
  const lampHousing = new THREE.Mesh(lampHousingGeom, materials.trainDarkMetal);
  lampHousing.position.set(0, 2.5, -4.1);
  train.add(lampHousing);

  const lampLensGeom = new THREE.CircleGeometry(0.32, 12);
  lampLensGeom.rotateY(Math.PI);
  const lampLens = new THREE.Mesh(lampLensGeom, materials.headlightLens);
  lampLens.position.set(0, 2.5, -4.36);
  train.add(lampLens);

  // Headlamp Spotlight
  const headlampLight = new THREE.SpotLight(0xfff0c0, 8, 45, Math.PI / 6, 0.5, 1);
  headlampLight.position.set(0, 2.5, -4.4);
  const lightTarget = new THREE.Object3D();
  lightTarget.position.set(0, 0, -25);
  train.add(lightTarget);
  headlampLight.target = lightTarget;
  train.add(headlampLight);

  // Wheels (3 pairs for engine)
  const wheelGeom = new THREE.CylinderGeometry(0.55, 0.55, 0.25, 12);
  wheelGeom.rotateZ(Math.PI / 2);
  const wheelPositionsZ = [-3.0, -1.2, 0.6, 2.2, 3.4];

  wheelPositionsZ.forEach((z) => {
    const leftWheel = new THREE.Mesh(wheelGeom, materials.trainWheel);
    leftWheel.position.set(-1.15, 0.55, z);
    leftWheel.castShadow = true;
    train.add(leftWheel);
    wheels.push(leftWheel);

    const rightWheel = new THREE.Mesh(wheelGeom, materials.trainWheel);
    rightWheel.position.set(1.15, 0.55, z);
    rightWheel.castShadow = true;
    train.add(rightWheel);
    wheels.push(rightWheel);

    // Axle
    const axleGeom = new THREE.CylinderGeometry(0.08, 0.08, 2.3, 6);
    axleGeom.rotateZ(Math.PI / 2);
    const axle = new THREE.Mesh(axleGeom, materials.trainDarkMetal);
    axle.position.set(0, 0.55, z);
    train.add(axle);
  });

  // 2. Trailing Freight Car 1 (Box car)
  const car1 = new THREE.Group();
  car1.position.set(0, 0, 7.5);

  const car1BodyGeom = new THREE.BoxGeometry(2.3, 2.2, 5.5);
  const car1Body = new THREE.Mesh(car1BodyGeom, materials.trainDarkMetal);
  car1Body.position.y = 1.9;
  car1Body.castShadow = true;
  car1.add(car1Body);

  const car1CouplerGeom = new THREE.BoxGeometry(0.3, 0.2, 1.2);
  const coupler1 = new THREE.Mesh(car1CouplerGeom, materials.trainDarkMetal);
  coupler1.position.set(0, 0.8, -3.2);
  car1.add(coupler1);

  [-1.8, 1.8].forEach((z) => {
    const wL = new THREE.Mesh(wheelGeom, materials.trainWheel);
    wL.position.set(-1.15, 0.55, z);
    wL.castShadow = true;
    car1.add(wL);
    wheels.push(wL);

    const wR = new THREE.Mesh(wheelGeom, materials.trainWheel);
    wR.position.set(1.15, 0.55, z);
    wR.castShadow = true;
    car1.add(wR);
    wheels.push(wR);
  });

  train.add(car1);

  // 3. Trailing Tanker Car 2 (Cylindrical tank)
  const car2 = new THREE.Group();
  car2.position.set(0, 0, 14.5);

  const tankGeom = new THREE.CylinderGeometry(1.0, 1.0, 5.2, 12);
  tankGeom.rotateX(Math.PI / 2);
  const tank = new THREE.Mesh(tankGeom, materials.trainOrangeStripe);
  tank.position.y = 1.8;
  tank.castShadow = true;
  car2.add(tank);

  const tankChassisGeom = new THREE.BoxGeometry(2.2, 0.4, 5.8);
  const tankChassis = new THREE.Mesh(tankChassisGeom, materials.trainDarkMetal);
  tankChassis.position.y = 0.8;
  car2.add(tankChassis);

  const coupler2 = new THREE.Mesh(car1CouplerGeom, materials.trainDarkMetal);
  coupler2.position.set(0, 0.8, -3.2);
  car2.add(coupler2);

  [-1.8, 1.8].forEach((z) => {
    const wL = new THREE.Mesh(wheelGeom, materials.trainWheel);
    wL.position.set(-1.15, 0.55, z);
    wL.castShadow = true;
    car2.add(wL);
    wheels.push(wL);

    const wR = new THREE.Mesh(wheelGeom, materials.trainWheel);
    wR.position.set(1.15, 0.55, z);
    wR.castShadow = true;
    car2.add(wR);
    wheels.push(wR);
  });

  train.add(car2);

  return { group: train, wheels, headlampLight };
}

/**
 * Creates low-poly human worker/figure (3-7 parts)
 */
export function createWorkerFigure(type: 'standing' | 'kneeling' | 'inspecting' = 'standing'): THREE.Group {
  const figure = new THREE.Group();

  // Torso with safety vest
  const torsoGeom = new THREE.BoxGeometry(0.44, 0.6, 0.28);
  const torso = new THREE.Mesh(torsoGeom, materials.workerVest);
  torso.position.y = type === 'kneeling' ? 0.6 : 1.1;
  torso.castShadow = true;
  figure.add(torso);

  // Head
  const headGeom = new THREE.BoxGeometry(0.24, 0.26, 0.24);
  const head = new THREE.Mesh(headGeom, materials.workerSkin);
  head.position.y = type === 'kneeling' ? 0.98 : 1.48;
  figure.add(head);

  // Hard hat helmet
  const helmetGeom = new THREE.CylinderGeometry(0.18, 0.16, 0.12, 8);
  const helmet = new THREE.Mesh(helmetGeom, materials.workerHelmet);
  helmet.position.y = type === 'kneeling' ? 1.14 : 1.64;
  figure.add(helmet);

  const brimGeom = new THREE.BoxGeometry(0.36, 0.04, 0.38);
  const brim = new THREE.Mesh(brimGeom, materials.workerHelmet);
  brim.position.y = type === 'kneeling' ? 1.09 : 1.59;
  figure.add(brim);

  // Legs
  const legGeom = new THREE.BoxGeometry(0.18, 0.7, 0.2);
  if (type === 'standing' || type === 'inspecting') {
    const leftLeg = new THREE.Mesh(legGeom, materials.workerPants);
    leftLeg.position.set(-0.12, 0.45, 0);
    leftLeg.castShadow = true;
    figure.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeom, materials.workerPants);
    rightLeg.position.set(0.12, 0.45, 0);
    rightLeg.castShadow = true;
    figure.add(rightLeg);
  } else {
    // Kneeling leg posture
    const kneeGeom = new THREE.BoxGeometry(0.18, 0.4, 0.5);
    const leftLeg = new THREE.Mesh(kneeGeom, materials.workerPants);
    leftLeg.position.set(-0.12, 0.25, 0.1);
    figure.add(leftLeg);

    const rightLeg = new THREE.Mesh(kneeGeom, materials.workerPants);
    rightLeg.position.set(0.12, 0.25, -0.1);
    figure.add(rightLeg);
  }

  // Tool / Clipboard
  if (type === 'inspecting') {
    const boardGeom = new THREE.BoxGeometry(0.25, 0.35, 0.04);
    const board = new THREE.Mesh(boardGeom, materials.treeTrunk);
    board.position.set(0.2, 1.15, 0.25);
    board.rotation.x = Math.PI / 4;
    figure.add(board);
  }

  return figure;
}

/**
 * Creates interactive Switch Stand with rotatable mechanical handle lever
 */
export function createSwitchStand(): {
  group: THREE.Group;
  leverPivot: THREE.Group;
  indicatorDisc: THREE.Mesh;
  interactiveMeshes: THREE.Object3D[];
} {
  const stand = new THREE.Group();

  // Foundation plate
  const baseGeom = new THREE.BoxGeometry(0.9, 0.15, 0.9);
  const base = new THREE.Mesh(baseGeom, materials.leverBase);
  base.position.y = 0.08;
  base.receiveShadow = true;
  stand.add(base);

  // Mechanism box
  const boxGeom = new THREE.BoxGeometry(0.5, 0.7, 0.5);
  const box = new THREE.Mesh(boxGeom, materials.leverBase);
  box.position.y = 0.5;
  box.castShadow = true;
  stand.add(box);

  // Lever Pivot Group (rotates on X or Z axis)
  const leverPivot = new THREE.Group();
  leverPivot.position.set(0, 0.8, 0);
  stand.add(leverPivot);

  // Lever Rod
  const rodGeom = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8);
  rodGeom.translate(0, 0.6, 0); // pivot at base of rod
  const rod = new THREE.Mesh(rodGeom, materials.steelRail);
  rod.castShadow = true;
  leverPivot.add(rod);

  // Lever Handle (orange warning grip)
  const handleGeom = new THREE.CylinderGeometry(0.07, 0.07, 0.35, 8);
  handleGeom.translate(0, 1.1, 0);
  const handle = new THREE.Mesh(handleGeom, materials.leverHandle);
  handle.castShadow = true;
  leverPivot.add(handle);

  // Mechanical Counterweight Sphere
  const counterweightGeom = new THREE.SphereGeometry(0.12, 8, 8);
  const counterweight = new THREE.Mesh(counterweightGeom, materials.trainDarkMetal);
  counterweight.position.set(0, 0.3, 0);
  leverPivot.add(counterweight);

  // Signal indicator disc attached to top
  const discGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.04, 12);
  discGeom.rotateX(Math.PI / 2);
  const indicatorDisc = new THREE.Mesh(discGeom, materials.signalGreen);
  indicatorDisc.position.set(0, 1.0, 0.3);
  stand.add(indicatorDisc);

  const interactiveMeshes = [box, handle, rod, base];

  return { group: stand, leverPivot, indicatorDisc, interactiveMeshes };
}

/**
 * Creates Signal Light Gantry (Mast + Light Heads)
 */
export function createSignalMast(): {
  group: THREE.Group;
  redLight: THREE.Mesh;
  greenLight: THREE.Mesh;
  yellowLight: THREE.Mesh;
} {
  const gantry = new THREE.Group();

  // Mast post
  const mastGeom = new THREE.CylinderGeometry(0.12, 0.15, 6.0, 8);
  const mast = new THREE.Mesh(mastGeom, materials.trainDarkMetal);
  mast.position.y = 3.0;
  mast.castShadow = true;
  gantry.add(mast);

  // Housing Box
  const boxGeom = new THREE.BoxGeometry(0.6, 1.8, 0.4);
  const box = new THREE.Mesh(boxGeom, materials.trainDarkMetal);
  box.position.set(0, 5.0, 0);
  gantry.add(box);

  // Hood shields & Lenses
  const lensGeom = new THREE.CircleGeometry(0.18, 12);
  lensGeom.rotateY(Math.PI);

  const redLight = new THREE.Mesh(lensGeom, materials.signalOff);
  redLight.position.set(0, 5.5, -0.21);
  gantry.add(redLight);

  const yellowLight = new THREE.Mesh(lensGeom, materials.signalOff);
  yellowLight.position.set(0, 5.0, -0.21);
  gantry.add(yellowLight);

  const greenLight = new THREE.Mesh(lensGeom, materials.signalGreen);
  greenLight.position.set(0, 4.5, -0.21);
  gantry.add(greenLight);

  return { group: gantry, redLight, greenLight, yellowLight };
}

/**
 * Creates Signal Observation Tower / Shelter platform
 */
export function createObservationTower(): THREE.Group {
  const tower = new THREE.Group();

  // Concrete Platform Foundation
  const foundationGeom = new THREE.BoxGeometry(4.2, 0.4, 4.2);
  const foundation = new THREE.Mesh(foundationGeom, materials.leverBase);
  foundation.position.y = 0.2;
  foundation.receiveShadow = true;
  tower.add(foundation);

  // Support pillars
  const pillarGeom = new THREE.BoxGeometry(0.2, 1.6, 0.2);
  [
    [-1.9, -1.9],
    [1.9, -1.9],
    [-1.9, 1.9],
    [1.9, 1.9],
  ].forEach(([x, z]) => {
    const pillar = new THREE.Mesh(pillarGeom, materials.trainDarkMetal);
    pillar.position.set(x, 1.0, z);
    pillar.castShadow = true;
    tower.add(pillar);
  });

  // Guard Rails
  const railHGeom = new THREE.BoxGeometry(4.0, 0.08, 0.08);
  const railH1 = new THREE.Mesh(railHGeom, materials.trainOrangeStripe);
  railH1.position.set(0, 1.2, 2.0);
  tower.add(railH1);
  const railH2 = new THREE.Mesh(railHGeom, materials.trainOrangeStripe);
  railH2.position.set(0, 1.2, -2.0);
  tower.add(railH2);

  // Roof Canopy
  const roofGeom = new THREE.BoxGeometry(4.4, 0.15, 4.4);
  const roof = new THREE.Mesh(roofGeom, materials.trainDarkMetal);
  roof.position.y = 3.6;
  tower.add(roof);

  return tower;
}

/**
 * Procedural low-poly pine tree
 */
export function createLowPolyTree(scale: number = 1.0): THREE.Group {
  const tree = new THREE.Group();

  // Trunk
  const trunkGeom = new THREE.CylinderGeometry(0.25 * scale, 0.35 * scale, 1.8 * scale, 6);
  const trunk = new THREE.Mesh(trunkGeom, materials.treeTrunk);
  trunk.position.y = 0.9 * scale;
  trunk.castShadow = true;
  tree.add(trunk);

  // 3 Layers of Foliage Cones
  const coneLayers = [
    { radius: 1.8 * scale, height: 2.2 * scale, y: 2.2 * scale },
    { radius: 1.4 * scale, height: 1.8 * scale, y: 3.4 * scale },
    { radius: 0.9 * scale, height: 1.5 * scale, y: 4.4 * scale },
  ];

  coneLayers.forEach((layer) => {
    const coneGeom = new THREE.ConeGeometry(layer.radius, layer.height, 7);
    const cone = new THREE.Mesh(coneGeom, materials.pineLeaves);
    cone.position.y = layer.y;
    cone.castShadow = true;
    tree.add(cone);
  });

  return tree;
}

/**
 * Procedural low-poly rock boulder
 */
export function createLowPolyRock(scale: number = 1.0): THREE.Mesh {
  const rockGeom = new THREE.DodecahedronGeometry(1.2 * scale, 1);
  // Slightly randomize vertices for distinct facets
  const pos = rockGeom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const vx = pos.getX(i);
    const vy = pos.getY(i);
    const vz = pos.getZ(i);
    const factor = 1 + (Math.sin(i * 3.7) * 0.18);
    pos.setXYZ(i, vx * factor, vy * factor * 0.75, vz * factor);
  }
  rockGeom.computeVertexNormals();

  const rock = new THREE.Mesh(rockGeom, materials.rock);
  rock.position.y = 0.6 * scale;
  rock.castShadow = true;
  rock.receiveShadow = true;
  return rock;
}

/**
 * Procedural Telegraph Pole with Wire Connectors
 */
export function createTelegraphPole(): THREE.Group {
  const pole = new THREE.Group();

  const mastGeom = new THREE.CylinderGeometry(0.14, 0.18, 7.5, 6);
  const mast = new THREE.Mesh(mastGeom, materials.treeTrunk);
  mast.position.y = 3.75;
  mast.castShadow = true;
  pole.add(mast);

  // Cross arm
  const armGeom = new THREE.BoxGeometry(2.4, 0.15, 0.15);
  const arm = new THREE.Mesh(armGeom, materials.treeTrunk);
  arm.position.y = 6.8;
  arm.castShadow = true;
  pole.add(arm);

  // Ceramic insulators
  [-1.0, -0.4, 0.4, 1.0].forEach((x) => {
    const insGeom = new THREE.CylinderGeometry(0.06, 0.08, 0.22, 6);
    const ins = new THREE.Mesh(insGeom, materials.steelRail);
    ins.position.set(x, 7.0, 0);
    pole.add(ins);
  });

  return pole;
}

/**
 * Procedural Tunnel Portal (Arch)
 */
export function createTunnelPortal(): THREE.Group {
  const portal = new THREE.Group();

  // Left & Right Portal Columns
  const colGeom = new THREE.BoxGeometry(2.5, 6.0, 4.0);
  const leftCol = new THREE.Mesh(colGeom, materials.tunnelWall);
  leftCol.position.set(-3.8, 3.0, 0);
  leftCol.castShadow = true;
  portal.add(leftCol);

  const rightCol = new THREE.Mesh(colGeom, materials.tunnelWall);
  rightCol.position.set(3.8, 3.0, 0);
  rightCol.castShadow = true;
  portal.add(rightCol);

  // Lintel / Top Arch
  const topGeom = new THREE.BoxGeometry(10.1, 3.0, 4.0);
  const top = new THREE.Mesh(topGeom, materials.tunnelWall);
  top.position.set(0, 7.5, 0);
  top.castShadow = true;
  portal.add(top);

  // Black dark interior plane
  const blackGeom = new THREE.PlaneGeometry(5.1, 6.0);
  const blackMat = new THREE.MeshBasicMaterial({ color: 0x050508 });
  const blackPlane = new THREE.Mesh(blackGeom, blackMat);
  blackPlane.position.set(0, 3.0, 2.0);
  portal.add(blackPlane);

  return portal;
}
