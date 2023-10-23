/**** 此方法为通用方法，将山体进行合并后进行export */

import * as THREE from 'three'
import { Mesh, Object3D, Float32BufferAttribute} from 'three'
import {PlaneGeometry} from 'three'; 
import {geometryWidth, geometryHeight} from '../utilities/constants'
import { GUI } from 'dat.gui'
import {mergedMaterial} from './topographyMaterial'
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

export class ExportMountain extends Mesh {
    constructor(data) {
        super()

        let geometry = []
        this.setUv()

        for(let i = 0; i < 4; i++){
            geometry[i] = new PlaneGeometry(
                geometryWidth,
                geometryHeight,
                1200,
                1200
            )
            const arr1 = new Array(geometry[i].attributes.position.count);
            const arr = arr1.fill(1);
            arr.forEach((a, index) => {
                const row = Math.floor(index / (1200 + 1));
                geometry[i].attributes.position.setZ(index, (data[i][3*row*((1200 * 3)+1) + (index % (1200 + 1)) * 3]/120 ));
            });
            geometry[i].setIndex( this.indices );
            geometry[i].setAttribute( 'uv', new Float32BufferAttribute( this.uvs, 2 ) );
            geometry[i].computeVertexNormals();
                    
            //change geometry position
            geometry[i].rotateX(-Math.PI/2)
            geometry[i].translate(0, 0, -geometryHeight * (i % 2))
            if(i == 2 || i == 3) {
                geometry[i].translate(-geometryWidth,0,0)
            }
            else if(i == 4|| i == 5) {
                geometry[i].translate(geometryWidth,0,0)
            }
        }
        const mergedGeometries = BufferGeometryUtils.mergeBufferGeometries(geometry)
        mergedGeometries.computeVertexNormals()

        this.geometry = mergedGeometries
        this.material = mergedMaterial
        console.log(this)
    }

    setUv (){

        const gridX = Math.floor( 1200 );
		const gridY = Math.floor( 1200 );

        const gridX1 = gridX + 1;
		const gridY1 = gridY + 1;

		const segment_width = geometryWidth / gridX;
		const segment_height = geometryHeight / gridY;

        const width_half = geometryWidth / 2;
		const height_half = geometryHeight / 2;

        this.indices = [];
		const vertices = [];
		const normals = [];
		this.uvs = [];

		for ( let iy = 0; iy < gridY1; iy ++ ) {

			const y = iy * segment_height - height_half;

			for ( let ix = 0; ix < gridX1; ix ++ ) {

				const x = ix * segment_width - width_half;

				vertices.push( x, - y, 0 );

				normals.push( 0, 0, 1 );

				this.uvs.push( ix / gridX );
				this.uvs.push( 1 - ( iy / gridY ) );

			}

		}

		for ( let iy = 0; iy < gridY; iy ++ ) {
			for ( let ix = 0; ix < gridX; ix ++ ) {
				const a = ix + gridX1 * iy;
				const b = ix + gridX1 * ( iy + 1 );
				const c = ( ix + 1 ) + gridX1 * ( iy + 1 );
				const d = ( ix + 1 ) + gridX1 * iy;
				this.indices.push( a, b, d );
				this.indices.push( b, c, d );
			}

		}
	}
}

