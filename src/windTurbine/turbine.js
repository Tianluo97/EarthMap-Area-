import * as THREE from 'three'
import {Object3D} from 'three'
//import { turbineScale} from '../utilities/constants'
//import { GUI } from 'dat.gui'
//import {animationSheet} from '../animation/animation'

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
                    element.material = new THREE.MeshStandardMaterial({color: 0xffffff})
                }
                else {
                    element.children.forEach(element => {
                        element.material = new THREE.MeshStandardMaterial({color: 0xffffff})
                    })
                }
            });
        }

        this.windTurbine= gltf.scene.clone()

        //this.windTurbine.scale.set(turbineScale, turbineScale, turbineScale) //HEIGHT 90M
        this.windTurbine.rotation.y = 0.9
        //animationSheet.createTurbineAnimation(this.windTurbine)
        //this.testCylinder = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 90 * scale), new THREE.MeshBasicMaterial({color: 0xffff00}))
        
        //this.scene.add(this.windTurbine)
        //this.scene.add(this.testCylinder)
        
        this.circularDiagram = this.addCircularDiagram()
        this.scene.add(this.circularDiagram)
        //animationSheet.createCircleAnimation(this.circularDiagram.children[2])  

        this.mixer = new THREE.AnimationMixer(this.windTurbine )    
        let action = this.mixer.clipAction(gltf.animations[0])  
        action.play()     
    }

    //根据自己设定的bounday来随机排布风机（已弃用）
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

    //根据csv提供的风机具体位置来排布风机
    setLocation (turbinePosition, intersectObj){

        //开始计算风机的相交处，然后设定风机的y值
        let dir = new THREE.Vector3(0,1,0)
        let raycaster, origin, intersectObject
        origin = new THREE.Vector3(turbinePosition.x, 0, turbinePosition.z)
        raycaster = new THREE.Raycaster(origin, dir)
        intersectObject = raycaster.intersectObjects(intersectObj)

        if (intersectObject.length> 0){
            turbinePosition.y = intersectObject[0].point.y
        }else{
            console.log("no intersect")
        }
        
        //排布风机的位置
        this.windTurbine.position.copy(turbinePosition)
        //console.log(this.windTurbine.position)
        this.testCylinder.position.copy(this.windTurbine.position)
        this.circularDiagram.position.copy(this.windTurbine.position)
        this.circularDiagram.position.y += 0.5
    }

    update(deltaTime){
        this.mixer.update(deltaTime)
    }

    addCircularDiagram(){

      //OuterCircle
      const OuterCircle = new THREE.Mesh(new THREE.CircleGeometry( 2.5, 100 ), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.3}))
      
      //BoundaryCircle
      const radius   = 2.5,
            segments = 100,
            material = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 0.5, transparent: true, opacity: 0.8} ),
            geometry = new THREE.CircleGeometry( radius, segments );
                                                
      const itemSize = 3;
      geometry.setAttribute('position',
        new THREE.BufferAttribute(
            geometry.attributes.position.array.slice(itemSize, geometry.attributes.position.array.length - itemSize), itemSize
        )
      );
      geometry.index = null;
      const StrokeCircle = new THREE.LineLoop(geometry, material)
      
      //innerCircle
      const InterCircle = new THREE.Mesh(new THREE.CircleGeometry( 0.5, 100 ), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 1.0}))

    //   animationSheet.createCircleAnimation(InterCircle)  
    //   animationSheet.createCircleAnimation(StrokeCircle)  
    //   animationSheet.createCircleAnimation2(OuterCircle)   

      //circleGroup
      const circleGroup = new THREE.Group()
      circleGroup.add(StrokeCircle, OuterCircle, InterCircle)
      circleGroup.rotation.x = -Math.PI/2
      return circleGroup   
    }
}