import * as THREE from 'three'

/*** 关于地球
 * 地球的真实半径为6378km
 * 地球在场景中的半径为 6378 * _kmScale = 20km
 */

/*** 关于山体和地形
 * 一块地图集瓦片的真实尺寸为1经度 x 1纬度, 即 85.276km x 111km,  
 * 一块地图集瓦片在场景中的半径为 85.276km * _kmScale
 */

/*** 关于风机
 * 一个风机的真实高度为90m
 * 模型风机的尺度为9000m
 * 模型风机的场景中的高度为9000m * 0.01 * _mToKm * _kmScale 
 */

export const _earthOrginRadius = 6378;
export const _kmScale = 20/6378;
export const _mToKm = 0.001;
export const _earthRadius = _earthOrginRadius*_kmScale;
export const _earthCircumference = Math.PI * 2 * _earthRadius

export const tileWidth = 85.276 * _kmScale
export const tileHeight = 111  * _kmScale

export const windTurbineNumber = 51 //51
export const turbineScale = 0.01 * _mToKm * _kmScale 

/**
 * 关于旋转瓦片以及设定瓦片的位置
 */
export const center = longlatToCoordinates(new THREE.Vector2(39, 114))
export function longlatToCoordinates(coordinates){
    const radius = 20, 
    widthSegments = 360, 
    heightSegments = 180, 
    phiStart = 0, 
    phiLength = Math.PI * 2, 
    thetaStart = 0, 
    thetaLength = Math.PI

    const u = (coordinates.y)/widthSegments;    //精度
    const v = (90-coordinates.x)/heightSegments;//纬度

    const vertex = new THREE.Vector3()
    vertex.x = -radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
    vertex.y = radius  * (Math.cos(thetaStart + v * thetaLength));
    vertex.z = radius  * (Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength));
    return vertex
}
