import { DirectionalLight } from "three";
import { CameraHelper } from "three";
import { Object3D } from "three";

//directionalLight
class SideLight extends DirectionalLight {
   constructor(){
      super(0xffe0aa, 0.5)
      this.castShadow = true;
      this.shadow.mapSize.set(4096,4096)
      this.shadow.camera.near = 0;
      this.shadow.camera.far = 10;
      this.shadow.camera.left = -1;
      this.shadow.camera.right = 2;
      this.shadow.camera.top = 2;
      this.shadow.camera.bottom = -5;
      this.shadow.bias = -0.001

      this.targetObject = new Object3D(); 
      this.targetObject.position.set(0.0200,  2,  19.0000)
      this.target = this.targetObject
      this.position.set(6, -6,  21) //27.74, -97.8, 107.02
      this.shadowHelper = new CameraHelper(this.shadow.camera)
   }
}

const sideLight = new SideLight()
export default sideLight

