import * as THREE from 'three'
import {Mesh} from 'three'
import { _earthRadius } from '/utilities/constants.js'
import { GUI } from 'dat.gui'
import {animationSheet} from '/animations/animation'

export class CloudLayer1Material {
    constructor() {

    const customUniforms = {
        cloudCoverage: { value: 1.0 },
    }

    const cloudTexture = new THREE.TextureLoader().load('./earth/textures/clouds.png' ); 
    const material = new THREE.MeshLambertMaterial(
        {
            color:'white',
            transparent: true,
            alphaMap: cloudTexture,
            displacementMap: cloudTexture,
            displacementScale: 0.0,
            opacity: 0.2,
            fog: false
        }
    );
    
    
    material.onBeforeCompile = (shader) =>
    {

        shader.uniforms.cloudCoverage = customUniforms.cloudCoverage
    
         //uniform参数
         shader.vertexShader = shader.vertexShader.replace(
            '#include <common>',
            `
                #include <common>
    
                uniform float cloudCoverage; 
            `
        )

         shader.fragmentShader = shader.fragmentShader.replace(
            '#include <common>',
            `
                #include <common>
    
                uniform float cloudCoverage; 
            `
        )

        //displacement 
        shader.vertexShader = shader.vertexShader.replace(
            '#include <displacementmap_vertex>',
            `
            #ifdef USE_DISPLACEMENTMAP
    
                float displacementIntensity = smoothstep(0.0, cloudCoverage,texture2D( displacementMap, vUv ).x);
                transformed += normalize( objectNormal ) * displacementIntensity * displacementScale + displacementBias;
    
            #endif
            `
        )
        
        //cubicPulse function define
        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <common>',
            `
                #include <common>
    
                float cubicPulse( float c, float w, float x )
                {
                    x = abs(x - c);
                    if( x>w ) return 0.0;
                    x /= w;
                    return (1.0 - x*x*(3.0-2.0*x));
                }
            `
        )

        //AlphaMap
        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <alphamap_fragment>',
            `
            #ifdef USE_ALPHAMAP

                float intensity = smoothstep(0.0, cloudCoverage, texture2D( alphaMap, vUv).g);
                diffuseColor.a *= intensity;
            #endif
            `
        )

        //添加遮罩，使得上下左右没有云层
        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <output_fragment>',
            `
            #include <output_fragment>

            //Mask
            float yMask = cubicPulse(0.55,0.4,vUv.y);
            float xMask =  dot(geometry.normal , vec3(0., 0., 1.0));
            xMask = smoothstep(0.3, 1.0, xMask);
            
            //lambert
            float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
            intensity *= dotNL;

            reflectedLight.directDiffuse *= dotNL ;
            reflectedLight.indirectDiffuse  *= dotNL ;

            outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
            
            gl_FragColor = vec4( outgoingLight, diffuseColor.a);
    
            //gl_FragColor = vec4(xMask,xMask,xMask,1.0);
            `
        )
    }
    
    //animationSheet.cloudMaterialAnimation(material)
    const gui = new GUI()
    var postProcessing = gui.addFolder('EarthCloud')
    postProcessing.add(customUniforms.cloudCoverage, 'value').min(0).max(1.0).step(0.0001).name('cloudCover')

    return material
  }

}