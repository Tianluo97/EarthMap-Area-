import * as THREE from 'three'
import {tileWidth, tileHeight, longlatToCoordinates} from '/utilities/constants.js'

const gridX = 1;
const gridY = 1;

const gridX1 = gridX + 1;
const gridY1 = gridY + 1;

const segment_width = 1 / gridX;
const segment_height = 1 / gridY;
const coordinatesCount = gridX1 * gridY1;

const indices = [];
const vertices = [];
const normals = [];
const uvs = [];
const coordinates = []

const center = longlatToCoordinates(new THREE.Vector2(39, 114))

//创建的方法一：直接在对应位置上进行创建    ****不适用****
function createGeographicalMesh(){

    //计算矩形上每个点的经纬度
    for ( let iy = 0; iy < gridY1; iy ++ ) {
        const x =  (40 + 1) - iy * segment_width;    //纬度
        for ( let ix = 0; ix < gridX1; ix ++ ) {
            const y =  113 + ix * segment_width;    //经度
            coordinates.push( new THREE.Vector2(x,y));
        }
        console.log(coordinates)
    }
    
    const indice = [];
    for ( let iy = 0; iy < gridY; iy ++ ) {
        for ( let ix = 0; ix < gridX; ix ++ ) {
        const a = ix + gridX1 * iy;
        const b = ix + gridX1 * ( iy + 1 );
        const c = ( ix + 1 ) + gridX1 * ( iy + 1 );
        const d = ( ix + 1 ) + gridX1 * iy;

        indice.push( a, b, d );
        indice.push( b, c, d );
        }
    }

    //把每个点转成坐标信息
    const vertexs = new Float32Array(coordinatesCount * 3);
    for(var index=0; index<coordinatesCount; index++){
        const u = (coordinates[index].y)/widthSegments;    //精度
        const v = (90-coordinates[index].x)/heightSegments;//纬度

        vertexs[index*3] = -radius * Math.cos( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );
        vertexs[index*3 +1] = radius  * (Math.cos( thetaStart + v * thetaLength ));
        vertexs[index*3 +2] = radius  * (Math.sin( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength ));
    }
    
    //create geometry
    const geometry  = new THREE.BufferGeometry();
    geometry.setIndex(indice);
    geometry.setAttribute( 'position', new THREE.BufferAttribute(vertexs, 3 ));

    const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false }))
    return mesh
}

//创建的方法二：在平面上创建好mesh后，通过旋转和位置copy将其放置在指定位置上
function createOriginalHorizontalMesh(middle){

    const tiles = new THREE.Group()

    const tileGeometry = new THREE.PlaneGeometry(tileWidth, tileHeight)
    const tileMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: false })

    for(let i = 0; i < 4; i++){
        const tile = new THREE.Mesh(tileGeometry, tileMaterial)
        switch(i) {
            case 0:
                tile.position.x = -tileWidth/2
                tile.position.y = tileHeight/2
              break;
            case 1:
                tile.position.x = tileWidth/2
                tile.position.y = tileHeight/2
              break;
            case 2:
                tile.position.x = -tileWidth/2
                tile.position.y = -tileHeight/2
              break;
            case 3:
                tile.position.x = tileWidth/2
                tile.position.y = -tileHeight/2
              break;
          }
        tiles.add(tile)
    }

    //setting position and rotation
    // tiles.position.copy(middle)
    // var lookVector = tiles.position.clone()
    // lookVector.normalize().multiplyScalar(5)
    // lookVector = tiles.position.clone().add(lookVector)
    // tiles.lookAt(lookVector)

    tiles.rotation.x = -Math.PI/2
    return tiles
}

export const tiles = createOriginalHorizontalMesh(center)



