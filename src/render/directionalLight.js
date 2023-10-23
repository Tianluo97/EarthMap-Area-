import { DirectionalLight } from "three";
import { Object3D } from "three";

//directionalLight
class Light extends DirectionalLight {
   constructor(){
    super(0xffffff, 1.0)
    this.castShadow = true;
    this.shadow.mapSize.set(4096,4096)
    this.shadow.camera.near = 0.5;
    this.shadow.camera.far = 500;
    this.shadow.camera.left = -300;
    this.shadow.camera.right = 300;
    this.shadow.camera.top = 300;
    this.shadow.camera.bottom = -300;
    this.shadow.bias = -0.01
    //this.position.set(4.19, 15, 26.65)

    this.targetObject = new Object3D(); 
    this.targetObject.position.set(-500.3398748000024,  22.182241366938598,  -253.90140000000216)
    this.target = this.targetObject
    this.position.set(this.targetObject.position.x + 4.19, this.targetObject.position.y + 15, this.targetObject.position.z + 26.65)
   }
}

const light = new Light()
export default light
