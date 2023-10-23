import * as THREE from 'three'

//createTurbine
let url = '山西广灵.csv'
let positionTle = []
let turbines = []

async function createTurbine(){

    const radius = 3  * 0.003  * 0.1
    const height = 90 * 0.003  * 0.1

    for (let i = 0; i < 53; i ++){
        const turbine = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height) , new THREE.MeshBasicMaterial({ color: 0xfffff0, wireframe: false }))
        scene.add(turbine)
        turbines.push(turbine)
        await loadFileAndPrintToConsole(url) 
        
        let positionX = positionTle[i].positionX - 114
        let positionZ = positionTle[i].positionZ  - 40
        const turbinePosition = new THREE.Vector3(positionX * tileWidth, -positionZ * tileHeight, 0.0)
        turbines[i].rotation.x = -Math.PI/2
        turbines[i].position.copy(turbinePosition)
    }
}

createTurbine()

async function loadFileAndPrintToConsole(url) {
    try {
      const response = await fetch(url);    //响应成功
      const data = await response.text();   //读取出文件中的信息
      readintoLines(data)
    } catch (err) {
      console.error(err);
    }
}

function readintoLines(data){               //对于文件做一个分割与读取, 得到为对象格式的tle
    let splitData= data.split('\r\n') 
    
    for(let i=0;i<splitData.length;i+=1){
        let turbineTle = splitData[i].split(',')
        let turbinePosition = {
            name: turbineTle[0],
            positionX: Number(turbineTle[1]),
            positionZ: Number(turbineTle[2]),
        }
        positionTle.push(turbinePosition)
    }
}
