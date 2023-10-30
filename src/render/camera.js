import * as THREE from 'three'
import { animationSheet } from '../animations/animation'

import { PerspectiveCamera } from 'three'

class RootCamera extends PerspectiveCamera {
    constructor() {
      super(35, window.innerWidth /window.innerHeight , 0.001, 100000)
      this.position.set(0, 0, 101.27290185799079);
      this.targetPosition = new THREE.Vector3(0, 0, 0)
      this.lookAt(this.targetPosition)
      this.updateProjectionMatrix()
    }
}

const camera = new RootCamera()
animationSheet.cameraAnimation(camera)
export default camera