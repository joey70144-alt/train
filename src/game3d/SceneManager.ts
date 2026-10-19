import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  createSwitchStand,
  createSignalMast,
  createObservationTower,
  createWorkerFigure,
  createLowPolyTree,
  createLowPolyRock,
  createTelegraphPole,
  createTunnelPortal,
} from './ProceduralModels';
import { TrainSystem, TrainPathChoice } from './TrainSystem';
import { Scenario } from '../types/game';

export class SceneManager {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public trainSystem: TrainSystem;

  // Interactive references
  public switchStand: ReturnType<typeof createSwitchStand>;
  public brakeValve: THREE.Group;
  public radioConsole: THREE.Group;
  public signalMast: ReturnType<typeof createSignalMast>;
  public interactiveObjects: {
    id: string;
    object: THREE.Object3D;
    label: string;
    description: string;
  }[] = [];

  // Groups and actors
  private mainWorkersGroup: THREE.Group;
  private branchWorkersGroup: THREE.Group;
  private tunnelGroup: THREE.Group;
  private rockObstacle: THREE.Mesh;
  private snowSystem: THREE.Points | null = null;
  private ambientLight: THREE.HemisphereLight;
  private dirLight: THREE.DirectionalLight;

  // Lever animation
  private isLeverSwitched: boolean = false;
  private leverAngle: number = -0.4;
  private targetLeverAngle: number = -0.4;

  // Disposed flag
  private isDisposed: boolean = false;

