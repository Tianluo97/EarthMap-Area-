//***此方法对于mountain的点数进行细分，以便于更好地进行材质贴图的精细化 */

import * as THREE from 'three'
import { Mesh, Object3D} from 'three'
import { PlaneGeometry
 } from 'three'
import {geometryWidth, geometryHeight} from '../utilities/constants'
import { GUI } from 'dat.gui'
import {mergedMaterial} from './topographyMaterial'

export class MountainDivision extends Mesh {
    constructor(data) {
        super()

        const division = 900
        this.geometry = new PlaneGeometry(
            geometryWidth,
            geometryHeight,
            division * 2,
            division * 2
        )
        this.geometry.rotateX(-Math.PI/2.0)
        const arr1 = new Array(this.geometry.attributes.position.count);
        const arr = arr1.fill(1);

        for(let i = 0; i<arr.length+1; i++){
            const row = Math.floor(i / (division * 2 + 1)) 
            const col = Math.floor(i % (division * 2 + 1))

            let height = 25
            if (row % 2 === 0){
                if(col % 2 === 0) {
                    const dataIndex = row/2 * (division + 1) + col/2 ;   //找到未扩容之前的矩形
                    const dataIndexTransform = dataIndex + row/2 * (3600 - division)  //找到矩形在数据中的对应数值
                    this.geometry.attributes.position.array[i*3 + 1] = data[dataIndexTransform]/height;
                }
                else {
                    const dataIndexBefore = row/2 * (division + 1) + (col-1)/2
                    const dataIndexAfter = row/2 * (division + 1) + (col+1)/2

                    const dataIndexTransformBefore = dataIndexBefore + row/2 * (3600 - division )
                    const dataIndexTransformAfter = dataIndexAfter + row/2 * (3600 - division )
                    
                    const dataTransform = 0.5 *(data[dataIndexTransformBefore] + data[dataIndexTransformAfter])
                    //height = data[dataTransform] < 610 ? 110 : 100
                    this.geometry.attributes.position.array[i*3 + 1] = dataTransform/height;
                }
            }
        }

        for(let i = 0; i<arr.length; i++){
            const row = Math.floor(i/(division * 2 + 1)) 
            if (row % 2 !== 0){
                this.geometry.attributes.position.array[i*3 + 1] =  (this.geometry.attributes.position.array[(i- division * 2 - 1)*3 + 1] + this.geometry.attributes.position.array[( i + division * 2 + 1)*3 + 1])/2.0;
            }
        }
        
        // //进行切分
        // arr.forEach((a, index) => {
        //     const row = Math.floor(index/(division + 1))
        //     const dataIndex = index + row * (3600 - division)    
        //     this.geometry.attributes.position.setY(index, (data[dataIndex]/100));
        // });

        this.geometry.computeVertexNormals();
        //this.geometry.computeFaceNormals();
        this.geometry.computeTangents()

        //calculate boundingBox
        this.geometry.computeBoundingBox();
        this.material = mergedMaterial(this.geometry.boundingBox.min, this.geometry.boundingBox.max)
        //this.material = new THREE.MeshBasicMaterial({wireframe: false})

        //shadowCast
        this.castShadow = true
        this.receiveShadow = true
    }
}

// arr.forEach((a, index) => {
//     const row = Math.floor(index/(division + 1))
//     const col = Math.floor(index % (division + 1))
//     if(row % 2 === 0 ){
//         console.log(index, col)
//     }
//     const dataIndex = index + row * (3600 - division)
//     // this.geometry.attributes.position.setY(index, (data[dataIndex]/100));
// });
