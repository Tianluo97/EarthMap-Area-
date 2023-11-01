import * as THREE from 'three'
import {Mesh} from 'three'
import { _earthRadius } from '/utilities/constants.js'
import {EarthMaterial} from './material/earthGlobeMaterial'
import {EarthAtmosphereMaterial} from './material/earthAtmosphereMaterial.js'
import {CloudLayer1Material} from './material/earthCloudMaterial1.js'

import { GUI } from 'dat.gui'

export class Earth {
    constructor() {
        
        const group = new THREE.Group();
        const geometry = new THREE.SphereGeometry(_earthRadius, 64 * 2, 32 * 2); 
        
        const earth = new THREE.Mesh(geometry, new EarthMaterial())
        earth.rotation.y = -Math.PI
        const earthAtmosphere = new THREE.Mesh(geometry, new EarthAtmosphereMaterial())
        earthAtmosphere.scale.set(1.05, 1.05, 1.05)
        
        const gui = new GUI()
        gui.add(earthAtmosphere.scale, 'x').min(0.0).max(2.0).name('scaleX').step(0.0001)
        gui.add(earthAtmosphere.scale, 'y').min(0.0).max(2.0).name('scaleY').step(0.0001)
        gui.add(earthAtmosphere.scale, 'z').min(0.0).max(2.0).name('scaleZ').step(0.0001)

        const earthCloud = new THREE.Mesh(geometry, new CloudLayer1Material()) 

        earthCloud.geometry.dispose()
        
		group.add(earth);
        group.add(earthAtmosphere);
        group.add(earthCloud)

        return group
    }  
}