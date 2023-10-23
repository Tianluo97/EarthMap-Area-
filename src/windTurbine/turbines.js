import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Turbine } from'/windTurbine/turbine'
import {windTurbineNumber, tileWidth, tileHeight} from '../utilities/constants'
//import {animationSheet} from '../animation/animation'

export class Turbines extends THREE.Group {
    constructor(scene, intersectObj) {
        super()
        this.type = "turbines";
        this.scene = scene                      //传进scene场景，绑定scene属性
        this.intesectObj = intersectObj             
        this.addTurbines().catch(error => {     //在方法中把turbine依次添加到场景中，并绑定到turbines属性上
            console.error(error);
        });
        this.turbines = []        //绑定turbines的属性
        let url= '../data/windTurbines/山西广灵.csv'   
        this.loadFileAndPrintToConsole(url)
    }

    async addTurbines(){
        const gltfLoader = new GLTFLoader()
        const gltfData = await gltfLoader.loadAsync('/windTurbine/models/turbineSolid.glb')         //load gltf模型
        gltfData.scene.traverse(function (child) {
            child.receiveShadow = true
            child.castShadow = true
        })

        //let windOriginalPosition
        for(let i = 0; i < windTurbineNumber; i++){             //加载完成模型后，依次把模型添加到场景中去
            
            let turbine= new Turbine(this.scene, gltfData)   
            
            //let boundaryPosition = new THREE.Vector3().fromBufferAttribute(boundaryGeometry.attributes.position, i); 
            //turbine.findLocation(boundaryPosition, this.intesectObj)    //设定好风场的boundary，然后在其中分布风机

            let positionX = this.positionTle[i].positionX - 114.5
            let positionZ = this.positionTle[i].positionZ  - 39.5
            const turbinePosition = new THREE.Vector3(positionX * tileWidth, 0.0, -positionZ * tileHeight)
            turbine.setLocation(turbinePosition, this.intesectObj)

            this.turbines[i]=turbine                           
        }
        
    }

    async loadFileAndPrintToConsole(url) {
        try {
          const response = await fetch(url);
          const data = await response.text();
          this.readintoLines(data)
        } catch (err) {
          console.error(err);
        }
    }

    readintoLines(data){
        let splitData= data.split('\r\n') 
        this.positionTle =[]
        for(let i=0;i<splitData.length;i+=1){
            let turbineTle = splitData[i].split(',')
            let turbinePosition = {
                name: turbineTle[0],
                positionX: Number(turbineTle[1]),
                positionZ: Number(turbineTle[2]),
            }
            this.positionTle.push(turbinePosition)
        }
    }

    update(deltaTime){
        this.turbines.forEach(element =>
        element.update(deltaTime))
    }
}