  constructor(container: HTMLElement) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      70,
      container.clientWidth / container.clientHeight,
      0.1,
      250
    );
    this.camera.position.set(3.5, 1.7, 4.0);

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      stencil: false,
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.renderer.domElement);

    // Studio Environment map
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Lighting
    this.ambientLight = new THREE.HemisphereLight(0x8eb2d5, 0x1a2430, 0.7);
    this.scene.add(this.ambientLight);

    this.dirLight = new THREE.DirectionalLight(0xffeedd, 1.4);
    this.dirLight.position.set(25, 35, 20);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.dirLight.shadow.camera.near = 1;
    this.dirLight.shadow.camera.far = 100;
    this.dirLight.shadow.camera.left = -30;
    this.dirLight.shadow.camera.right = 30;
    this.dirLight.shadow.camera.top = 30;
    this.dirLight.shadow.camera.bottom = -30;
    this.dirLight.shadow.bias = -0.0005;
    this.scene.add(this.dirLight);

    // Fog
    this.scene.fog = new THREE.FogExp2(0x1e2732, 0.015);

    // Base Terrain Ground
    const groundGeom = new THREE.PlaneGeometry(160, 200, 16, 16);
    groundGeom.rotateX(-Math.PI / 2);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x1b2220,
      roughness: 0.95,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.receiveShadow = true;
    ground.position.y = -0.05;
    this.scene.add(ground);

    // Tracks construction
    this.buildTracks();

    // Observation Tower (Platform where player stands)
    const tower = createObservationTower();
    tower.position.set(3.5, 0, 3.5);
    this.scene.add(tower);

    // Switch Stand
    this.switchStand = createSwitchStand();
    this.switchStand.group.position.set(2.4, 0.35, 1.8);
    this.scene.add(this.switchStand.group);
    this.interactiveObjects.push({
      id: 'switch_stand',
      object: this.switchStand.group,
      label: '操作道岔拉桿',
      description: '手動切換道岔方向（主線 / 側線）',
    });

    // Emergency Brake Valve Box
    this.brakeValve = this.buildBrakeValve();
    this.brakeValve.position.set(4.8, 0.9, 2.5);
    this.scene.add(this.brakeValve);
    this.interactiveObjects.push({
      id: 'brake_valve',
      object: this.brakeValve,
      label: '緊急死寂制動閥',
      description: '強制釋放列車氣壓煞車',
    });

    // Radio Dispatch Console
    this.radioConsole = this.buildRadioConsole();
    this.radioConsole.position.set(2.5, 0.9, 4.8);
    this.scene.add(this.radioConsole);
    this.interactiveObjects.push({
      id: 'radio_console',
      object: this.radioConsole,
      label: '調度通訊電台',
      description: '連線總調度室查核指示與遙測',
    });

    // Signal Mast
    this.signalMast = createSignalMast();
    this.signalMast.group.position.set(-2.2, 0, 5.0);
    this.scene.add(this.signalMast.group);

    // Train System
    this.trainSystem = new TrainSystem();
    this.scene.add(this.trainSystem.group);

    // Worker figures
    this.mainWorkersGroup = new THREE.Group();
    this.scene.add(this.mainWorkersGroup);

    this.branchWorkersGroup = new THREE.Group();
    this.scene.add(this.branchWorkersGroup);

    // Tunnel Portal & Obstacle
    this.tunnelGroup = createTunnelPortal();
    this.tunnelGroup.position.set(0, 0, -42);
    this.tunnelGroup.visible = false;
    this.scene.add(this.tunnelGroup);

    this.rockObstacle = createLowPolyRock(1.6);
    this.rockObstacle.position.set(0.2, 0.6, -35);
    this.rockObstacle.visible = false;
    this.scene.add(this.rockObstacle);

    // Environment Props: Trees, rocks, poles
    this.populateEnvironment();

    // Resize handler
    window.addEventListener('resize', this.onResize);
  }

  private onResize = () => {
    if (this.isDisposed || !this.renderer.domElement.parentElement) return;
    const parent = this.renderer.domElement.parentElement;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  /**
   * Builds the dual track network: Main straight line + Curved branch line
   */
  private buildTracks() {
    const tracksGroup = new THREE.Group();

    // 1. Ballast bed (gravel embankment)
    const ballastGeom = new THREE.BoxGeometry(4.2, 0.25, 120);
    const ballastMat = new THREE.MeshStandardMaterial({ color: 0x383838, roughness: 0.95 });
    const ballast = new THREE.Mesh(ballastGeom, ballastMat);
    ballast.position.set(0, 0.1, -10);
    ballast.receiveShadow = true;
    tracksGroup.add(ballast);

    // Curved ballast branch
    const branchBallastGeom = new THREE.BoxGeometry(4.0, 0.23, 60);
    branchBallastGeom.rotateY(-0.18);
    const branchBallast = new THREE.Mesh(branchBallastGeom, ballastMat);
    branchBallast.position.set(4.0, 0.09, -28);
    branchBallast.receiveShadow = true;
    tracksGroup.add(branchBallast);

    // 2. Wooden Sleepers (Ties)
    const tieGeom = new THREE.BoxGeometry(2.8, 0.15, 0.35);
    const tieMat = new THREE.MeshStandardMaterial({ color: 0x3a281c, roughness: 0.85 });

    // Main line ties from z = +45 down to -65
    for (let z = 45; z >= -65; z -= 1.0) {
      const tie = new THREE.Mesh(tieGeom, tieMat);
      tie.position.set(0, 0.25, z);
      tie.receiveShadow = true;
      tracksGroup.add(tie);
    }

    // Branch line ties curving off from z = 0 to z = -55
    for (let z = 0; z >= -55; z -= 1.0) {
      const progress = Math.min(1, Math.max(0, -z / 35));
      const ease = 0.5 - 0.5 * Math.cos(progress * Math.PI);
      const x = ease * 7.5;
      const angle = -Math.sin(progress * Math.PI) * 0.28;

      const tie = new THREE.Mesh(tieGeom, tieMat);
      tie.position.set(x, 0.25, z);
      tie.rotation.y = angle;
      tie.receiveShadow = true;
      tracksGroup.add(tie);
    }

    // 3. Steel Rails (Extruded or Box profiles)
    const railMat = new THREE.MeshStandardMaterial({
      color: 0x8f9aa6,
      metalness: 0.88,
      roughness: 0.25,
    });
    const railGeom = new THREE.BoxGeometry(0.12, 0.2, 120);

    // Main line Left rail (x = -0.9) and Right rail (x = +0.9)
    const leftRail = new THREE.Mesh(railGeom, railMat);
    leftRail.position.set(-0.9, 0.42, -10);
    leftRail.castShadow = true;
    tracksGroup.add(leftRail);

    const rightRail = new THREE.Mesh(railGeom, railMat);
    rightRail.position.set(0.9, 0.42, -10);
    rightRail.castShadow = true;
    tracksGroup.add(rightRail);

    // Branch line rails using smooth curve tubes
    const branchCurveL = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.9, 0.42, 0),
      new THREE.Vector3(0.1, 0.42, -15),
      new THREE.Vector3(3.2, 0.42, -30),
      new THREE.Vector3(6.6, 0.42, -50),
    ]);
    const branchRailL = new THREE.Mesh(
      new THREE.TubeGeometry(branchCurveL, 40, 0.08, 6, false),
      railMat
    );
    branchRailL.castShadow = true;
    tracksGroup.add(branchRailL);

    const branchCurveR = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.9, 0.42, 0),
      new THREE.Vector3(1.9, 0.42, -15),
      new THREE.Vector3(5.0, 0.42, -30),
      new THREE.Vector3(8.4, 0.42, -50),
    ]);
    const branchRailR = new THREE.Mesh(
      new THREE.TubeGeometry(branchCurveR, 40, 0.08, 6, false),
      railMat
    );
    branchRailR.castShadow = true;
    tracksGroup.add(branchRailR);

    this.scene.add(tracksGroup);
  }

  private buildBrakeValve(): THREE.Group {
    const valve = new THREE.Group();

    // Wall bracket
    const bracketGeom = new THREE.BoxGeometry(0.3, 0.4, 0.1);
    const bracketMat = new THREE.MeshStandardMaterial({ color: 0x1f2429, metalness: 0.8 });
    const bracket = new THREE.Mesh(bracketGeom, bracketMat);
    valve.add(bracket);

    // Red Emergency Handle
    const handleGeom = new THREE.TorusGeometry(0.18, 0.04, 8, 16);
    const handleMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626, // Bright red
      metalness: 0.5,
      roughness: 0.3,
    });
    const handle = new THREE.Mesh(handleGeom, handleMat);
    handle.position.z = 0.12;
    valve.add(handle);

    // Pressure gauge
    const gaugeGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.06, 12);
    gaugeGeom.rotateX(Math.PI / 2);
    const gauge = new THREE.Mesh(
      gaugeGeom,
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
    );
    gauge.position.set(0, 0.28, 0.08);
    valve.add(gauge);

    return valve;
  }

  private buildRadioConsole(): THREE.Group {
    const consoleGroup = new THREE.Group();

    // Table / Pedestal
    const deskGeom = new THREE.BoxGeometry(0.8, 0.8, 0.5);
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });
    const desk = new THREE.Mesh(deskGeom, deskMat);
    desk.position.y = -0.4;
    consoleGroup.add(desk);

    // Radio Unit
    const radioGeom = new THREE.BoxGeometry(0.6, 0.3, 0.35);
    const radioMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6 });
    const radio = new THREE.Mesh(radioGeom, radioMat);
    radio.position.y = 0.15;
    consoleGroup.add(radio);

    // Frequency display (glowing amber)
    const screenGeom = new THREE.PlaneGeometry(0.25, 0.08);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const screen = new THREE.Mesh(screenGeom, screenMat);
    screen.position.set(-0.1, 0.15, 0.18);
    consoleGroup.add(screen);

    // Handset / Microphone
    const micGeom = new THREE.CylinderGeometry(0.04, 0.05, 0.25, 8);
    const mic = new THREE.Mesh(micGeom, new THREE.MeshStandardMaterial({ color: 0x0f172a }));
    mic.position.set(0.2, 0.15, 0.15);
    consoleGroup.add(mic);

    return consoleGroup;
  }

  private populateEnvironment() {
    // Pine trees along perimeter
    const treePositions = [
      [-12, -15],
      [-16, -28],
      [-14, 5],
      [-18, 25],
      [14, -10],
      [18, -30],
      [16, 12],
      [20, 30],
      [-8, -45],
      [15, -48],
    ];

    treePositions.forEach(([x, z], i) => {
      const tree = createLowPolyTree(0.8 + (i % 3) * 0.25);
      tree.position.set(x, 0, z);
      this.scene.add(tree);
    });

    // Rocks
    const rockPositions = [
      [-9, -5],
      [-11, -35],
      [12, -22],
      [14, 5],
      [10, -40],
    ];
    rockPositions.forEach(([x, z], i) => {
      const rock = createLowPolyRock(0.9 + (i % 2) * 0.4);
      rock.position.set(x, 0, z);
      this.scene.add(rock);
    });

    // Telegraph poles along left track
    for (let z = 30; z >= -50; z -= 25) {
      const pole = createTelegraphPole();
      pole.position.set(-4.5, 0, z);
      this.scene.add(pole);
    }
  }

  /**
   * Configures scene for a specific scenario
   */
  public loadScenario(scenario: Scenario) {
    const cfg = scenario.sceneConfig;

    // Fog & Weather adjustments
    if (cfg.weather === 'foggy_dawn') {
      this.scene.fog = new THREE.FogExp2(0x273646, cfg.fogDensity);
      this.ambientLight.color.set(cfg.ambientColor);
      this.dirLight.color.set(cfg.lightColor);
      this.tunnelGroup.visible = false;
      this.rockObstacle.visible = false;
    } else if (cfg.weather === 'dusk_storm') {
      this.scene.fog = new THREE.FogExp2(0x2d222b, cfg.fogDensity);
      this.ambientLight.color.set(cfg.ambientColor);
      this.dirLight.color.set(cfg.lightColor);
      this.tunnelGroup.visible = true;
      this.rockObstacle.visible = true;
    } else if (cfg.weather === 'overcast_noon') {
      this.scene.fog = new THREE.FogExp2(0x38414b, cfg.fogDensity);
      this.ambientLight.color.set(cfg.ambientColor);
      this.dirLight.color.set(cfg.lightColor);
      this.tunnelGroup.visible = false;
      this.rockObstacle.visible = false;
    } else if (cfg.weather === 'midnight_snow') {
      this.scene.fog = new THREE.FogExp2(0x131926, cfg.fogDensity);
      this.ambientLight.color.set(cfg.ambientColor);
      this.dirLight.color.set(cfg.lightColor);
      this.tunnelGroup.visible = false;
      this.rockObstacle.visible = false;
      this.initSnow();
    }

    // Reposition camera
    this.camera.position.set(cfg.playerSpawn[0], cfg.playerSpawn[1], cfg.playerSpawn[2]);
    this.camera.lookAt(cfg.playerLookAt[0], cfg.playerLookAt[1], cfg.playerLookAt[2]);

    // Setup workers
    this.clearWorkers();
    this.setupWorkers(cfg.mainTrackVictims, cfg.branchTrackVictims);

    // Reset train
    this.trainSystem.reset();
    this.setSwitchState(false);

    // Reset lights on mast
    if (scenario.id === 'scenario-3') {
      // Blinking red warning on mast for scenario 3
      this.signalMast.redLight.material = new THREE.MeshBasicMaterial({ color: 0xff1111 });
      this.signalMast.greenLight.material = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.8,
      });
    } else {
      this.signalMast.greenLight.material = new THREE.MeshBasicMaterial({ color: 0x22ff44 });
      this.signalMast.redLight.material = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.8,
      });
    }
  }

  private setupWorkers(mainCount: number, branchCount: number) {
    // Place main track workers
    const mainZStart = -20;
    for (let i = 0; i < mainCount; i++) {
      const type = i % 2 === 0 ? 'standing' : 'kneeling';
      const figure = createWorkerFigure(type);
      const zOffset = mainZStart - i * 2.2;
      const xOffset = ((i % 3) - 1) * 0.45;
      figure.position.set(xOffset, 0.42, zOffset);
      figure.rotation.y = Math.PI + (i % 2 === 0 ? 0.2 : -0.3);
      this.mainWorkersGroup.add(figure);
    }

    // Place branch track workers
    const branchZStart = -22;
    for (let i = 0; i < branchCount; i++) {
      const figure = createWorkerFigure('inspecting');
      figure.position.set(5.2 + i * 1.0, 0.42, branchZStart - i * 2.0);
      figure.rotation.y = -Math.PI / 3;
      this.branchWorkersGroup.add(figure);
    }
  }

  private clearWorkers() {
    while (this.mainWorkersGroup.children.length > 0) {
      this.mainWorkersGroup.remove(this.mainWorkersGroup.children[0]);
    }
    while (this.branchWorkersGroup.children.length > 0) {
      this.branchWorkersGroup.remove(this.branchWorkersGroup.children[0]);
    }
  }

  private initSnow() {
    if (this.snowSystem) return;
    const count = 1200;
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = Math.random() * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xeeeeff,
      size: 0.15,
      transparent: true,
      opacity: 0.8,
    });
    this.snowSystem = new THREE.Points(geom, mat);
    this.scene.add(this.snowSystem);
  }

  public setSwitchState(isBranch: boolean) {
    this.isLeverSwitched = isBranch;
    this.targetLeverAngle = isBranch ? 0.4 : -0.4;
    this.trainSystem.setPath(isBranch ? 'BRANCH' : 'MAIN');

    // Update indicator disc
    (this.switchStand.indicatorDisc.material as THREE.MeshBasicMaterial).color.set(
      isBranch ? 0xffaa00 : 0x22ff44
    );
  }

  public toggleSwitch() {
    this.setSwitchState(!this.isLeverSwitched);
    return this.isLeverSwitched;
  }

  public getSwitchState(): boolean {
    return this.isLeverSwitched;
  }

  public update(delta: number) {
    if (this.isDisposed) return;

    // Smooth lever mechanical rotation
    this.leverAngle = THREE.MathUtils.damp(this.leverAngle, this.targetLeverAngle, 8, delta);
    this.switchStand.leverPivot.rotation.z = this.leverAngle;

    // Update train motion
    this.trainSystem.update(delta);

    // Update snow if present
    if (this.snowSystem) {
      const positions = this.snowSystem.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= delta * 3.5;
        if (positions[i] < 0) {
          positions[i] = 30;
        }
      }
      this.snowSystem.geometry.attributes.position.needsUpdate = true;
    }

    // Render frame
    this.renderer.render(this.scene, this.camera);
  }

  public dispose() {
    this.isDisposed = true;
    window.removeEventListener('resize', this.onResize);
    this.trainSystem.dispose();
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
