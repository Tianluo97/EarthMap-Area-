import { DirectionalLight } from "three";
import { CameraHelper } from "three";
import { Object3D } from "three";

//directionalLight
class Light extends DirectionalLight {
   constructor(){
    super(0xffe0aa, 1.0)
    this.castShadow = true;
    this.shadow.mapSize.set(4096,4096)
    this.shadow.camera.near = 0;
    this.shadow.camera.far = 15;
    this.shadow.camera.left = -1;
    this.shadow.camera.right = 2;
    this.shadow.camera.top = 2;
    this.shadow.camera.bottom = -5;
    this.shadow.bias = -0.001

    this.targetObject = new Object3D(); 
    this.targetObject.position.set(0.0,  -0.15,  20.0000)
    this.target = this.targetObject
    this.position.set(4.2,  3.5,  20.4000) //24.66, 22.46, 51.09
    this.shadowHelper = new CameraHelper(this.shadow.camera)
   }
}

const light = new Light()
export default light

