import * as THREE from 'three'
import { GUI } from 'dat.gui'
import { _earthRadius } from '/utilities/constants.js' 
//import { mergedMaterial } from './topographyMaterial.js';
import GeoTIFF, { fromUrl, fromUrls, fromArrayBuffer, fromBlob } from 'geotiff';

import { Mountain } from'/topography/Mountain'
import { mergedGeometryMethod } from'/topography/mergedGeometryMethod'
import { tileWidth, tileHeight, center} from '../utilities/constants'
import { exportGLTF } from '../utilities/exportMethod'

export class Mountains extends THREE.Group {
  constructor(scene, turbineGroup){
    return (async () => {
    super()
    this.type = "mountains"
    this.scene = scene                      
    this.mountains = [] 
    this.mountainsGroup = new THREE.Group()
    this.mountainGeometries = []
    this.url = []
    this.data = []
    
    this.turbineGroup = turbineGroup
    this.setLongLat(this.turbineGroup)

    // await anything you want
    await this.addMountains().catch(error => {     
        console.error(error);
    });

    return this; // Return the newly-created instance
  })();
}

async readUrl() {
    this.url[0] = './data/topography/NASADEM_HGT_n39e113.tif';
    this.url[1] = './data/topography/NASADEM_HGT_n39e114.tif';
    this.url[2] = './data/topography/NASADEM_HGT_n40e113.tif';
    this.url[3] = './data/topography/NASADEM_HGT_n40e114.tif';
}

async addMountains(){
    await this.readUrl()

    let rawTiff, tifImage
    for (let i = 0; i< this.url.length; i++ ){

      //提取rawtiff
        rawTiff = await fromUrl(this.url[i]);
        tifImage = await rawTiff.getImage();
        this.data[i] = await tifImage.readRasters({ interleave: true });
        this.data[i].index = i

        let mountain = new Mountain(this.data[i])
        this.mountains.push(mountain)
        this.mountainsGroup.add(mountain)
        this.mountainGeometries.push(mountain.geometry)
    }

    await this.setLongLat(this.mountainsGroup)
    this.scene.add(this.mountainsGroup)

    //this.addMergedMountains(this.scene, this.mountainGeometries)
    //this.mountainSingle = new ExportMountain(this.data)
    //this.scene.add(this.mountainSingle)
    //exportGLTF(this.mountainSingle)
}

async setLongLat(mountainGroup){
  mountainGroup.position.copy(center)
  // var lookVector = mountainGroup.position.clone()
  // lookVector.normalize().multiplyScalar(5)
  // lookVector = mountainGroup.position.clone().add(lookVector)
  // mountainGroup.lookAt(lookVector)
  mountainGroup.rotation.set(-0.7252609053826057, 0.3216092814144043, 0.2731862631967506)
}

  addMergedMountains(scene, mountainGeometries){
    this.mergedMountains = new mergedGeometryMethod(mountainGeometries)
    scene.add(this.mergedMountains) 
   // exportGLTF(this.mergedMountains)
  }

async addTurbineToGroup(turbineGroup){
    this.mountainsGroup.add(turbineGroup)
    console.log(this.mountainsGroup)
  }
}

