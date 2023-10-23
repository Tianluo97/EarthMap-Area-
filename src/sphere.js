import * as THREE from 'three'
import { _earthRadius } from '/utilities/constants.js'

const geometry = new THREE.SphereGeometry(_earthRadius, 360, 180); 
const material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true})

export const earth = new THREE.Mesh(geometry, material)

