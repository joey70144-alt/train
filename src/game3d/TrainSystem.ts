import * as THREE from 'three';
import { createTrainModel } from './ProceduralModels';
import { sound } from '../audio/soundSystem';

export type TrainPathChoice = 'MAIN' | 'BRANCH';

export class TrainSystem {
  public group: THREE.Group;
  private trainModel: ReturnType<typeof createTrainModel>;
  private wheels: THREE.Mesh[];
  private currentProgress: number = 0; // 0 to 1 along the route
  private isRunning: boolean = false;
  private isBraking: boolean = false;
  private isDerailing: boolean = false;
  private speed: number = 14; // units per second
  private pathChoice: TrainPathChoice = 'MAIN';
  private totalLength: number = 90;
  private currentDistance: number = 0;
  private smokeParticles: THREE.Mesh[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.trainModel = createTrainModel();
    this.group.add(this.trainModel.group);
    this.wheels = this.trainModel.wheels;

    // Create smoke puff pool
    const smokeGeom = new THREE.DodecahedronGeometry(0.3, 0);
    const smokeMat = new THREE.MeshBasicMaterial({
      color: 0xcccccc,
      transparent: true,
      opacity: 0.4,
    });
    for (let i = 0; i < 15; i++) {
      const p = new THREE.Mesh(smokeGeom, smokeMat);
      p.visible = false;
      this.group.add(p);
      this.smokeParticles.push(p);
    }

    this.reset();
  }

  public reset(startDistance: number = -45) {
    this.currentDistance = startDistance; // Train starts at z = 35..45 approaching junction at z = 0
    this.isRunning = false;
    this.isBraking = false;
    this.isDerailing = false;
    this.pathChoice = 'MAIN';
    this.speed = 14;
    this.updateTransform(0);
  }

  public setPath(choice: TrainPathChoice) {
    this.pathChoice = choice;
  }

  public getPath(): TrainPathChoice {
    return this.pathChoice;
  }

  public startRunning(initialSpeed: number = 14) {
    this.speed = initialSpeed;
    this.isRunning = true;
    this.isBraking = false;
    this.isDerailing = false;
    sound.startTrainRumble();
    sound.playTrainHorn();
  }

  public triggerEmergencyBrake() {
    this.isBraking = true;
    sound.playEmergencyBrake();
  }

  public triggerDerail() {
    this.isDerailing = true;
    this.isBraking = true;
    sound.playEmergencyBrake();
  }

  public stop() {
    this.isRunning = false;
    this.isBraking = false;
    sound.stopTrainRumble();
  }

  public getPosition(): THREE.Vector3 {
    return this.trainModel.group.position;
  }

  public isFinished(): boolean {
    return this.currentDistance >= 40 || (!this.isRunning && this.currentDistance > -20);
  }

  public update(delta: number) {
    if (!this.isRunning) return;

    // Emergency braking deceleration
    if (this.isBraking) {
      this.speed = Math.max(0, this.speed - delta * 9.5);
      if (this.speed <= 0.05) {
        this.speed = 0;
        this.isRunning = false;
        sound.stopTrainRumble();
      }
    }

    // Distance progression
    const step = this.speed * delta;
    this.currentDistance += step;

    // Rotate wheels
    const wheelRot = step / 0.55;
    this.wheels.forEach((w) => {
      w.rotation.x += wheelRot;
    });

    this.updateTransform(delta);

    // Stop sound if train has passed
    if (this.currentDistance > 45) {
      this.isRunning = false;
      sound.stopTrainRumble();
    }
  }

  private updateTransform(delta: number) {
    // Coordinate layout:
    // Train moves from positive Z (e.g. +35) towards negative Z (e.g. -45)
    // Junction is at z = 0
    // Main track continues straight along x = 0, z from +40 to -50
    // Branch track curves to x = +7.0, z from 0 to -50
    const d = this.currentDistance; // d goes from -45 (start) to +45 (end)
    const z = -d; // start z = +45, junction z = 0, past junction z = -45

    let x = 0;
    let headingAngle = 0;

    if (z > 0) {
      // Approaching junction along straight main track
      x = 0;
      headingAngle = 0;
    } else {
      // Past junction (z <= 0)
      if (this.pathChoice === 'BRANCH') {
        // Curve to the right
        const progressPastJunction = Math.min(1, Math.max(0, -z / 35));
        // Smooth sine ease
        const ease = 0.5 - 0.5 * Math.cos(progressPastJunction * Math.PI);
        x = ease * 7.5;
        headingAngle = -Math.sin(progressPastJunction * Math.PI) * 0.28;
      } else {
        // Stay on main straight
        x = 0;
        headingAngle = 0;
      }
    }

    // Derail effect (tilts and skids sideways)
    if (this.isDerailing && z < -5) {
      x += (Math.random() - 0.5) * 0.15 + (z < -8 ? 1.5 : 0.4);
      headingAngle += 0.35;
      this.trainModel.group.rotation.z = THREE.MathUtils.damp(
        this.trainModel.group.rotation.z,
        0.3,
        4,
        delta
      );
    } else {
      this.trainModel.group.rotation.z = 0;
    }

    this.trainModel.group.position.set(x, 0, z);
    this.trainModel.group.rotation.y = headingAngle;
  }

  public dispose() {
    this.stop();
  }
}
