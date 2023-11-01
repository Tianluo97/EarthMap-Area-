import * as THREE from 'three'
import {Mesh} from 'three'
import { _earthRadius } from '/utilities/constants.js'
import { animationSheet } from '/animations/animation.js'
import { GUI } from 'dat.gui'

export class EarthAtmosphereMaterial {
    constructor() {
    
    const customUniforms = {
        atmosphereRange: { value: 1.2 },
        atmosphereIntensity: { value: 10.0 }
    }

    const material = new THREE.MeshLambertMaterial(
        {
         blending: THREE.AdditiveBlending,
         side: THREE.BackSide,
         transparent: true,
         opacity: 1.0,
         fog: false
        }
     ); 
     
     material.onBeforeCompile = (shader) =>
     {
        shader.uniforms.atmosphereRange = customUniforms.atmosphereRange   
        shader.uniforms.atmosphereIntensity = customUniforms.atmosphereIntensity
        
        //uniform参数
        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <common>',
            `
                #include <common>
    
                uniform float atmosphereRange; 
                uniform float atmosphereIntensity; 
            `
        )

         shader.vertexShader = shader.vertexShader.replace(
             '#include <common>',
             `
                 #include <common>
     
                 uniform float atmoIntensity;
             `
         )
         shader.fragmentShader = shader.fragmentShader.replace(
             '#include <output_fragment>',
             `
             #include <output_fragment>
     
                 #ifdef OPAQUE
                 diffuseColor.a = 1.0;
                 #endif
     
                 #ifdef USE_TRANSMISSION
                 diffuseColor.a *= material.transmissionAlpha + 0.1;
                 #endif
     
                 float intensity =   dot(vNormal, vec3(0., 0., 1.0))  ;
                 intensity = pow(intensity, atmosphereRange);
                 
                 float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
                 intensity *= 1.0 - dotNL;

                 gl_FragColor = vec4( 1.0) * intensity * atmosphereIntensity;
                 //gl_FragColor = vec4(vec3(intensity), 1.0);
             `
        )
    }
    
    //animationSheet.atmosphereAnimation(customUniforms)

    const gui = new GUI()
    var postProcessing = gui.addFolder('EarthAtmosphere')
    postProcessing.add(customUniforms.atmosphereRange, 'value').min(0).max(10.0).step(0.0001).name('atmosphereRange')
    postProcessing.add(customUniforms.atmosphereIntensity, 'value').min(0).max(10.0).step(0.0001).name('atmosphereIntensity')

    return material
    }
}

