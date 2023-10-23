import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {earth} from '/sphere.js'

import * as constant from '/utilities/constants.js'
import { longlatToCoordinates} from '/utilities/constants.js'
import { Turbines } from'/windTurbine/turbines.js'
import { Mountains } from '/topography/Mountains'

import light from '/render/directionalLight'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.add(light)
/**
 * Object
 */
scene.add(earth)

//createTile
const tileWidth = 85.276 * 0.003
const tileHeight = 111  * 0.003

// //createTurbine
// let url = '山西广灵.csv'
// let positionTle = []
// let turbines = new THREE.Group()

// async function createTurbine(){

//     const radius = 3  * 0.003  * 0.1
//     const height = 90 * 0.003  * 0.1
//     await loadFileAndPrintToConsole(url) 

//     for (let i = 0; i < positionTle.length; i ++){
//         const turbine = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height) , new THREE.MeshBasicMaterial({ color: 0xfffff0, wireframe: false }))
//         turbines.add(turbine)

//         let positionX = positionTle[i].positionX - 114
//         let positionZ = positionTle[i].positionZ  - 40
//         const turbinePosition = new THREE.Vector3(positionX * tileWidth, -positionZ * tileHeight, 0.0)
//         turbine.rotation.x = -Math.PI/2
//         turbine.position.copy(turbinePosition)
//     }
// }

// //createTurbine()

// const center = longlatToCoordinates(new THREE.Vector2(39, 114))

// //setting position
// turbines.position.copy(center)
// var lookVector = turbines.position.clone()
// lookVector.normalize().multiplyScalar(5)
// lookVector = turbines.position.clone().add(lookVector)
// turbines.lookAt(lookVector)
// //scene.add(turbines)

// async function loadFileAndPrintToConsole(url) {
//     try {
//       const response = await fetch(url);    //响应成功
//       const data = await response.text();   //读取出文件中的信息
//       console.log(data)
//       readintoLines(data)
//     } catch (err) {
//       console.error(err);
//     }
// }

// function readintoLines(data){               //对于文件做一个分割与读取, 得到为对象格式的tle
//     let splitData= data.split('\r\n') 
    
//     for(let i=0;i<splitData.length;i+=1){
//         let turbineTle = splitData[i].split(',')
//         let turbinePosition = {
//             name: turbineTle[0],
//             positionX: Number(turbineTle[1]),
//             positionZ: Number(turbineTle[2]),
//         }
//         positionTle.push(turbinePosition)
//     }
// }
const mountains = await new Mountains(scene)
//const turbines= new Turbines(scene, )

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(40, sizes.width / sizes.height, 0.1, 100)
camera.position.set(-36.17444101804413, -1.3149238903600657, 101.27290185799079)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()