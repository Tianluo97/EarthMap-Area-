import * as THREE from 'three'
import {Object3D} from 'three'
import {turbineScale, center} from '../utilities/constants'
//import { GUI } from 'dat.gui'
import {animationSheet} from '../animations/animation'

export class Turbine extends Object3D {
    constructor(scene, gltf) {
        super()
        this.scene= scene;
        for(const child of gltf.scene.children)
        {   
            child.receiveShadow = true;
            child.castShadow = true
            
            child.children.forEach(element => {
                if(element.type === 'Mesh'){
                    element.material = new THREE.MeshStandardMaterial({color: 0xffffff, transparent: true, opacity: 1.0})
                }
                else {
                    element.children.forEach(element => {
                        element.material = new THREE.MeshStandardMaterial({color: 0xffffff, transparent: true, opacity: 1.0})
                    })
                }
            });
        }

        this.windTurbine= gltf.scene.clone()

        /**
         * 调整风机的位置与尺度
         */
        this.windTurbine.scale.set(turbineScale, turbineScale, turbineScale) //HEIGHT 90M
        //this.windTurbine.rotation.y = 0.9   
        //this.windTurbine.rotation.x = Math.PI/2   
        //animationSheet.createTurbineAnimation(this.windTurbine)   

        //this.scene.add(this.windTurbine)
        
        this.circularDiagram = this.addCircularDiagram()
        //this.scene.add(this.circularDiagram)
        //animationSheet.createCircleAnimation(this.circularDiagram.children[2])  

        this.mixer = new THREE.AnimationMixer(this.windTurbine)    
        let action = this.mixer.clipAction(gltf.animations[0])  
        action.play()     

        //this.testCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 90 * turbineScale), new THREE.MeshBasicMaterial({color: 0xffff00, wireframe: true}))
        //this.scene.add(this.testCylinder)
    }

    /**
     * 根据自己设定的bounday来随机排布风机（已弃用）
     */
    findLocation(boundaryPosition, intersectObj){
        const centerPosition = new THREE.Vector3(centroid.x, 0.0, -centroid.y)
        centerPosition.sub(boundaryPosition)
        centerPosition.multiplyScalar(Math.random())
        boundaryPosition.add(centerPosition) 

        let dir = new THREE.Vector3(0,1,0)
        let raycaster, origin, intersectObject
        origin = new THREE.Vector3(boundaryPosition.x, 0, boundaryPosition.z)
        raycaster = new THREE.Raycaster(origin, dir)
        intersectObject = raycaster.intersectObject(intersectObj)
        
        if (intersectObject.length> 0){
            boundaryPosition.y = intersectObject[0].point.y
        }else{
            console.log("no intersect")
        }
        this.windTurbine.position.copy(boundaryPosition)
        this.testCylinder.position.copy(this.windTurbine.position)
        this.circularDiagram.position.copy(this.windTurbine.position)
    }

    /**
     * 根据csv提供的风机具体位置来计算风机应该处于的高度
     */
    calculateHeightPosition (turbinePosition, intersectObj){

        //开始计算风机的相交处，然后设定风机的y值
        let dir = new THREE.Vector3(0,0,1)
        let raycaster, origin, intersectObject
        origin = new THREE.Vector3(turbinePosition.x, turbinePosition.y, 0)
        raycaster = new THREE.Raycaster(origin, dir)
        intersectObject = raycaster.intersectObjects(intersectObj)

        if (intersectObject.length> 0){
            turbinePosition.z = intersectObject[0].point.z
            console.log(intersectObject[0].point.z)
        }else{
            console.log("no intersect")
        }
        
        //排布风机的位置
        this.windTurbine.position.copy(turbinePosition)
        //this.testCylinder.position.copy(this.windTurbine.position)
        //this.circularDiagram.position.copy(this.windTurbine.position)
        //this.circularDiagram.position.y += 0.5
    }

    /**
     * 根据csv提供的风机具体位置与高度来排布风机
     */
    setLocation (turbinePosition){
        this.windTurbine.position.copy(turbinePosition)
        this.circularDiagram.position.copy(this.windTurbine.position)
        this.circularDiagram.position.z += 0.005
    }

    update(deltaTime){
        this.mixer.update(deltaTime)
    }

    addCircularDiagram(){

      //OuterCircle
      const outerRadius = 0.001
      const innerRadius = outerRadius/5

      const OuterCircle = new THREE.Mesh(new THREE.CircleGeometry( outerRadius, 100 ), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.3}))
 
      //BoundaryCircle

       const segments = 100,
            material = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 0.5, transparent: true, opacity: 0.8} ),
            geometry = new THREE.CircleGeometry( outerRadius, segments );
                                                
      const itemSize = 3;
      geometry.setAttribute('position',
        new THREE.BufferAttribute(
            geometry.attributes.position.array.slice(itemSize, geometry.attributes.position.array.length - itemSize), itemSize
        )
      );
      geometry.index = null;
      const StrokeCircle = new THREE.LineLoop(geometry, material)

      //innerCircle
      const InterCircle = new THREE.Mesh(new THREE.CircleGeometry( innerRadius, 100 ), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 1.0}))

      animationSheet.turbineAnimation(InterCircle)  
      animationSheet.turbineAnimation(StrokeCircle)  
      animationSheet.turbineAnimation(OuterCircle)   
      
      //circleGroup
      const circleGroup = new THREE.Group()
      circleGroup.add(OuterCircle, InterCircle)
      //circleGroup.add(OuterCircle)
      //circleGroup.rotation.x = -Math.PI/2
      return circleGroup   
    }

    setLongLat(turbine){
        turbine.position.copy(center)
        var lookVector = turbine.position.clone()
        lookVector.normalize().multiplyScalar(5)
        lookVector = turbine.position.clone().add(lookVector)
        turbine.lookAt(lookVector)
      }
}
