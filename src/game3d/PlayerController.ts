import * as THREE from 'three';
import { GameSettings } from '../types/game';

export class PlayerController {
  private camera: THREE.PerspectiveCamera;
  private domElement: HTMLElement;
  private settings: GameSettings;

  // Euler angles for camera rotation
  private euler = new THREE.Euler(0, 0, 0, 'YXZ');
  private minPolarAngle = 0.1;
  private maxPolarAngle = Math.PI - 0.1;

  // Keyboard state
  private keys = {
    KeyW: false,
    KeyA: false,
    KeyS: false,
    KeyD: false,
    ArrowUp: false,
    ArrowLeft: false,
    ArrowDown: false,
    ArrowRight: false,
  };

  // Virtual movement input for mobile
  public virtualMove = { x: 0, y: 0 };

  // Pointer state
  private isPointerLocked: boolean = false;
  private isMouseDown: boolean = false;
  private lastTouchX: number = 0;
  private lastTouchY: number = 0;

  // Platform walking bounds
  private bounds = {
    minX: 1.8,
    maxX: 5.2,
    minZ: 1.8,
    maxZ: 5.2,
    eyeHeight: 1.75,
  };

  // Interaction key callback
  public onInteractRequest: (() => void) | null = null;
  public onPauseRequest: (() => void) | null = null;

  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement, settings: GameSettings) {
    this.camera = camera;
    this.domElement = domElement;
    this.settings = settings;

    this.euler.setFromQuaternion(this.camera.quaternion);

    this.bindEvents();
  }

  public updateSettings(newSettings: GameSettings) {
    this.settings = newSettings;
  }

  private bindEvents() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);

    this.domElement.addEventListener('click', this.onClick);
    this.domElement.addEventListener('mousemove', this.onMouseMove);
    this.domElement.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);

    // Touch controls for mobile look
    this.domElement.addEventListener('touchstart', this.onTouchStart, { passive: false });
    this.domElement.addEventListener('touchmove', this.onTouchMove, { passive: false });
    this.domElement.addEventListener('touchend', this.onTouchEnd);

    // PointerLock state sync
    document.addEventListener('pointerlockchange', this.onPointerLockChange);
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if ((this.keys as any)[e.code] !== undefined) {
      (this.keys as any)[e.code] = true;
    }
    if (e.code === 'Escape') {
      this.onPauseRequest?.();
    }
  };

  private onKeyUp = (e: KeyboardEvent) => {
    if ((this.keys as any)[e.code] !== undefined) {
      (this.keys as any)[e.code] = false;
    }
  };

  private onClick = () => {
    // Attempt pointer lock on desktop if not locked
    if (!this.isPointerLocked && window.matchMedia('(hover: hover)').matches) {
      try {
        this.domElement.requestPointerLock?.();
      } catch (_) {}
    }
  };

  private onMouseDown = () => {
    this.isMouseDown = true;
  };

  private onMouseUp = () => {
    this.isMouseDown = false;
  };

  private onPointerLockChange = () => {
    this.isPointerLocked = document.pointerLockElement === this.domElement;
  };

  private onMouseMove = (e: MouseEvent) => {
    if (!this.isPointerLocked && !this.isMouseDown) return;

    const movementX = e.movementX || 0;
    const movementY = e.movementY || 0;

    const sens = 0.0022 * this.settings.mouseSensitivity;
    const invertY = this.settings.invertY ? -1 : 1;

    this.euler.y -= movementX * sens;
    this.euler.x -= movementY * sens * invertY;
    this.euler.x = Math.max(Math.PI / 2 - this.maxPolarAngle, Math.min(Math.PI / 2 - this.minPolarAngle, this.euler.x));

    this.camera.quaternion.setFromEuler(this.euler);
  };

  private onTouchStart = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      // Touch on right half of screen controls look
      const touch = e.touches[0];
      if (touch.clientX > window.innerWidth * 0.35) {
        this.lastTouchX = touch.clientX;
        this.lastTouchY = touch.clientY;
      }
    }
  };

  private onTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      if (touch.clientX > window.innerWidth * 0.35) {
        const deltaX = touch.clientX - this.lastTouchX;
        const deltaY = touch.clientY - this.lastTouchY;
        this.lastTouchX = touch.clientX;
        this.lastTouchY = touch.clientY;

        const sens = 0.0035 * this.settings.mouseSensitivity;
        const invertY = this.settings.invertY ? -1 : 1;

        this.euler.y -= deltaX * sens;
        this.euler.x -= deltaY * sens * invertY;
        this.euler.x = Math.max(
          Math.PI / 2 - this.maxPolarAngle,
          Math.min(Math.PI / 2 - this.minPolarAngle, this.euler.x)
        );

        this.camera.quaternion.setFromEuler(this.euler);
      }
    }
  };

  private onTouchEnd = () => {};

  public lookAt(x: number, y: number, z: number) {
    this.camera.lookAt(x, y, z);
    this.euler.setFromQuaternion(this.camera.quaternion);
  }

  public update(delta: number) {
    // Calculate movement vector
    let forward = 0;
    let sideways = 0;

    if (this.keys.KeyW || this.keys.ArrowUp) forward += 1;
    if (this.keys.KeyS || this.keys.ArrowDown) forward -= 1;
    if (this.keys.KeyD || this.keys.ArrowRight) sideways += 1;
    if (this.keys.KeyA || this.keys.ArrowLeft) sideways -= 1;

    // Merge mobile virtual movement
    sideways += this.virtualMove.x;
    forward += this.virtualMove.y;

    if (forward !== 0 || sideways !== 0) {
      const moveSpeed = 3.5 * delta;

      // Extract horizontal forward & right vectors
      const forwardVec = new THREE.Vector3(0, 0, -1).applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        this.euler.y
      );
      const rightVec = new THREE.Vector3(1, 0, 0).applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        this.euler.y
      );

      const moveDir = new THREE.Vector3()
        .addScaledVector(forwardVec, forward)
        .addScaledVector(rightVec, sideways)
        .normalize()
        .multiplyScalar(moveSpeed);

      const targetX = this.camera.position.x + moveDir.x;
      const targetZ = this.camera.position.z + moveDir.z;

      // Clamp within observation deck bounds
      this.camera.position.x = Math.max(this.bounds.minX, Math.min(this.bounds.maxX, targetX));
      this.camera.position.z = Math.max(this.bounds.minZ, Math.min(this.bounds.maxZ, targetZ));
    }

    this.camera.position.y = this.bounds.eyeHeight;
  }

  public dispose() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    this.domElement.removeEventListener('click', this.onClick);
    this.domElement.removeEventListener('mousemove', this.onMouseMove);
    this.domElement.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
    this.domElement.removeEventListener('touchstart', this.onTouchStart);
    this.domElement.removeEventListener('touchmove', this.onTouchMove);
    this.domElement.removeEventListener('touchend', this.onTouchEnd);
    document.removeEventListener('pointerlockchange', this.onPointerLockChange);
  }
}
