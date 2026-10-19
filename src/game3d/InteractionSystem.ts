import * as THREE from 'three';
import { SceneManager } from './SceneManager';

export interface InteractionTarget {
  id: string;
  label: string;
  description: string;
}

export class InteractionSystem {
  private raycaster = new THREE.Raycaster();
  private sceneManager: SceneManager;
  private currentHover: InteractionTarget | null = null;
  public onHoverChange: ((target: InteractionTarget | null) => void) | null = null;

  constructor(sceneManager: SceneManager) {
    this.sceneManager = sceneManager;
    this.raycaster.far = 4.5; // realistic reach distance from platform
  }

  public update() {
    // Cast ray from center of camera viewport
    this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.sceneManager.camera);

    let foundTarget: InteractionTarget | null = null;

    for (const item of this.sceneManager.interactiveObjects) {
      const intersects = this.raycaster.intersectObject(item.object, true);
      if (intersects.length > 0) {
        foundTarget = {
          id: item.id,
          label: item.label,
          description: item.description,
        };
        break;
      }
    }

    if (
      (!this.currentHover && foundTarget) ||
      (this.currentHover && !foundTarget) ||
      (this.currentHover && foundTarget && this.currentHover.id !== foundTarget.id)
    ) {
      this.currentHover = foundTarget;
      this.onHoverChange?.(this.currentHover);
    }
  }

  public getCurrentHover(): InteractionTarget | null {
    return this.currentHover;
  }
}
