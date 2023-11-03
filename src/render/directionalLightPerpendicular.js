import { DirectionalLight } from "three";
import { CameraHelper } from "three";
import { Object3D } from "three";

//directionalLight
class PerpendicularLight extends DirectionalLight {
   constructor(){
    super(0xffffff, 0.5)
    this.castShadow = true;
    this.shadow.mapSize.set(4096,4096)
    this.shadow.camera.near = 0;
    this.shadow.camera.far = 20;
    this.shadow.camera.left = -1;
    this.shadow.camera.right = 2;
    this.shadow.camera.top = 2;
    this.shadow.camera.bottom = -5;
    this.shadow.bias = -0.001
    //this.position.set(4.19, 15, 26.65)

    this.targetObject = new Object3D(); 
    this.targetObject.position.set(0,  -0.12000000000000001,  20.01)
    this.target = this.targetObject
    this.position.set(-0.5, -0.1, 20.05)
    this.shadowHelper = new CameraHelper(this.shadow.camera)
   }
}

const perpendicularLight = new PerpendicularLight()
export default perpendicularLight

