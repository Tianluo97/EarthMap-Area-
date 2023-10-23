import * as THREE from 'three'
import { GUI } from 'dat.gui'
import { _earthRadius } from '/utilities/constants.js' 
//import { mergedMaterial } from './topographyMaterial.js';
import GeoTIFF, { fromUrl, fromUrls, fromArrayBuffer, fromBlob } from 'geotiff';

import { Mountain } from'/topography/Mountain'
import { tileWidth, tileHeight} from '../utilities/constants'
import { exportGLTF } from '../utilities/exportMethod'

export class Mountains extends THREE.Group {
  constructor(scene){
    return (async () => {
    super()
    this.type = "mountains"
    this.scene = scene                      
    this.mountains = [] 
    this.mountainGeometries = []
    this.url = []
    this.data = []

    // await anything you want
    await this.addMountains().catch(error => {     
        console.error(error);
    });

    return this; // Return the newly-created instance
  })();
}

async readUrl() {
    this.url[0] = './data/topography/NASADEM_HGT_n39e114.tif';
    this.url[1] = './data/topography/NASADEM_HGT_n40e114.tif';
    // this.url[2] = './data/topography/NASADEM_HGT_n39e113.tif';
    // this.url[3] = './data/topography/NASADEM_HGT_n40e113.tif';
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
        this.mountainGeometries.push(mountain.geometry)
        this.scene.add(mountain) //NORMAL
        
        // //let mountain test division
        // let mountain1 = new MountainDivision(this.data[i])
        // mountain1.position.z = -geometryHeight/4 * (i % 2)
        // if(i == 2 || i == 3) {
        //   mountain1.position.x = -geometryWidth
        // }
        // else if(i == 4|| i == 5) {
        //   mountain1.position.x = geometryWidth
        // }
        // this.scene.add(mountain1)
        // this.mountains.push(mountain1)
        // //exportGLTF(mountain1)
    }

    //this.addMergedMountains(this.scene, this.mountainGeometries)
    //this.mountainSingle = new ExportMountain(this.data)
    //this.scene.add(this.mountainSingle)
    //exportGLTF(this.mountainSingle)
  }

  addMergedMountains(scene, mountainGeometries){
    this.mergedMountains = new mergedMountain(mountainGeometries)
    scene.add(this.mergedMountains) 
    exportGLTF(this.mergedMountains)
  }
}

