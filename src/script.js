import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui';

import {sphere} from '/sphere.js'
import {Earth} from '/earth/earth Satellite'

import * as constant from '/utilities/constants.js'
import { longlatToCoordinates, center} from '/utilities/constants.js'
import { Turbines } from'/windTurbine/turbines.js'
import { Mountains } from '/topography/Mountains'

import light from '/render/directionalLight'
import {addGUI} from './helper/gui'
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
scene.add(helper);
addGUI(light)

/**
 * fog
 */
const parameters = {
    color: 0xffffff,
    height: 25
};

scene.fog = new THREE.FogExp2(parameters.color, 0.001)
// animationSheet.createFogAnimation(scene.fog)

const gui = new dat.GUI();
gui.add(scene.fog, 'density', 0, 0.02)

/**
 * Object
 */
const earth = new Earth()
//scene.add(earth)
const turbines= await new Turbines(scene)
const mountains = await new Mountains(scene, turbines.turbineGroup)

/**
 * Test
 */
const _kmScale = 20/6378
const tileWidth = 85.276 * _kmScale
const tileHeight = 111  * _kmScale
const testPlane = new THREE.Mesh(new THREE.PlaneGeometry(tileWidth * 2, tileHeight * 2,1), new THREE.MeshLambertMaterial({color: 0xffff00}))
testPlane.position.copy(center)
testPlane.rotation.set(-0.7252609053826057, 0.3216092814144043, 0.2731862631967506)
// testPlane.position.set(0, 0, 20)

const turbineTest = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 600 * 0.01 *  _kmScale), new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: false}))
turbineTest.position.copy(testPlane.position)
turbineTest.rotation.x = -Math.PI/2

//turbineTest.rotation.set(-0.7252609053826057, 0.3216092814144043, 0.2731862631967506)

/**
 * ObjectGroup
 */
const objectGroup = new THREE.Group()
//objectGroup.add(sphere)
objectGroup.add(earth)
objectGroup.add(mountains.turbineGroup)
objectGroup.add(mountains.mountainsGroup)
//objectGroup.add(testPlane)
//objectGroup.add(turbineTest)
scene.add(objectGroup)

animationSheet.earthAnimation(objectGroup)
animationSheet.atmosphereAnimation(objectGroup, objectGroup.children[0])


/**
 * camera rotation recording
 */
window.addEventListener('dblclick', () => {
    console.log(camera)
})

//_x: 0.5182061374903414, _y: 0, _z: 0, _w: 0.8552557506777382
// _x: 0.499685742059271, _y: -0.5003140605486474, _z: -0.4996857420592711, _w: 0.5003140605486475

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

scene.add(camera)
const helper1 = new THREE.CameraHelper( camera );
scene.add( helper1 );

let aspect = sizes.width / sizes.height;
const cameraHelp = new THREE.PerspectiveCamera( 30, 0.5 * aspect, 1, 10000 );
cameraHelp.position.z = 22;
//cameraHelp.position.x = -10;
//cameraHelp.position.x = 100;

/**
 * Controls
 */
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

    // Update controls
    //controls.update()

    //turbines.update(deltaTime)

    //renderer.setViewport( 0, 0, sizes.width / 2, sizes.height );
    renderer.render(scene, camera)

    // helper1.update()
    // renderer.setViewport( sizes.width / 2, 0, sizes.width / 2, sizes.height  );
	// renderer.render( scene, cameraHelp );

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()