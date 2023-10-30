import * as THREE from 'three'
import { animationSheet } from '../animations/animation'
import { PerspectiveCamera } from 'three'
import { GUI } from 'dat.gui'

class RootCamera extends PerspectiveCamera {
    constructor() {
      super(35, window.innerWidth /window.innerHeight , 0.001, 100000)
      this.position.set(0, 0, 101.27290185799079);
      this.targetPosition = new THREE.Vector3(0, 0, 0)
      //调整相机的偏移，使得在7168 x 1600的分辨率下能保持正中心
      //this.setViewOffset( window.innerWidth, window.innerHeight, 400, -110, window.innerWidth, window.innerHeight, );
      this.lookAt(this.targetPosition)
      this.updateProjectionMatrix()
    }
}

const camera = new RootCamera()
animationSheet.cameraAnimation(camera)
export default camera

const gui = new GUI()
const cameraFolder = gui.addFolder('THREE.Camera')
cameraFolder.add(camera, "fov", 10, 100).onChange(function(newvalue){
  camera.updateProjectionMatrix();
}).name('camera.fov');

cameraFolder.add(camera.rotation, "x", -2 * Math.PI, 2 * Math.PI).onChange(function(){
  camera.updateProjectionMatrix();
}).name('camera.rotation').step(0.00001);

cameraFolder.add(camera.rotation, "y", -2 * Math.PI, 2 * Math.PI).onChange(function(){
  camera.updateProjectionMatrix();
}).name('camera.rotation').step(0.00001);

cameraFolder.add(camera.rotation, "z", -2 * Math.PI, 2 * Math.PI).onChange(function(){
  camera.updateProjectionMatrix();
}).name('camera.rotation').step(0.00001);


// cameraFolder.add(camera.targetObject.position, 'x').min(-2000).max(2000).step(0.001).name('targetX')
// cameraFolder.add(camera.targetObject.position, 'y').min(-2000).max(2000).step(0.001).name('targetY')
// cameraFolder.add(camera.targetObject.position, 'z').min(-2000).max(2000).step(0.001).name('targetZ')