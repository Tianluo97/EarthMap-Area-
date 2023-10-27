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

const mountains = await new Mountains(scene)
const testPlane = new THREE.Mesh(new THREE.PlaneGeometry(10,10,1), new THREE.MeshLambertMaterial({color: 0xffffff}))
//scene.add(testPlane)
const turbines= new Turbines(scene, [mountains.mountains[0], mountains.mountains[1]])
 
window.addEventListener('dbclick', ()=>{
    console.log(camera.position)
})

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
const camera = new THREE.PerspectiveCamera(40, sizes.width / sizes.height, 0.1, 100000)
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