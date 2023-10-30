import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {earth} from '/sphere.js'

import * as constant from '/utilities/constants.js'
import { longlatToCoordinates, center} from '/utilities/constants.js'
import { Turbines } from'/windTurbine/turbines.js'
import { Mountains } from '/topography/Mountains'

import light from '/render/directionalLight'
import { addGUI } from './helper/gui'
import {animationSheet} from './animations/animation'
import camera from './render/camera'
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.add(light)
const helper = new THREE.DirectionalLightHelper( light, 5 );
scene.add( helper );

addGUI(light)

/**
 * Object
 */
scene.add(earth)

const turbines= await new Turbines(scene)
const mountains = await new Mountains(scene, turbines.turbineGroup)

const _kmScale = 20/6378
const tileWidth = 85.276 * _kmScale
const tileHeight = 111  * _kmScale
const testPlane = new THREE.Mesh(new THREE.PlaneGeometry(tileWidth,tileHeight,1), new THREE.MeshLambertMaterial())
testPlane.position.copy(center)
//testPlane.position.set(0,0, 20)
testPlane.rotation.set(-0.7252609053826057, 0.3216092814144043, 0.2731862631967506)

const test = new THREE.Group()
test.add(earth)
test.add(mountains.turbineGroup)
test.add(mountains.mountainsGroup)

scene.add(test)
animationSheet.earthAnimation(test)

window.addEventListener('click', () => {
    console.log(test.children[1].rotation)
})

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

let aspect = sizes.width / sizes.height;
const cameraHelp = new THREE.PerspectiveCamera( 30, 0.5 * aspect, 1, 10000 );
cameraHelp.position.z = 22;
// cameraHelp.position.x = -10;
//cameraHelp.position.x = 100;

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

scene.add(camera)
const helper1 = new THREE.CameraHelper( camera );
scene.add( helper1 );


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
let deltaTime

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    deltaTime = clock.getDelta() + 0.05
    console.log(deltaTime)

    // Update controls
    //controls.update()
    renderer.autoClear = false;
    renderer.clear()

    turbines.update(deltaTime)

    //renderer.setViewport( 0, 0, sizes.width / 2, sizes.height );
    renderer.render(scene, camera)

    // helper1.update()
    // renderer.setViewport( sizes.width / 2, 0, sizes.width / 2, sizes.height  );
	// renderer.render( scene, cameraHelp );

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()