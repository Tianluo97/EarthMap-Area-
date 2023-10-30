import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Turbine } from'/windTurbine/turbine'
import {windTurbineNumber, tileWidth, tileHeight, center} from '../utilities/constants'
//import {animationSheet} from '../animation/animation'

export class Turbines extends THREE.Group {
    constructor(scene, intersectObj) {
        super()
        this.type = "turbines";
        this.scene = scene                      //传进scene场景，绑定scene属性
        this.intesectObj = intersectObj           
        this.turbines = []        //绑定turbines的属性
        this.turbineGroup = new THREE.Group()
        let url= '../data/windTurbines/山西广灵.csv'   
        let url1= '../data/windTurbines/山西广灵高度.csv'  
        this.loadFileAndPrintToConsole(url, url1)  
        this.addTurbines().catch(error => {     //在方法中把turbine依次添加到场景中，并绑定到turbines属性上
            console.error(error);
        });
    }

    async addTurbines(){
        const gltfLoader = new GLTFLoader()
        const gltfData = await gltfLoader.loadAsync('/windTurbine/models/turbineHorizontal.glb')         //load gltf模型
        gltfData.scene.traverse(function (child) {
            child.receiveShadow = true
            child.castShadow = true
        })

        //windPosition
        for(let i = 0; i < windTurbineNumber; i++){             //加载完成模型后，依次把模型添加到场景中去

            let turbine= new Turbine(this.scene, gltfData)   

            let positionX = this.positionTle[i].positionX - 114
            let positionY = this.positionTle[i].positionY - 40
            let positionZ = this.positionTle[i].positionZ
            const turbinePosition = new THREE.Vector3(
            positionX * tileWidth, positionY * tileHeight, positionZ)
            turbine.setLocation(turbinePosition)

            this.turbines[i]= turbine  
            this.turbineGroup.add(turbine.windTurbine)
            this.turbineGroup.add(turbine.circularDiagram)
        }
    }

    async loadFileAndPrintToConsole(url, url1) {
        try {
          const response1 = await fetch(url1);
          const data1 = await response1.text();
          const response = await fetch(url);
          const data = await response.text();
          this.readintoLines(data, data1)
        } catch (err) { 
          console.error(err);
        }
    }

    readintoLines(data, data1){
        let splitData= data.split('\r\n')     //mac是\n，windows是\r\n
        let heightTle = data1.split('\r\n')
        this.positionTle = []
        console.log(this.positionTle)
        for(let i=0;i<splitData.length;i+=1){
            let turbineTle = splitData[i].split(',')
            let turbinePosition = {
                name: turbineTle[0],
                positionX: Number(turbineTle[1]),
                positionY: Number(turbineTle[2]),
                positionZ: Number(heightTle[i])
            }
            this.positionTle.push(turbinePosition)
        }
    }

    update(deltaTime){
        this.turbines.forEach(element =>
        element.update(deltaTime))
    }
}
