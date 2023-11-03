import { Mesh, Object3D, Float32BufferAttribute} from 'three'
import { PlaneGeometry} from 'three'
import {tileWidth, tileHeight, _kmScale, _mToKm, center} from '../utilities/constants'
import { GUI } from 'dat.gui'
import {mergedMaterial} from './material/topographyMaterial'

export class Mountain extends Mesh {
    constructor(data) {
        super()
        this.originDivision = 1800  //未被分段前的division

        //构建好geometry的高度
        this.buildGeometry(data)
        //this.buildSegmentGeometry(data)

        //计算uv
        this.setUv(this.geometry, data.index)

        //计算法线
        this.geometry.computeVertexNormals();
        
        //改变位置
        this.setPosition(this.geometry, data.index)
 
        //calculate boundingBox
        this.geometry.computeBoundingBox();
        this.material = mergedMaterial

        //shadowCast
        this.castShadow = true
        this.receiveShadow = true
    }

    buildGeometry(data){

        //1200 division
        this.geometry = new PlaneGeometry(
            tileWidth,
            tileHeight,
            this.originDivision,
            this.originDivision
        )
        //this.geometry.rotateX(-Math.PI/2.0)
        const arr1 = new Array(this.geometry.attributes.position.count);
        const arr = arr1.fill(1);

        switch(this.originDivision){
            case 1200:
                arr.forEach((a, index) => {
                    const row = Math.floor(index / (1200 + 1));
                    this.geometry.attributes.position.setZ(index, (data[3*row*((1200 * 3)+1) + (index % (1200 + 1)) * 3]* _mToKm * _kmScale));
                });
            break;
            
            case 1800:
                arr.forEach((a, index) => {
                    const row = Math.floor(index / (1800 + 1));
                    this.geometry.attributes.position.setZ(index, (data[2*row*((1800 * 2)+1) + (index % (1800 + 1)) * 2]* _mToKm * _kmScale ));
                });
            break;
            
            default:
                arr.forEach((a, index) => {
                    this.geometry.attributes.position.setZ(index, (data[index]* _mToKm * _kmScale));
                });
        }
    }

    buildSegmentGeometry(data){

        let segmentDivision = 3600
        let x = 0, y = 0

        this.geometry = new PlaneGeometry(
            tileWidth * segmentDivision/this.originDivision ,
            tileHeight * segmentDivision/this.originDivision ,
            segmentDivision,
            segmentDivision
        )
        this.geometry.rotateX(-Math.PI/2.0)
        const arr = new Array(this.geometry.attributes.position.count).fill(1);

        for (let i =0; i < segmentDivision + 1; i++){
            for (let j = 0; j < segmentDivision + 1; j ++){
                let originIndex = j + i * (segmentDivision + 1)
                let newIndex = (x + j) + (y + i) * (this.originDivision  + 1);
                this.geometry.attributes.position.setZ(originIndex, (data[newIndex] * scale));
            }
        }
    }

    setUv(geometry, index){

        const uvs = [];

        const gridX =  this.originDivision
        const gridY =  this.originDivision
        const gridY1 = this.originDivision + 1
        const gridX1 = this.originDivision + 1
        
		for ( let iy = 0; iy < gridY1; iy ++ ) {
			for ( let ix = 0; ix < gridX1; ix ++ ) { 
                const uvX = ix / gridX
                const uvY = 1.0 - ( iy / gridY )
				// uvs.push( uvX * 0.5 + (index < 2 ? 0.5 : 0.0));        
                // //写死的功能模块，index是0或1的时候，uv的x坐标平移0.5
				// uvs.push( uvY * 0.5 + (index % 2 === 0 ? 0.0 : 0.5));

                if (index == 0){
                    uvs.push( uvX * 0.5 + 0.0);
                    uvs.push( uvY * 0.5 + 0.0);
                }
                if (index == 1) {
                    uvs.push( uvX * 0.5 + 0.5);
                    uvs.push( uvY * 0.5 + 0.0);
                }
                if (index == 2) {
                    uvs.push( uvX * 0.5 + 0.0);
                    uvs.push( uvY * 0.5 + 0.5);
                }
                if (index == 3) {
                    uvs.push( uvX * 0.5 + 0.5);
                    uvs.push( uvY * 0.5 + 0.5);
                }
			}   
		}
        geometry.setAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );
    }

    setPosition(geometry, i){ 

        switch(i) {
            case 0:
                geometry.translate(-tileWidth/2, -tileHeight/2, 0) 
              break;
            case 1:
                geometry.translate(tileWidth/2, -tileHeight/2, 0) 
              break;
            case 2:
                geometry.translate(-tileWidth/2, tileHeight/2, 0) 
              break;
            case 3:
                geometry.translate(tileWidth/2, tileHeight/2, 0) 
              break;
            case 4:
                geometry.translate(-tileWidth - tileWidth/2, -tileHeight/2, 0) 
              break;
            case 5:
                geometry.translate(-tileWidth - tileWidth/2, tileHeight/2, 0) 
              break;
          }
    }
}