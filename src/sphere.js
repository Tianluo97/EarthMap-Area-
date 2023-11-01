import * as THREE from 'three'
import { _earthRadius } from '/utilities/constants.js'
import { animationSheet }  from '/animations/animation.js'

const geometry = new THREE.SphereGeometry(_earthRadius, 360, 180); 
const material = new THREE.MeshBasicMaterial({color: 'blue', wireframe: true})

export const sphere = new THREE.Mesh(geometry, material)

//animationSheet.earthAnimation(earth)