
import { Mesh} from 'three'
import * as THREE from 'three'
//import {mergedMaterial} from './topography/material'
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

export class mergedGeometryMethod extends Mesh {
    constructor(geometry){
        super()
        const mergedGeometries = BufferGeometryUtils.mergeBufferGeometries(geometry)
        mergedGeometries.computeVertexNormals()
        this.geometry = mergedGeometries
        this.material = new THREE.MeshLambertMaterial()
    }
}
